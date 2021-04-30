import React, { Component } from "react";
import moment from "moment";
import {
  Table,
  Divider,
  Popconfirm,
  Typography,
  Tag,
  Select,
  Icon,
  Space,
  notification,
  Row,
  Form,
  Input,
  List,
  Col,
  Collapse,
  Avatar,
  Button,
  Card,
  Modal,
} from "antd";
import {
  getMyPeeps,
  getStudentSessions,
  getStudentEvents,
  getAllClassDatesBySessionId,
  getLocationByName,
  getStudentTests,
  createStudent,
  getTestScoresByStudentIdAndTestId,
  createUserStudent,
} from "../util/APIUtils";
import { STUDENT_LIST_SIZE } from "../constants";
import { withRouter } from "react-router-dom";

import {
  SaveOutlined,
  TeamOutlined,
  UserAddOutlined,
  ItalicOutlined,
} from "@ant-design/icons";

import "../styles/style.less";
import testImage from "../img/TestImage.png";
import eventImage from "../img/EventImage.png";
import sessionImage from "../img/Session.png";
import classDateImage from "../img/ClassDateImage.png";

const Option = Select.Option;
const { Panel } = Collapse;

const children = [
  <Option key={1}>January</Option>,
  <Option key={2}>February</Option>,
  <Option key={3}>March</Option>,
  <Option key={4}>April</Option>,
  <Option key={5}>May</Option>,
  <Option key={6}>June</Option>,
  <Option key={7}>July</Option>,
  <Option key={8}>August</Option>,
  <Option key={9}>September</Option>,
  <Option key={10}>October</Option>,
  <Option key={11}>November</Option>,
  <Option key={12}>December</Option>,
];
const { Title, Text, Paragraph } = Typography;

/* const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
}; */

var testCols = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    align: "center",
    width: 25,
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
    align: "center",
    width: 25,
  },
  {
    title: "Scores",
    children: [
      {
        title: "Form",
        dataIndex: "form",
        key: "form",
        align: "center",
        width: 15,
        ellipsis: true,
      },
      {
        title: "Steps",
        dataIndex: "steps",
        key: "steps",
        align: "center",
        width: 15,
        ellipsis: true,
      },
      {
        title: "Power",
        dataIndex: "power",
        align: "center",
        key: "power",
        width: 15,
        ellipsis: true,
      },
      {
        title: "Kiap",
        dataIndex: "kiap",
        align: "center",
        key: "kiap",
        width: 15,
        ellipsis: true,
      },
      {
        title: "Questions",
        dataIndex: "questions",
        align: "center",
        key: "questions",
        width: 15,
        ellipsis: true,
      },
      {
        title: "Attitude",
        dataIndex: "attitude",
        align: "center",
        key: "attitude",
        width: 15,
        ellipsis: true,
      },
      {
        title: "Sparring",
        dataIndex: "sparring",
        align: "center",
        key: "sparring",
        width: 15,
        ellipsis: true,
      },
      {
        title: "Breaking",
        dataIndex: "breaking",
        align: "center",
        key: "breaking",
        width: 15,
        ellipsis: true,
      },
    ],
  },
];

// load all peep info up front and render static data and updated peep info

class MyGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: this.props.currentUser,
      myPeeps: [],
      myPeepSessions: [],
      myPeepSessionClassDates: [],
      myPeepEvents: [],
      myPeepTests: [],
      myPeepTestScores: [],
      myPeepAttendance: [],
      myPeepCards: [],
      myPeepSessionIds: [],
      locations: [],
      testLocations: [],
      schedulesLoading: false,
      attendanceLoading: false,
      testsLoading: false,
      visible: false,
      peepScheduleVisible: false,
      peepTestsVisible: false,
      peepAttendanceVisible: false,
      selectedPeep: "",
      selectedSchedule: "",
      count: 0,

      firstName: {
        text: "",
      },
      lastName: {
        text: "",
      },
      email: {
        text: "",
      },
      birthDateMonth: {
        text: "January",
      },
      birthDateDay: {
        text: "",
      },
      birthDateYear: {
        text: "",
      },

      active: false,
      loading: false,
      visible: false,

      peepContentSelected: [],
    };

    this.getMyPeepsList = this.getMyPeepsList.bind(this);
    this.loadPeepSchedule = this.loadPeepSchedule.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
    this.handleMonthChange = this.handleMonthChange.bind(this);
    this.handleDayChange = this.handleDayChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
  }

  formRef = React.createRef();

  componentDidMount() {
    this.getMyPeepsList();
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleSubmit() {}

  handleOk = () => {
    this.setState({
      loading: false,
      visible: false,
      peepScheduleVisible: false,
      peepAttendanceVisible: false,
      peepTestsVisible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      loading: false,
      visible: false,
      peepScheduleVisible: false,
      peepAttendanceVisible: false,
      peepTestsVisible: false,
    });
  };

  getMyPeepsList() {
    let promise;
    promise = getMyPeeps(this.state.currentUser.id); //this.state.currentUser.id
    if (!promise) {
      return;
    }

    this.setState({
      isLoading: true,
    });

    promise
      .then((response) => {
        this.setState(
          {
            myPeeps: response,
            isLoading: false,
          },
          () => this.loadPeepData(response)
        );
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  loadPeepData(peeps) {
    let newArray = [];
    let p;
    for (p of peeps) {
      const data = {
        peepId: p.id,
        selectedContent: "",
      };
      newArray.push(data);
    }
    this.setState({
      peepContentSelected: newArray,
    });

    this.loadPeepSchedule(peeps);
    this.loadPeepAttendance(peeps);
    this.loadPeepTests(peeps);
  }

  loadPeepAttendance(peeps) {}

  loadPeepSchedule(peeps) {
    this.loadPeepEvents(peeps);
  }

  loadPeepSessions(peeps) {
    const { myPeepEvents } = this.state;

    let events = myPeepEvents;

    events = events.filter(
      (events, index, self) =>
        index === self.findIndex((t) => t.id === events.id)
    );

    this.setState({
      myPeepEvents: events,
    });

    var sessions = [];
    var promises = [];
    var peepSessionIds = [];
    var peepInc = 0;
    var value, innerValue;

    this.state.myPeepSessions.length = 0;
    let peep;
    for (peep of peeps) {
      let promise = getStudentSessions(peep.id);
      promises.push(promise);
    }

    Promise.all(promises).then((values) => {
      for (value of values) {
        for (innerValue of value) {
          sessions.push(innerValue);

          const peepSessionId = {
            peepId: peeps[peepInc].id,
            sessionId: innerValue.id,
          };
          peepSessionIds.push(peepSessionId);
        }
        peepInc++;
      }
      this.loadPeepSessionLocations(sessions);
      this.setState(
        {
          myPeepSessions: this.state.myPeepSessions.concat(sessions),
          myPeepSessionIds: peepSessionIds,
        },
        () => this.loadPeepSessionClassDates()
      );
    });
  }

  loadPeepSessionClassDates() {
    const { myPeepSessions } = this.state;

    let sessions = myPeepSessions;

    sessions = sessions.filter(
      (sessions, index, self) =>
        index === self.findIndex((t) => t.id === sessions.id)
    );

    var promises = [];
    var classDates = [];
    var value, innerValue;
    var session;
    this.state.myPeepSessionClassDates.length = 0;

    for (session of sessions) {
      let promise = getAllClassDatesBySessionId(session.id);
      promises.push(promise);
    }

    Promise.all(promises).then((values) => {
      for (value of values) {
        if (value != "null") {
          for (innerValue of value) {
            classDates.push(innerValue);
          }
        }
      }
      this.setState({
        myPeepSessionClassDates: this.state.myPeepSessionClassDates.concat(
          classDates
        ),
      });
    });
  }

  loadPeepSessionLocations(sessions) {
    const { myPeepEvents } = this.state;

    var promises = [];
    var value;
    var newLocations = [];
    var session, event;
    this.state.locations.length = 0;

    for (session of sessions) {
      let promise = getLocationByName(session.location);
      promises.push(promise);
    }

    for (event of myPeepEvents) {
      let promise = getLocationByName(event.location);
      promises.push(promise);
    }

    Promise.all(promises).then((values) => {
      for (value of values) {
        if (value != "null") {
          newLocations.push(value);
        }
      }
      this.setState({
        locations: this.state.locations.concat(newLocations),
        schedulesLoading: false,
      });
    });
  }

  getStudentTestScores() {
    const { myPeepTestIds } = this.state;

    let ids;
    for (ids of myPeepTestIds) {
      this.getStudentTestScoresCont(ids.peepId, ids.testId);
    }
  }

  getStudentTestScoresCont(peepId, testId) {
    getTestScoresByStudentIdAndTestId(peepId, testId)
      .then((response) => {
        this.setState({
          myPeepTestScores: this.state.myPeepTestScores.concat(response),
        });
      })
      .catch((error) => {});
  }

  createPeepTestScoreTable(peep) {
    const { myPeepTestScores, myPeepTests } = this.state;
    var datas = [];

    var testScore, i, key, test, t;
    for (testScore of myPeepTestScores) {
      for (t of myPeepTests) {
        if (t.id == testScore.testId) {
          test = t;
          break;
        }
      }
      if (testScore.studentId == peep.id) {
        i++;
        datas.push({
          key: i,
          date: test.date,
          location: test.location,
          form: testScore.form,
          power: testScore.power,
          steps: testScore.steps,
          kiap: testScore.kiap,
          questions: testScore.questions,
          sparring: testScore.sparring,
          breaking: testScore.breaking,
          attitude: testScore.attitude,
        });
      }
    }

    return (
      <Table
        rowKey={key}
        bordered
        pagination={false}
        columns={testCols}
        dataSource={datas}
        size="small"
        style={{ marginTop: 2, width: "100%", height: "100%" }}
        scroll={{ x: 800 }}
      />
    );
  }

  loadPeepTests(peeps) {
    var tests = [];
    var promises = [];
    var peepTestIds = [];
    var peepInc = 0;
    var value, innerValue;

    this.state.myPeepTests.length = 0;
    let peep;
    for (peep of peeps) {
      let promise = getStudentTests(peep.id);
      promises.push(promise);
    }

    Promise.all(promises).then((values) => {
      for (value of values) {
        for (innerValue of value) {
          tests.push(innerValue);
          const peepTestId = {
            peepId: peeps[peepInc].id,
            testId: innerValue.id,
          };
          peepTestIds.push(peepTestId);
        }
        peepInc++;
      }
      this.setState(
        {
          myPeepTests: this.state.myPeepTests.concat(tests),
          myPeepTestIds: peepTestIds,
        },
        () => this.loadPeepTestsLocations(tests)
      );
    });
  }

  loadPeepTestsLocations(tests) {
    var promises = [];
    var value, innerValue;
    var newLocations = [];
    var test;
    this.state.testLocations.length = 0;

    for (test of tests) {
      let promise = getLocationByName(test.location);
      promises.push(promise);
    }

    Promise.all(promises).then((values) => {
      for (value of values) {
        if (value != "null") {
          newLocations.push(value);
        }
      }
      this.setState(
        {
          testLocations: this.state.testLocations.concat(newLocations),
        },
        () => this.getStudentTestScores()
      );
    });
  }

  loadPeepEvents(peeps) {
    var events = [];
    var promises = [];
    var peepEventIds = [];
    var peepInc = 0;
    var value, innerValue;

    this.setState({
      schedulesLoading: true,
    });

    this.state.myPeepEvents.length = 0;
    let peep;
    for (peep of peeps) {
      let promise = getStudentEvents(peep.id);
      promises.push(promise);
    }

    Promise.all(promises).then((values) => {
      for (value of values) {
        for (innerValue of value) {
          events.push(innerValue);

          const peepEventId = {
            peepId: peeps[peepInc].id,
            eventId: innerValue.id,
          };
          peepEventIds.push(peepEventId);
        }
        peepInc++;
      }
      this.setState(
        {
          myPeepEvents: this.state.myPeepEvents.concat(events),
          myPeepEventIds: peepEventIds,
        },
        () => this.loadPeepSessions(peeps)
      );
    });
  }

  showPeepSchedule = (peep) => (e) => {
    let p,
      index,
      inc = 0;
    for (p of this.state.myPeeps) {
      if (p.id == peep.id) {
        index = inc;
        break;
      }
      inc++;
    }

    let peepContentSelected = [...this.state.peepContentSelected];
    let content = { ...peepContentSelected[index] };
    content.selectedContent = "schedule";
    peepContentSelected[index] = content;
    this.setState({ peepContentSelected: peepContentSelected });

    this.setState({
      selectedPeep: peep,
    });
  };

  showPeepTests = (peep) => (e) => {
    let p,
      index,
      inc = 0;
    for (p of this.state.myPeeps) {
      if (p.id == peep.id) {
        index = inc;
        break;
      }
      inc++;
    }

    let peepContentSelected = [...this.state.peepContentSelected];
    let content = { ...peepContentSelected[index] };
    content.selectedContent = "tests";
    peepContentSelected[index] = content;
    this.setState({ peepContentSelected: peepContentSelected });

    this.setState({
      selectedPeep: peep,
    });
  };

  showPeepAttendance = (peep) => (e) => {
    this.setState({
      //peepAttendanceVisible: true,
      selectedPeep: peep,
      selectedContent: "attendance",
    });

    //this.getPeepAttendance(peep);
  };

  getPeepSchedule(peep) {
    if (!peep || this.state.schedulesLoading) {
      return;
    }

    // show next up to 5 dates including individual class dates and events

    // then show tests coming up

    // then show all sessions signed up for

    // then show all events signed up for

    console.log("get peep schedule " + peep.id);

    const {
      myPeepSessions,
      myPeepEvents,
      myPeepEventIds,
      myPeepSessionClassDates,
      myPeepSessionIds,
      myPeepTests,
      myPeepTestIds,
      locations,
      testLocations,
    } = this.state;

    let tests = myPeepTests;

    tests = tests.filter(
      (tests, index, self) => index === self.findIndex((t) => t.id === tests.id)
    );

    var upcomingTests = [];
    var peepsTests = [];
    let test, peepTestId;
    for (test of tests) {
      for (peepTestId of myPeepTestIds) {
        if (peepTestId.testId == test.id && peepTestId.peepId == peep.id) {
          peepsTests.push(test);
        }
      }
    }

    for (test of peepsTests) {
      let testDate = moment(test.date, "YYYY-MM-DD");
      if (moment().isBefore(testDate)) {
        upcomingTests.push(test);
      }
    }

    var upcomingTestsWithLocation = [];
    let ut, utAddress;
    for (ut of peepsTests) {
      for (loc of testLocations) {
        if (loc.name == ut.location) {
          utAddress = loc.address;
          break;
        }
      }
      const testWithLocation = {
        key: ut.id,
        id: ut.id,
        title: ut.title,
        type: ut.type,
        date: ut.date,
        startTime: ut.startTime,
        endTime: ut.endTime,
        location: ut.location,
        address: utAddress,
      };
      upcomingTestsWithLocation.push(testWithLocation);
    }

    let sessions = myPeepSessions;

    sessions = sessions.filter(
      (sessions, index, self) =>
        index === self.findIndex((t) => t.id === sessions.id)
    );

    let classDate, session, event, peepEventId, peepSessionId;
    let peepsClassDates = [],
      peepsSessions = [],
      peepsEvents = [];

    for (session of sessions) {
      for (peepSessionId of myPeepSessionIds) {
        if (
          peepSessionId.sessionId == session.id &&
          peepSessionId.peepId == peep.id
        ) {
          peepsSessions.push(session);

          for (classDate of myPeepSessionClassDates) {
            if (classDate.sessionId == session.id) {
              peepsClassDates.push(classDate);
            }
          }
        }
      }
    }

    peepsClassDates.sort((a, b) => (a.date > b.date ? 1 : -1));

    let upcomingClassDates = peepsClassDates.slice(
      0,
      peepsClassDates.length / 5
    );
    var sessionsWithLocation = [];
    let s, loc, sAddress;
    for (s of peepsSessions) {
      for (loc of locations) {
        if (loc.name == s.location) {
          sAddress = loc.address;
          break;
        }
      }
      const sessionWithLocation = {
        key: s.id,
        id: s.id,
        title: s.title,
        description: s.description,
        startDate: s.startDate,
        endDate: s.endDate,
        endTime: s.endTime,
        location: s.location,
        address: sAddress,
      };
      sessionsWithLocation.push(sessionWithLocation);
    }

    for (event of myPeepEvents) {
      for (peepEventId of myPeepEventIds) {
        if (peepEventId.eventId == event.id && peepEventId.peepId == peep.id) {
          peepsEvents.push(event);
        }
      }
    }

    var eventsWithLocation = [];
    let pe, peAddress;
    for (pe of peepsEvents) {
      for (loc of locations) {
        if (loc.name == pe.location) {
          peAddress = loc.address;
          break;
        }
      }
      const eventWithLocation = {
        key: pe.id,
        id: pe.id,
        title: pe.title,
        description: pe.description,
        date: pe.date,
        startTime: pe.startTime,
        endTime: pe.endTime,
        location: pe.location,
        address: peAddress,
      };
      eventsWithLocation.push(eventWithLocation);
    }

    let testsHeader = [
      <Text strong style={{ textShadow: "0px 1px 0px rgba(255,255,255,0.9)" }}>
        tests
      </Text>,
    ];

    let testsContent = [
      <List
        size="small"
        bordered
        itemLayout="horizontal"
        dataSource={upcomingTestsWithLocation}
        renderItem={(test) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={testImage} />}
              title={
                <Col>
                  <Row>{moment(test.date).format("dddd, MMMM Do YYYY")}</Row>
                  {test.startTime + "-" + test.endTime}
                </Col>
              }
              description={
                <Col>
                  <Row>
                    <Text type="secondary">{test.title}</Text>
                  </Row>
                  <Paragraph
                    type="secondary"
                    ellipsis={{
                      expandable: true,
                      suffix: test.location,
                      expandable: true,
                    }}
                  >
                    <Row>
                      <Text type="secondary" copyable>
                        {test.address}
                      </Text>
                    </Row>
                  </Paragraph>
                </Col>
              }
            />
          </List.Item>
        )}
      />,
    ];

    let sessionsHeader = [
      <Text strong style={{ textShadow: "0px 1px 0px rgba(255,255,255,0.9)" }}>
        sessions
      </Text>,
    ];

    let sessionsContent = [
      <List
        size="small"
        bordered
        itemLayout="horizontal"
        dataSource={sessionsWithLocation}
        renderItem={(session) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={sessionImage} />}
              title={
                <Col>
                  <Row>{moment(session.startDate).format("MMMM Do YYYY")}</Row>-
                  {moment(session.endDate).format("MMMM Do YYYY")}
                </Col>
              }
              description={
                <Col>
                  <Row>{session.title}</Row>
                  {session.description}

                  <Paragraph
                    type="secondary"
                    ellipsis={{
                      expandable: true,
                      suffix: session.location,
                      expandable: true,
                    }}
                  >
                    <Row>
                      <Text type="secondary" copyable>
                        {session.address}
                      </Text>
                    </Row>
                  </Paragraph>
                </Col>
              }
            />
          </List.Item>
        )}
      />,
    ];

    let classDatesHeader = [
      <Text strong style={{ textShadow: "0px 1px 0px rgba(255,255,255,0.9)" }}>
        upcoming classes
      </Text>,
    ];

    let classDatesContent = [
      <List
        size="small"
        bordered
        itemLayout="horizontal"
        dataSource={upcomingClassDates}
        renderItem={(classDate) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={classDateImage} />}
              title={
                <Col>
                  <Row>
                    {moment(classDate.date).format("dddd, MMMM Do YYYY")}
                  </Row>
                  {classDate.startTime + "-" + classDate.endTime}
                </Col>
              }
              description={
                <Col>
                  <Row>{classDate.title}</Row>
                  {classDate.location}
                </Col>
              }
            />
          </List.Item>
        )}
      />,
    ];

    let eventsHeader = [
      <Text strong style={{ textShadow: "0px 1px 0px rgba(255,255,255,0.9)" }}>
        events
      </Text>,
    ];

    let eventsContent = [
      <List
        size="small"
        bordered
        itemLayout="horizontal"
        dataSource={eventsWithLocation}
        renderItem={(event) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={eventImage} />}
              title={
                <Col>
                  <Row>{moment(event.date).format("dddd, MMMM Do YYYY")}</Row>
                  {event.startTime + "-" + event.endTime}
                </Col>
              }
              description={
                <Col>
                  <Row>{event.title}</Row>
                  <Row>{event.description}</Row>
                  <Paragraph
                    type="secondary"
                    ellipsis={{
                      expandable: true,
                      suffix: event.location,
                      expandable: true,
                    }}
                  >
                    <Row>
                      <Text type="secondary" copyable>
                        {event.address}
                      </Text>
                    </Row>
                  </Paragraph>
                </Col>
              }
            />
          </List.Item>
        )}
      />,
    ];

    return (
      <div>
        <Collapse defaultActiveKey={["3"]} ghost>
          <Panel header={classDatesHeader} key="3">
            {classDatesContent}
          </Panel>
          <Panel header={testsHeader} key="1">
            {testsContent}
          </Panel>
          <Panel header={sessionsHeader} key="2">
            {sessionsContent}
          </Panel>
          <Panel header={eventsHeader} key="4">
            {eventsContent}
          </Panel>
        </Collapse>
      </div>
    );
  }

  getFullLocationByName(name) {
    let promise;
    promise = getLocationByName(name);

    if (!promise) {
      return;
    }

    promise
      .then((response) => {
        /*         this.setState({
          location: response,
        }); */
        return response;
      })
      .catch((error) => {});
  }

  getPeepTests(peep) {
    return this.createPeepTestScoreTable(peep);
  }

  getPeepAttendance(peep) {
    return (
      <Text style={{ textShadow: "0px 1px 0px rgba(255,255,255,0.9)" }}>
        {peep.firstName} attendance
      </Text>
    );
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  resetFields() {
    this.formRef.current.resetFields();
    this.setState({
      firstName: {
        text: "",
      },
      lastName: {
        text: "",
      },
      email: {
        text: "",
      },
      birthDateMonth: {
        text: "",
      },
      birthDateDay: {
        text: "",
      },
      birthDateYear: {
        text: "",
      },
      rank: {
        text: "Gold Stripe",
      },
      active: true,
    });
  }

  validateName = (nameText) => {
    if (nameText.length === 0) {
      return {
        validateStatus: "error",
        errorMsg: "Please enter students first name",
      };
    } else if (nameText.length > 40) {
      return {
        validateStatus: "error",
        errorMsg: `Name is too long (Maximum ${40} characters allowed)`,
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null,
      };
    }
  };

  validateEmail = (text) => {
    if (text.length === 0) {
      return {
        validateStatus: "error",
        errorMsg: "Please enter students email",
      };
    } else if (text.length > 40) {
      return {
        validateStatus: "error",
        errorMsg: `email is too long (Maximum ${40} characters allowed)`,
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null,
      };
    }
  };

  handleMonthChange(value) {
    value--;
    this.setState({
      birthDateMonth: {
        text: value,
      },
    });
  }

  handleDayChange(event) {
    const value = event.target.value;
    this.setState({
      birthDateDay: {
        text: value,
        ...this.validateName(value),
      },
    });
  }
  handleYearChange(event) {
    const value = event.target.value;
    this.setState({
      birthDateYear: {
        text: value,
        ...this.validateName(value),
      },
    });
  }

  handleEmailChange(event) {
    const value = event.target.value;
    this.setState({
      email: {
        text: value,
        ...this.validateEmail(value),
      },
    });
  }

  handleFirstNameChange(event) {
    const value = event.target.value;
    this.setState({
      firstName: {
        text: value,
        ...this.validateName(value),
      },
    });
  }

  handleLastNameChange(event) {
    const value = event.target.value;
    this.setState({
      lastName: {
        text: value,
        ...this.validateName(value),
      },
    });
  }

  isFormInvalid() {
    if (this.state.firstName.validateStatus !== "success") {
      return true;
    }
  }

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleSubmit(event) {
    this.setState({ loading: true });

    var d = new Date();
    d.setMonth(this.state.birthDateMonth.text);
    d.setDate(this.state.birthDateDay.text);
    d.setYear(this.state.birthDateYear.text);

    const studentData = {
      firstName: this.state.firstName.text,
      lastName: this.state.lastName.text,
      email: this.state.email.text,
      birthDate: d,
      ranks: "Gold Belt",
      active: false,
      joined: moment().format("YYYY-MM-DD"),
    };

    createStudent(studentData)
      .then((response) => {
        this.createUserStudent(response.id);
        notification.success({
          message: "Add Successful!",
          description:
            this.state.firstName.text +
            " " +
            this.state.lastName.text +
            " was added.",
          duration: 4,
        });
        this.resetFields();
        this.setState({ loading: false, visible: false });
      })
      .catch((error) => {
        if (error.status === 401) {
          this.props.handleLogout(
            "/login",
            "error",
            "You have been logged out. Please login."
          );
        } else {
          notification.error({
            message: "Dans App",
            description:
              error.message || "Sorry! Something went wrong. Please try again!",
          });
        }
      });
  }

  createUserStudent(studentId) {
    const userStudent = {
      userId: this.state.currentUser.id,
      studentId: studentId,
    };

    createUserStudent(userStudent)
      .then((response) => {
        this.getMyPeepsList();
      })
      .catch((error) => {});
  }

  render() {
    const {
      myPeeps,
      myPeepCards,
      visible,
      loading,
      currentUser,
      peepScheduleVisible,
      peepTestsVisible,
      peepAttendanceVisible,
      selectedPeep,
      peepContentSelected,
    } = this.state;

    myPeepCards.length = 0;

    let peep, peepContent, pcs;
    for (peep of myPeeps) {
      peepContent = "";
      for (pcs of peepContentSelected) {
        if (pcs.peepId == peep.id) {
          if (pcs.selectedContent == "schedule") {
            peepContent = [this.getPeepSchedule(peep)];
          } else if (pcs.selectedContent == "tests") {
            peepContent = [this.getPeepTests(peep)];
          } else if (pcs.selectedContent == "attendance") {
            peepContent = [this.getPeepAttendance(peep)];
          }
        }
      }

      const peepTitle = [
        <Col>
          <Row>
            <Title
              style={{
                marginLeft: 20,
                marginTop: 10,
                marginBottom: 0,
                color: "white",
              }}
              level={3}
            >
              {peep.firstName} {peep.lastName.charAt(0)}.
            </Title>
          </Row>
          <Row>
            <Text
              style={{
                fontStyle: "italic",
                marginLeft: 20,
                marginBottom: 10,
                color: "white",
              }}
              type="secondary"
            >
              {peep.ranks}
            </Text>
          </Row>
        </Col>,
      ];

      const peepCard = [
        <Card
          headStyle={{
            padding: 0,
            backgroundColor: "#4694b4",
            borderRadius: "10px 10px 0px 0px",
          }}
          bodyStyle={{ backgroundColor: "white", padding: 0 }}
          style={{
            backgroundColor: "white",
            width: "100%",
            textShadow: "1px 1px 1px rgba(0,0,0,0.1)",
            borderRadius: "10px",
            boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.39)",
            padding: 6,
          }}
          title={peepTitle}
          actions={[
            <Button
              type="secondary"
              onClick={this.showPeepSchedule(peep)}
              style={{ width: "90%" }}
            >
              Schedule
            </Button>,
            <Button
              type="secondary"
              onClick={this.showPeepTests(peep)}
              style={{ width: "90%" }}
            >
              Tests
            </Button>,
            <Button
              type="secondary"
              onClick={this.showPeepAttendance(peep)}
              style={{ width: "90%" }}
            >
              Attendance
            </Button>,
          ]}
        >
          {peepContent}
        </Card>,
      ];

      myPeepCards.push(
        <div style={{ marginLeft: 3, marginRight: 3, marginTop: 15 }}>
          {peepCard}
        </div>
      );
    }

    const newStudentTitle = [<Title level={2}>New Student</Title>];

    const content = [
      <Modal
        className="my-group"
        visible={visible}
        title={newStudentTitle}
        style={{ top: 0 }}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" type="secondary" onClick={this.handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            icon={<SaveOutlined />}
            loading={loading}
            onClick={this.handleSubmit}
          >
            Save
          </Button>,
        ]}
      >
        <Form layout="vertical" onFinish={this.handleSubmit} ref={this.formRef}>
          <Form.Item
            name="firstName"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                {"First"}
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter students first name.",
              },
            ]}
          >
            <Input
              placeholder="Bruce"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 1 }}
              value={this.state.firstName.text}
              onChange={this.handleFirstNameChange}
            />
          </Form.Item>

          <Form.Item
            name="lastName"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                {"Last"}
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter students last name.",
              },
            ]}
          >
            <Input
              placeholder="Wayne"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 1 }}
              value={this.state.lastName.text}
              onChange={this.handleLastNameChange}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                {"Email"}
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: false,
                type: "email",
                message: "Please enter students email.",
              },
            ]}
          >
            <Input
              placeholder="myemail@gmail.com"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 1 }}
              value={this.state.email.text}
              onChange={this.handleEmailChange}
            />
          </Form.Item>

          <Divider orientation="left">Birth Date</Divider>

          <Form.Item
            name="month"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                {"Month"}
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please select student birth month.",
              },
            ]}
          >
            <Select onChange={this.handleMonthChange} style={{ width: 200 }}>
              {children}
            </Select>
          </Form.Item>

          <Form.Item
            className="student-form-row"
            name="day"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                {"Day"}
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please select student birth day.",
              },
            ]}
          >
            <Input
              placeholder="DD"
              style={{ width: 100, fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 1 }}
              value={this.state.birthDateDay.text}
              onChange={this.handleDayChange}
            />
          </Form.Item>

          <Form.Item
            className="student-form-row"
            name="year"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                {"Year"}
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please select student birth year.",
              },
            ]}
          >
            <Input
              placeholder="YYYY"
              style={{ width: 100, fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 1 }}
              value={this.state.birthDateYear.text}
              onChange={this.handleYearChange}
            />
          </Form.Item>
        </Form>
      </Modal>,
      <div>{myPeepCards}</div>,
    ];

    const title = [
      <Row style={{ marginTop: 5 }}>
        <Title level={3}>
          My Group <TeamOutlined />
        </Title>
        <Divider
          style={{ height: 35, marginLeft: 15, marginRight: 15 }}
          type="vertical"
        />
        <Button icon={<UserAddOutlined />} onClick={this.showModal}>
          Add
        </Button>
      </Row>,
    ];

    return (
      <div className="my-group">
        <Card
          bordered={false}
          bodyStyle={{ padding: 6 }}
          style={{
            width: "100%",
            padding: 0,
          }}
          title={title}
        >
          {content}
        </Card>
        <Modal
          visible={peepScheduleVisible}
          title="Schedule"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Ok
            </Button>,
          ]}
        >
          {this.getPeepSchedule(selectedPeep)}
        </Modal>
        <Modal
          visible={peepTestsVisible}
          title="Tests"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button type="primary" key="back" onClick={this.handleCancel}>
              Ok
            </Button>,
          ]}
        >
          {this.getPeepTests(selectedPeep)}
        </Modal>
        <Modal
          visible={peepAttendanceVisible}
          title="Attendance"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button type="primary" key="back" onClick={this.handleCancel}>
              Ok
            </Button>,
          ]}
        >
          {this.getPeepAttendance(selectedPeep)}
        </Modal>
      </div>
    );
  }
}

export default withRouter(MyGroup);
