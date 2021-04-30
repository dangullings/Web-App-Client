import React, { Component } from "react";
import ReactDOM from "react-dom";
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
  Popconfirm,
} from "antd";
import {
  createEvent,
  getAllLocations,
  getAllEvents,
  getAllStudentsByEventId,
  getAllStudentsByActive,
  removeStudentEvent,
  createStudentEvent,
  getStudentEventsByEventId,
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
const { TextArea } = Input;
const Option = Select.Option;

const ages = [];
for (let i = 0; i < 100; i++) {
  ages.push(<Option key={i}>{i}</Option>);
}

class EventList extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      events: [],
      event: "",
      studentEvents: [],
      selectedEvent: "",
      eventStudents: [],
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
      selectedLocation: "",
      title: "",
      type: "Test",
      description: "",
      newEventStartDate: "",
      newEventStartTime: "",
      newEventEndTime: "",
      ageRange: "",
      rankRange: "",
      youngestAge: "",
      oldestAge: "",
      lowestRank: "",
      highestRank: "",
      price: 0,
    };

    this.handleAgeRangeChange = this.handleAgeRangeChange.bind(this);
    this.handleRankRangeChange = this.handleRankRangeChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleYoungestAgeChange = this.handleYoungestAgeChange.bind(this);
    this.handleOldestAgeChange = this.handleOldestAgeChange.bind(this);
    this.handleLowestRankChange = this.handleLowestRankChange.bind(this);
    this.handleHighestRankChange = this.handleHighestRankChange.bind(this);

    this.handleEventSubmit = this.handleEventSubmit.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleLocationDropdownChange = this.handleLocationDropdownChange.bind(
      this
    );
    this.handleTypeChange = this.handleTypeChange.bind(this);

    this.expandedRowRender = this.expandedRowRender.bind(this);
  }

  componentDidMount() {
    this.getEventList(this.state.page, this.state.STUDENT_LIST_SIZE);
    this.getLocationList(0);
    this.getAllStudentsList(0);
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
        this.setState({
          allStudents: response.content,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
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
          isLoading: false,
        });
      });
  }

  isFormInvalid() {
    const {
      title,
      type,
      description,
      selectedLocation,
      newEventDate,
      newEventStartTime,
      newEventEndTime,
    } = this.state;

    if (title == "") {
      return true;
    }
    if (description == "") {
      return true;
    }
    if (newEventDate == "") {
      return true;
    }
    if (newEventStartTime == "") {
      return true;
    }
    if (newEventEndTime == "") {
      return true;
    }
    if (type == "") {
      return true;
    }
    if (selectedLocation == "") {
      return true;
    }
    if (newEventStartTime.isAfter(newEventEndTime)) {
      return true;
    }

    return false;
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
      newEventDate: "",
      newEventStartTime: "",
      newEventEndTime: "",
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
    this.getSessionList(pagination.current, pagination.pageSize);
    /* this.fetch({
          sortField: sorter.field,
          sortOrder: sorter.order,
          pagination,
          ...filter
        }); */
  };

  deleteRemovedStudentEvents() {
    let removedStudent, student, initial;
    for (initial of this.state.initialEventStudents) {
      removedStudent = true;
      for (student of this.state.eventStudents) {
        if (initial.id == student.id) {
          removedStudent = false;
          break;
        }
      }

      if (removedStudent) {
        this.removeStudentEvent(this.state.eventId, initial.id);
      }
    }
  }

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

  handleCancel = () => {
    this.setState({ eventModalVisible: false });
    this.onReset();
  };

  onReset() {
    console.log("reset forms");
    this.formRef.current.resetFields();
  }

  handleEventSubmit(event) {
    let title = this.formRef.current.getFieldValue("title");
    let type = this.formRef.current.getFieldValue("type");
    let description = this.formRef.current.getFieldValue("description");
    let location = this.formRef.current.getFieldValue("location");
    let date = this.formRef.current.getFieldValue("eventDate");
    let startTime = this.formRef.current.getFieldValue("startTime");
    let endTime = this.formRef.current.getFieldValue("endTime");
    let youngestAge = this.formRef.current.getFieldValue("youngestAge");
    let oldestAge = this.formRef.current.getFieldValue("oldestAge");
    let lowestRank = this.formRef.current.getFieldValue("lowestRank");
    let highestRank = this.formRef.current.getFieldValue("highestRank");
    let price = this.formRef.current.getFieldValue("price");

    let ageRange = youngestAge + "-" + oldestAge;
    let rankRange = lowestRank + "-" + highestRank;

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

    return;

    this.setState({ loading: true });

    this.deleteRemovedStudentEvents();

    let formattedDate = date.format("YYYY-MM-DD");
    let parts = formattedDate.split("-");
    let month = parts[1];
    let year = parts[0];

    const EventData = {
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
    };

    createEvent(EventData)
      .then((response) => {
        notification.success({
          message: "Save Successful!",
          description: "Event was saved.",
          duration: 2,
        });
        this.props.history.push("/schedule/calendar");
        this.setState({ loading: false, eventModalVisible: false }, () =>
          this.startSavingStudentEvents(this.state.eventStudents)
        );
        this.resetFields();
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

  startSavingStudentEvents(students) {
    let student, initial;
    let isNewStudent = true;
    for (student of students) {
      isNewStudent = true;
      for (initial of this.state.initialEventStudents) {
        if (initial.id == student.id) {
          isNewStudent = false;
          break;
        }
      }

      if (isNewStudent) {
        this.saveAllStudentEvents(student);
      }
    }
  }

  saveAllStudentEvents(student) {
    let eventId = this.state.eventId;

    const data = {
      calendarEventId: eventId,
      studentId: student.id,
      isAttending: true,
    };

    createStudentEvent(data)
      .then((response) => {})
      .catch((error) => {});
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
        eventStudents: [],
        selectedItems: [],
      },
      this.setFormValues
    );

    this.getAllStudentsList(0);
    this.getLocationList(0);

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

  setFormValues = () => {
    var startTime = moment();
    var endTime = moment().add(2, "hours");
    this.formRef.current.setFieldsValue({
      title: "",
      startTime: startTime,
      endTime: endTime,
      date: moment(),
      location: "",
      type: "Camp",
      eventStudentIds: [],
    });
  };

  handleCancel = () => {
    //this.formRef.current.resetFields();

    var startTime = moment();
    var endTime = moment().add(2, "hours");

    this.setState({
      title: "",
      location: "",
      type: "",
      date: moment(),
      startTime: startTime,
      endTime: endTime,
      eventStudents: [],
      visible: false,
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
      eventStudents: joined,
    });
  };

  render() {
    const {
      events,
      eventStudents,
      studentEvents,
      allStudents,
      title,
      description,
      locations,
      selectedLocation,
      selectedDate,
      selectedType,
      selectedItems,
      isSavedEvent,
      eventModalVisible,
      price,
    } = this.state;
    const { pagination, loading, size } = this.state;

    const filteredOptions = allStudents.filter(
      (o) => !selectedItems.includes(o)
    );

    var studentEventList = [];
    let student, se, studEvent;
    for (student of eventStudents) {
      for (se of studentEvents) {
        if (se.studentId == student.id) {
          studEvent = se;
          break;
        }
      }

      let balance = 0;
      if (studEvent) {
        balance = "$" + (studEvent.charged - studEvent.paid);
      }

      const studentEvent = {
        studentId: student.id,
        studentName:
          student.firstName + " " + student.lastName.substring(0, 1) + ".",
        studentRank: student.ranks,
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
        ellipsis: true,
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
        width: 50,
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        width: 50,
      },
    ];

    const ModalTitle = <Title level={2}>New Event</Title>;
    const TableTitle = <Title level={3}>Event List</Title>;

    const tableProps = {
      expandedRowRender: (record) => this.expandedRowRender(record),
    };

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
        className="eventCalendar"
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
            startTime: moment(this.state.startTime, "HH:mm:ss"),
            endTime: moment(this.state.endTime, "HH:mm:ss"),
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
              style={{ fontSize: "16px" }}
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
              style={{ fontSize: "16px" }}
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
              size={"large"}
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
              size={"large"}
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
              width: "calc(50% - 12px)",
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
              width: "calc(50% - 12px)",
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

          <Divider style={{ marginTop: 10 }} orientation="left">
            {
              <Title style={{ marginBottom: 0 }} level={4}>
                price
              </Title>
            }
          </Divider>
          <Form.Item
            name="price"
            style={{ marginLeft: 0 }}
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
            />
          </Form.Item>

          <Divider style={{ marginTop: 10 }} orientation="left">
            {<Title level={4}>rank limits</Title>}
          </Divider>
          <Form.Item
            name="lowestRank"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                {"Lowest Rank"}
              </Title>
            }
          >
            <Select
              align="center"
              sie={"large"}
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
          >
            <Select
              align="center"
              sie={"large"}
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

          <Divider style={{ marginTop: 10 }} orientation="left">
            {<Title level={4}>age limits</Title>}
          </Divider>
          <Form.Item
            name="youngestAge"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                {"Youngest Age"}
              </Title>
            }
          >
            <Select
              align="center"
              sie={"large"}
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
          >
            <Select
              align="center"
              sie={"large"}
              style={{ width: "100%" }}
              placeholder={"select an oldest age"}
              defaultValue={99}
              onChange={this.handleOldestAgeChange}
            >
              {ages}
            </Select>
          </Form.Item>

          <Form.Item
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                {"Students"}
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
            style={{ marginTop: 20 }}
          >
            <Table
              loading={loading}
              rowKey={studentEventList.studentId}
              pagination={pagination}
              bordered
              columns={studentCols}
              dataSource={studentEventList}
              size="small"
              scroll={{ y: 350 }}
              onChange={this.handleTableChange}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (studentEvent) => {
                    this.handleStudentRowClick(studentEvent);
                  }, // click row
                  //onDoubleClick: event => { this.handleRowClick(record) }, // double click row
                  //onContextMenu: event => { }, // right button click row
                  //onMouseEnter: event => { }, // mouse enter row
                  //onMouseLeave: event => { }, // mouse leave row
                };
              }}
            />
          </Form.Item>
        </Form>
      </Modal>,
      <Table
        loading={loading}
        rowKey={events.id}
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

  expandedRowRender = (event) => {
    const students = event.students;
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

  getEventStudentsTable(event) {
    return this.getEventStudentsList(event);
  }

  onFill = () => {
    this.formRef.current.setFieldsValue({
      title: this.state.title,
      description: this.state.description,
      startTime: moment(this.state.startTime, "HH:mm:ss"),
      endTime: moment(this.state.endTime, "HH:mm:ss"),
      date: moment(this.state.date),
      location: this.state.selectedLocation,
      type: this.state.selectedType,
    });
  };

  handleTypeChange = (value) => {
    this.setState({ type: value });
  };

  handleStudentRowClick(student) {
    //this.showEvent(event);
  }

  handleRowClick(event) {
    this.showEvent(event);
  }

  /* showEvent(event) {
    const { events } = this.state;

    let e, selectedEvent;
    for (e of events) {
      if (e.id == event.id) {
        selectedEvent = e;
        break;
      }
    }

    this.setState(
      {
        selectedEvent: selectedEvent,
        eventStudents: selectedEvent.students,
        initialEventStudents: selectedEvent.students,
        selectedItems: selectedEvent.students,
        selectedLocation: selectedEvent.location,
        date: selectedEvent.date,
        title: selectedEvent.title,
        eventId: selectedEvent.id,
        startTime: selectedEvent.startTime,
        endTime: selectedEvent.endTime,
        selectedType: selectedEvent.type,
        loading: false,
        isSavedEvent: true,
      },
      this.onFill
    );
  } */

  showEvent(event) {
    this.loadStudentsByEventId(event);
    this.getAllStudentsList(0);
    this.getLocationList(0);
  }

  loadStudentsByEventId(event) {
    let promise;

    promise = getAllStudentsByEventId(event.id);

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
            event: event,
            eventStudents: response,
            initialEventStudents: response,
            selectedItems: response,
            selectedLocation: event.location,
            date: event.date,
            title: event.title,
            eventId: event.id,
            startTime: event.startTime,
            endTime: event.endTime,
            selectedType: event.type,
          },
          this.getAllStudentEvents(event)
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
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }
}

export default withRouter(EventList);
