import React, { Component } from "react";
import {
  createSession,
  createClassDate,
  getAllLocations,
} from "../util/APIUtils";
import moment from "moment";
import {
  Typography,
  Checkbox,
  TimePicker,
  Radio,
  Table,
  Space,
  Card,
  Form,
  Input,
  Button,
  Icon,
  Select,
  notification,
  DatePicker,
  Transfer,
  Divider,
  Row,
  Col,
  InputNumber,
} from "antd";
import "./Attendance.css";

import {
  SaveOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CarryOutOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const DayOptions = [
  { label: "Monday", value: "1" },
  { label: "Tuesday", value: "2" },
  { label: "Wednesday", value: "3" },
  { label: "Thursday", value: "4" },
  { label: "Friday", value: "5" },
  { label: "Saturday", value: "6" },
];

const SecondHourOptions = [
  { label: "Mon 2nd Hr", value: "1" },
  { label: "Tue 2nd Hr", value: "2" },
  { label: "Wed 2nd Hr", value: "3" },
  { label: "Thu 2nd Hr", value: "4" },
  { label: "Fri 2nd Hr", value: "5" },
  { label: "Sat 2nd Hr", value: "6" },
];

const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;
const verticalRows = {};

class NewSession extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLocation: "Select a location",
      date: {
        text: "",
      },
      year: "",
      month: "",
      day: "",
      locationItems: [],
      selectedItems: [],
      selectedDate: "",
      dates: [],
      checkboxValues: [],
      selectedDate: moment(),
      specificDate: moment(),
      startDate: moment(),
      endDate: moment(),
      selectedDays: [],
      selected2ndHours: [],
      datesSet: false,
      sessionId: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeSelectedDate = this.changeSelectedDate.bind(this);
    this.removeSelectedDate = this.removeSelectedDate.bind(this);
    this.handleLocationDropdownChange = this.handleLocationDropdownChange.bind(
      this
    );
    this.addSpecificDate = this.addSpecificDate.bind(this);
    this.changeSpecificDate = this.changeSpecificDate.bind(this);
    this.changeDateRange = this.changeDateRange.bind(this);
    this.onCheckboxChangeDays = this.onCheckboxChangeDays.bind(this);
    this.onCheckboxChange2ndHours = this.onCheckboxChange2ndHours.bind(this);
    this.resetAllDates = this.resetAllDates.bind(this);
    this.setDates = this.setDates.bind(this);
    this.updateDates = this.updateDates.bind(this);
  }

  componentDidMount() {
    this.getAllLocationsList(0);

    this.setState({
      selectedLocation: this.state.locationItems[0],
    });
  }

  handleSubmit(event) {
    const { dates } = this.state;
    let localSessionId;
    event.preventDefault();

    console.log("save session");

    const SessionData = {
      location: this.state.selectedLocation,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
    };

    createSession(SessionData)
      .then((response) => {
        this.setState({
          sessionId: response.id,
        });
        localSessionId = response.id;
        this.props.history.push("/");
        notification.success({
          message: "Save Successful!",
          description: "Session was saved.",
          duration: 2,
        });
      })
      .catch((error) => {
        if (error.status === 401) {
          this.props.handleLogout(
            "/login",
            "error",
            "You have been logged out. Please login create poll."
          );
        } else {
          notification.error({
            message: "Dans App",
            description:
              error.message || "Sorry! Something went wrong. Please try again!",
          });
        }
      });

    var date;
    var month, year;
    var secondHour = false;
    for (date of dates) {
      if (date.getHours() == "2") {
        secondHour = true;
      } else {
        secondHour = false;
      }
      month = date.getMonth() + 1;
      year = date.getFullYear();
      let ClassDateData = {
        location: this.state.selectedLocation,
        date: date,
        sessionId: localSessionId,
        secondHour: secondHour,
        month: month,
        year: year,
      };

      createClassDate(ClassDateData)
        .then((response) => {})
        .catch((error) => {});
    }
  }

  changeDateRange(value, dateString) {
    if (value) {
      this.setState({
        startDate: value[0],
        endDate: value[1],
        datesSet: false,
      });
    }
  }

  updateDates() {
    const { startDate, endDate, selectedDays, selected2ndHours } = this.state;
    var days = [];

    for (
      var day = moment(startDate);
      day.isBefore(endDate);
      day.add(1, "days")
    ) {
      if (this.validDay(selectedDays, day)) {
        day.startOf("day"); // set as not having 2nd hour by default
        var sh;
        for (sh of selected2ndHours) {
          if (sh == day.day()) {
            day.hour(2); // set as having 2nd hour
            break;
          }
        }
        days.push(day.toDate());
      }
    }

    console.log(
      "dates" +
        this.state.dates +
        " days" +
        selectedDays +
        " start" +
        startDate +
        " end" +
        endDate
    );

    this.setState({ dates: days });
  }

  validDay(selectedDays, day) {
    var d;
    for (d of selectedDays) {
      if (d == day.day()) {
        return true;
      }
    }
    return false;
  }

  handleLocationDropdownChange = (value) => {
    this.setState({ selectedLocation: value });
  };

  getAllLocationsList(page) {
    let promise;
    promise = getAllLocations(page, 1000);

    if (!promise) {
      return;
    }

    this.setState({
      isLoading: true,
    });

    promise
      .then((response) => {
        this.setState({
          locationItems: response.content,
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

  onCheckboxChange2ndHours(checkedValues) {
    this.setState({
      selected2ndHours: checkedValues,
      datesSet: false,
    });
  }

  onCheckboxChangeDays(checkedValues) {
    var { selected2ndHours } = this.state;

    this.setState({
      selectedDays: checkedValues,
      datesSet: false,
    });

    if (
      !checkedValues.some(function (e) {
        return e == "1";
      })
    ) {
      for (var i = 0; i < selected2ndHours.length; i++) {
        if (selected2ndHours[i] == "1") {
          selected2ndHours.splice(i, 1);
        }
      }
    }

    if (
      !checkedValues.some(function (e) {
        return e == "2";
      })
    ) {
      for (var i = 0; i < selected2ndHours.length; i++) {
        if (selected2ndHours[i] == "2") {
          selected2ndHours.splice(i, 1);
        }
      }
    }

    if (
      !checkedValues.some(function (e) {
        return e == "3";
      })
    ) {
      for (var i = 0; i < selected2ndHours.length; i++) {
        if (selected2ndHours[i] == "3") {
          selected2ndHours.splice(i, 1);
        }
      }
    }

    if (
      !checkedValues.some(function (e) {
        return e == "4";
      })
    ) {
      for (var i = 0; i < selected2ndHours.length; i++) {
        if (selected2ndHours[i] == "4") {
          selected2ndHours.splice(i, 1);
        }
      }
    }

    if (
      !checkedValues.some(function (e) {
        return e == "5";
      })
    ) {
      for (var i = 0; i < selected2ndHours.length; i++) {
        if (selected2ndHours[i] == "5") {
          selected2ndHours.splice(i, 1);
        }
      }
    }

    if (
      !checkedValues.some(function (e) {
        return e == "6";
      })
    ) {
      for (var i = 0; i < selected2ndHours.length; i++) {
        if (selected2ndHours[i] == "6") {
          selected2ndHours.splice(i, 1);
        }
      }
    }
  }

  render() {
    const {
      selectedLocation,
      locationItems,
      selectedDate,
      specificDate,
      dates,
    } = this.state;
    const { selectedDays, selected2ndHours, startDate, endDate } = this.state;

    let { datesSet } = this.state;
    const renderButton = () => {
      if (datesSet) {
        return (
          <Button
            icon={<CarryOutOutlined />}
            disabled
            style={{ marginLeft: 0 }}
            onClick={this.setDates}
            shape="round"
            type="primary"
          >
            Confirm Dates
          </Button>
        );
      } else {
        return (
          <Button
            icon={<CarryOutOutlined />}
            style={{ marginLeft: 0 }}
            onClick={this.setDates}
            shape="round"
            type="primary"
          >
            Confirm Dates
          </Button>
        );
      }
    };

    var d;
    var selectDates = [];
    for (d of dates) {
      if (d.getHours() == "2") {
        selectDates.push(d.toDateString().concat(" 2nd Hour"));
      } else {
        selectDates.push(d.toDateString());
      }
    }

    const dayCheckboxes = [
      <Checkbox.Group
        options={DayOptions}
        value={selectedDays}
        style={{ marginLeft: 10, marginTop: 10, width: "100%" }}
        onChange={this.onCheckboxChangeDays}
      ></Checkbox.Group>,
      <Checkbox.Group
        options={SecondHourOptions}
        value={selected2ndHours}
        style={{ marginLeft: 10, marginTop: 10, width: "100%" }}
        onChange={this.onCheckboxChange2ndHours}
      ></Checkbox.Group>,
    ];

    const contentList = [
      <Form onSubmit={this.handleSubmit} className="new-Test-form">
        <Divider style={{ marginTop: 10 }} orientation="left">
          {<Title level={5}>Location</Title>}
        </Divider>
        <Form.Item label="">
          <Select
            align="center"
            style={{ marginLeft: 10, width: "50%" }}
            Key={locationItems.id}
            defaultValue={selectedLocation}
            onChange={this.handleLocationDropdownChange}
          >
            {locationItems.map((item) => (
              <Select.Option value={item.name} key={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Divider style={{ marginTop: 30 }} orientation="left">
          {<Title level={5}>Duration / Days Per Wk</Title>}
        </Divider>
        <Col style={{ marginLeft: 10, marginBottom: 10 }}>
          <RangePicker
            inputReadOnly="true"
            style={{ marginTop: 0, marginLeft: 0 }}
            value={[startDate, endDate]}
            onChange={this.changeDateRange}
          />
          {dayCheckboxes}
          {renderButton()}
          <Button
            icon={<ReloadOutlined />}
            style={{ marginTop: 10, marginLeft: 10 }}
            onClick={this.resetAllDates.bind()}
            shape="round"
            type="primary"
          >
            Reset All Dates
          </Button>
        </Col>

        <Divider style={{ marginTop: 30 }} orientation="left">
          View Dates / Select date to remove
        </Divider>

        <Row style={{ marginLeft: 10 }}>
          <Select
            align="center"
            style={{ width: "50%" }}
            placeholder="Dates"
            optionFilterProp="children"
            onChange={this.changeSelectedDate}
            Key={selectDates.key}
          >
            {selectDates.map((date) => (
              <Select.Option value={date.toString()} key={date.toString()}>
                {date.toString()}
              </Select.Option>
            ))}
          </Select>

          <Button
            icon={<DeleteOutlined />}
            style={{ marginLeft: 10 }}
            onClick={this.removeSelectedDate.bind(this, selectedDate)}
            shape="round"
            type="primary"
          >
            Remove Date
          </Button>
        </Row>

        <Divider style={{ marginTop: 30 }} orientation="left">
          Add specific date
        </Divider>
        <DatePicker
          inputReadOnly="true"
          style={{ marginBottom: 10, marginLeft: 10 }}
          align="center"
          defaultValue={moment()}
          onChange={this.changeSpecificDate}
        />
        <Checkbox style={{ marginLeft: 20 }} value="2nd Hour">
          2nd Hour
        </Checkbox>
        <Button
          icon={<PlusCircleOutlined />}
          style={{ marginLeft: 10 }}
          onClick={this.addSpecificDate.bind(this, specificDate)}
          shape="round"
          type="primary"
        >
          Add Date
        </Button>

        <Divider></Divider>

        <FormItem>
          <Button
            icon={<SaveOutlined />}
            size="large"
            style={{ marginTop: 0 }}
            block={true}
            onClick={this.handleSubmit}
            shape="round"
            type="primary"
          >
            Save Session
          </Button>
        </FormItem>
      </Form>,
    ];

    return (
      <Card
        bodyStyle={{ padding: 10 }}
        style={{
          width: "100%",
          textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
          borderRadius: 6,
          marginRight: 0,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
        title={<Title level={3}>New Session</Title>}
      >
        {contentList}
      </Card>
    );
  }

  resetAllDates() {
    this.setState({
      selectedDays: [],
      selected2ndHours: [],
      dates: [],
      selectedDate: "",
      datesSet: false,
      startDate: moment(),
      endDate: moment(),
    });
  }

  setDates() {
    this.updateDates();

    this.setState({
      datesSet: true,
    });
  }

  changeSelectedDate(value) {
    this.setState({
      selectedDate: value,
    });
  }

  changeSpecificDate(value) {
    var date = value.toDate();
    this.setState({
      specificDate: date,
    });
  }

  addSpecificDate(value) {
    this.setState({
      dates: this.state.dates.concat(value),
    });
  }

  removeSelectedDate(value) {
    var subValue = value.replace(" 2nd Hour", "");
    const { dates } = this.state;
    var i = 0;
    var d;
    for (d of dates) {
      var subD = d.toString();
      subD = subD.slice(0, 15);
      if (subD == subValue) {
        break;
      }
      i++;
    }

    dates.splice(i, 1);

    this.setState({
      selectedDate: "",
    });
  }
}

export default NewSession;
