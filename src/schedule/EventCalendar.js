import React, { Component } from "react";
import moment from "moment";
import {
  Modal,
  notification,
  Calendar,
  Select,
  Badge,
  Typography,
  DatePicker,
  TimePicker,
  message,
  Card,
  Input,
  Table,
  List,
  Tag,
  Row,
  Col,
  Button,
  Layout,
  Divider,
  Form,
  Spin,
  Alert,
} from "antd";
import {
  getAllEventsByMonthYear,
  getAllTestsByMonthYear,
  getAllClassDatesByMonthYear,
  getAllLocations,
  createEvent,
} from "../util/APIUtils";
import "../styles/style.less";
import { getRanks } from "../util/Helpers.js";

import {
  SaveOutlined,
  ReloadOutlined,
  CarryOutOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const Option = Select.Option;

const ages = [];
for (let i = 0; i < 100; i++) {
  ages.push(<Option key={i}>{i}</Option>);
}
const ranks = getRanks();
const { TextArea } = Input;
const { Title, Text } = Typography;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const { Header, Footer, Sider, Content } = Layout;

const style = { background: "#0092ff", padding: "8px 0" };

class EventCalendar extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      currentUser: this.props.currentUser,

      year: moment().year(),
      month: moment().month(),
      events: [],
      tests: [],
      classDates: [],
      eventDates: [],
      dayModalVisible: "",
      eventModalVisible: "",
      loading: false,
      selectedDate: "",
      selectedMoment: moment(),
      locations: [],
      selectedLocation: "",
    };

    this.dateCellRender = this.dateCellRender.bind(this);
    this.handleDateClick = this.handleDateClick.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.onMonthYearChange = this.onMonthYearChange.bind(this);
    this.getEventsByMonthYear = this.getEventsByMonthYear.bind(this);
    this.getClassDatesByMonthYear = this.getClassDatesByMonthYear.bind(this);
    this.getTestsByMonthYear = this.getTestsByMonthYear.bind(this);
    this.changeSelectedEvent = this.changeSelectedEvent.bind(this);
    this.handleLocationDropdownChange =
      this.handleLocationDropdownChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
  }

  formRef = React.createRef();

  componentDidMount() {
    this.onMonthYearChange(moment(), String(moment().format("YYYY-MM")));
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
        //if (value != "null") {
        //  eventList.push(value);
        //}
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

    console.log("update event list " + newEventDates.length);
  }

  changeSelectedEvent(value) {
    let parts = value.split("-");
    let year = parts[0];
    let month = parts[1];
    let day = parts[2];

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
    let day = parts[2];

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

    //<Divider style={{ marginTop: 8, marginBottom: 8 }} />
    let daysEvents = [];
    if (valueEventsDate.length > 0) {
      <ul>
        {valueEventsDate.map((date) =>
          daysEvents.push(
            <li key={date.title + date.id}>{this.getFullDateData(date)}</li>
          )
        )}
      </ul>;
    }

    return daysEvents;
  }

  getFullDateData(date) {
    const firstLine = [
      <Text strong>
        <Tag color={this.getTypeColor(date.type)}>{date.title}</Tag>
        {date.startTime + " - " + date.endTime}
      </Text>,
    ];
    const secondLine = [<Text>{date.description}</Text>];
    const view = [
      <Row>{firstLine}</Row>,
      <Row style={{ marginTop: 5, marginLeft: 15 }}>{secondLine}</Row>,
    ];
    return view;
  }

  render() {
    const {
      title,
      description,
      locations,
      selectedLocation,
      selectedDate,
      selectedMoment,
      month,
      year,
      loading,
      dayModalVisible,
      eventModalVisible,
      eventDates,
      tests,
      price,
    } = this.state;

    const headerRender = () => null;

    const datepickerValue = moment(selectedMoment.format("YYYY-MM"));

    //console.log("user " + this.state.currentUser.role);
    var isGood;
    if (this.state.currentUser) {
      isGood = this.state.currentUser.role;
    } else {
      isGood = "user";
    }

    const renderButton = () => {
      if (isGood == "user" || isGood == "admin") {
        return (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={this.showEventModal}
            size={"default"}
            style={{
              marginBottom: 0,
              marginTop: 0,
              marginLeft: 10,
              marginRight: 0,
            }}
          >
            New Event
          </Button>
        );
      } else {
        return [];
      }
    };

    var valueEventsDate = [];

    let date;
    for (date of eventDates) {
      valueEventsDate.push(date);
    }

    for (date of tests) {
      valueEventsDate.push(date);
    }

    valueEventsDate.sort((a, b) => (a.date > b.date ? 1 : -1));

    const ModalTitle = <Title level={2}>New Event</Title>;
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
      <Row style={{ marginTop: 10, marginLeft: 10 }}>
        <DatePicker
          onChange={this.onMonthYearChange}
          picker="month"
          inputReadOnly="true"
          defaultValue={moment().format("YYYY-MM")}
          value={datepickerValue}
          style={{
            marginLeft: 0,
          }}
        />
        {renderButton()}
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
        className="eventCalendar"
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

    return (
      <Content className="eventCalendar">
        <Card
          bodyStyle={{ padding: 0 }}
          bordered={false}
          title={<Title level={3}>{cardTitle}</Title>}
        >
          <Row justify="space-around" style={{ marginBottom: 10 }}>
            <Col span={4}>
              <Tag color="gray">Session</Tag>
            </Col>
            <Col span={4}>
              <Tag color="red">Test</Tag>
            </Col>
            <Col span={4}>
              <Tag color="lime">Camp</Tag>
            </Col>
            <Col span={4}>
              <Tag color="cyan">Event</Tag>
            </Col>
          </Row>

          {calendar}
        </Card>
      </Content>
    );
  }

  dateCellRender(value) {
    const { eventDates, tests } = this.state;

    var cellDate = value.format("YYYY-MM-DD");
    var valueEventsDate = [];

    let date;
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

    if (valueEventsDate.length > 0) {
      return (
        <ul className="events">
          {valueEventsDate.map((date) => (
            <li key={date.id}>
              <Tag color={this.getTypeColor(date.type)}>{date.title}</Tag>
            </li>
          ))}
        </ul>
      );
    }
  }

  getTypeColor(type) {
    if (type == "Camp") {
      return "lime";
    } else if (type == "Test") {
      return "red";
    } else if (type == "Misc") {
      return "cyan";
    }
    return "gray";
  }

  onMonthYearChange(date, dateString) {
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
