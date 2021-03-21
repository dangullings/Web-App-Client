import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  Table,
  Typography,
  DatePicker,
  Row,
  Popconfirm,
  Divider,
  Select,
  List,
  Radio,
  Modal,
  Space,
  message,
  Form,
  notification,
  Input,
  TimePicker,
  Checkbox,
  Col,
  Button,
  Card,
} from "antd";
import {
  createSession,
  createClassDate,
  getAllLocations,
  getAllSessions,
  getSessionStudents,
} from "../util/APIUtils";
import moment from "moment";
import { STUDENT_LIST_SIZE } from "../constants";
import { getRanks } from "../util/Helpers.js";
import { withRouter } from "react-router-dom";

import {
  SaveOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CarryOutOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import "../styles/style.less";

const ranks = getRanks();
const { Title, Text } = Typography;

const Option = Select.Option;

const ages = [];
for (let i = 0; i < 100; i++) {
  ages.push(<Option key={i}>{i}</Option>);
}

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 60,
  },
};

class SessionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessions: [],
      sessionStudents: [],
      size: STUDENT_LIST_SIZE,
      search: "",
      page: 0,
      searchText: "",
      searchedColumn: "",
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        pageSizeOptions: ["10", "25", "50", "100"],
      },
      total: 0,
      loading: false,

      selectedLocation: "Select a location",
      date: {
        text: "",
      },
      year: "",
      month: "",
      day: "",
      title: "",
      description: "",
      ageRange: "",
      rankRange: "",
      youngestAge: "",
      oldestAge: "",
      lowestRank: "",
      highestRank: "",
      price: "",
      locationItems: [],
      selectedItems: [],
      expandedRowKeys: [],
      selectedDate: "",
      dates: [],
      checkboxValues: [],
      selectedDate: moment(),
      startDate: moment(),
      endDate: moment().add(1, "M"),
      datesSet: false,
      sessionId: "",

      specific: {
        date: "",
        hasSecondHour: false,
        startTime: "",
        endTime: "",
      },

      monday: {
        isSelected: false,
        hasSecondHour: false,
        startTime: "",
        endTime: "",
      },

      tuesday: {
        isSelected: false,
        hasSecondHour: false,
        startTime: "",
        endTime: "",
      },

      wednesday: {
        isSelected: false,
        hasSecondHour: false,
        startTime: "",
        endTime: "",
      },

      thursday: {
        isSelected: false,
        hasSecondHour: false,
        startTime: "",
        endTime: "",
      },

      friday: {
        isSelected: false,
        hasSecondHour: false,
        startTime: "",
        endTime: "",
      },

      saturday: {
        isSelected: false,
        hasSecondHour: false,
        startTime: "",
        endTime: "",
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeSelectedDate = this.changeSelectedDate.bind(this);
    this.removeSelectedDate = this.removeSelectedDate.bind(this);
    this.handleLocationDropdownChange = this.handleLocationDropdownChange.bind(
      this
    );
    this.addSpecificDate = this.addSpecificDate.bind(this);
    this.changeSpecificDate = this.changeSpecificDate.bind(this);
    this.handleSpecificStartTimeChange = this.handleSpecificStartTimeChange.bind(
      this
    );
    this.handleSpecificEndTimeChange = this.handleSpecificEndTimeChange.bind(
      this
    );
    this.onSpecificSecondHourCheckboxChange = this.onSpecificSecondHourCheckboxChange.bind(
      this
    );
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleAgeRangeChange = this.handleAgeRangeChange.bind(this);
    this.handleRankRangeChange = this.handleRankRangeChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);

    this.handleYoungestAgeChange = this.handleYoungestAgeChange.bind(this);
    this.handleOldestAgeChange = this.handleOldestAgeChange.bind(this);
    this.handleLowestRankChange = this.handleLowestRankChange.bind(this);
    this.handleHighestRankChange = this.handleHighestRankChange.bind(this);

    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.onMondayCheckboxChange = this.onMondayCheckboxChange.bind(this);
    this.onMondaySecondHourCheckboxChange = this.onMondaySecondHourCheckboxChange.bind(
      this
    );
    this.handleMondayStartTimeChange = this.handleMondayStartTimeChange.bind(
      this
    );
    this.handleMondayEndTimeChange = this.handleMondayEndTimeChange.bind(this);
    this.onTuesdayCheckboxChange = this.onTuesdayCheckboxChange.bind(this);
    this.onTuesdaySecondHourCheckboxChange = this.onTuesdaySecondHourCheckboxChange.bind(
      this
    );
    this.handleTuesdayStartTimeChange = this.handleTuesdayStartTimeChange.bind(
      this
    );
    this.handleTuesdayEndTimeChange = this.handleTuesdayEndTimeChange.bind(
      this
    );

    this.onWednesdayCheckboxChange = this.onWednesdayCheckboxChange.bind(this);
    this.onWednesdaySecondHourCheckboxChange = this.onWednesdaySecondHourCheckboxChange.bind(
      this
    );
    this.handleWednesdayStartTimeChange = this.handleWednesdayStartTimeChange.bind(
      this
    );
    this.handleWednesdayEndTimeChange = this.handleWednesdayEndTimeChange.bind(
      this
    );

    this.onThursdayCheckboxChange = this.onThursdayCheckboxChange.bind(this);
    this.onThursdaySecondHourCheckboxChange = this.onThursdaySecondHourCheckboxChange.bind(
      this
    );
    this.handleThursdayStartTimeChange = this.handleThursdayStartTimeChange.bind(
      this
    );
    this.handleThursdayEndTimeChange = this.handleThursdayEndTimeChange.bind(
      this
    );

    this.onFridayCheckboxChange = this.onFridayCheckboxChange.bind(this);
    this.onFridaySecondHourCheckboxChange = this.onFridaySecondHourCheckboxChange.bind(
      this
    );
    this.handleFridayStartTimeChange = this.handleFridayStartTimeChange.bind(
      this
    );
    this.handleFridayEndTimeChange = this.handleFridayEndTimeChange.bind(this);

    this.onSaturdayCheckboxChange = this.onSaturdayCheckboxChange.bind(this);
    this.onSaturdaySecondHourCheckboxChange = this.onSaturdaySecondHourCheckboxChange.bind(
      this
    );
    this.handleSaturdayStartTimeChange = this.handleSaturdayStartTimeChange.bind(
      this
    );
    this.handleSaturdayEndTimeChange = this.handleSaturdayEndTimeChange.bind(
      this
    );

    this.resetAllDates = this.resetAllDates.bind(this);
    this.setDates = this.setDates.bind(this);
    this.updateDates = this.updateDates.bind(this);
    this.expandedRowRender = this.expandedRowRender.bind(this);
  }

  componentDidMount() {
    this.getSessionList(this.state.page, this.state.STUDENT_LIST_SIZE);
    this.getAllLocationsList(0);

    this.setState({
      selectedLocation: this.state.locationItems[0],
    });
  }

  isFormInvalid() {
    if (this.state.selectedLocation == "") {
      return true;
    }
    if (this.state.dates.length == 0) {
      return true;
    }

    return false;
  }

  getSessionList(page, pageSize) {
    let promise;
    promise = getAllSessions(page, pageSize);

    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise
      .then((response) => {
        let value;
        for (value of response.content) {
          this.getSessionStudentsList(value);
        }
        this.setState({
          //sessions: response.content,
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last,
          loading: false,
          pagination: {
            showSizeChanger: true,
            pageSizeOptions: ["10", "25", "50", "100"],
            current: response.page,
            pageSize: response.size,
            total: response.totalElements,
          },
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  getStudentLists() {
    const { sessions } = this.state;

    this.state.sessionStudents.length = 0;
    let session;
    for (session of sessions) {
      this.getSessionStudentsList(session.id);
    }
  }

  getSessionStudentsList(session) {
    let promise,
      students = [];
    promise = getSessionStudents(session.id);

    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise
      .then((response) => {
        let value;
        for (value of response) {
          const student = {
            id: value.id,
            firstName: value.firstName,
            lastName: value.lastName,
            ranks: value.ranks,
          };

          students.push(student);
        }

        const sessionData = {
          session: session,
          students: students,
        };

        this.setState({
          sessions: this.state.sessions.concat(sessionData),
          sessionStudents: students,
          loading: false,
        });
      })
      .catch((error) => {});
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.getSessionList(pagination.current, pagination.pageSize);
    /* this.fetch({
          sortField: sorter.field,
          sortOrder: sorter.order,
          pagination,
          ...filter
        }); */
  };

  showModal = () => {
    this.setState({
      visible: true,
    });

    this.getAllLocationsList(0);
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleSubmit(event) {
    event.preventDefault();

    const {
      youngestAge,
      oldestAge,
      lowestRank,
      highestRank,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
    } = this.state;

    let ageRange = youngestAge + "-" + oldestAge;
    let rankRange = lowestRank + "-" + highestRank;
    var days = "";
    if (monday.isSelected) {
      days += "mon,";
    }
    if (tuesday.isSelected) {
      days += "tue,";
    }
    if (wednesday.isSelected) {
      days += "wed,";
    }
    if (thursday.isSelected) {
      days += "thu,";
    }
    if (friday.isSelected) {
      days += "fri,";
    }
    if (saturday.isSelected) {
      days += "sat,";
    }

    const SessionData = {
      location: this.state.selectedLocation,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      title: this.state.title,
      description: this.state.description,
      ageRange: ageRange,
      rankRange: rankRange,
      price: this.state.price,
      days: days,
    };

    this.setState({
      loading: true,
    });

    createSession(SessionData)
      .then((response) => {
        notification.success({
          message: "Save Successful!",
          description: "Session was saved.",
          duration: 2,
        });

        this.setState(
          {
            sessionId: response.id,
          },
          () => this.saveClassDates(response.id)
        );
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
  }

  saveClassDates(sessionId) {
    const { dates } = this.state;
    var date;
    var month, year;
    for (date of dates) {
      let parts = date.date.split("-");
      let y = parts[0];
      let m = parts[1];

      month = m;
      year = y;

      let ClassDateData = {
        location: this.state.selectedLocation,
        title: this.state.title,
        date: date.date,
        startTime: date.startTime.format("h:mm a"),
        endTime: date.endTime.format("h:mm a"),
        sessionId: sessionId,
        secondHour: date.hasSecondHour,
        month: month,
        year: year,
      };

      createClassDate(ClassDateData)
        .then((response) => {
          this.setState({
            loading: false,
          });
          this.props.history.push("schedule/sessions");
        })
        .catch((error) => {
          this.setState({
            loading: false,
          });
        });
    }
  }

  resetAllDates() {
    this.setState({
      selectedDays: [],
      selected2ndHours: [],
      dates: [],
      selectedDate: "",
      datesSet: false,
      startDate: moment(),
      endDate: moment().add(1, "M"),

      specific: {
        date: "",
        hasSecondHour: false,
        startTime: "",
        endTime: "",
      },
      monday: {
        isSelected: false,
        hasSecondHour: false,
        startTime: "",
        endTime: "",
      },
      tuesday: {
        isSelected: false,
        hasSecondHour: false,
        startTime: "",
        endTime: "",
      },
      wednesday: {
        isSelected: false,
        hasSecondHour: false,
        startTime: "",
        endTime: "",
      },
      thursday: {
        isSelected: false,
        hasSecondHour: false,
        startTime: "",
        endTime: "",
      },
      friday: {
        isSelected: false,
        hasSecondHour: false,
        startTime: "",
        endTime: "",
      },
      saturday: {
        isSelected: false,
        hasSecondHour: false,
        startTime: "",
        endTime: "",
      },
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
    this.setState((prevState) => ({
      specific: {
        ...prevState.specific,
        date: value,
      },
    }));
  }

  addSpecificDate() {
    const { specific } = this.state;

    const newSpecific = {
      date: specific.date.format("YYYY-MM-DD"),
      hasSecondHour: specific.hasSecondHour,
      startTime: specific.startTime,
      endTime: specific.endTime,
    };

    this.setState({
      dates: this.state.dates.concat(newSpecific),
      specific: {
        date: "",
        hasSecondHour: false,
        startTime: "",
        endTime: "",
      },
    });

    message.success({
      content: "Specific date " + newSpecific.date + " added.",
      style: {
        marginTop: "30vh",
      },
    });
  }

  removeSelectedDate(value) {
    const { dates } = this.state;
    var i = 0;
    var d;
    var subValue = value.slice(0, 10);

    for (d of dates) {
      if (subValue == d.date) {
        break;
      }
      i++;
    }

    dates.splice(i, 1);

    this.setState({
      selectedDate: "",
    });

    message.success({
      content: subValue + " removed.",
      style: {
        marginTop: "30vh",
      },
    });
  }

  handleStartDateChange(date, dateString) {
    const { endDate } = this.state;

    if (date.isAfter(endDate)) {
      message.error({
        content: "Start date must be before end date",
        style: {
          marginTop: "30vh",
        },
      });
      return;
    }

    this.setState({
      startDate: date,
      datesSet: false,
    });
  }

  handleEndDateChange(date, dateString) {
    const { startDate } = this.state;

    if (date.isBefore(startDate)) {
      message.error({
        content: "End date must be before start date",
        style: {
          marginTop: "30vh",
        },
      });
      return;
    }

    this.setState({
      endDate: date,
      datesSet: false,
    });
  }

  updateDates() {
    const {
      startDate,
      endDate,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
    } = this.state;
    var days = [];

    for (
      var day = moment(startDate);
      day.isBefore(endDate);
      day.add(1, "days")
    ) {
      let isSelected = false,
        hasSecondHour = false,
        startTime,
        endTime;
      if (day.day() == 1) {
        if (monday.isSelected) {
          isSelected = true;
          startTime = monday.startTime;
          endTime = monday.endTime;
          if (monday.hasSecondHour) {
            hasSecondHour = true;
          }
        }
      } else if (day.day() == 2) {
        if (tuesday.isSelected) {
          isSelected = true;
          startTime = tuesday.startTime;
          endTime = tuesday.endTime;
          if (tuesday.hasSecondHour) {
            hasSecondHour = true;
          }
        }
      } else if (day.day() == 3) {
        if (wednesday.isSelected) {
          isSelected = true;
          startTime = wednesday.startTime;
          endTime = wednesday.endTime;
          if (wednesday.hasSecondHour) {
            hasSecondHour = true;
          }
        }
      } else if (day.day() == 4) {
        if (thursday.isSelected) {
          isSelected = true;
          startTime = thursday.startTime;
          endTime = thursday.endTime;
          if (thursday.hasSecondHour) {
            hasSecondHour = true;
          }
        }
      } else if (day.day() == 5) {
        if (friday.isSelected) {
          isSelected = true;
          startTime = friday.startTime;
          endTime = friday.endTime;
          if (friday.hasSecondHour) {
            hasSecondHour = true;
          }
        }
      } else if (day.day() == 6) {
        if (saturday.isSelected) {
          isSelected = true;
          startTime = saturday.startTime;
          endTime = saturday.endTime;
          if (saturday.hasSecondHour) {
            hasSecondHour = true;
          }
        }
      }

      if (isSelected) {
        let dayObject = {
          date: day.format("YYYY-MM-DD"),
          startTime: startTime,
          endTime: endTime,
          hasSecondHour: hasSecondHour,
        };

        days.push(dayObject);
      }
    }

    this.setState({ dates: days });

    message.success({
      content: "Class dates confirmed.",
      style: {
        marginTop: "30vh",
      },
    });
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

  onSpecificSecondHourCheckboxChange() {
    this.setState((prevState) => ({
      specific: {
        ...prevState.specific,
        hasSecondHour: !this.state.specific.hasSecondHour,
      },
    }));
  }

  handleSpecificStartTimeChange(time, timeString) {
    const { endTime } = this.state.specific;

    if (time.isAfter(endTime)) {
      message.error({
        content: "Start time must be before end time",
        style: {
          marginTop: "30vh",
        },
      });
      return;
    }

    this.setState((prevState) => ({
      specific: {
        ...prevState.specific,
        startTime: time,
      },
    }));
  }

  handleSpecificEndTimeChange(time, timeString) {
    const { startTime } = this.state.specific;

    if (time.isBefore(startTime)) {
      message.error({
        content: "End time must be after start time",
        style: {
          marginTop: "30vh",
        },
      });
      return;
    }

    this.setState((prevState) => ({
      specific: {
        ...prevState.specific,
        endTime: time,
      },
    }));
  }

  onMondayCheckboxChange() {
    this.setState((prevState) => ({
      datesSet: false,
      monday: {
        ...prevState.monday,
        isSelected: !this.state.monday.isSelected,
      },
    }));
  }

  onMondaySecondHourCheckboxChange() {
    this.setState((prevState) => ({
      datesSet: false,
      monday: {
        ...prevState.monday,
        hasSecondHour: !this.state.monday.hasSecondHour,
      },
    }));
  }

  handleMondayStartTimeChange(time, timeString) {
    const { endTime } = this.state.monday;

    if (time.isAfter(endTime)) {
      message.error({
        content: "Start time must be before end time",
        style: {
          marginTop: "30vh",
        },
      });
      return;
    }

    this.setState((prevState) => ({
      datesSet: false,
      monday: {
        ...prevState.monday,
        startTime: time,
      },
    }));
  }

  handleMondayEndTimeChange(time, timeString) {
    const { startTime } = this.state.monday;

    if (time.isBefore(startTime)) {
      message.error({
        content: "End time must be after start time",
        style: {
          marginTop: "30vh",
        },
      });
      return;
    }

    this.setState((prevState) => ({
      datesSet: false,
      monday: {
        ...prevState.monday,
        endTime: time,
      },
    }));
  }

  onTuesdayCheckboxChange() {
    this.setState((prevState) => ({
      datesSet: false,
      tuesday: {
        ...prevState.tuesday,
        isSelected: !this.state.tuesday.isSelected,
      },
    }));
  }
  onTuesdaySecondHourCheckboxChange() {
    this.setState((prevState) => ({
      datesSet: false,
      tuesday: {
        ...prevState.tuesday,
        hasSecondHour: !this.state.tuesday.hasSecondHour,
      },
    }));
  }

  handleTuesdayStartTimeChange(time, timeString) {
    const { endTime } = this.state.tuesday;

    if (time.isAfter(endTime)) {
      message.error({
        content: "Start time must be before end time",
        style: {
          marginTop: "30vh",
        },
      });
      return;
    }

    this.setState((prevState) => ({
      datesSet: false,
      tuesday: {
        ...prevState.tuesday,
        startTime: time,
      },
    }));
  }

  handleTuesdayEndTimeChange(time, timeString) {
    const { startTime } = this.state.tuesday;

    if (time.isBefore(startTime)) {
      message.error({
        content: "End time must be after start time",
        style: {
          marginTop: "30vh",
        },
      });
      return;
    }

    this.setState((prevState) => ({
      datesSet: false,
      tuesday: {
        ...prevState.tuesday,
        endTime: time,
      },
    }));
  }

  onWednesdayCheckboxChange() {
    this.setState((prevState) => ({
      datesSet: false,
      wednesday: {
        ...prevState.wednesday,
        isSelected: !this.state.wednesday.isSelected,
      },
    }));
  }

  onWednesdaySecondHourCheckboxChange() {
    this.setState((prevState) => ({
      datesSet: false,
      wednesday: {
        ...prevState.wednesday,
        hasSecondHour: !this.state.wednesday.hasSecondHour,
      },
    }));
  }

  handleWednesdayStartTimeChange(time, timeString) {
    const { endTime } = this.state.wednesday;

    if (time.isAfter(endTime)) {
      message.error({
        content: "Start time must be before end time",
        style: {
          marginTop: "30vh",
        },
      });
      return;
    }

    this.setState((prevState) => ({
      datesSet: false,
      wednesday: {
        ...prevState.wednesday,
        startTime: time,
      },
    }));
  }

  handleWednesdayEndTimeChange(time, timeString) {
    const { startTime } = this.state.wednesday;

    if (time.isBefore(startTime)) {
      message.error({
        content: "End time must be after start time",
        style: {
          marginTop: "30vh",
        },
      });
      return;
    }

    this.setState((prevState) => ({
      datesSet: false,
      wednesday: {
        ...prevState.wednesday,
        endTime: time,
      },
    }));
  }

  onThursdayCheckboxChange() {
    this.setState((prevState) => ({
      datesSet: false,
      thursday: {
        ...prevState.thursday,
        isSelected: !this.state.thursday.isSelected,
      },
    }));
  }

  onThursdaySecondHourCheckboxChange() {
    this.setState((prevState) => ({
      datesSet: false,
      thursday: {
        ...prevState.thursday,
        hasSecondHour: !this.state.thursday.hasSecondHour,
      },
    }));
  }

  handleThursdayStartTimeChange(time, timeString) {
    const { endTime } = this.state.thursday;

    if (time.isAfter(endTime)) {
      message.error({
        content: "Start time must be before end time",
        style: {
          marginTop: "30vh",
        },
      });
      return;
    }

    this.setState((prevState) => ({
      datesSet: false,
      thursday: {
        ...prevState.thursday,
        startTime: time,
      },
    }));
  }

  handleThursdayEndTimeChange(time, timeString) {
    const { startTime } = this.state.thursday;

    if (time.isBefore(startTime)) {
      message.error({
        content: "End time must be after start time",
        style: {
          marginTop: "30vh",
        },
      });
      return;
    }

    this.setState((prevState) => ({
      datesSet: false,
      thursday: {
        ...prevState.thursday,
        endTime: time,
      },
    }));
  }

  onFridayCheckboxChange() {
    this.setState((prevState) => ({
      datesSet: false,
      friday: {
        ...prevState.friday,
        isSelected: !this.state.friday.isSelected,
      },
    }));
  }

  onFridaySecondHourCheckboxChange() {
    this.setState((prevState) => ({
      datesSet: false,
      friday: {
        ...prevState.friday,
        hasSecondHour: !this.state.friday.hasSecondHour,
      },
    }));
  }

  handleFridayStartTimeChange(time, timeString) {
    const { endTime } = this.state.friday;

    if (time.isAfter(endTime)) {
      message.error({
        content: "Start time must be before end time",
        style: {
          marginTop: "30vh",
        },
      });
      return;
    }

    this.setState((prevState) => ({
      datesSet: false,
      friday: {
        ...prevState.friday,
        startTime: time,
      },
    }));
  }

  handleFridayEndTimeChange(time, timeString) {
    const { startTime } = this.state.friday;

    if (time.isBefore(startTime)) {
      message.error({
        content: "End time must be after start time",
        style: {
          marginTop: "30vh",
        },
      });
      return;
    }

    this.setState((prevState) => ({
      datesSet: false,
      friday: {
        ...prevState.friday,
        endTime: time,
      },
    }));
  }

  onSaturdayCheckboxChange() {
    this.setState((prevState) => ({
      datesSet: false,
      saturday: {
        ...prevState.saturday,
        isSelected: !this.state.saturday.isSelected,
      },
    }));
  }

  onSaturdaySecondHourCheckboxChange() {
    this.setState((prevState) => ({
      datesSet: false,
      saturday: {
        ...prevState.saturday,
        hasSecondHour: !this.state.saturday.hasSecondHour,
      },
    }));
  }

  handleSaturdayStartTimeChange(time, timeString) {
    const { endTime } = this.state.saturday;

    if (time.isAfter(endTime)) {
      message.error({
        content: "Start time must be before end time",
        style: {
          marginTop: "30vh",
        },
      });
      return;
    }

    this.setState((prevState) => ({
      datesSet: false,
      saturday: {
        ...prevState.saturday,
        startTime: time,
      },
    }));
  }

  handleSaturdayEndTimeChange(time, timeString) {
    const { startTime } = this.state.saturday;

    if (time.isBefore(startTime)) {
      message.error({
        content: "End time must be after start time",
        style: {
          marginTop: "30vh",
        },
      });
      return;
    }

    this.setState((prevState) => ({
      datesSet: false,
      saturday: {
        ...prevState.saturday,
        endTime: time,
      },
    }));
  }

  handleTitleChange(event) {
    const value = event.target.value;
    this.setState({
      title: value,
    });
  }

  handleDescriptionChange(event) {
    const value = event.target.value;
    this.setState({
      description: value,
    });
  }

  handlePriceChange(event) {
    const value = event.target.value;
    this.setState({
      price: value,
    });
  }

  handleAgeRangeChange(value) {
    this.setState({
      ageRange: value,
    });
  }

  handleRankRangeChange(value) {
    this.setState({
      rankRange: value,
    });
  }

  handleYoungestAgeChange(value) {
    this.setState({
      youngestAge: value,
    });
  }

  handleOldestAgeChange(value) {
    this.setState({
      oldestAge: value,
    });
  }

  handleLowestRankChange(value) {
    this.setState({
      lowestRank: value,
    });
  }

  handleHighestRankChange(value) {
    this.setState({
      highestRank: value,
    });
  }

  render() {
    const {
      selectedLocation,
      locationItems,
      selectedDate,
      specific,
      startDate,
      endDate,
      dates,
      sessions,
      sessionStudents,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      title,
      description,
      ageRange,
      rankRange,
      youngestAge,
      oldestAge,
      lowestRank,
      highestRank,
      price,
    } = this.state;
    const { pagination, visible, loading, size } = this.state;

    let { datesSet } = this.state;
    const renderButton = () => {
      if (datesSet) {
        return (
          <Button
            icon={<CarryOutOutlined />}
            disabled
            style={{
              boxShadow:
                "0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 4px 10px 0 rgba(0, 0, 0, 0.39)",
              marginLeft: 10,
              width: "60%",
            }}
            onClick={this.setDates}
            shape="round"
            type="primary"
          >
            Confirm
          </Button>
        );
      } else {
        return (
          <Button
            icon={<CarryOutOutlined />}
            style={{
              boxShadow:
                "0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 4px 10px 0 rgba(0, 0, 0, 0.39)",
              marginLeft: 10,
              width: "60%",
            }}
            onClick={this.setDates}
            shape="round"
            type="primary"
          >
            Confirm
          </Button>
        );
      }
    };

    var d;
    var selectDates = [];
    for (d of dates) {
      let date = d.date;
      let time =
        d.startTime.format("hh:mm a") + "-" + d.endTime.format("hh:mm a");
      let secondHour;
      if (d.hasSecondHour) {
        secondHour = "2nd";
      } else {
        secondHour = "";
      }
      let date_time = date + " | " + time + " | " + secondHour;

      selectDates.push(date_time);
    }

    const addSpecificDate = [
      <Row style={{ marginTop: 0, marginLeft: 10 }}>
        <Col>
          <DatePicker
            inputReadOnly="true"
            style={{ marginBottom: 10, marginLeft: 0 }}
            align="center"
            size={"small"}
            defaultValue={moment()}
            value={specific.date}
            onChange={this.changeSpecificDate}
          />
          <Checkbox
            style={{ marginLeft: 20 }}
            checked={this.state.specific.hasSecondHour}
            onChange={this.onSpecificSecondHourCheckboxChange}
          >
            2nd
          </Checkbox>
        </Col>
      </Row>,
      <Row style={{ marginTop: 0, marginLeft: 10, marginBottom: 20 }}>
        <Col>
          <TimePicker
            inputReadOnly="true"
            style={{ width: "50%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"start"}
            minuteStep={15}
            value={specific.startTime}
            onChange={this.handleSpecificStartTimeChange}
          />
          <TimePicker
            inputReadOnly="true"
            style={{ width: "50%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"end"}
            minuteStep={15}
            value={specific.endTime}
            onChange={this.handleSpecificEndTimeChange}
          />
        </Col>
      </Row>,
    ];

    const dayCheckboxes = [
      <Row style={{ marginTop: 0, marginLeft: 4 }}>
        <Col>
          <Checkbox
            style={{ width: "65px" }}
            checked={monday.isSelected}
            onChange={this.onMondayCheckboxChange}
          >
            Mon
          </Checkbox>

          <TimePicker
            inputReadOnly="true"
            style={{ width: "30%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"start"}
            minuteStep={15}
            value={monday.startTime}
            onChange={this.handleMondayStartTimeChange}
          />
          <TimePicker
            inputReadOnly="true"
            style={{ width: "30%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"end"}
            minuteStep={15}
            value={monday.endTime}
            onChange={this.handleMondayEndTimeChange}
          />

          {/* <Checkbox
            style={{ marginLeft: 4 }}
            checked={monday.hasSecondHour}
            onChange={this.onMondaySecondHourCheckboxChange}
          >
            2nd
          </Checkbox> */}
        </Col>
        <Divider style={{ marginTop: 8, marginBottom: 8 }} />
      </Row>,
      <Row style={{ marginTop: 0, marginLeft: 4 }}>
        <Col>
          <Checkbox
            style={{ width: "65px" }}
            checked={tuesday.isSelected}
            onChange={this.onTuesdayCheckboxChange}
          >
            Tue
          </Checkbox>

          <TimePicker
            inputReadOnly="true"
            style={{ width: "30%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"start"}
            minuteStep={15}
            value={tuesday.startTime}
            onChange={this.handleTuesdayStartTimeChange}
          />
          <TimePicker
            inputReadOnly="true"
            style={{ width: "30%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"end"}
            minuteStep={15}
            value={tuesday.endTime}
            onChange={this.handleTuesdayEndTimeChange}
          />

          {/* <Checkbox
            style={{ marginLeft: 4 }}
            checked={tuesday.hasSecondHour}
            onChange={this.onTuesdaySecondHourCheckboxChange}
          >
            2nd
          </Checkbox> */}
        </Col>
        <Divider style={{ marginTop: 8, marginBottom: 8 }} />
      </Row>,
      <Row style={{ marginTop: 0, marginLeft: 4 }}>
        <Col>
          <Checkbox
            style={{ width: "65px" }}
            checked={wednesday.isSelected}
            onChange={this.onWednesdayCheckboxChange}
          >
            Wed
          </Checkbox>

          <TimePicker
            inputReadOnly="true"
            style={{ width: "30%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"start"}
            minuteStep={15}
            value={wednesday.startTime}
            onChange={this.handleWednesdayStartTimeChange}
          />
          <TimePicker
            inputReadOnly="true"
            style={{ width: "30%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"end"}
            minuteStep={15}
            value={wednesday.endTime}
            onChange={this.handleWednesdayEndTimeChange}
          />

          {/*  <Checkbox
            style={{ marginLeft: 4 }}
            checked={wednesday.hasSecondHour}
            onChange={this.onWednesdaySecondHourCheckboxChange}
          >
            2nd
          </Checkbox> */}
        </Col>
        <Divider style={{ marginTop: 8, marginBottom: 8 }} />
      </Row>,
      <Row style={{ marginTop: 0, marginLeft: 4 }}>
        <Col>
          <Checkbox
            style={{ width: "65px" }}
            checked={thursday.isSelected}
            onChange={this.onThursdayCheckboxChange}
          >
            Thur
          </Checkbox>

          <TimePicker
            inputReadOnly="true"
            style={{ width: "30%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"start"}
            minuteStep={15}
            value={thursday.startTime}
            onChange={this.handleThursdayStartTimeChange}
          />
          <TimePicker
            inputReadOnly="true"
            style={{ width: "30%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"end"}
            minuteStep={15}
            value={thursday.endTime}
            onChange={this.handleThursdayEndTimeChange}
          />

          {/* <Checkbox
            style={{ marginLeft: 4 }}
            checked={thursday.hasSecondHour}
            onChange={this.onThursdaySecondHourCheckboxChange}
          >
            2nd
          </Checkbox> */}
        </Col>
        <Divider style={{ marginTop: 8, marginBottom: 8 }} />
      </Row>,
      <Row style={{ marginTop: 0, marginLeft: 4 }}>
        <Col>
          <Checkbox
            style={{ width: "65px" }}
            checked={friday.isSelected}
            onChange={this.onFridayCheckboxChange}
          >
            Fri
          </Checkbox>

          <TimePicker
            inputReadOnly="true"
            style={{ width: "30%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"start"}
            minuteStep={15}
            value={friday.startTime}
            onChange={this.handleFridayStartTimeChange}
          />
          <TimePicker
            inputReadOnly="true"
            style={{ width: "30%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"end"}
            minuteStep={15}
            value={friday.endTime}
            onChange={this.handleFridayEndTimeChange}
          />

          {/*  <Checkbox
            style={{ marginLeft: 4 }}
            checked={friday.hasSecondHour}
            onChange={this.onFridaySecondHourCheckboxChange}
          >
            2nd
          </Checkbox> */}
        </Col>
        <Divider style={{ marginTop: 8, marginBottom: 8 }} />
      </Row>,
      <Row style={{ marginTop: 0, marginBottom: 20, marginLeft: 4 }}>
        <Col>
          <Checkbox
            style={{ width: "65px" }}
            checked={saturday.isSelected}
            onChange={this.onSaturdayCheckboxChange}
          >
            Sat
          </Checkbox>

          <TimePicker
            inputReadOnly="true"
            style={{ width: "30%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"start"}
            minuteStep={15}
            value={saturday.startTime}
            onChange={this.handleSaturdayStartTimeChange}
          />
          <TimePicker
            inputReadOnly="true"
            style={{ width: "30%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"end"}
            minuteStep={15}
            value={saturday.endTime}
            onChange={this.handleSaturdayEndTimeChange}
          />

          {/* <Checkbox
            style={{ marginLeft: 4 }}
            checked={saturday.hasSecondHour}
            onChange={this.onSaturdaySecondHourCheckboxChange}
          >
            2nd
          </Checkbox> */}
        </Col>
      </Row>,
    ];

    const sessionCols = [
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        width: 50,
        render: (text, row) => <a>{text}</a>,
      },
      {
        title: "Location",
        dataIndex: "location",
        key: "location",
        width: 50,
      },
      {
        title: "Start Date",
        dataIndex: "startDate",
        key: "startDate",
        width: 50,
      },
      {
        title: "End Date",
        dataIndex: "endDate",
        key: "endDate",
        width: 50,
      },
    ];

    const sessionList = [];
    for (let i = 0; i < sessions.length; ++i) {
      sessionList.push({
        key: i,
        id: sessions[i].session.id,
        title: sessions[i].session.title,
        location: sessions[i].session.location,
        startDate: sessions[i].session.startDate,
        endDate: sessions[i].session.endDate,
        students: sessions[i].students,
      });
    }

    const ModalTitle = <Title level={2}>New Session</Title>;
    const TableTitle = <Title level={3}>Session List</Title>;

    const tableProps = {
      expandedRowRender: (record) => this.expandedRowRender(record),
    };

    const contentList = [
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={this.showModal}
        size={"default"}
        style={{
          marginBottom: 10,
          marginTop: 10,
          marginLeft: 8,
          marginRight: 10,
          boxShadow:
            "0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 4px 10px 0 rgba(0, 0, 0, 0.39)",
        }}
      >
        New Session
      </Button>,

      <Form
        {...layout}
        onFinish={this.handleSubmit}
        ref={this.formRef}
        style={{ top: 0, padding: 0, marginLeft: 0 }}
      >
        <Modal
          className="sessionList"
          visible={visible}
          title={ModalTitle}
          closable={false}
          style={{ top: 0 }}
          bodyStyle={{ padding: 8, marginBottom: 20 }}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button
              key="back"
              type="secondary"
              onClick={this.handleCancel}
              style={{
                boxShadow:
                  "0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 4px 10px 0 rgba(0, 0, 0, 0.39)",
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
                boxShadow:
                  "0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 4px 10px 0 rgba(0, 0, 0, 0.39)",
              }}
            >
              Save
            </Button>,
          ]}
        >
          <Divider style={{ marginTop: 10 }} orientation="left">
            {<Title level={4}>name and description</Title>}
          </Divider>
          <Form.Item
            name="title"
            style={{ marginLeft: 20 }}
            label={
              <Title style={{ marginTop: 14 }} level={5}>
                {"Title"}
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter the session title.",
              },
            ]}
          >
            <Input
              placeholder="Session Title"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 1 }}
              value={title.text}
              onChange={this.handleTitleChange}
            />
          </Form.Item>

          <Form.Item
            name="description"
            style={{ marginLeft: 20 }}
            label={
              <Title style={{ marginTop: 14 }} level={5}>
                {"Desc"}
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter the session description.",
              },
            ]}
          >
            <Input
              placeholder="Session Description"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 3 }}
              value={description.text}
              onChange={this.handleDescriptionChange}
            />
          </Form.Item>

          <Divider style={{ marginTop: 10 }} orientation="left">
            {<Title level={4}>student requirements/limits</Title>}
          </Divider>
          <Form.Item
            name="price"
            style={{ marginLeft: 20 }}
            label={
              <Title style={{ marginTop: 14 }} level={5}>
                {"Price"}
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter the session price.",
              },
            ]}
          >
            <Input
              placeholder="US$"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 1 }}
              value={price.text}
              onChange={this.handlePriceChange}
            />
          </Form.Item>

          <Form.Item label="lowest">
            <Select
              align="left"
              style={{ width: "100%" }}
              placeholder={"select a lowest rank"}
              defaultValue={"Gold Stripe"}
              onChange={this.handleLowestRankChange}
            >
              {ranks.map((rank) => (
                <Select.Option value={rank} key={rank}>
                  {rank}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="highest">
            <Select
              align="left"
              style={{ width: "100%" }}
              placeholder={"select a highest rank"}
              defaultValue={"Fifth Degree"}
              onChange={this.handleHighestRankChange}
            >
              {ranks.map((rank) => (
                <Select.Option value={rank} key={rank}>
                  {rank}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="youngest">
            <Select
              align="left"
              style={{ width: "100%" }}
              placeholder={"select a youngest age"}
              defaultValue={0}
              onChange={this.handleYoungestAgeChange}
            >
              {ages}
            </Select>
          </Form.Item>
          <Form.Item label="oldest">
            <Select
              align="left"
              style={{ width: "100%" }}
              placeholder={"select an oldest age"}
              defaultValue={99}
              onChange={this.handleOldestAgeChange}
            >
              {ages}
            </Select>
          </Form.Item>

          <Divider style={{ marginTop: 10 }} orientation="left">
            {<Title level={4}>location</Title>}
          </Divider>
          <Form.Item label="">
            <Select
              align="left"
              style={{ width: "100%" }}
              Key={locationItems.id}
              defaultValue={selectedLocation}
              placeholder={"select a location"}
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
            {<Title level={4}>duration / days</Title>}
          </Divider>
          <Form.Item
            label="Start Date"
            style={{ marginLeft: "40px" }}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please select the session start date.",
              },
            ]}
          >
            <DatePicker
              inputReadOnly="true"
              align="center"
              placeholder={"select start date"}
              value={startDate}
              onChange={this.handleStartDateChange}
            />
          </Form.Item>

          <Form.Item
            label="End Date"
            style={{ marginLeft: "40px" }}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please select the session end date.",
              },
            ]}
          >
            <DatePicker
              inputReadOnly="true"
              align="center"
              placeholder={"select end date"}
              value={endDate}
              onChange={this.handleEndDateChange}
            />
          </Form.Item>

          {dayCheckboxes}
          {renderButton()}
          <Button
            icon={<ReloadOutlined />}
            style={{
              boxShadow:
                "0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 4px 10px 0 rgba(0, 0, 0, 0.39)",
              marginTop: 10,
              marginLeft: 10,
              width: "30%",
            }}
            onClick={this.resetAllDates.bind()}
            shape="round"
            type="primary"
          >
            Reset
          </Button>
          <Divider style={{ marginTop: 30 }} orientation="left">
            {<Title level={4}>view / select dates to remove</Title>}
          </Divider>
          <Row style={{ marginLeft: 10 }}>
            <Select
              align="center"
              style={{ width: "80%" }}
              placeholder="Dates"
              optionFilterProp="children"
              onChange={this.changeSelectedDate}
              Key={selectDates.index}
            >
              {selectDates.map((date) => (
                <Select.Option value={date.date_time} key={date}>
                  {date.toString()}
                </Select.Option>
              ))}
            </Select>

            <Button
              icon={<DeleteOutlined />}
              style={{
                boxShadow:
                  "0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 4px 10px 0 rgba(0, 0, 0, 0.39)",
                marginLeft: 10,
              }}
              onClick={this.removeSelectedDate.bind(this, selectedDate)}
              shape="round"
              type="primary"
            ></Button>
          </Row>
          <Divider style={{ marginTop: 30 }} orientation="left">
            {<Title level={4}>add specific date</Title>}
          </Divider>
          {addSpecificDate}
          <Button
            icon={<PlusCircleOutlined />}
            style={{
              boxShadow:
                "0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 4px 10px 0 rgba(0, 0, 0, 0.39)",
              marginLeft: 10,
            }}
            onClick={this.addSpecificDate}
            shape="round"
            type="primary"
          >
            Add
          </Button>
        </Modal>
      </Form>,

      <Table
        loading={loading}
        rowKey={sessions.id}
        pagination={pagination}
        bordered
        columns={sessionCols}
        dataSource={sessionList}
        size="small"
        scroll={{ y: 350 }}
        onChange={this.handleTableChange}
        /* onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              this.handleRowClick(record);
            }, // click row
            //onDoubleClick: event => { this.handleRowClick(record) }, // double click row
            //onContextMenu: event => { }, // right button click row
            //onMouseEnter: event => { }, // mouse enter row
            //onMouseLeave: event => { }, // mouse leave row
          };
        }} */

        {...tableProps}
      />,
    ];

    return (
      <Card
        className="sessionList"
        bodyStyle={{ padding: 0 }}
        style={{
          width: "100%",
          //textShadow: '1px 1px 1px rgba(0,0,0,0.1)',
          borderRadius: 6,
        }}
        title={TableTitle}
      >
        {contentList}
      </Card>
    );
  }

  expandedRowRender = (session) => {
    const students = session.students;
    const data = [];
    for (let i = 0; i < students.length; ++i) {
      data.push({
        key: i,
        id: students[i].id,
        firstName: students[i].firstName,
        lastName: students[i].lastName,
        rank: students[i].ranks,
      });
    }

    return (
      <List
        size="small"
        header={
          <Text strong style={{ marginLeft: 10 }}>
            Students
          </Text>
        }
        bordered
        dataSource={data}
        renderItem={(student) => (
          <List.Item>
            <Text style={{ textShadow: "0px 1px 0px rgba(255,255,255,1.0)" }}>
              {student.firstName} {student.lastName} | {student.rank}
            </Text>
          </List.Item>
        )}
      />
    );
  };

  getSessionStudentsTable(session) {
    return this.getSessionStudentsList(session);
  }
}

export default withRouter(SessionList);
