import React, { Component } from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import { getRanks } from "../util/Helpers.js";
import {
  Typography,
  Popconfirm,
  Modal,
  Row,
  Select,
  Divider,
  Space,
  message,
  Image,
  Checkbox,
  notification,
  Col,
  Button,
  Card,
} from "antd";
import {
  getAllSessionsByDate,
  getMyPeeps,
  createStudentSession,
} from "../util/APIUtils";
import { withRouter } from "react-router-dom";

import {
  SaveOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CarryOutOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import bg from "../img/Session.png";
//import bg from "../img/MainBackground.jpg";
import "./Sessions.css";

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
};

const ranks = getRanks();
const { Title, Text } = Typography;
const Option = Select.Option;

class Sessions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: this.props.currentUser,
      loading: false,
      visible: false,
      sessions: [],
      myPeeps: [],
      signedUpPeeps: [],
      sessionSignupPrice: "0",
      sessionSignupVisible: false,
      selectedSession: "",
    };

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getSessionList();
    this.getMyPeepsList();
  }

  getSessionList() {
    let promise;

    promise = getAllSessionsByDate();

    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise
      .then((response) => {
        this.setState({
          sessions: response,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  getMyPeepsList() {
    let promise;
    promise = getMyPeeps(1); // this.state.currentUser.id
    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise
      .then((response) => {
        this.setState({
          myPeeps: response,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  handleOk = () => {
    this.setState({
      loading: false,
      sessionSignupVisible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      loading: false,
      sessionSignupVisible: false,
    });
  };

  onChange(checkedValues) {
    this.setState({
      signedUpPeeps: checkedValues,
      sessionSignupPrice:
        this.state.selectedSession.price * checkedValues.length,
    });
  }

  getSessionSignupForm(session) {
    if (!session) {
      return;
    }

    var rank, age;
    let sessionRankRange = session.rankRange.split("-");
    let low = sessionRankRange[0];
    let high = sessionRankRange[1];
    let ranksAllowed = [];
    let blip = false;
    for (rank of ranks) {
      if (rank == low) {
        blip = true;
      }

      if (blip) {
        ranksAllowed.push(rank);
      }

      if (rank == high) {
        blip = false;
      }
    }

    let ages = [];
    for (let i = 0; i < 100; i++) {
      ages.push(i);
    }
    let sessionAgeRange = session.ageRange.split("-");
    let lowAge = sessionAgeRange[0];
    let highAge = sessionAgeRange[1];
    let agesAllowed = [];
    blip = false;
    for (age of ages) {
      if (age == lowAge) {
        blip = true;
      }

      if (blip) {
        agesAllowed.push(age);
      }

      if (age == highAge) {
        blip = false;
      }
    }

    const { myPeeps } = this.state;

    const myPeepOptions = [];
    let peep,
      notAllowedRank = true,
      notAllowedAge = true;
    for (peep of myPeeps) {
      let peepAge = moment().diff(peep.birthDate, "years");
      notAllowedRank = true;
      notAllowedAge = true;
      for (rank of ranksAllowed) {
        if (peep.ranks == rank) {
          notAllowedRank = false;
          break;
        }
      }

      for (age of agesAllowed) {
        if (peepAge == age) {
          notAllowedAge = false;
          break;
        }
      }

      let notAllowed = false;
      if (notAllowedAge || notAllowedRank) {
        notAllowed = true;
      }

      let lastLetter = peep.lastName.split("");
      let p = {
        label:
          peep.firstName +
          " " +
          lastLetter[0] +
          ".   |   " +
          peepAge +
          " yrs old   |   " +
          peep.ranks +
          "",
        value: peep.id,
        disabled: notAllowed,
      };

      myPeepOptions.push(p);
    }

    const signupForm = [
      <Divider orientation="left">Select signups</Divider>,
      <Checkbox.Group
        style={{ marginLeft: 15, marginBottom: 15 }}
        options={myPeepOptions}
        onChange={this.onChange}
      >
        <Space>{myPeepOptions}</Space>
      </Checkbox.Group>,
      <Text strong style={{ marginLeft: 5 }}>
        TOTAL: ${this.state.sessionSignupPrice}
      </Text>,
    ];

    return signupForm;
  }

  showSessionSignupModal = (session) => (e) => {
    this.setState({
      sessionSignupVisible: true,
      selectedSession: session,
      signedUpPeeps: [],
    });
  };

  handleSubmit(event) {
    const { signedUpPeeps, selectedSession } = this.state;
    var success = false;
    this.setState({
      loading: true,
    });

    let peep;
    for (peep of signedUpPeeps) {
      const data = {
        classSessionId: selectedSession.id,
        studentId: peep,
      };

      createStudentSession(data)
        .then((response) => {
          success = true;
          this.setState({
            loading: false,
            sessionSignupVisible: false,
          });
        })
        .catch((error) => {
          this.setState({
            loading: false,
          });
          if (error.status === 401) {
          } else {
          }
        });
    }

    if (success) {
      notification.success({
        message: "Signup Successful!",
        description: "",
        duration: 2,
      });
    }
  }

  isFormInvalid() {
    if (this.state.signedUpPeeps.length == 0) {
      return true;
    }

    return false;
  }

  render() {
    // <Image className="card-content-image" src={bg} />
    const {
      visible,
      loading,
      currentUser,
      sessions,
      sessionSignupVisible,
      selectedSession,
      myPeeps,
    } = this.state;

    let sessionCards = [];
    sessionCards.length = 0;

    let session;
    if (sessions) {
      for (session of sessions) {
        var startDate = moment(session.startDate, "YYYY-MM-DD");
        var endDate = moment(session.endDate, "YYYY-MM-DD");

        const title = [
          <Title
            style={{ marginLeft: 0, marginTop: 10, color: "white" }}
            level={4}
          >
            {session.title}
          </Title>,
        ];

        const date = [
          <Row>
            <Space size="small">
              <Text
                style={{
                  textShadow: "0px 1px 0px rgba(255,255,255,0.9)",
                }}
                type="secondary"
              >
                start date:{" "}
              </Text>
              <Text
                style={{ textShadow: "0px 1px 0px rgba(255,255,255,0.9)" }}
                strong
              >
                {startDate.format("dddd, MMMM Do YYYY")}
              </Text>
            </Space>
          </Row>,
          <Row>
            <Space size="small">
              <Text
                style={{ textShadow: "0px 1px 0px rgba(255,255,255,0.9)" }}
                type="secondary"
              >
                end date:{" "}
              </Text>
              <Text
                style={{ textShadow: "0px 1px 0px rgba(255,255,255,0.9)" }}
                strong
              >
                {endDate.format("dddd, MMMM Do YYYY")}
              </Text>
            </Space>
          </Row>,
        ];
        const ages = [
          <Row>
            <Space size="small">
              <Text
                style={{ textShadow: "0px 1px 0px rgba(255,255,255,0.9)" }}
                type="secondary"
              >
                ages:{" "}
              </Text>
              <Text
                style={{ textShadow: "0px 1px 0px rgba(255,255,255,0.9)" }}
                strong
              >
                {session.ageRange}
              </Text>
            </Space>
          </Row>,
        ];
        const ranks = [
          <Row>
            <Space size="small">
              <Text
                style={{ textShadow: "0px 1px 0px rgba(255,255,255,0.9)" }}
                type="secondary"
              >
                rank range:{" "}
              </Text>
              <Text
                style={{ textShadow: "0px 1px 0px rgba(255,255,255,0.9)" }}
                strong
              >
                {session.rankRange}
              </Text>
            </Space>
          </Row>,
        ];
        const description = [
          <Text
            strong
            style={{ textShadow: "0px 1px 0px rgba(255,255,255,0.9)" }}
          >
            {session.description}
          </Text>,
        ];
        const location = [
          <Row>
            <Space size="small">
              <Text
                style={{ textShadow: "0px 1px 0px rgba(255,255,255,0.9)" }}
                type="secondary"
              >
                location:{" "}
              </Text>
              <Text
                style={{ textShadow: "0px 1px 0px rgba(255,255,255,0.9)" }}
                strong
              >
                {session.location}
              </Text>
            </Space>
          </Row>,
        ];
        const price = [<Text strong>${session.price}</Text>];

        const sessionCard = [
          <Card
            title={title}
            headStyle={{
              padding: 8,
              backgroundColor: "#4694b4",
              borderRadius: "20px 20px 0px 0px",
            }}
            bodyStyle={{ backgroundColor: "white", padding: 8 }}
            style={{
              backgroundColor: "white",
              width: "100%",
              textShadow: "1px 1px 1px rgba(0,0,0,0.1)",
              borderRadius: "20px",
              boxShadow: "0px 2px 10px 0px rgba(208, 216, 243, 0.6)",
              padding: 0,
            }}
          >
            <Space size="small" direction="vertical">
              {location}
              {date}
              {ages}
              <Space size="large" direction="vertical">
                {ranks}
                {description}
              </Space>
              {price}
            </Space>
            <Button
              type="primary"
              size="large"
              onClick={this.showSessionSignupModal(session)}
              style={{
                borderRadius: "6px",
                marginTop: "20px",
                width: "100%",
              }}
            >
              Signup
            </Button>
          </Card>,
        ];

        sessionCards.push(<div style={{ padding: 10 }}>{sessionCard}</div>);
      }
    }

    const content = [sessionCards];

    const title = [
      <Title level={2}>
        <div>Sessions</div>
      </Title>,
    ];

    const sessionModalTitle = [
      <Title level={4}>{selectedSession.title}</Title>,
    ];

    return (
      <div>
        <Card
          bordered={false}
          bodyStyle={{ padding: 0 }}
          style={{
            width: "100%",
            borderRadius: "6px",
            padding: 0,
          }}
          title={title}
        >
          {content}
        </Card>
        <Modal
          visible={sessionSignupVisible}
          title={sessionModalTitle}
          style={{ top: 0 }}
          bodyStyle={{ padding: 4, marginBottom: 0 }}
          footer={[
            <Button
              key="back"
              onClick={this.handleCancel}
              style={{
                boxShadow: "0px 0px 5px rgba(0,0,0,0.2)",
              }}
            >
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              icon={<SaveOutlined />}
              disabled={this.isFormInvalid()}
              loading={loading}
              onClick={this.handleSubmit}
              style={{
                boxShadow: "0px 0px 5px rgba(0,0,0,0.2)",
              }}
            >
              Submit
            </Button>,
          ]}
        >
          {this.getSessionSignupForm(selectedSession)}
        </Modal>
      </div>
    );
  }
}

export default withRouter(Sessions);
