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
  List,
  Spin,
} from "antd";
import {
  getMyPeeps,
  createStudentSession,
  getSession,
  getImage,
  getLocationByName,
  getAllClassDatesBySessionId,
  getStudentSessions,
} from "../util/APIUtils";
import { Link, withRouter } from "react-router-dom";
import StripeContainer from "../stripe/StripeContainer";
import { SaveOutlined, DollarOutlined, LeftOutlined } from "@ant-design/icons";

import "../styles/style.less";

const ranks = getRanks();
const { Title, Text } = Typography;
const Option = Select.Option;

class SessionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: this.props.currentUser,
      loading: false,

      session: "",
      classDates: [],
      myPeeps: [],
      peepSessions: [],
      image: "",
      location: "",
      signedUpPeeps: [],
      sessionSignupPrice: "0",
      sessionSignupVisible: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.loadSession(this.props.match.params.id);
    this.getMyPeepsList();
  }

  loadSession(id) {
    console.log("id " + id);

    getSession(id)
      .then((response) => {
        this.setState(
          {
            session: response,
          },
          () => this.loadImage(response)
        );
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  getMyPeepsList() {
    let promise;
    promise = getMyPeeps(this.state.currentUser.id); // this.state.currentUser.id
    if (!promise) {
      return;
    }

    promise
      .then((response) => {
        this.setState(
          {
            myPeeps: response,
          },
          () => this.cycleThruPeeps(response)
        );
      })
      .catch((error) => {});
  }

  loadImage(session) {
    let promise = getImage(session.imageId);

    promise
      .then((response) => {
        this.setState(
          {
            image: response,
          },
          () => this.loadLocation(session)
        );
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  loadLocation(session) {
    let promise = getLocationByName(session.location);

    promise
      .then((response) => {
        this.setState(
          {
            location: response,
          },
          () => this.loadClassDates(session)
        );
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  loadClassDates(session) {
    let promise = getAllClassDatesBySessionId(session.id);

    promise
      .then((response) => {
        this.setState({
          classDates: response,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  getDayAndTime(day, dayTimes) {
    let dt, fullDay;
    if (day == "mon") {
      fullDay = "Monday";
    } else if (day == "tue") {
      fullDay = "Tuesday";
    } else if (day == "wed") {
      fullDay = "Wednesday";
    } else if (day == "thu") {
      fullDay = "Thursday";
    } else if (day == "fri") {
      fullDay = "Friday";
    } else if (day == "sat") {
      fullDay = "Saturday";
    }
    for (dt of dayTimes) {
      if (day == dt.slice(0, 3)) {
        let dayFormat = fullDay + " "; //day.slice(0, 1).toUpperCase() + " ";
        return dayFormat.concat(dt.slice(4));
      }
    }
  }

  sessionCard(session) {
    const { image, location, classDates } = this.state;
    let requirementList = [];
    let dayTimes = [];
    let dayHistory = [];

    let cd;
    for (cd = 0; cd < classDates.length && cd < 7; cd++) {
      let dt = moment(classDates[cd].date, "YYYY-MM-DD HH:mm");
      let day = dt.format("ddd").toLowerCase();

      let start = classDates[cd].startTime.replace(/ /g, "");
      let end = classDates[cd].endTime.replace(/ /g, "");

      //let day = d.format("d");

      let time = day + " " + start.slice(0, -1) + "-" + end.slice(0, -1);

      if (dayHistory.includes(day)) {
        break;
      } else {
        dayTimes.push(time);
        dayHistory.push(day);
      }
    }

    var startDate = moment(session.startDate, "YYYY-MM-DD");
    var endDate = moment(session.endDate, "YYYY-MM-DD");

    const dateView = [
      startDate.format("MMMM Do YYYY") + " - " + endDate.format("MMMM Do YYYY"),
    ];

    const title = [session.title];

    let days = session.days.split(",");

    let mon = [<div className="grid-item">Monday</div>];
    if (days.includes("mon")) {
      mon = [
        <div className="grid-item-highlight">
          {this.getDayAndTime("mon", dayTimes)}
        </div>,
      ];
    }
    let tue = [<div className="grid-item">Tuesday</div>];
    if (days.includes("tue")) {
      tue = [
        <div className="grid-item-highlight">
          {this.getDayAndTime("tue", dayTimes)}
        </div>,
      ];
    }
    let wed = [<div className="grid-item">Wednesday</div>];
    if (days.includes("wed")) {
      wed = [
        <div className="grid-item-highlight">
          {this.getDayAndTime("wed", dayTimes)}
        </div>,
      ];
    }
    let thu = [<div className="grid-item">Thursday</div>];
    if (days.includes("thu")) {
      thu = [
        <div className="grid-item-highlight">
          {this.getDayAndTime("thu", dayTimes)}
        </div>,
      ];
    }
    let fri = [<div className="grid-item">Friday</div>];
    if (days.includes("fri")) {
      fri = [
        <div className="grid-item-highlight">
          {this.getDayAndTime("fri", dayTimes)}
        </div>,
      ];
    }
    let sat = [<div className="grid-item">Saturday</div>];
    if (days.includes("sat")) {
      sat = [
        <div className="grid-item-highlight">
          {this.getDayAndTime("sat", dayTimes)}
        </div>,
      ];
    }

    const daysGrid = [
      <div className="grid-container">
        {mon}
        {tue}
        {wed}
        {thu}
        {fri}
        {sat}
      </div>,
    ];

    let ageRange = session.ageRange.split("-");
    if (ageRange[0] != "0" || ageRange[1] != "99") {
      requirementList.push(session.ageRange + " yrs");
    }
    //const ages = [session.ageRange];

    let rankRange = session.rankRange.split("-");
    if (rankRange[0] != "Gold Stripe" || rankRange[1] != "Fifth Degree") {
      requirementList.push(session.rankRange);
    }
    //const ranks = [session.rankRange];

    if (session.price > 0) {
      requirementList.push("$" + session.price);
    }
    //const price = [session.price];

    const description = [session.description];
    const locationName = [location.name];
    const locationAddress = [location.address];

    const signupBtn = [
      <Button
        icon={<DollarOutlined />}
        type="primary"
        onClick={this.showSessionSignupModal(session)}
      >
        Signup
      </Button>,
    ];

    const back = [
      <Link to={"/user/sessions"}>
        {
          <Button
            style={{ marginTop: 10, marginBottom: 10 }}
            type="secondary"
            icon={<LeftOutlined />}
          >
            session list
          </Button>
        }
      </Link>,
    ];

    //<div className="session-detail sub-title">{ages} yrs old</div>
    //<div className="session-detail sub-title">{ranks}</div>
    //<div className="session-detail sub-title">${price}</div>

    const sessionCard = [
      <Card
        className="session-detail"
        hoverable
        bordered={false}
        key={session.id}
        cover={
          <Image
            width={"100%"}
            height={"100%"}
            src={`data:image/jpeg;base64,${image.photo}`}
          />
        }
      >
        <div className="session-detail title">{title}</div>
        <div className="session-detail title-gray">DATE</div>
        <div className="session-detail sub-title">{dateView}</div>

        <div className="session-detail title-gray">DAYS</div>
        <div className="session-detail sub-title">{daysGrid}</div>

        <div className="session-detail title-gray">LOCATION</div>
        <div className="session-detail sub-title">{locationName}</div>
        <div className="session-detail sub-title">{locationAddress}</div>
        <div className="session-detail title-gray">REQUIREMENTS</div>
        {requirementList.map((element) => (
          <div className="session-detail sub-title">{element}</div>
        ))}

        <div className="session-detail title-black">Details</div>
        <div className="session-detail details">{description}</div>
        <div style={{ marginBottom: "20px" }} />
        {signupBtn}
        {back}
      </Card>,
    ];

    return sessionCard;
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
      signedUpPeeps: [],
      sessionSignupPrice: 0,
    });
  };

  onChange(checkedValues) {
    this.setState({
      signedUpPeeps: checkedValues,
      sessionSignupPrice: this.state.session.price * checkedValues.length,
    });
  }

  cycleThruPeeps(peeps) {
    let peep;
    for (peep of peeps) {
      this.getAllPeepSessions(peep);
    }
  }

  getAllPeepSessions(peep) {
    this.state.peepSessions.length = 0;
    var peepSessions = [];

    let promise = getStudentSessions(peep.id);

    promise.then((response) => {
      let value;
      for (value of response) {
        const peepSession = {
          peepId: peep.id,
          sessionId: value.id,
        };
        peepSessions.push(peepSession);
      }
      this.setState({
        peepSessions: this.state.peepSessions.concat(peepSessions),
      });
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

    var myPeepOptions = [];
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
        value={this.state.signedUpPeeps}
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
      selectedsSession: session,
      signedUpPeeps: [],
    });
  };

  handleSubmit() {
    const { signedUpPeeps, session } = this.state;
    this.setState({
      loading: true,
    });

    let peep;
    for (peep of signedUpPeeps) {
      const data = {
        classSessionId: session.id,
        studentId: peep,
        charged: session.price,
        paid: 0,
        signupDate: moment().format("YYYY-MM-DD"),
      };

      createStudentSession(data)
        .then((response) => {
          this.setState({
            loading: false,
            sessionSignupVisible: false,
            signedUpPeeps: [],
            session: "",
          });
          notification.success({
            message: "Signup Successful!",
            description: "",
            duration: 4,
          });
          this.props.history.push("/user/sessions");
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
  }

  isFormInvalid() {
    if (this.state.signedUpPeeps.length == 0) {
      return true;
    }

    return false;
  }

  render() {
    const {
      loading,
      currentUser,
      session,
      sessionSignupVisible,
      myPeeps,
      image,
    } = this.state;

    var sessionCard = [<Spin spinning={loading} />];

    if (session && image) {
      sessionCard = this.sessionCard(session);
    }

    const sessionModalTitle = [<Title level={2}>{session.title}</Title>];

    const stripeView = [
      <div className="session" style={{ paddingLeft: 15, paddingRight: 15 }}>
        <StripeContainer />
      </div>,
    ];

    return (
      <div className="session-detail">
        {sessionCard}
        <Modal
          className="event-detail"
          bordered={false}
          loading={loading}
          visible={sessionSignupVisible}
          title={sessionModalTitle}
          footer={[
            <Button
              key="back"
              type="secondary"
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
          {this.getSessionSignupForm(session)}
          <Divider orientation="left">Payment</Divider>
          {stripeView}
        </Modal>
      </div>
    );
  }

  handleToken(token, addresses) {
    console.log(token, addresses);
  }
}

export default withRouter(SessionDetail);
