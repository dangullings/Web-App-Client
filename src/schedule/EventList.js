import React, { Component } from "react";
import NewWindow from "react-new-window";
import {
  Table,
  Typography,
  DatePicker,
  Divider,
  Select,
  List,
  Modal,
  message,
  Form,
  notification,
  Input,
  TimePicker,
  Button,
  Card,
  Space,
  Popconfirm,
  Image,
  Upload,
  Collapse,
} from "antd";
import {
  createEvent,
  createImage,
  getAllLocations,
  getAllEvents,
  getAllStudentsByEventId,
  getAllStudentsByActive,
  removeStudentEvent,
  removeEventById,
  createStudentEvent,
  getStudentEventsByEventId,
  removeStudentEventByEventIdAndStudentId,
  removeStudentEventsByEventId,
  getImage,
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
} from "@ant-design/icons";
import "../styles/style.less";

const Compress = require("compress.js");
const compress = new Compress();

const ranks = getRanks();
const { Title, Text } = Typography;
const { TextArea } = Input;
const Option = Select.Option;
const { Panel } = Collapse;

const ages = [];
for (let i = 0; i < 100; i++) {
  ages.push(<Option key={i}>{i}</Option>);
}

//after delete, select allstudents list needs updating

class EventList extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      events: [],
      event: "",
      studentEvents: [],
      selectedStudentId: "",
      selectedEvent: "",
      signupStudents: [],
      selectedItems: [],
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
      eventModalVisible: "",
      total: 0,
      loading: false,

      allStudents: [],
      locations: [],
      selectedLocation: "select a location",
      type: "Camp",

      photo: "",
      imageId: "",
      image: "",
    };

    this.handleAgeRangeChange = this.handleAgeRangeChange.bind(this);
    this.handleRankRangeChange = this.handleRankRangeChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleYoungestAgeChange = this.handleYoungestAgeChange.bind(this);
    this.handleOldestAgeChange = this.handleOldestAgeChange.bind(this);
    this.handleLowestRankChange = this.handleLowestRankChange.bind(this);
    this.handleHighestRankChange = this.handleHighestRankChange.bind(this);

    this.handleStudentChange = this.handleStudentChange.bind(this);
    this.signupStudent = this.signupStudent.bind(this);

    this.handleEventSubmit = this.handleEventSubmit.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleLocationDropdownChange =
      this.handleLocationDropdownChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.resizeImageFn = this.resizeImageFn.bind(this);
  }

  componentDidMount() {
    this.getEventList(this.state.page, this.state.STUDENT_LIST_SIZE);
    this.getLocationList(0);
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
            loading: false,
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

  isFormInvalid() {
    if (!this.formRef.current) {
      return true;
    }
    let title = this.formRef.current.getFieldValue("title");
    let description = this.formRef.current.getFieldValue("description");
    let startTime = this.formRef.current.getFieldValue("startTime");
    let endTime = this.formRef.current.getFieldValue("endTime");
    let youngestAge = this.formRef.current.getFieldValue("youngestAge");
    let oldestAge = this.formRef.current.getFieldValue("oldestAge");

    if (title == "") {
      //return true;
    }
    if (description == "") {
      //return true;
    }
    //if (youngestAge > oldestAge) {
    //  return true;
    //}
    //if (startTime.isAfter(endTime)) {
    //  return true;
    //}

    return false;
  }

  getEventList(page, pageSize) {
    let promise;
    promise = getAllEvents(page, pageSize);

    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise
      .then((response) => {
        this.setState({
          events: response.content,
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

  resetFields() {
    this.formRef.current.resetFields();
    this.setState({
      loading: false,
      selectedDate: "",
      selectedLocation: "",
      title: "",
      type: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
    });
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

  handleStartTimeChange(time, timeString) {
    const { newEventEndTime } = this.state;

    if (time.isAfter(newEventEndTime)) {
      message.error({
        content: "Start time must be before end time",
        style: {
          marginTop: "30vh",
        },
      });
      return;
    }

    this.setState({
      newEventStartTime: time,
      eventStartTime: timeString,
    });
  }

  handleEndTimeChange(time, timeString) {
    const { newEventStartTime } = this.state;

    if (time.isBefore(newEventStartTime)) {
      message.error({
        content: "End time must be after start time",
        style: {
          marginTop: "30vh",
        },
      });
      return;
    }

    this.setState({
      newEventEndTime: time,
      eventEndTime: timeString,
    });
  }

  handleLocationDropdownChange = (value) => {
    this.setState({ selectedLocation: value });
  };

  handleTableChange = (pagination, filters, sorter) => {
    //this.getSessionList(pagination.current, pagination.pageSize);
    /* this.fetch({
          sortField: sorter.field,
          sortOrder: sorter.order,
          pagination,
          ...filter
        }); */
  };

  removeStudentEvent(eventId, studentId) {
    removeStudentEvent(eventId, studentId)
      .then((response) => {})
      .catch((error) => {});
  }

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  handleEventSubmit(event) {
    var data = new FormData();
    data.append("file", this.state.photo);

    this.setState({
      loading: true,
    });

    let imageId;
    if (this.state.isSavedEvent) {
      imageId = this.state.event.imageId;
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
            () => this.saveEvent(event)
          );
        } else {
          this.setState(
            {
              imageId: this.state.event.imageId,
            },
            () => this.saveEvent(event)
          );
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  saveEvent(event) {
    let title = this.formRef.current.getFieldValue("title");
    let type = this.formRef.current.getFieldValue("type");
    let description = this.formRef.current.getFieldValue("description");
    let location = this.formRef.current.getFieldValue("location");
    let date = this.formRef.current.getFieldValue("date");
    let startTime = this.formRef.current.getFieldValue("startTime");
    let endTime = this.formRef.current.getFieldValue("endTime");
    let youngestAge = this.formRef.current.getFieldValue("youngestAge");
    let oldestAge = this.formRef.current.getFieldValue("oldestAge");
    let lowestRank = this.formRef.current.getFieldValue("lowestRank");
    let highestRank = this.formRef.current.getFieldValue("highestRank");
    let price = this.formRef.current.getFieldValue("price");

    let ageRange = youngestAge + "-" + oldestAge;
    let rankRange = lowestRank + "-" + highestRank;

    this.setState({ loading: true });

    let formattedDate = date.format("YYYY-MM-DD");
    let parts = formattedDate.split("-");
    let month = parts[1];
    let year = parts[0];

    console.log(
      title +
        " " +
        type +
        " " +
        description +
        " " +
        location +
        " " +
        date +
        " " +
        startTime +
        " " +
        endTime +
        " " +
        youngestAge +
        " " +
        oldestAge +
        " " +
        lowestRank +
        " " +
        highestRank +
        " " +
        price
    );

    let eventId;
    if (this.state.isSavedEvent) {
      eventId = this.state.event.id;
    } else {
      eventId = 0;
    }

    const EventData = {
      id: eventId,
      title: title,
      type: type,
      description: description,
      location: location,
      date: formattedDate,
      startTime: startTime.format("h:mm a"),
      endTime: endTime.format("h:mm a"),
      month: month,
      year: year,
      ageRange: ageRange,
      rankRange: rankRange,
      price: price,
      imageId: this.state.imageId,
    };

    createEvent(EventData)
      .then((response) => {
        notification.success({
          message: "Save Successful!",
          description: "Event was saved.",
          duration: 2,
        });
        this.props.history.push("/schedule/events");
        this.setState({ loading: false, eventModalVisible: false });
        this.handleCancel();
      })
      .catch((error) => {
        if (error.status === 401) {
          this.props.handleLogout(
            "/login",
            "error",
            "You have been logged out."
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

  handleLocationDropdownChange = (value) => {
    this.setState({ selectedLocation: value });
  };

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
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  showModal = () => {
    this.setState(
      {
        eventModalVisible: true,
        isSavedEvent: false,
        signupStudents: [],
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

  handleStudentChange(value) {
    this.setState({
      selectedStudentId: value,
    });
  }

  setFormValues = () => {
    var startTime = moment();
    var endTime = moment().add(2, "hours");
    this.formRef.current.setFieldsValue({
      title: "",
      startTime: startTime,
      description: "",
      endTime: endTime,
      selectedLocation: this.state.locations[0],
      date: moment(),
      type: "Camp",
    });
  };

  handleCancel = () => {
    this.formRef.current.resetFields();

    var startTime = moment();
    var endTime = moment().add(2, "hours");

    this.setState({
      title: "",
      event: "",
      description: "",
      selectedLocation: "",
      type: "",
      lowestRank: "",
      highestRank: "",
      youngestAge: "",
      oldestAge: "",
      sessionId: "",
      photo: "",
      imageId: "",
      image: "",
      price: 0,
      date: moment(),
      startTime: startTime,
      endTime: endTime,
      signupStudents: [],
      studentEvents: [],
      allStudents: [],
      eventModalVisible: false,
      loading: false,
      isSavedEvent: false,
    });
  };

  filterOption = (inputValue, students) =>
    students.lastName.indexOf(inputValue) > -1;

  handleChange = (selectedItems) => {
    var joined = new Array();

    selectedItems.forEach((item) => {
      joined.push(
        this.state.allStudents.find(function (student) {
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
    const { eventId } = this.state;
    removeStudentEventByEventIdAndStudentId(eventId, studentId)
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

    const { studentEvents, signupStudents, allStudents } = this.state;

    let signup, student;
    let newSignupList = signupStudents;
    for (signup of signupStudents) {
      if (signup.id == studentId) {
        student = signup;
        newSignupList = signupStudents.filter(function (value) {
          return value.id != studentId;
        });
        break;
      }
    }

    var newStudentEventList = studentEvents.filter(function (value) {
      return value.studentId != studentId;
    });

    this.setState({
      signupStudents: newSignupList,
      allStudents: this.state.allStudents.concat(student),
      studentEvents: newStudentEventList,
      loading: false,
    });
  }

  updateStudentEventList(studentId) {
    this.setState({
      loading: true,
    });

    var { studentEvents, signupStudents } = this.state;

    var newList = studentEvents.filter(function (value, index, arr) {
      return value.studentId != studentId;
    });

    var newSignupList = signupStudents.filter(function (value, index, arr) {
      return value.id != studentId;
    });

    this.setState({
      studentEvents: newList,
      signupStudents: newSignupList,
      loading: false,
    });
  }

  updateAllStudentList() {
    this.setState({
      loading: true,
    });

    var { studentEvents, allStudents } = this.state;

    var newStudentList = allStudents;
    newStudentList = allStudents.filter(function (value) {
      return checkCondition(value, studentEvents);
    });

    this.setState({
      allStudents: newStudentList,
      loading: false,
    });
  }

  signupStudent() {
    const { eventId, selectedStudentId } = this.state;

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
      calendarEventId: eventId,
      studentId: selectedStudentId,
      charged: this.state.event.price,
      paid: 0,
      signupDate: moment().format("YYYY-MM-DD"),
    };

    createStudentEvent(data)
      .then((response) => {
        this.setState(
          {
            loading: false,
            selectedStudentId: "",
            studentEvents: this.state.studentEvents.concat(data),
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

  removeEvent = () => {
    const id = this.state.eventId;
    removeEventById(id)
      .then((response) => {
        message.success("Event deleted.");
        this.handleCancel;
        this.getEventList(this.state.page, this.state.STUDENT_LIST_SIZE);
        this.setState({ loading: false, eventModalVisible: false });
      })
      .catch((error) => {
        message.error("Error [" + error.message + "]");
      });

    removeStudentEventsByEventId(id)
      .then((response) => {})
      .catch((error) => {});
  };

  render() {
    const {
      events,
      signupStudents,
      studentEvents,
      allStudents,
      selectedStudentId,
      locations,
      isSavedEvent,
      eventModalVisible,
      image,
    } = this.state;
    const { pagination, loading } = this.state;

    var studentEventList = [];
    let student, se, studEvent;
    for (student of signupStudents) {
      for (se of studentEvents) {
        if (se.studentId == student.id) {
          studEvent = se;
          break;
        }
      }

      let balance = 0,
        date = "";
      if (studEvent) {
        balance = "$" + (studEvent.charged - studEvent.paid);
        date = studEvent.signupDate;
      }

      const studentEvent = {
        studentId: student.id,
        studentName:
          student.firstName + " " + student.lastName.substring(0, 1) + ".",
        studentRank: student.ranks,
        date: date,
        balance: balance,
      };

      studentEventList.push(studentEvent);
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

    const eventCols = [
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
        width: 60,
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        width: 40,
      },
    ];

    const warningText = [
      <Text type="warning">*save event before signing up students</Text>,
    ];

    var signupStudentsView = [];
    if (this.state.isSavedEvent) {
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
    if (isSavedEvent) {
      ModalTitle = <Title level={2}>Edit Event</Title>;
    } else {
      ModalTitle = <Title level={2}>New Event</Title>;
    }
    const TableTitle = <Title level={3}>Event List</Title>;

    const renderButton = () => {
      if (isSavedEvent) {
        return (
          <Popconfirm
            title="Delete event?"
            onConfirm={this.removeEvent}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              loading={loading}
            >
              Delete
            </Button>
          </Popconfirm>
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
          marginBottom: 10,
          marginTop: 10,
          marginLeft: 8,
          marginRight: 10,
        }}
      >
        New Event
      </Button>,

      <Modal
        closable={false}
        className="session-list"
        visible={eventModalVisible}
        title={ModalTitle}
        onCancel={this.handleCancel}
        style={{ top: 0 }}
        footer={[
          <Button key="back" type="secondary" onClick={this.handleCancel}>
            Cancel
          </Button>,
          renderButton(),
          <Button
            key="submit"
            type="primary"
            icon={<SaveOutlined />}
            disabled={this.isFormInvalid()}
            loading={loading}
            onClick={this.handleEventSubmit}
          >
            Save
          </Button>,
        ]}
      >
        <Form
          initialValues={{
            title: this.state.title,
            description: this.state.description,
            type: this.state.selectedType,
            location: this.state.selectedLocation,
            date: moment(this.state.date),
            startTime: moment(this.state.startTime, "HH:mm a"),
            endTime: moment(this.state.endTime, "HH:mm a"),
            lowestRank: "Gold Stripe",
            highestRank: "Fifth Degree",
            youngestAge: 0,
            oldestAge: 99,
            price: 0,
          }}
          layout="vertical"
          onFinish={this.handleEventSubmit}
          ref={this.formRef}
        >
          <Collapse
            accordion
            bordered={false}
            defaultActiveKey={["1"]}
            className="site-collapse-custom-collapse"
          >
            <Panel
              header={
                <Title style={{ marginBottom: 0 }} level={4}>
                  {"Info"}
                </Title>
              }
              key="1"
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
                    message: "Please enter the event title.",
                  },
                ]}
              >
                <Input
                  placeholder="Title"
                  autosize={{ minRows: 1, maxRows: 1 }}
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
                    message: "Please enter the event description.",
                  },
                ]}
              >
                <TextArea
                  placeholder="describe the event in detail"
                  rows={3}
                  autosize={{ minRows: 1, maxRows: 3 }}
                />
              </Form.Item>

              <Form.Item
                name="type"
                label={
                  <Title style={{ marginBottom: 0 }} level={5}>
                    {"Type"}
                  </Title>
                }
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please select the event type.",
                  },
                ]}
              >
                <Select
                  align="center"
                  placeholder={"select type"}
                  onChange={this.handleTypeChange}
                >
                  <Option value="Camp">Camp</Option>
                  <Option value="Misc">Misc</Option>
                </Select>
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
                    message: "Please select the event location.",
                  },
                ]}
              >
                <Select
                  align="center"
                  Key={locations.id}
                  placeholder={"select location"}
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
                  {"Date and Time"}
                </Title>
              }
              key="2"
              className="site-collapse-custom-panel"
            >
              <Form.Item
                name="date"
                label={
                  <Title style={{ marginBottom: 0 }} level={5}>
                    {"Date"}
                  </Title>
                }
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please select the event date.",
                  },
                ]}
              >
                <DatePicker
                  inputReadOnly="true"
                  align="center"
                  placeholder={"select date"}
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>

              <Form.Item
                name="startTime"
                label={
                  <Title style={{ marginBottom: 0 }} level={5}>
                    {"Start Time"}
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
                    message: "Please select the event start time.",
                  },
                ]}
              >
                <TimePicker
                  inputReadOnly="true"
                  use12Hours
                  format="h:mm a"
                  align="center"
                  placeholder={"select start time"}
                  minuteStep={15}
                  style={{ marginLeft: 0, width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                name="endTime"
                label={
                  <Title style={{ marginBottom: 0 }} level={5}>
                    {"End Time"}
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
                    message: "Please select the event end time.",
                  },
                ]}
              >
                <TimePicker
                  inputReadOnly="true"
                  use12Hours
                  format="h:mm a"
                  align="center"
                  placeholder={"select end time"}
                  minuteStep={15}
                  style={{ marginLeft: 0, width: "100%" }}
                />
              </Form.Item>
            </Panel>

            <Panel
              header={
                <Title style={{ marginBottom: 0 }} level={4}>
                  {"Student Requirements"}
                </Title>
              }
              key="3"
              className="site-collapse-custom-panel"
            >
              <Form.Item
                name="price"
                style={{ marginLeft: 0 }}
                label={
                  <Title style={{ marginTop: 14, marginBottom: 0 }} level={5}>
                    {"Price"}
                  </Title>
                }
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please enter the event price.",
                  },
                ]}
              >
                <Input
                  placeholder="US$"
                  style={{ fontSize: "16px" }}
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
                >
                  {ages}
                </Select>
              </Form.Item>
            </Panel>

            <Panel
              header={
                <Title style={{ marginBottom: 0 }} level={4}>
                  {"Student Signup"}
                </Title>
              }
              key="4"
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
                  rowKey={studentEventList.studentId}
                  rowClassName={(record, index) =>
                    this.getRowColor(record, index)
                  }
                  pagination={false}
                  bordered
                  columns={studentCols}
                  dataSource={studentEventList}
                  size="small"
                  style={{ width: "100%" }}
                  scroll={{ x: 400 }}
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
        rowKey={events.id}
        rowClassName={(record, index) => this.getRowColor(record, index)}
        pagination={pagination}
        bordered
        columns={eventCols}
        dataSource={events}
        size="small"
        scroll={{ y: 350 }}
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
        className="session-list"
        bordered={false}
        bodyStyle={{ padding: 0 }}
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

  getEventStudentsTable(event) {
    return this.getEventStudentsList(event);
  }

  onFill = () => {
    this.formRef.current.setFieldsValue({
      title: this.state.title,
      description: this.state.description,
      startTime: moment(this.state.startTime, "HH:mm a"),
      endTime: moment(this.state.endTime, "HH:mm a"),
      date: moment(this.state.date),
      location: this.state.selectedLocation,
      type: this.state.selectedType,
      price: this.state.price,
      youngestAge: this.state.youngestAge,
      oldestAge: this.state.oldestAge,
      lowestRank: this.state.lowestRank,
      highestRank: this.state.highestRank,
    });
  };

  handleTypeChange = (value) => {
    this.setState({ type: value });
  };

  Demo() {
    console.log("test demo");
    <NewWindow>
      <h1>Hi 👋</h1>
    </NewWindow>;
  }

  handleStudentRowClick(student) {
    <NewWindow>
      <h1>Hi 👋</h1>
    </NewWindow>;
    //this.Demo();
    //this.props.history.push(`/students/${student.studentId}`);
  }

  handleRowClick(event) {
    this.showEvent(event);
  }

  showEvent(event) {
    this.loadImage(event);
    this.getLocationList(0);
  }

  loadImage(event) {
    let promise;
    promise = getImage(event.imageId);

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
          this.loadStudentsByEventId(event)
        );
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  loadStudentsByEventId(event) {
    let promise;

    promise = getAllStudentsByEventId(event.id);

    if (!promise) {
      return;
    }

    let eventRankRange = event.rankRange.split("-");
    let lowestRank = eventRankRange[0];
    let highestRank = eventRankRange[1];

    let eventAgeRange = event.ageRange.split("-");
    let youngestAge = eventAgeRange[0];
    let oldestAge = eventAgeRange[1];

    this.setState({
      loading: true,
    });

    promise
      .then((response) => {
        this.setState(
          {
            event: event,
            photo: "image",
            signupStudents: response,
            selectedLocation: event.location,
            date: event.date,
            title: event.title,
            description: event.description,
            eventId: event.id,
            price: event.price,
            startTime: event.startTime,
            endTime: event.endTime,
            selectedType: event.type,
            youngestAge: youngestAge,
            oldestAge: oldestAge,
            lowestRank: lowestRank,
            highestRank: highestRank,
          },
          () => this.getAllStudentEvents(event)
        );
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  getAllStudentEvents(event) {
    let promise;

    promise = getStudentEventsByEventId(event.id);

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
            studentEvents: response,
            loading: false,
            isSavedEvent: true,
            eventModalVisible: true,
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
        size: 0.1, // the max size in MB, defaults to 2MB
        quality: 1, // the quality of the image, max is 1,
        maxWidth: 200, // the max width of the output image, defaults to 1920px
        maxHeight: 200, // the max height of the output image, defaults to 1920px
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

export default withRouter(EventList);

function checkCondition(student, studentEvents) {
  let se;

  for (se of studentEvents) {
    if (se.studentId == student.id) {
      return false;
    }
  }

  return true;
}
