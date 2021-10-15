import React, { Component } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  Modal,
  Calendar,
  Select,
  Typography,
  DatePicker,
  Card,
  Checkbox,
  List,
  Tag,
  Row,
  Col,
  Button,
  Layout,
} from "antd";
import {
  getAllEventsByMonthYear,
  getAllTestsByMonthYear,
  getAllClassDatesByMonthYear,
  getAllLocations,
  getMyPeeps,
  getStudentTests,
  getStudentEvents,
  getStudentSessions,
} from "../util/APIUtils";
import "../styles/style.less";
import { getRanks } from "../util/Helpers.js";

import {
  ClockCircleOutlined,
  AlertOutlined,
  SmileOutlined,
} from "@ant-design/icons";

const Option = Select.Option;
const ages = [];
for (let i = 0; i < 100; i++) {
  ages.push(<Option key={i}>{i}</Option>);
}
const { Title } = Typography;
const { Content } = Layout;

class EventCalendar extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      currentUser: this.props.currentUser,

      myPeeps: [],
      year: moment().year(),
      month: moment().month(),
      events: [],
      tests: [],
      classDates: [],
      eventDates: [],
      myPeepTestIds: [],
      myPeepSessionIds: [],
      myPeepEventIds: [],
      dayModalVisible: "",
      eventModalVisible: "",
      loading: false,
      selectedDate: "",
      selectedMoment: moment(),
      locations: [],
      selectedLocation: "",
      myCalendar: true,
    };

    this.getMyPeepCalendarItems = this.getMyPeepCalendarItems.bind(this);
    this.getMyPeepCalendarEvents = this.getMyPeepCalendarEvents.bind(this);
    this.getMyPeepCalendarSessions = this.getMyPeepCalendarSessions.bind(this);
    this.getMyPeepsList = this.getMyPeepsList.bind(this);
    this.dateCellRender = this.dateCellRender.bind(this);
    this.handleDateClick = this.handleDateClick.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.onMonthYearChange = this.onMonthYearChange.bind(this);
    this.getEventsByMonthYear = this.getEventsByMonthYear.bind(this);
    this.getClassDatesByMonthYear = this.getClassDatesByMonthYear.bind(this);
    this.getTestsByMonthYear = this.getTestsByMonthYear.bind(this);
    this.changeSelectedEvent = this.changeSelectedEvent.bind(this);
    this.handleLocationDropdownChange = this.handleLocationDropdownChange.bind(
      this
    );
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.onMyCalendarChange = this.onMyCalendarChange.bind(this);
  }

  formRef = React.createRef();

  componentDidMount() {
    this.onMonthYearChange(moment(), String(moment().format("YYYY-MM")));
    this.getMyPeepsList();
  }

  getMyPeepsList() {
    let promise;

    let userId;
    if (
      this.state.currentUser &&
      this.state.currentUser !== "null" &&
      this.state.currentUser !== "undefined"
    ) {
      userId = this.state.currentUser.id;
    } else {
      userId = this.props.currentUser;
    }

    promise = getMyPeeps(userId);
    if (!promise) {
      return;
    }

    promise
      .then((response) => {
        this.setState(
          {
            myPeeps: response,
          },
          () => this.getMyPeepCalendarItems(response)
        );
      })
      .catch((error) => {});
  }

  getMyPeepCalendarItems(peeps) {
    var promises = [];
    var peepItemIds = [];
    var value, innerValue;

    this.state.myPeepTestIds.length = 0;
    let peep;
    for (peep of peeps) {
      let promise = getStudentTests(peep.id);
      promises.push(promise);
    }

    Promise.all(promises).then((values) => {
      for (value of values) {
        for (innerValue of value) {
          peepItemIds.push(innerValue.id);
        }
      }
      this.setState(
        {
          myPeepTestIds: peepItemIds,
        },
        () => this.getMyPeepCalendarEvents(peeps)
      );
    });
  }

  getMyPeepCalendarEvents(peeps) {
    var promises = [];
    var peepItemIds = [];
    var value, innerValue;

    this.state.myPeepEventIds.length = 0;
    let peep;
    for (peep of peeps) {
      let promise = getStudentEvents(peep.id);
      promises.push(promise);
    }

    Promise.all(promises).then((values) => {
      for (value of values) {
        for (innerValue of value) {
          peepItemIds.push(innerValue.id);
        }
      }
      this.setState(
        {
          myPeepEventIds: peepItemIds,
        },
        () => this.getMyPeepCalendarSessions(peeps)
      );
    });
  }

  getMyPeepCalendarSessions(peeps) {
    var promises = [];
    var peepItemIds = [];
    var value, innerValue;

    this.state.myPeepSessionIds.length = 0;
    let peep;
    for (peep of peeps) {
      let promise = getStudentSessions(peep.id);
      promises.push(promise);
    }

    Promise.all(promises).then((values) => {
      for (value of values) {
        for (innerValue of value) {
          peepItemIds.push(innerValue.id);
        }
      }
      this.setState({
        myPeepSessionIds: peepItemIds,
      });
    });
  }

  getTestsByMonthYear(page, month, year) {
    var value,
      months = [],
      years = [],
      promises = [],
      testList = [];

    var priorMonth = month - 1;
    var nextMonth = parseInt(month) + 1;
    var priorYear = year,
      nextYear = year;

    if (priorMonth == 0) {
      priorMonth = 12;
      priorYear = year - 1;
    }
    if (nextMonth == 13) {
      nextMonth = 1;
      nextYear = year + 1;
    }

    months.push(priorMonth, month, nextMonth);
    years.push(priorYear, year, nextYear);

    this.setState({
      loading: true,
    });

    let i = 0,
      m;
    for (m of months) {
      let promise = getAllTestsByMonthYear(page, 100, m, years[i++]);
      promises.push(promise);
    }

    let con;
    this.state.tests.length = 0;
    Promise.all(promises).then((values) => {
      for (value of values) {
        for (con of value.content) {
          testList.push(con);
        }
      }

      this.setState({
        tests: this.state.tests.concat(testList),
      });
    });
  }

  getEventsByMonthYear(page, month, year) {
    var value,
      months = [],
      years = [],
      promises = [],
      eventList = [];

    var priorMonth = month - 1;
    var nextMonth = parseInt(month) + 1;
    var priorYear = year,
      nextYear = year;

    if (priorMonth == 0) {
      priorMonth = 12;
      priorYear = year - 1;
    }
    if (nextMonth == 13) {
      nextMonth = 1;
      nextYear = year + 1;
    }

    months.push(priorMonth, month, nextMonth);
    years.push(priorYear, year, nextYear);

    this.setState({
      loading: true,
    });

    let i = 0,
      m;
    for (m of months) {
      let promise = getAllEventsByMonthYear(page, 100, m, years[i++]);
      promises.push(promise);
    }

    let con;
    this.state.events.length = 0;
    Promise.all(promises).then((values) => {
      for (value of values) {
        for (con of value.content) {
          eventList.push(con);
        }
      }

      this.setState(
        {
          events: this.state.events.concat(eventList),
        },
        () => this.getClassDatesByMonthYear(0, months, years)
      );
    });
  }

  getClassDatesByMonthYear(page, months, years) {
    var value,
      promises = [],
      eventList = [];

    let i = 0,
      m;
    for (m of months) {
      let promise = getAllClassDatesByMonthYear(page, 100, m, years[i++]);
      promises.push(promise);
    }

    let con;
    this.state.classDates.length = 0;
    Promise.all(promises).then((values) => {
      for (value of values) {
        for (con of value.content) {
          eventList.push(con);
        }
      }
      this.setState(
        {
          classDates: this.state.classDates.concat(eventList),
        },
        () => this.updateEventList()
      );
    });
  }

  getLocationList(page) {
    let promise;
    promise = getAllLocations(page, 1000);

    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise
      .then((response) => {
        this.setState({
          locations: response.content,
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last,
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  updateEventList() {
    const { events, classDates } = this.state;

    this.state.eventDates.length = 0;
    var newEventDates = [];

    let vent;
    for (vent of events) {
      newEventDates.push(vent);
    }

    let classDate;
    for (classDate of classDates) {
      newEventDates.push(classDate);
    }

    this.setState({
      eventDates: newEventDates,
      loading: false,
    });
  }

  changeSelectedEvent(value) {
    let parts = value.split("-");
    let year = parts[0];
    let month = parts[1];

    this.setState(
      {
        selectedDate: value,
        selectedMoment: moment(value),
        month: month,
        year: year,
      },
      () => this.handleDateClick(moment(value))
    );
  }

  handleDateChange(date, dateString) {
    let parts = dateString.split("-");
    let year = parts[0];
    let month = parts[1];

    this.setState({
      newEventDate: dateString,
      month: month,
      year: year,
    });
  }

  handleLocationDropdownChange = (value) => {
    this.setState({ selectedLocation: value });
  };

  handleTypeChange = (value) => {
    this.setState({ type: value });
  };

  showEventModal = () => {
    this.getLocationList(0);
    this.setState({
      loading: false,
      eventModalVisible: true,
    });
  };

  showDayModal = () => {
    this.setState({
      dayModalVisible: true,
    });
  };

  handleCancel = () => {
    this.setState({ dayModalVisible: false });
  };

  handleDateClick(e) {
    var date = e.format("dddd, MMMM Do YYYY");

    this.setState({
      dayModalVisible: true,
      selectedDate: date,
      selectedMoment: e,
    });
  }

  getDaysEvents(value) {
    const { eventDates, tests } = this.state;

    let cellDate = value.format("YYYY-MM-DD");

    var valueEventsDate = [];

    let date;
    for (date of eventDates) {
      if (date.date.substring(0, 10) == cellDate) {
        const event = {
          id: date.id,
          sessionId: date.sessionId,
          type: date.type,
          title: date.title,
          date: date.date,
          location: date.location,
          description: date.description,
          startTime: date.startTime,
          endTime: date.endTime,
        };

        valueEventsDate.push(event);
      }
    }

    for (date of tests) {
      if (date.date.substring(0, 10) == cellDate) {
        const event = {
          id: date.id,
          type: "Test",
          title: date.title,
          date: date.date,
          location: date.location,
          description: date.description,
          startTime: date.startTime,
          endTime: date.endTime,
        };

        valueEventsDate.push(event);
      }
    }

    let daysEvents = [];
    if (valueEventsDate.length > 0) {
      {
        valueEventsDate.map((date) =>
          daysEvents.push(
            <li key={date.title + date.id}>{this.getFullDateData(date)}</li>
          )
        );
      }
    }

    return daysEvents;
  }

  getFullDateData(date) {
    var firstLine = [];

    //session, test, event
    if (date.type == undefined) {
      firstLine = [
        <div className="day-event-container">
          <div className="day-event-info">
            <Tag
              className="tag"
              icon={this.getTypeIcon(date.type)}
              color={this.getTypeColor(date.type)}
            >
              {date.title}
            </Tag>
            <div className="day-event-time">
              {date.startTime + " - " + date.endTime}
            </div>
          </div>
          <Link to={`/user/sessions/${date.sessionId}`}>
            <button type="button" className="btn">
              View Session
            </button>
          </Link>
        </div>,
      ];
    } else if (date.type == "Test") {
      firstLine = [
        <div className="day-event-container">
          <div className="day-event-info">
            <Tag
              className="tag"
              icon={this.getTypeIcon(date.type)}
              color={this.getTypeColor(date.type)}
            >
              {date.title}
            </Tag>
            <div className="day-event-time">
              {date.startTime + " - " + date.endTime}
            </div>
          </div>
        </div>,
      ];
    } else if (date.type == "Event") {
      firstLine = [
        <div className="day-event-container">
          <div className="day-event-info">
            <Tag
              className="tag"
              icon={this.getTypeIcon(date.type)}
              color={this.getTypeColor(date.type)}
            >
              {date.title}
            </Tag>
            <div className="day-event-time">
              {date.startTime + " - " + date.endTime}
            </div>
          </div>
          <Link to={`/user/events/${date.id}`}>
            <button type="button" className="btn">
              View Event
            </button>
          </Link>
        </div>,
      ];
    }

    const view = [
      <Row>{firstLine}</Row>,
      <Row style={{ marginLeft: 15 }}></Row>,
    ];
    return view;
  }

  onMyCalendarChange() {
    this.setState({
      myCalendar: !this.state.myCalendar,
    });
  }

  render() {
    const {
      selectedDate,
      selectedMoment,
      year,
      loading,
      dayModalVisible,
      eventDates,
      tests,
      myCalendar,
      myPeepEventIds,
      myPeepSessionIds,
      myPeepTestIds,
    } = this.state;

    const headerRender = () => null;

    const datepickerValue = moment(selectedMoment.format("YYYY-MM"));

    var isGood;
    if (this.state.currentUser) {
      isGood = this.state.currentUser.role;
    } else {
      isGood = "user";
    }

    var valueEventsDate = [];

    let date, id;
    for (date of eventDates) {
      if (myCalendar) {
        if (date.type == "Event") {
          for (id of myPeepEventIds) {
            if (id == date.id) {
              valueEventsDate.push(date);
              break;
            }
          }
        } else {
          for (id of myPeepSessionIds) {
            if (id == date.sessionId) {
              valueEventsDate.push(date);
              break;
            }
          }
        }
      } else {
        valueEventsDate.push(date);
      }
    }

    for (date of tests) {
      if (myCalendar) {
        for (id of myPeepTestIds) {
          if (id == date.id) {
            valueEventsDate.push(date);
            break;
          }
        }
      } else {
        valueEventsDate.push(date);
      }
    }

    valueEventsDate.sort((a, b) => (a.date > b.date ? 1 : -1));

    const ModalSelectedDateTitle = <Title level={2}>{selectedDate}</Title>;

    const calendar = [
      <Row style={{ marginLeft: 10, marginRight: 10 }}>
        <Select
          align="center"
          style={{
            width: "100%",
            marginLeft: 0,
          }}
          placeholder="Events / Classes"
          optionFilterProp="children"
          dropdownClassName="calendar-event"
          onChange={this.changeSelectedEvent}
          Key={valueEventsDate.index}
        >
          {valueEventsDate.map((date) => (
            <Select.Option value={date.date} key={date.date + date.id}>
              {date.date} | {date.title}
            </Select.Option>
          ))}
        </Select>
      </Row>,

      <Calendar
        style={{ marginTop: 10 }}
        loading={loading}
        headerRender={headerRender}
        mode={"month"}
        value={selectedMoment}
        onSelect={this.handleDateClick}
        dateCellRender={this.dateCellRender}
      ></Calendar>,

      <Modal
        className="calendar-event"
        closable={false}
        visible={dayModalVisible}
        title={ModalSelectedDateTitle}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" block={true} onClick={this.handleCancel}>
            Ok
          </Button>,
        ]}
      >
        <List
          size="default"
          dataSource={this.getDaysEvents(selectedMoment)}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Modal>,
    ];

    var shortName = moment.monthsShort(parseInt(selectedMoment.month(), 10));
    var cardTitle = "Calendar " + shortName + " '" + String(year).slice(-2);

    var cardHeader = [
      <Row style={{ display: "flex", justifyContent: "space-between" }}>
        <Title level={3}>{cardTitle}</Title>
        <DatePicker
          onChange={this.onMonthYearChange}
          picker="month"
          inputReadOnly="true"
          dropdownClassName="calendar-event"
          defaultValue={moment().format("YYYY-MM")}
          value={datepickerValue}
          style={{
            height: 35,
            width: 110,
          }}
        />
      </Row>,
    ];

    return (
      <Content className="calendar-event">
        <Card
          bodyStyle={{ padding: 0 }}
          bordered={false}
          title={cardHeader}
          loading={loading}
        >
          <Row
            justify="space-between"
            style={{ marginBottom: 5, marginTop: 5, marginLeft: 10 }}
          >
            <Checkbox
              style={{ width: "65px" }}
              checked={myCalendar}
              onChange={this.onMyCalendarChange}
            >
              Mine
            </Checkbox>
            <Col span={4}>
              <Tag color="cyan">Session</Tag>
            </Col>
            <Col span={4}>
              <Tag color="red">Test</Tag>
            </Col>
            <Col span={4}>
              <Tag color="green">Event</Tag>
            </Col>
          </Row>

          {calendar}
        </Card>
      </Content>
    );
  }

  dateCellRender(value) {
    const {
      eventDates,
      tests,
      myCalendar,
      myPeepTestIds,
      myPeepSessionIds,
      myPeepEventIds,
    } = this.state;

    var cellDate = value.format("YYYY-MM-DD");
    var valueEventsDate = [];

    let date, id;
    for (date of eventDates) {
      if (date.date.substring(0, 10) == cellDate) {
        const event = {
          id: date.id,
          type: date.type,
          title: date.title,
          date: date.date,
          location: date.location,
          description: date.description,
          startTime: date.startTime,
          endTime: date.endTime,
        };

        if (myCalendar) {
          if (date.type == "Event") {
            for (id of myPeepEventIds) {
              if (id == date.id) {
                valueEventsDate.push(event);
                break;
              }
            }
          } else {
            for (id of myPeepSessionIds) {
              if (id == date.sessionId) {
                valueEventsDate.push(event);
                break;
              }
            }
          }
        } else {
          valueEventsDate.push(event);
        }
      }
    }

    for (date of tests) {
      if (date.date.substring(0, 10) == cellDate) {
        const event = {
          id: date.id,
          type: "Test",
          title: date.title,
          date: date.date,
          location: date.location,
          description: date.description,
          startTime: date.startTime,
          endTime: date.endTime,
        };

        if (myCalendar) {
          for (id of myPeepTestIds) {
            if (id == date.id) {
              valueEventsDate.push(event);
              break;
            }
          }
        } else {
          valueEventsDate.push(event);
        }
      }
    }

    if (valueEventsDate.length > 0) {
      return (
        <ul className="events">
          {valueEventsDate.map((date) => (
            <li key={date.id}>
              <Tag
                color={this.getTypeColor(date.type)}
                icon={this.getTypeIcon(date.type)}
              >
                {date.title}
              </Tag>
            </li>
          ))}
        </ul>
      );
    }
  }

  getTypeIcon(type) {
    if (type == "Event") {
      return <SmileOutlined />;
    } else if (type == "Test") {
      return <AlertOutlined />;
    } else if (type == "Misc") {
      return "cyan";
    }
    return <ClockCircleOutlined />;
  }

  getTypeColor(type) {
    if (type == "Event") {
      return "green";
    } else if (type == "Test") {
      return "red";
    } else if (type == "Misc") {
      return "cyan";
    }
    return "cyan";
  }

  onMonthYearChange(date, dateString) {
    if (dateString == "") return;
    let parts = dateString.split("-");
    let month = parts[1];
    let year = parts[0];

    let newDate = dateString.concat("-01");
    let newMoment = moment(newDate);

    this.setState(
      {
        month: month,
        year: year,
        selectedMoment: newMoment,
      },
      () => this.getTestsAndEvents(0, month, year)
    );
  }

  getTestsAndEvents(page, month, year) {
    this.getEventsByMonthYear(0, month, year);
    this.getTestsByMonthYear(0, month, year);
  }
}

export default EventCalendar;
