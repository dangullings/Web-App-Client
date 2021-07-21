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
  createStudentEvent,
  getEvent,
  getImage,
  getLocationByName,
  getStudentEvents,
} from "../util/APIUtils";
import { Link, withRouter } from "react-router-dom";
import StripeContainer from "../stripe/StripeContainer";
import {
  SaveOutlined,
  LikeOutlined,
  DollarOutlined,
  UnorderedListOutlined,
  LeftOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import "../styles/style.less";

const ranks = getRanks();
const { Title, Text } = Typography;
const Option = Select.Option;

class EventDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: this.props.currentUser,
      loading: false,

      event: "",
      myPeeps: [],
      peepEvents: [],
      image: "",
      location: "",
      signedUpPeeps: [],
      eventSignupPrice: "0",
      eventSignupVisible: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.loadEvent(this.props.match.params.id);
    this.getMyPeepsList();
  }

  loadEvent(id) {
    console.log("id " + id);

    getEvent(id)
      .then((response) => {
        this.setState(
          {
            event: response,
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

  loadImage(event) {
    let promise = getImage(event.imageId);

    promise
      .then((response) => {
        this.setState(
          {
            image: response,
          },
          () => this.loadLocation(event)
        );
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  loadLocation(event) {
    let promise = getLocationByName(event.location);

    promise
      .then((response) => {
        this.setState({
          location: response,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  eventCard(event) {
    const { image, location } = this.state;
    let requirementList = [];

    var date = moment(event.date, "YYYY-MM-DD");

    const title = [event.title];

    const dateView = [date.format("dddd, MMMM Do YYYY")];
    let startTime = event.startTime.replace(/ /g, "");
    startTime = startTime.slice(0, -1);
    let endTime = event.endTime.replace(/ /g, "");
    endTime = endTime.slice(0, -1);
    const time = [startTime + " - " + endTime];

    let ageRange = event.ageRange.split("-");
    if (ageRange[0] != "0" || ageRange[1] != "99") {
      requirementList.push(event.ageRange + " yrs");
    }
    //const ages = [event.ageRange];

    let rankRange = event.rankRange.split("-");
    if (rankRange[0] != "Gold Stripe" || rankRange[1] != "Fifth Degree") {
      requirementList.push(event.rankRange);
    }
    //const ranks = [event.rankRange];

    if (event.price > 0) {
      requirementList.push("$" + event.price);
    }
    //const price = [event.price];

    const description = [event.description];
    const locationName = [location.name];
    const locationAddress = [location.address];

    const signupBtn = [
      <Button
        icon={<LikeOutlined />}
        type="primary"
        onClick={this.showEventSignupModal(event)}
      >
        Signup
      </Button>,
    ];

    const back = [
      <Link to={"/user/events"}>
        {
          <Button
            style={{ marginTop: 10, marginBottom: 10 }}
            type="secondary"
            icon={<UnorderedListOutlined />}
          >
            Event List
          </Button>
        }
      </Link>,
    ];

    const eventCard = [
      <Card
        className="event-detail"
        bordered={false}
        key={event.id}
        cover={
          <Image
            width={"100%"}
            height={"100%"}
            src={`data:image/jpeg;base64,${image.photo}`}
          />
        }
      >
        <div className="event-detail title">{title}</div>
        <div className="event-detail title-gray">DATE</div>
        <div className="event-detail sub-title">
          <div>{dateView}</div>
          <div>{time}</div>
        </div>
        <div className="event-detail title-gray">LOCATION</div>
        <div className="event-detail sub-title">{locationName}</div>
        <div className="event-detail sub-title">{locationAddress}</div>
        <div className="event-detail title-gray">REQUIREMENTS</div>
        {requirementList.map((element) => (
          <div className="event-detail sub-title">{element}</div>
        ))}

        <div className="event-detail title-black">Details</div>
        <div className="event-detail details">{description}</div>
        <div style={{ marginBottom: "20px" }} />
        {signupBtn}
        {back}
      </Card>,
    ];

    return eventCard;
  }

  handleOk = () => {
    this.setState({
      loading: false,
      eventSignupVisible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      loading: false,
      eventSignupVisible: false,
      signedUpPeeps: [],
      eventSignupPrice: 0,
    });
  };

  onChange(checkedValues) {
    this.setState({
      signedUpPeeps: checkedValues,
      eventSignupPrice: this.state.event.price * checkedValues.length,
    });
  }

  cycleThruPeeps(peeps) {
    let peep;
    for (peep of peeps) {
      this.getAllPeepEvents(peep);
    }
  }

  getAllPeepEvents(peep) {
    this.state.peepEvents.length = 0;
    var peepEvents = [];

    let promise = getStudentEvents(peep.id);

    promise.then((response) => {
      let value;
      for (value of response) {
        const peepEvent = {
          peepId: peep.id,
          eventId: value.id,
        };
        peepEvents.push(peepEvent);
      }
      this.setState({
        peepEvents: this.state.peepEvents.concat(peepEvents),
      });
    });
  }

  getEventSignupForm(event) {
    const { peepEvents } = this.state;

    if (!event || !this.state.eventSignupVisible) {
      return;
    }

    var rank, age;
    let eventRankRange = event.rankRange.split("-");
    let low = eventRankRange[0];
    let high = eventRankRange[1];
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
    let eventAgeRange = event.ageRange.split("-");
    let lowAge = eventAgeRange[0];
    let highAge = eventAgeRange[1];
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
      notAllowedAge = true,
      notAllowedAlreadySignedUp = false;
    for (peep of myPeeps) {
      let peepAge = moment().diff(peep.birthDate, "years");
      notAllowedRank = true;
      notAllowedAge = true;
      notAllowedAlreadySignedUp = false;
      for (rank of ranksAllowed) {
        if (peep.ranks == rank) {
          notAllowedRank = false;
          break;
        }
      }

      let peepEvent;
      for (peepEvent of peepEvents) {
        if (peepEvent.peepId == peep.id) {
          if (peepEvent.eventId == event.id) {
            notAllowedAlreadySignedUp = true;
            break;
          }
        }
      }

      for (age of agesAllowed) {
        if (peepAge == age) {
          notAllowedAge = false;
          break;
        }
      }

      let notAllowed = false;
      if (notAllowedAge || notAllowedRank || notAllowedAlreadySignedUp) {
        notAllowed = true;
      }

      if (notAllowedAge) {
        notification["info"]({
          message: peep.firstName,
          description: "Age not allowed.",
          duration: 6,
        });
      }

      if (notAllowedRank) {
        notification["info"]({
          message: peep.firstName,
          description: "Rank not allowed.",
          duration: 6,
        });
      }

      if (notAllowedAlreadySignedUp) {
        notification["info"]({
          message: peep.firstName,
          description: "Already signed up.",
          duration: 6,
        });
      }

      let pe;
      for (pe of peepEvents) {
        console.log("pe " + pe.peepId + " " + pe.eventId);
        if (pe.eventId == event.id) {
          if (pe.peepId == peep.id) {
            notAllowed = true;
            break;
          }
        }
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
        TOTAL: ${this.state.eventSignupPrice}
      </Text>,
    ];

    return signupForm;
  }

  showEventSignupModal = (event) => (e) => {
    this.setState({
      eventSignupVisible: true,
      event: event,
      signedUpPeeps: [],
    });
  };

  handleSubmit() {
    const { signedUpPeeps, event } = this.state;
    this.setState({
      loading: true,
    });

    let peep;
    for (peep of signedUpPeeps) {
      const data = {
        calendarEventId: event.id,
        studentId: peep,
        charged: event.price,
        paid: 0,
        signupDate: moment().format("YYYY-MM-DD"),
      };

      createStudentEvent(data)
        .then((response) => {
          this.setState({
            loading: false,
            eventSignupVisible: false,
            signedUpPeeps: [],
            event: "",
          });
          notification.success({
            message: "Signup Successful!",
            description: "",
            duration: 4,
          });
          this.props.history.push("/user/events");
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
    const { loading, currentUser, event, eventSignupVisible, myPeeps, image } =
      this.state;

    var eventCard = [
      <Row style={{ color: "#c9c9c9", fontSize: 28, justifyContent: "center" }}>
        Loading... <LoadingOutlined spin />
      </Row>,
    ];

    if (event && image) {
      eventCard = this.eventCard(event);
    }

    const eventModalTitle = [<Title level={2}>{event.title}</Title>];

    const stripeView = [
      <div className="session" style={{ paddingLeft: 15, paddingRight: 15 }}>
        <StripeContainer />
      </div>,
    ];

    return (
      <div className="event-detail">
        {eventCard}
        <Modal
          className="event-detail"
          style={{ top: 10 }}
          bordered={false}
          loading={loading}
          visible={eventSignupVisible}
          title={eventModalTitle}
          closable={false}
          footer={[
            <Button key="back" type="secondary" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              style={{ marginLeft: 0, marginTop: 10 }}
              icon={<DollarOutlined />}
              disabled={this.isFormInvalid()}
              loading={loading}
              onClick={this.handleSubmit}
            >
              Submit Order
            </Button>,
          ]}
        >
          {this.getEventSignupForm(event)}
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

export default withRouter(EventDetail);
