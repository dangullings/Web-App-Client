import React, { Component } from "react";
import NewWindow from "react-new-window";
import {
  Table,
  Typography,
  DatePicker,
  Row,
  Popconfirm,
  Divider,
  Select,
  Modal,
  message,
  Form,
  notification,
  Input,
  TimePicker,
  Checkbox,
  Col,
  Button,
  Card,
  Collapse,
  Image,
  Upload,
} from "antd";
import {
  createSession,
  createClassDate,
  getAllLocations,
  getAllStudentsByActive,
  getAllSessions,
  getAllClassDatesBySessionId,
  getAllStudentsBySessionId,
  createStudentSession,
  getStudentSessionsBySessionId,
  removeClassDatesBySessionId,
  removeStudentSessionsBySessionId,
  removeStudentSessionBySessionIdAndStudentId,
  removeSessionById,
  getImage,
  createImage,
  removeImage,
} from "../util/APIUtils";
import moment from "moment";
import { STUDENT_LIST_SIZE } from "../constants";
import { getRanks } from "../util/Helpers.js";
import { withRouter } from "react-router-dom";

import {
  SaveOutlined,
  DeleteOutlined,
  UploadOutlined,
  ReloadOutlined,
  CarryOutOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "../styles/style.less";

const Compress = require("compress.js");
const compress = new Compress();
const { confirm } = Modal;
const { Panel } = Collapse;

const ranks = getRanks();
const { Title, Text } = Typography;
const { TextArea } = Input;
const Option = Select.Option;

const ages = [];
for (let i = 0; i < 100; i++) {
  ages.push(<Option key={i}>{i}</Option>);
}

class SessionList extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      sessions: [],
      sessionStudents: [],
      session: "",
      studentSessions: [],
      selectedStudentId: "",
      selectedSession: "",
      classDates: [],
      signupStudents: [],
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
      sessionModalVisible: false,
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
      locations: [],
      selectedItems: [],
      expandedRowKeys: [],
      selectedDate: "",
      dates: [],
      allStudents: [],
      checkboxValues: [],
      selectedDate: moment(),
      startDate: moment(),
      endDate: moment(),
      datesSet: false,
      sessionId: "",

      photo: "",
      imageId: "",
      image: "",

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

    this.handleStudentChange = this.handleStudentChange.bind(this);
    this.signupStudent = this.signupStudent.bind(this);

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
    this.handleUpload = this.handleUpload.bind(this);
    this.resizeImageFn = this.resizeImageFn.bind(this);
  }

  componentDidMount() {
    this.getSessionList(this.state.page, this.state.STUDENT_LIST_SIZE);
    this.getLocationList(0);
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
        this.setState({
          sessions: response.content,
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
          loading: false,
        });
      });
  }

  getAllStudentsList() {
    let promise;
    promise = getAllStudentsByActive(true);

    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise
      .then((response) => {
        this.setState(
          {
            allStudents: response.content,
          },
          () => this.updateAllStudentList()
        );
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  handleStudentChange(value) {
    this.setState({
      selectedStudentId: value,
    });
  }

  setFormValues = () => {
    this.formRef.current.setFieldsValue({
      title: "",
      description: "",
      selectedLocation: this.state.locations[0],
      startDate: moment(),
      endDate: moment(),
    });
  };

  handleCancel = () => {
    this.formRef.current.resetFields();

    this.setState({
      title: "",
      Session: "",
      description: "",
      selectedLocation: "",
      lowestRank: "",
      highestRank: "",
      youngestAge: "",
      oldestAge: "",
      price: 0,
      startDate: moment(),
      endDate: moment(),
      signupStudents: [],
      studentSessions: [],
      allStudents: [],
      dates: [],
      classDates: [],
      datesSet: false,
      sessionId: "",

      photo: "",
      imageId: "",
      image: "",

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

      sessionModalVisible: false,
      loading: false,
      isSavedSession: false,
    });
  };

  filterOption = (inputValue, students) =>
    students.lastName.indexOf(inputValue) > -1;

  handleChange = (selectedItems) => {
    var joined = new Array();

    selectedItems.forEach((item) => {
      joined.push(
        this.state.allStudents.find(function(student) {
          return student.id === item;
        })
      );
    });

    this.setState({
      selectedItems,
      signupStudents: joined,
    });
  };

  handleDelete = (studentId) => {
    const { SessionId } = this.state;
    removeStudentSessionBySessionIdAndStudentId(SessionId, studentId)
      .then((response) => {
        message.success("Student removed from signup.");
        this.handleAfterDeletion(studentId);
      })
      .catch((error) => {
        message.error("Error [" + error.message + "]");
      });
  };

  handleAfterDeletion(studentId) {
    this.setState({
      loading: true,
    });

    const { studentSessions, signupStudents, allStudents } = this.state;

    let signup, student;
    let newSignupList = signupStudents;
    for (signup of signupStudents) {
      if (signup.id == studentId) {
        student = signup;
        newSignupList = signupStudents.filter(function(value) {
          return value.id != studentId;
        });
        break;
      }
    }

    var newStudentSessionList = studentSessions.filter(function(value) {
      return value.studentId != studentId;
    });

    this.setState({
      signupStudents: newSignupList,
      allStudents: this.state.allStudents.concat(student),
      studentSessions: newStudentSessionList,
      loading: false,
    });
  }

  updateStudentSessionList(studentId) {
    this.setState({
      loading: true,
    });

    var { studentSessions, signupStudents } = this.state;

    var newList = studentSessions.filter(function(value, index, arr) {
      return value.studentId != studentId;
    });

    var newSignupList = signupStudents.filter(function(value, index, arr) {
      return value.id != studentId;
    });

    this.setState({
      studentSessions: newList,
      signupStudents: newSignupList,
      loading: false,
    });
  }

  updateAllStudentList() {
    var { studentSessions, allStudents } = this.state;

    var newStudentList = allStudents;
    newStudentList = allStudents.filter(function(value) {
      return checkCondition(value, studentSessions);
    });

    this.setState({
      allStudents: newStudentList,
      loading: false,
    });
  }

  signupStudent() {
    const { sessionId, selectedStudentId, session } = this.state;

    this.setState({
      loading: true,
    });

    let s, student;
    for (s of this.state.allStudents) {
      if (s.id == selectedStudentId) {
        student = s;
        break;
      }
    }

    const data = {
      classSessionId: sessionId,
      studentId: selectedStudentId,
      charged: session.price,
      paid: 0,
      signupDate: moment().format("YYYY-MM-DD"),
    };

    createStudentSession(data)
      .then((response) => {
        this.setState(
          {
            loading: false,
            selectedStudentId: "",
            studentSessions: this.state.studentSessions.concat(data),
            signupStudents: this.state.signupStudents.concat(student),
          },
          () => this.updateAllStudentList()
        );
        notification.success({
          message: "Signup Successful!",
          description: "",
          duration: 4,
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
    this.setState(
      {
        sessionModalVisible: true,
        isSavedSession: false,
        signupStudents: [],
        sessionId: "",
      },
      this.setFormValues
    );

    this.getAllStudentsList(0);
    //var today = new Date();
    //var dd = String(today.getDate()).padStart(2, "0");
    //var mm = String(today.getMonth() + 1).padStart(2, "0");
    //var yyyy = today.getFullYear();
    //today = yyyy + "-" + mm + "-" + dd;
  };

  handleSubmit(session) {
    var data = new FormData();
    data.append("file", this.state.photo);

    this.setState({
      loading: true,
    });

    let imageId;
    if (this.state.isSavedSession) {
      imageId = this.state.session.imageId;
    } else {
      imageId = 0;
    }

    createImage(data, imageId)
      .then((response) => {
        if (imageId == 0) {
          this.setState(
            {
              imageId: response.id,
            },
            () => this.saveSession(session)
          );
        } else {
          this.setState(
            {
              imageId: this.state.session.imageId,
            },
            () => this.saveSession(session)
          );
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  saveSession(session) {
    let title = this.formRef.current.getFieldValue("title");
    let description = this.formRef.current.getFieldValue("description");
    let location = this.formRef.current.getFieldValue("location");
    let startDate = this.formRef.current.getFieldValue("startDate");
    let endDate = this.formRef.current.getFieldValue("endDate");
    let youngestAge = this.formRef.current.getFieldValue("youngestAge");
    let oldestAge = this.formRef.current.getFieldValue("oldestAge");
    let lowestRank = this.formRef.current.getFieldValue("lowestRank");
    let highestRank = this.formRef.current.getFieldValue("highestRank");
    let price = this.formRef.current.getFieldValue("price");

    const {
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
    } = this.state;

    this.setState({ loading: true });

    let formattedStartDate = startDate.format("YYYY-MM-DD");
    let formattedEndDate = endDate.format("YYYY-MM-DD");
    //let parts = formattedDate.split("-");
    //let month = parts[1];
    //let year = parts[0];

    let ageRange = youngestAge + "-" + oldestAge;
    let rankRange = lowestRank + "-" + highestRank;
    let days = "";

    if (monday.isSelected) {
      days = days.concat("mon,");
    }
    if (tuesday.isSelected) {
      days = days.concat("tue,");
    }
    if (wednesday.isSelected) {
      days = days.concat("wed,");
    }
    if (thursday.isSelected) {
      days = days.concat("thu,");
    }
    if (friday.isSelected) {
      days = days.concat("fri,");
    }
    if (saturday.isSelected) {
      days = days.concat("sat,");
    }

    let sessionId;
    if (this.state.isSavedSession) {
      sessionId = this.state.session.id;
    } else {
      sessionId = 0;
    }

    const SessionData = {
      id: sessionId,
      title: title,
      description: description,
      location: location,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      ageRange: ageRange,
      rankRange: rankRange,
      price: price,
      days: days,
      imageId: this.state.imageId,
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

  saveClassDates(sessionId) {
    const { classDates } = this.state;
    let promises = [];
    var date;
    var month, year;
    let title = this.formRef.current.getFieldValue("title");

    removeClassDatesBySessionId(this.state.sessionId)
      .then((response) => {
        for (date of classDates) {
          let parts = date.date.split("-");
          let y = parts[0];
          let m = parts[1];

          month = m;
          year = y;

          let startTime = date.startTime,
            endTime = date.endTime;
          if (date.startTime instanceof moment) {
            startTime = startTime.format("h:mm a");
          }
          if (date.endTime instanceof moment) {
            endTime = endTime.format("h:mm a");
          }

          let ClassDateData = {
            id: date.id,
            location: this.state.selectedLocation,
            title: title,
            date: date.date,
            startTime: startTime,
            endTime: endTime,
            sessionId: sessionId,
            secondHour: date.hasSecondHour,
            month: month,
            year: year,
          };

          let promise = createClassDate(ClassDateData);
          promises.push(promise);
        }

        Promise.all(promises).then((values) => {
          this.handleCancel();
          this.getSessionList(this.state.page);
          this.props.history.push("/schedule/sessions");
        });
      })
      .catch((error) => {});
  }

  resetAllDates() {
    removeClassDatesBySessionId(this.state.sessionId)
      .then((response) => {})
      .catch((error) => {});

    this.setState({
      selectedDays: [],
      selected2ndHours: [],
      dates: [],
      selectedDate: "",
      datesSet: false,
      startDate: moment(),
      endDate: moment(),

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

    removeClassDatesBySessionId(this.state.sessionId)
      .then((response) => {})
      .catch((error) => {});
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
      classDates: this.state.classDates.concat(newSpecific),
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
    const { classDates } = this.state;
    var i = 0;
    var d;
    var subValue = value.slice(0, 10);

    for (d of classDates) {
      if (subValue == d.date) {
        break;
      }
      i++;
    }

    classDates.splice(i, 1);

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
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
    } = this.state;
    var days = [];

    let startDate = this.formRef.current.getFieldValue("startDate");
    let endDate = this.formRef.current.getFieldValue("endDate");

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

    this.setState({ dates: days, classDates: days });

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

  getLocationList(page) {
    let promise;
    promise = getAllLocations(page, 1000);

    if (!promise) {
      return;
    }

    promise
      .then((response) => {
        this.setState({
          locations: response.content,
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last,
        });
      })
      .catch((error) => {});
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

  handleTitleChange(Session) {
    const value = Session.target.value;
    this.setState({
      title: value,
    });
  }

  handleDescriptionChange(Session) {
    const value = Session.target.value;
    this.setState({
      description: value,
    });
  }

  handlePriceChange(Session) {
    const value = Session.target.value;
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

  showConfirm = () => {
    confirm({
      className: "confirm-custom-style",
      title: "Do you want to remove this session?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      content: "This will erase all records of this session.",
      onOk: () => {
        return this.removeSession();
      },
      onCancel: () => {
        return console.log("");
      },
    });
  };

  removeSession = () => {
    const id = this.state.sessionId;
    const { session } = this.state;
    removeImage(session.imageId)
      .then((response) => {})
      .catch((error) => {});

    removeSessionById(id)
      .then((response) => {
        message.success("Session deleted.");
        this.handleCancel();
        this.getSessionList(this.state.page, this.state.STUDENT_LIST_SIZE);
        this.setState({ loading: false, sessionModalVisible: false });
      })
      .catch((error) => {
        message.error("Error [" + error.message + "]");
      });

    removeStudentSessionsBySessionId(id)
      .then((response) => {})
      .catch((error) => {});
  };

  render() {
    const {
      selectedDate,
      specific,
      classDates,
      sessions,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      signupStudents,
      studentSessions,
      allStudents,
      selectedStudentId,
      locations,
      isSavedSession,
      sessionModalVisible,
      image,
    } = this.state;
    const { pagination, loading } = this.state;

    var studentSessionList = [];
    let student, ss, studSession;
    for (student of signupStudents) {
      for (ss of studentSessions) {
        if (ss.studentId == student.id) {
          studSession = ss;
          break;
        }
      }

      let balance = 0,
        date = "";
      if (studSession) {
        balance = "$" + (studSession.charged - studSession.paid);
        date = studSession.signupDate;
      }

      const studentSession = {
        studentId: student.id,
        studentName:
          student.firstName + " " + student.lastName.substring(0, 1) + ".",
        studentRank: student.ranks,
        date: date,
        balance: balance,
      };

      studentSessionList.push(studentSession);
    }

    const studentCols = [
      {
        title: "Name",
        dataIndex: "studentName",
        key: "studentName",
        ellipsis: true,
        sorter: true,
        render: (text, record) => (
          <a
            href={"/students/" + record.studentId}
            target="_blank"
            rel="noopener noreferrer"
          >
            {text}
          </a>
        ),
      },
      {
        title: "Rank",
        dataIndex: "studentRank",
        key: "studentRank",
        ellipsis: true,
      },
      {
        title: "Balance",
        dataIndex: "balance",
        key: "balance",
        align: "right",
        width: 70,
        ellipsis: true,
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        ellipsis: true,
      },
      {
        title: "",
        key: "action",
        align: "center",
        ellipsis: true,
        fixed: "right",
        width: 35,
        render: (text, record) => (
          <Popconfirm
            title="Remove Student?"
            onConfirm={() => this.handleDelete(record.studentId)}
          >
            <DeleteOutlined style={{ color: "red" }} />
          </Popconfirm>
        ),
      },
    ];

    let { datesSet } = this.state;
    const renderButton = () => {
      if (datesSet) {
        return (
          <Button
            icon={<CarryOutOutlined />}
            disabled
            style={{
              width: "60%",
            }}
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
    for (d of classDates) {
      let date = d.date;
      let time =
        moment(d.startTime, "h:mm a").format("hh:mm a") +
        "-" +
        moment(d.endTime, "h:mm a").format("hh:mm a");
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
      <Row style={{ marginTop: 0, marginLeft: 0 }}>
        <Col>
          <DatePicker
            inputReadOnly="true"
            style={{ marginBottom: 6, marginLeft: 0 }}
            align="center"
            size={"default"}
            value={specific.date}
            onChange={this.changeSpecificDate}
            dropdownClassName="custom-style"
          />
          {/* <Checkbox
            style={{ marginLeft: 20 }}
            checked={this.state.specific.hasSecondHour}
            onChange={this.onSpecificSecondHourCheckboxChange}
          >
            2nd
          </Checkbox> */}
        </Col>
      </Row>,
      <Row style={{ marginTop: 0, marginLeft: 0, marginBottom: 10 }}>
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
            showNow={false}
            popupClassName="custom-style"
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
            showNow={false}
            popupClassName="custom-style"
          />
        </Col>
      </Row>,
    ];

    const dayCheckboxes = [
      <Row style={{ marginTop: 0 }}>
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
            style={{ width: "35%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"start"}
            minuteStep={15}
            value={monday.startTime}
            onChange={this.handleMondayStartTimeChange}
            showNow={false}
            popupClassName="custom-style"
          />
          <TimePicker
            inputReadOnly="true"
            style={{ width: "35%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"end"}
            minuteStep={15}
            value={monday.endTime}
            onChange={this.handleMondayEndTimeChange}
            showNow={false}
            popupClassName="custom-style"
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
      <Row style={{ marginTop: 0 }}>
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
            style={{ width: "35%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"start"}
            minuteStep={15}
            value={tuesday.startTime}
            onChange={this.handleTuesdayStartTimeChange}
            showNow={false}
            popupClassName="custom-style"
          />
          <TimePicker
            inputReadOnly="true"
            style={{ width: "35%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"end"}
            minuteStep={15}
            value={tuesday.endTime}
            onChange={this.handleTuesdayEndTimeChange}
            showNow={false}
            popupClassName="custom-style"
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
      <Row style={{ marginTop: 0 }}>
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
            style={{ width: "35%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"start"}
            minuteStep={15}
            value={wednesday.startTime}
            onChange={this.handleWednesdayStartTimeChange}
            showNow={false}
            popupClassName="custom-style"
          />
          <TimePicker
            inputReadOnly="true"
            style={{ width: "35%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"end"}
            minuteStep={15}
            value={wednesday.endTime}
            onChange={this.handleWednesdayEndTimeChange}
            showNow={false}
            popupClassName="custom-style"
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
      <Row style={{ marginTop: 0 }}>
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
            style={{ width: "35%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"start"}
            minuteStep={15}
            value={thursday.startTime}
            onChange={this.handleThursdayStartTimeChange}
            showNow={false}
            popupClassName="custom-style"
          />
          <TimePicker
            inputReadOnly="true"
            style={{ width: "35%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"end"}
            minuteStep={15}
            value={thursday.endTime}
            onChange={this.handleThursdayEndTimeChange}
            showNow={false}
            popupClassName="custom-style"
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
      <Row style={{ marginTop: 0 }}>
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
            style={{ width: "35%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"start"}
            minuteStep={15}
            value={friday.startTime}
            onChange={this.handleFridayStartTimeChange}
            showNow={false}
            popupClassName="custom-style"
          />
          <TimePicker
            inputReadOnly="true"
            style={{ width: "35%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"end"}
            minuteStep={15}
            value={friday.endTime}
            onChange={this.handleFridayEndTimeChange}
            showNow={false}
            popupClassName="custom-style"
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
      <Row style={{ marginTop: 0, marginBottom: 20 }}>
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
            style={{ width: "35%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"start"}
            minuteStep={15}
            value={saturday.startTime}
            onChange={this.handleSaturdayStartTimeChange}
            showNow={false}
            popupClassName="custom-style"
          />
          <TimePicker
            inputReadOnly="true"
            style={{ width: "35%" }}
            use12Hours
            size={"small"}
            format="h:mm a"
            align="center"
            placeholder={"end"}
            minuteStep={15}
            value={saturday.endTime}
            onChange={this.handleSaturdayEndTimeChange}
            showNow={false}
            popupClassName="custom-style"
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

    const warningText = [
      <Text type="warning">*save session before signing up students</Text>,
    ];

    var signupStudentsView = [];
    if (this.state.isSavedSession) {
      signupStudentsView = [
        <Form.Item
          label={
            <Title style={{ marginBottom: 0, marginTop: 0 }} level={5}>
              {"Signup Student"}
            </Title>
          }
        >
          <Select
            showSearch
            align="center"
            style={{ width: "100%" }}
            optionFilterProp="children"
            Key={allStudents.id}
            onChange={this.handleStudentChange}
            placeholder={"select student"}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {allStudents.map((student) => (
              <Select.Option value={student.id} key={student.id}>
                {student.firstName +
                  " " +
                  student.lastName +
                  " | " +
                  student.ranks}
              </Select.Option>
            ))}
          </Select>

          <Button
            type="primary"
            loading={loading}
            icon={<PlusCircleOutlined />}
            onClick={this.signupStudent}
            disabled={selectedStudentId == ""}
            size={"default"}
            block={true}
            style={{ marginTop: 10 }}
          >
            Signup
          </Button>
        </Form.Item>,
      ];
    } else {
      signupStudentsView = [warningText];
    }

    var ModalTitle;
    if (isSavedSession) {
      ModalTitle = <Title level={2}>Edit Session</Title>;
    } else {
      ModalTitle = <Title level={2}>New Session</Title>;
    }
    const TableTitle = <Title level={3}>Session List</Title>;

    const renderDeleteButton = () => {
      if (isSavedSession) {
        return (
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={this.showConfirm}
          >
            Delete
          </Button>
        );
      } else {
        return [];
      }
    };

    const contentList = [
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={this.showModal}
        size={"default"}
        style={{
          margin: 10,
        }}
      >
        New Session
      </Button>,

      <Modal
        className="custom-style"
        visible={sessionModalVisible}
        title={ModalTitle}
        closable={false}
        style={{ top: 0 }}
        bodyStyle={{ padding: 20, marginBottom: 20 }}
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
          renderDeleteButton(),
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
        <Form
          initialValues={{
            title: this.state.title,
            description: this.state.description,
            location: this.state.selectedLocation,
            startDate: moment(this.state.startDate),
            endDate: moment(this.state.endDate),
            lowestRank: "Gold Stripe",
            highestRank: "Fifth Degree",
            youngestAge: 0,
            oldestAge: 99,
            price: 0,
          }}
          layout="vertical"
          onFinish={this.handleSubmit}
          ref={this.formRef}
        >
          <Collapse
            accordion
            bordered={false}
            defaultActiveKey={["4"]}
            className="site-collapse-custom-collapse"
          >
            <Panel
              header={
                <Title style={{ marginBottom: 0 }} level={4}>
                  {"Info"}
                </Title>
              }
              key="4"
              className="site-collapse-custom-panel"
            >
              <Form.Item
                name="title"
                label={
                  <Title style={{ marginBottom: 0 }} level={5}>
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
                  placeholder="Title"
                  autosize={{ minRows: 1, maxRows: 1 }}
                  className="custom-style"
                />
              </Form.Item>

              <Form.Item
                name="description"
                label={
                  <Title style={{ marginBottom: 0 }} level={5}>
                    {"Description"}
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
                <TextArea
                  placeholder="describe the session in detail"
                  rows={3}
                  autosize={{ minRows: 1, maxRows: 3 }}
                />
              </Form.Item>

              <Form.Item
                name="location"
                label={
                  <Title style={{ marginBottom: 0 }} level={5}>
                    {"Location"}
                  </Title>
                }
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please select the session location.",
                  },
                ]}
              >
                <Select
                  align="center"
                  Key={locations.id}
                  placeholder={"select location"}
                  dropdownClassName="custom-style"
                  onChange={this.handleLocationDropdownChange}
                >
                  {locations.map((item) => (
                    <Select.Option value={item.name} key={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Title style={{ marginBottom: 8 }} level={5}>
                Current Image
              </Title>
              <Image
                width={"100%"}
                height={"100%"}
                src={`data:image/jpeg;base64,${image.photo}`}
                placeholder={
                  <Image
                    preview={false}
                    src="../img/TestImage.png"
                    width={10}
                  />
                }
              />

              <Upload
                listType="picture"
                maxCount={1}
                onChange={this.handleUpload}
                beforeUpload={() => false}
              >
                <Button
                  style={{ marginTop: 20, marginBottom: 10 }}
                  icon={<UploadOutlined />}
                >
                  Upload Image (Max: 1)
                </Button>
              </Upload>
            </Panel>
            <Panel
              header={
                <Title style={{ marginBottom: 0 }} level={4}>
                  {"Student Requirements"}
                </Title>
              }
              key="1"
              className="site-collapse-custom-panel"
            >
              <Form.Item
                name="price"
                style={{ marginLeft: 0 }}
                label={
                  <Title style={{ marginBottom: 0 }} level={5}>
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
                  onClick={this.clickFormInput}
                  autosize={{ minRows: 1, maxRows: 1 }}
                />
              </Form.Item>

              <Form.Item
                name="lowestRank"
                label={
                  <Title style={{ marginBottom: 0 }} level={5}>
                    {"Lowest Rank"}
                  </Title>
                }
                style={{
                  display: "inline-block",
                  width: "calc(50%)",
                }}
              >
                <Select
                  align="center"
                  style={{ width: "100%" }}
                  placeholder={"select a lowest rank"}
                  defaultValue={"Gold Stripe"}
                  onChange={this.handleLowestRankChange}
                  dropdownClassName="custom-style"
                >
                  {ranks.map((rank) => (
                    <Select.Option value={rank} key={rank}>
                      {rank}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="highestRank"
                label={
                  <Title style={{ marginBottom: 0 }} level={5}>
                    {"Highest Rank"}
                  </Title>
                }
                style={{
                  display: "inline-block",
                  width: "calc(50%)",
                }}
              >
                <Select
                  align="center"
                  style={{ width: "100%" }}
                  placeholder={"select a highest rank"}
                  defaultValue={"Fifth Degree"}
                  onChange={this.handleHighestRankChange}
                  dropdownClassName="custom-style"
                >
                  {ranks.map((rank) => (
                    <Select.Option value={rank} key={rank}>
                      {rank}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="youngestAge"
                label={
                  <Title style={{ marginBottom: 0 }} level={5}>
                    {"Youngest Age"}
                  </Title>
                }
                style={{
                  display: "inline-block",
                  width: "calc(50%)",
                }}
              >
                <Select
                  align="center"
                  style={{ width: "100%" }}
                  placeholder={"select a youngest age"}
                  defaultValue={0}
                  onChange={this.handleYoungestAgeChange}
                  dropdownClassName="custom-style"
                >
                  {ages}
                </Select>
              </Form.Item>
              <Form.Item
                name="oldestAge"
                label={
                  <Title style={{ marginBottom: 0 }} level={5}>
                    {"Oldest Age"}
                  </Title>
                }
                style={{
                  display: "inline-block",
                  width: "calc(50%)",
                }}
              >
                <Select
                  align="center"
                  style={{ width: "100%" }}
                  placeholder={"select an oldest age"}
                  defaultValue={99}
                  onChange={this.handleOldestAgeChange}
                  dropdownClassName="custom-style"
                >
                  {ages}
                </Select>
              </Form.Item>
            </Panel>
            <Panel
              header={
                <Title style={{ marginBottom: 0 }} level={4}>
                  {"Duration and Dates"}
                </Title>
              }
              key="2"
              className="site-collapse-custom-panel"
            >
              <Form.Item
                name="startDate"
                label={
                  <Title style={{ marginBottom: 0 }} level={5}>
                    {"Start Date"}
                  </Title>
                }
                style={{
                  display: "inline-block",
                  width: "calc(50%)",
                }}
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
                  style={{
                    width: "100%",
                  }}
                  dropdownClassName="custom-style"
                />
              </Form.Item>

              <Form.Item
                name="endDate"
                label={
                  <Title style={{ marginBottom: 0 }} level={5}>
                    {"End Date"}
                  </Title>
                }
                style={{
                  display: "inline-block",
                  width: "calc(50%)",
                }}
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
                  style={{
                    width: "100%",
                  }}
                  dropdownClassName="custom-style"
                />
              </Form.Item>

              {dayCheckboxes}
              {renderButton()}
              <Button
                icon={<ReloadOutlined />}
                style={{
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
              <Divider
                style={{ marginTop: 30, marginBottom: 0 }}
                orientation="left"
              >
                {<Title level={5}>Remove</Title>}
              </Divider>
              <Row>
                <Select
                  align="center"
                  style={{ width: "100%" }}
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
                  danger
                  style={{
                    marginTop: 10,
                    width: "100%",
                  }}
                  onClick={this.removeSelectedDate.bind(this, selectedDate)}
                  shape="round"
                  type="primary"
                >
                  Remove
                </Button>
              </Row>
              <Divider
                style={{ marginTop: 30, marginBottom: 0 }}
                orientation="left"
              >
                {<Title level={5}>Specific</Title>}
              </Divider>
              {addSpecificDate}
              <Button
                icon={<PlusCircleOutlined />}
                style={{
                  marginBottom: 15,
                }}
                onClick={this.addSpecificDate}
                shape="round"
                type="primary"
              >
                Add
              </Button>
            </Panel>
            <Panel
              header={
                <Title style={{ marginBottom: 0 }} level={4}>
                  {"Student Signup"}
                </Title>
              }
              key="3"
              className="site-collapse-custom-panel"
            >
              {signupStudentsView}
              <Form.Item
                label={
                  <Title style={{ marginBottom: 0 }} level={5}>
                    {"Students Signed Up"}
                  </Title>
                }
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please select the students.",
                    type: "array",
                  },
                ]}
              >
                <Table
                  loading={loading}
                  rowKey={studentSessionList.studentId}
                  rowClassName={(record, index) =>
                    this.getRowColor(record, index)
                  }
                  pagination={false}
                  bordered
                  columns={studentCols}
                  dataSource={studentSessionList}
                  size="small"
                  style={{ width: "100%" }}
                  scroll={{ x: 300 }}
                  onChange={this.handleTableChange}
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: (event) => {
                        this.handleStudentRowClick(record);
                      }, // click row
                      //onDoubleClick: event => { this.handleRowClick(record) }, // double click row
                      //onContextMenu: event => { }, // right button click row
                      //onMouseEnter: event => { }, // mouse enter row
                      //onMouseLeave: event => { }, // mouse leave row
                    };
                  }}
                />
              </Form.Item>
            </Panel>
          </Collapse>
        </Form>
      </Modal>,

      <Table
        loading={loading}
        rowKey={sessions.id}
        rowClassName={(record, index) => this.getRowColor(record, index)}
        pagination={pagination}
        bordered
        columns={sessionCols}
        dataSource={sessions}
        size="small"
        scroll={{ y: 500 }}
        onChange={this.handleTableChange}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              this.handleRowClick(record);
            }, // click row
            //onDoubleClick: event => { this.handleRowClick(record) }, // double click row
            //onContextMenu: event => { }, // right button click row
            //onMouseEnter: event => { }, // mouse enter row
            //onMouseLeave: event => { }, // mouse leave row
          };
        }}
      />,
    ];

    return (
      <Card
        className="custom-style"
        bordered={false}
        bodyStyle={{ padding: 1 }}
        title={TableTitle}
      >
        {contentList}
      </Card>
    );
  }

  getRowColor(record, index) {
    if (index % 2 === 0) {
      return "table-row-light";
    } else {
      return "table-row-dark";
    }
  }

  onFill = () => {
    this.formRef.current.setFieldsValue({
      title: this.state.title,
      description: this.state.description,
      startDate: moment(this.state.startDate),
      endDate: moment(this.state.endDate),
      location: this.state.selectedLocation,
      price: this.state.price,
      youngestAge: this.state.youngestAge,
      oldestAge: this.state.oldestAge,
      lowestRank: this.state.lowestRank,
      highestRank: this.state.highestRank,
    });

    this.setState({
      loading: false,
    });
  };

  handleRowClick(session) {
    this.showSession(session);
  }

  showSession(session) {
    this.loadImage(session);
    this.getLocationList(0);
  }

  loadImage(session) {
    let promise;
    promise = getImage(session.imageId);

    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise
      .then((response) => {
        this.setState(
          {
            image: response,
            loading: false,
          },
          this.loadClassDatesBySessionId(session)
        );
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  loadClassDatesBySessionId(session) {
    let promise;

    promise = getAllClassDatesBySessionId(session.id);

    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise
      .then((response) => {
        this.setState(
          {
            classDates: response,
          },
          () => this.setupDates(session, response)
        );
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  setupDates(session, classDates) {
    const {
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
    } = this.state;
    let mon = monday,
      tue = tuesday,
      wed = wednesday,
      thu = thursday,
      fri = friday,
      sat = saturday;
    let dates = [];
    let days = session.days.split(",");

    let classDate;
    for (classDate of classDates) {
      dates.push(classDate.date);

      let date = moment(classDate.date).day();

      if (date == 1 && !mon.isSelected) {
        let day = {
          isSelected: true,
          hasSecondHour: classDate.secondHour,
          startTime: moment(classDate.startTime, "h:mm a"),
          endTime: moment(classDate.endTime, "h:mm a"),
        };
        mon = day;
      }
      if (date == 2 && !tue.isSelected) {
        let day = {
          isSelected: true,
          hasSecondHour: classDate.secondHour,
          startTime: moment(classDate.startTime, "h:mm a"),
          endTime: moment(classDate.endTime, "h:mm a"),
        };
        tue = day;
      }
      if (date == 3 && !wed.isSelected) {
        let day = {
          isSelected: true,
          hasSecondHour: classDate.secondHour,
          startTime: moment(classDate.startTime, "h:mm a"),
          endTime: moment(classDate.endTime, "h:mm a"),
        };
        wed = day;
      }
      if (date == 4 && !thu.isSelected) {
        let day = {
          isSelected: true,
          hasSecondHour: classDate.secondHour,
          startTime: moment(classDate.startTime, "h:mm a"),
          endTime: moment(classDate.endTime, "h:mm a"),
        };
        thu = day;
      }
      if (date == 5 && !fri.isSelected) {
        let day = {
          isSelected: true,
          hasSecondHour: classDate.secondHour,
          startTime: moment(classDate.startTime, "h:mm a"),
          endTime: moment(classDate.endTime, "h:mm a"),
        };
        fri = day;
      }
      if (date == 6 && !sat.isSelected) {
        let day = {
          isSelected: true,
          hasSecondHour: classDate.secondHour,
          startTime: moment(classDate.startTime, "h:mm a"),
          endTime: moment(classDate.endTime, "h:mm a"),
        };
        sat = day;
      }
    }

    this.setState(
      {
        monday: mon,
        tuesday: tue,
        wednesday: wed,
        thursday: thu,
        friday: fri,
        saturday: sat,
        dates: dates,
      },
      () => this.loadStudentsBySessionId(session)
    );
  }

  loadStudentsBySessionId(session) {
    let promise;

    promise = getAllStudentsBySessionId(session.id);

    if (!promise) {
      return;
    }

    let sessionRankRange = session.rankRange.split("-");
    let lowestRank = sessionRankRange[0];
    let highestRank = sessionRankRange[1];

    let sessionAgeRange = session.ageRange.split("-");
    let youngestAge = sessionAgeRange[0];
    let oldestAge = sessionAgeRange[1];

    promise
      .then((response) => {
        this.setState(
          {
            session: session,
            photo: "image",
            startDate: session.startDate,
            endDate: session.endDate,
            signupStudents: response,
            selectedLocation: session.location,
            date: session.date,
            title: session.title,
            description: session.description,
            sessionId: session.id,
            price: session.price,
            selectedType: session.type,
            youngestAge: youngestAge,
            oldestAge: oldestAge,
            lowestRank: lowestRank,
            highestRank: highestRank,
          },
          () => this.getAllStudentSessions(session)
        );
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  getAllStudentSessions(session) {
    let promise;

    promise = getStudentSessionsBySessionId(session.id);

    if (!promise) {
      return;
    }

    promise
      .then((response) => {
        this.setState(
          {
            studentSessions: response,
            isSavedSession: true,
            sessionModalVisible: true,
          },
          this.onFill
        );
        this.getAllStudentsList(0);
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  getSessionStudentsTable(session) {
    return this.getSessionStudentsList(session);
  }

  handleUpload(info) {
    if (info.file instanceof File) {
      this.resizeImageFn(info.file);
    } else {
      this.setState({
        photo: "",
      });
    }
  }

  resizeImageFn(file) {
    compress
      .compress([file], {
        size: 2, // the max size in MB, defaults to 2MB
        quality: 1, // the quality of the image, max is 1,
        maxWidth: 1280, // the max width of the output image, defaults to 1920px
        maxHeight: 720, // the max height of the output image, defaults to 1920px
        resize: true, // defaults to true, set false if you do not want to resize the image width and height
      })
      .then((data) => {
        const img = data[0];
        const base64str = img.data;
        const imgExt = img.ext;

        this.setState({
          photo: Compress.convertBase64ToFile(base64str, imgExt),
          loading: false,
        });
      });
  }
}

export default withRouter(SessionList);

function checkCondition(student, studentSessions) {
  let ss;

  for (ss of studentSessions) {
    if (ss.studentId == student.id) {
      return false;
    }
  }

  return true;
}
