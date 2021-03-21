import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  Table,
  Typography,
  DatePicker,
  Row,
  Popconfirm,
  TimePicker,
  Divider,
  Select,
  Switch,
  Radio,
  Modal,
  Space,
  message,
  Form,
  notification,
  Input,
  Button,
  Card,
} from "antd";
import {
  removeStudentTestScores,
  getAllTests,
  getStudentTestScores,
  removeTest,
  createTest,
  saveStudentTestScores,
  getAllStudentsByActive,
  getAllStudentsByTestId,
  getAllStudents,
  getAllLocations,
  getAllSessionsByDate,
  getSessionStudents,
  removeStudentTestScore,
} from "../util/APIUtils";
import moment from "moment";
import { STUDENT_LIST_SIZE } from "../constants";
import { withRouter } from "react-router-dom";
import "../styles/style.less";

import {
  SearchOutlined,
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const Option = Select.Option;
const { Title, Text } = Typography;

class TestList extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      tests: [],
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

      test: "",

      selectedLocation: "Location",
      date: "",
      title: "",
      testId: "",
      selectedType: "color",
      locationItems: [],
      allStudents: [],
      students: [],
      targetKeys: [],
      testStudents: [],
      studentTestCards: [],
      selectedKeys: [],
      verticalRows: 7,
      editingId: "",
      selectedItems: [],
      selectedTestStudent: "",
      testStudentScores: "",
      studentTestId: "",
      testStudentScoring: [],
      initialTestStudents: [],
      newStartTime: "",
      newEndTime: "",
      startTime: "",
      endTime: "",
      isSavedTest: false,

      studentId: "",
      form: 0,
      steps: 0,
      power: 0,
      kiap: 0,
      questions: 0,
      attitude: 0,
      sparring: 0,
      breaking: 0,
    };
    this.getTestList = this.getTestList.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
    this.changeSelectedTestStudent = this.changeSelectedTestStudent.bind(this);
    this.handleLocationDropdownChange = this.handleLocationDropdownChange.bind(
      this
    );

    this.clickFormInput = this.clickFormInput.bind(this);
    this.clickStepsInput = this.clickStepsInput.bind(this);
    this.clickPowerInput = this.clickPowerInput.bind(this);
    this.clickKiapInput = this.clickKiapInput.bind(this);
    this.clickQuestionsInput = this.clickQuestionsInput.bind(this);
    this.clickAttitudeInput = this.clickAttitudeInput.bind(this);
    this.clickSparringInput = this.clickSparringInput.bind(this);
    this.clickBreakingInput = this.clickBreakingInput.bind(this);

    this.handleFormScoreChange = this.handleFormScoreChange.bind(this);
    this.handleStepsScoreChange = this.handleStepsScoreChange.bind(this);
    this.handlePowerScoreChange = this.handlePowerScoreChange.bind(this);
    this.handleKiapScoreChange = this.handleKiapScoreChange.bind(this);
    this.handleQuestionsScoreChange = this.handleQuestionsScoreChange.bind(
      this
    );
    this.handleAttitudeScoreChange = this.handleAttitudeScoreChange.bind(this);
    this.handleSparringScoreChange = this.handleSparringScoreChange.bind(this);
    this.handleBreakingScoreChange = this.handleBreakingScoreChange.bind(this);
    this.changeSelectedTestStudent = this.changeSelectedTestStudent.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    this.getTestList(this.state.page);
    this.getSessionList();
  }

  onFill = () => {
    this.formRef.current.setFieldsValue({
      title: this.state.title,
      startTime: moment(this.state.test.startTime, "HH:mm:ss"),
      endTime: moment(this.state.test.endTime, "HH:mm:ss"),
      date: moment(this.state.date),
      location: this.state.selectedLocation,
      type: this.state.selectedType,
      testStudentIds: [],
    });
  };

  validateTest() {}

  getSessionList() {
    let promise;
    promise = getAllSessionsByDate();

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
          this.getSessionStudentsList(value);
        }
        this.setState({
          sessions: response,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  getSessionStudentsList(session) {
    let promise,
      students = [],
      sessionDatas = [];
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
          };

          students.push(student);
        }

        const sessionData = {
          sessionId: session.id,
          students: students,
        };
        sessionDatas.push(sessionData);

        this.setState({
          sessionStudents: this.state.sessionStudents.concat(sessionDatas),
          loading: false,
        });
      })
      .catch((error) => {});
  }

  clickFormInput() {
    this.setState({ form: "" });
  }

  clickStepsInput() {
    this.setState({ steps: "" });
  }

  clickPowerInput() {
    this.setState({ power: "" });
  }

  clickKiapInput() {
    this.setState({ kiap: "" });
  }

  clickQuestionsInput() {
    this.setState({ questions: "" });
  }

  clickAttitudeInput() {
    this.setState({ attitude: "" });
  }

  clickSparringInput() {
    this.setState({ sparring: "" });
  }

  clickBreakingInput() {
    this.setState({ breaking: "" });
  }

  handleFormScoreChange(event) {
    this.setState({ form: event.target.value });
  }

  handleStepsScoreChange(event) {
    this.setState({ steps: event.target.value });
  }

  handlePowerScoreChange(event) {
    this.setState({ power: event.target.value });
  }

  handleQuestionsScoreChange(event) {
    this.setState({ questions: event.target.value });
  }

  handleAttitudeScoreChange(event) {
    this.setState({ attitude: event.target.value });
  }

  handleSparringScoreChange(event) {
    this.setState({ sparring: event.target.value });
  }

  handleBreakingScoreChange(event) {
    this.setState({ breaking: event.target.value });
  }

  handleKiapScoreChange(event) {
    this.setState({ kiap: event.target.value });
  }

  handleStartTimeChange(time, timeString) {
    const { newEndTime } = this.state;

    if (time.isAfter(newEndTime)) {
      message.error({
        content: "Start time must be before end time",
        style: {
          marginTop: "30vh",
        },
      });
      return;
    }

    this.setState({
      newStartTime: time,
      startTime: timeString,
    });
  }

  handleEndTimeChange(time, timeString) {
    const { newStartTime } = this.state;

    if (time.isBefore(newStartTime)) {
      message.error({
        content: "End time must be after start time",
        style: {
          marginTop: "30vh",
        },
      });
      return;
    }

    this.setState({
      newEndTime: time,
      endTime: timeString,
    });
  }

  handleSessionChange = (session) => {
    const { sessionStudents } = this.state;

    let ss;
    for (ss of sessionStudents) {
      if (ss.sessionId == session) {
        this.setState({
          testStudents: ss.students,
        });
      }
    }
  };

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
      testStudents: joined,
    });
  };

  mouseEnter = (e) => {};

  filterOption = (inputValue, students) =>
    students.lastName.indexOf(inputValue) > -1;

  onTypeChange = (e) => {
    console.log("radio checked", e.target.value);
    this.setState({
      selectedType: e.target.value,
    });
  };

  handleStudentChange = (targetKeys, direction, moveKeys) => {
    console.log(targetKeys, direction, moveKeys);
    this.setState({
      targetKeys,
      testStudents: [],
      studentTestCards: [],
    });

    //this.state.testStudents.length = 0;
    //this.state.studentTestCards.length = 0;

    targetKeys.forEach((item) => {
      this.state.testStudents.push(this.state.allStudents[item - 1]);
      this.state.studentTestCards.push(
        this.studentTestCard(this.state.allStudents[item - 1])
      );
    });
  };

  handleStudentSearch = (dir, value) => {
    console.log("search:", dir, value);
  };

  startSavingStudentTestScores(students) {
    let student, initial;
    let isNewStudent = true;
    for (student of students) {
      isNewStudent = true;
      for (initial of this.state.initialTestStudents) {
        if (initial.id == student.id) {
          isNewStudent = false;
          break;
        }
      }

      if (isNewStudent) {
        this.saveAllStudentTestScores(student);
      }
    }
  }

  deleteRemovedStudentTests() {
    let removedStudent, student, initial;
    for (initial of this.state.initialTestStudents) {
      removedStudent = true;
      for (student of this.state.testStudents) {
        if (initial.id == student.id) {
          removedStudent = false;
          break;
        }
      }

      if (removedStudent) {
        this.removeStudentTest(this.state.testId, initial.id);
      }
    }
  }

  removeStudentTest(testId, studentId) {
    removeStudentTestScore(testId, studentId)
      .then((response) => {})
      .catch((error) => {});
  }

  handleSubmit = () => {
    let title = this.formRef.current.getFieldValue("title");
    let location = this.formRef.current.getFieldValue("location");
    let startTime = this.formRef.current.getFieldValue("startTime");
    let formattedStartTime = moment(startTime, "H:mm:ss").format("LT");
    let endTime = this.formRef.current.getFieldValue("endTime");
    let formattedEndTime = moment(endTime, "H:mm:ss").format("LT");
    let date = this.formRef.current.getFieldValue("date").format("YYYY-MM-DD");
    let type = this.formRef.current.getFieldValue("type");

    console.log(
      "title " +
        title +
        " location " +
        location +
        " startTime " +
        formattedStartTime +
        " endTime " +
        formattedEndTime +
        " type " +
        type +
        " date " +
        date
    );

    this.setState({ loading: true });

    this.deleteRemovedStudentTests();

    var month, year;
    let parts = date.split("-");
    let y = parts[0];
    let m = parts[1];

    month = m;
    year = y;

    const TestData = {
      id: this.state.testId,
      type: type,
      location: location,
      date: date,
      title: title,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      month: month,
      year: year,
    };

    createTest(TestData)
      .then((response) => {
        notification.success({
          message: "Save Successful!",
          description: "Test was saved.",
          duration: 2,
        });
        this.getTestList(this.state.page);
        this.onReset;
        this.props.history.push("/tests");
        this.setState(
          {
            testId: response.id,
            loading: false,
            visible: false,
          },
          () => this.startSavingStudentTestScores(this.state.testStudents)
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
  };

  handleDateChange(date, dateString) {
    //let parts = dateString.split('-');
    //let year = parts[0];
    //let month = parts[1];
    //let day = parts[2];

    this.setState({
      date: dateString,
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
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
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
      isLoading: true,
    });

    promise
      .then((response) => {
        this.setState({
          allStudents: response.content,
          students: response.content,
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  renderItem = (students) => {
    const customLabel = (
      <span className="custom-item">
        {students.firstName} {students.lastName}
      </span>
    );

    return {
      label: customLabel, // for displayed item
      value: students.lastName, // for title and filter matching
    };
  };

  getTestList(page, pageSize) {
    let promise;
    promise = getAllTests(page, pageSize);

    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise
      .then((response) => {
        this.setState({
          tests: response.content,
          //page: response.page,
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

  handleTableChange = (pagination, filters, sorter) => {
    this.getTestList(pagination.current, pagination.pageSize);
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
        visible: true,
        isSavedTest: false,
        testStudents: [],
        selectedItems: [],
        selectedTestStudent: "",
      },
      this.setFormValues
    );

    this.getAllStudentsList(0);
    this.getAllLocationsList(0);

    this.setState({
      selectedLocation: this.state.locationItems[0],
    });

    //var today = new Date();
    //var dd = String(today.getDate()).padStart(2, "0");
    //var mm = String(today.getMonth() + 1).padStart(2, "0");
    //var yyyy = today.getFullYear();
    //today = yyyy + "-" + mm + "-" + dd;
  };

  setFormValues = () => {
    var startTime = moment();
    var endTime = moment().add(2, "hours");
    this.formRef.current.setFieldsValue({
      title: "",
      startTime: startTime,
      endTime: endTime,
      date: moment(),
      location: "",
      type: "Color",
      testStudentIds: [],
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
      testStudents: [],
      selectedTestStudent: "",
      visible: false,
      loading: false,
      isSavedTest: false,
    });
  };

  handleTitleChange(event) {
    const value = event.target.value;
    this.setState({
      titleText: value,
    });
  }

  removeTest = () => {
    const id = this.state.testId;
    removeTest(id)
      .then((response) => {
        message.success("Test deleted.");
        this.handleCancel;
        this.getTestList(this.state.page);
        this.setState({ loading: false, visible: false });
      })
      .catch((error) => {
        message.error("Error [" + error.message + "]");
      });

    removeStudentTestScores(id)
      .then((response) => {})
      .catch((error) => {});
  };

  render() {
    const { pagination, visible, loading, size } = this.state;
    const {
      testStudentScoring,
      form,
      power,
      steps,
      kiap,
      questions,
      sparring,
      breaking,
      attitude,
    } = this.state;
    const {
      isSavedTest,
      tests,
      selectedItems,
      selectedTestStudent,
      locationItems,
      students,
      testStudents,
      sessions,
      sessionStudents,
      title,
    } = this.state;
    const filteredOptions = students.filter((o) => !selectedItems.includes(o));

    var columns = [
      {
        title: "Form",
        dataIndex: "form",
        key: "form",
        ellipsis: true,
        render: () => (
          <Input
            size="small"
            onClick={this.clickFormInput}
            maxLength={1}
            value={form}
            style={{ fontSize: 20, width: "100%" }}
            type="text"
            onChange={this.handleFormScoreChange}
          />
        ),
      },
      {
        title: "Steps",
        dataIndex: "steps",
        key: "steps",
        ellipsis: true,
        render: () => (
          <Input
            size="small"
            onClick={this.clickStepsInput}
            maxLength={1}
            value={steps}
            style={{ fontSize: 20, width: "100%" }}
            type="text"
            onChange={this.handleStepsScoreChange}
          />
        ),
      },
      {
        title: "Power",
        dataIndex: "power",
        key: "power",
        ellipsis: true,
        render: () => (
          <Input
            size="small"
            onClick={this.clickPowerInput}
            maxLength={1}
            value={power}
            style={{ fontSize: 20, width: "100%" }}
            type="text"
            onChange={this.handlePowerScoreChange}
          />
        ),
      },
      {
        title: "Kiap",
        dataIndex: "kiap",
        key: "kiap",
        ellipsis: true,
        render: () => (
          <Input
            size="small"
            onClick={this.clickKiapInput}
            maxLength={1}
            value={kiap}
            style={{ fontSize: 20, width: "100%" }}
            type="text"
            onChange={this.handleKiapScoreChange}
          />
        ),
      },
      {
        title: "Questions",
        dataIndex: "questions",
        key: "questions",
        ellipsis: true,
        render: () => (
          <Input
            size="small"
            onClick={this.clickQuestionsInput}
            maxLength={1}
            value={questions}
            style={{ fontSize: 20, width: "100%" }}
            type="text"
            onChange={this.handleQuestionsScoreChange}
          />
        ),
      },
      {
        title: "Attitude",
        dataIndex: "attitude",
        key: "attitude",
        ellipsis: true,
        render: () => (
          <Input
            size="small"
            onClick={this.clickAttitudeInput}
            maxLength={1}
            value={attitude}
            style={{ fontSize: 20, width: "100%" }}
            type="text"
            onChange={this.handleAttitudeScoreChange}
          />
        ),
      },
      {
        title: "Sparring",
        dataIndex: "sparring",
        key: "sparring",
        ellipsis: true,
        minWidth: 120,
        render: () => (
          <Input
            size="small"
            onClick={this.clickSparringInput}
            maxLength={1}
            value={sparring}
            style={{ fontSize: 20, width: "100%" }}
            type="text"
            onChange={this.handleSparringScoreChange}
          />
        ),
      },
      {
        title: "Breaking",
        dataIndex: "breaking",
        key: "breaking",
        ellipsis: true,
        render: () => (
          <Input
            size="small"
            onClick={this.clickBreakingInput}
            maxLength={1}
            value={breaking}
            style={{ fontSize: 20, width: "100%" }}
            type="text"
            onChange={this.handleBreakingScoreChange}
          />
        ),
      },
    ];

    const testCols = [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        ellipsis: true,
        width: "26%",
      },
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        ellipsis: true,
      },
      {
        title: "Location",
        dataIndex: "location",
        key: "location",
        ellipsis: true,
      },
    ];

    var ModalTitle;
    if (isSavedTest) {
      ModalTitle = <Title level={2}>Edit Test</Title>;
    } else {
      ModalTitle = <Title level={2}>New Test</Title>;
    }

    const TableTitle = <Title level={3}>Test List</Title>;

    var testStudentIds = [];
    let ts;
    for (ts of testStudents) {
      testStudentIds.push(ts.id);
    }

    const warningText = [
      <Text type="warning">*save test before scoring students</Text>,
    ];

    var studentTestTitle = ["NO STUDENT SELECTED"];
    if (selectedTestStudent) {
      studentTestTitle = [
        <Title level={4}>
          {selectedTestStudent.firstName + " " + selectedTestStudent.lastName}
        </Title>,
      ];
    }

    var scoreStudentsView = [];
    if (this.state.isSavedTest) {
      scoreStudentsView = [
        <Divider orientation="left">
          {<Title level={4}>{"Score Students"}</Title>}
        </Divider>,

        <Select
          align="center"
          size="large"
          style={{ width: "100%" }}
          placeholder="Select a student to score"
          optionFilterProp="children"
          onChange={this.changeSelectedTestStudent}
          onFocus={onFocus}
          onBlur={onBlur}
          onSearch={onSearch}
          Key={testStudents.id}
        >
          {testStudents.map((item) => (
            <Select.Option value={item.id} key={item.id}>
              {item.firstName + " " + item.lastName}
            </Select.Option>
          ))}
        </Select>,

        <div className="site-card-wrapper">
          <Row
            style={{ width: "100%", marginTop: 30, marginBottom: 30 }}
            key={selectedTestStudent.id}
          >
            <Card
              className="custom-card"
              bodyStyle={{ padding: 0 }}
              //headStyle={{ backgroundColor: 'rgba(0, 80, 255, 0.8)', border: 15, fontSize: 16 }}
              bordered={true}
              hoverable={true}
              title={studentTestTitle}
              key={selectedTestStudent.id}
              type="inner"
              style={{
                width: "100%",
                borderRadius: 4,
                boxShadow:
                  "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
              }}
            >
              <Table
                rowKey={testStudentScoring.name}
                pagination={false}
                bordered
                columns={columns}
                dataSource={testStudentScoring}
                size="small"
                style={{ width: "100%" }}
                scroll={{ x: 600 }}
              />
            </Card>

            <Button
              icon={<SaveOutlined />}
              style={{ marginTop: 15 }}
              size="default"
              block={true}
              onClick={this.saveAllStudentTestScores.bind(
                this,
                selectedTestStudent
              )}
              shape="round"
              type="primary"
            >
              Save {selectedTestStudent.firstName}'s Scores
            </Button>
          </Row>
        </div>,
      ];
    } else {
      scoreStudentsView = [warningText];
    }

    const renderButton = () => {
      if (isSavedTest) {
        return (
          <Popconfirm
            title="Delete test?"
            onConfirm={this.removeTest}
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
        style={{
          marginBottom: 10,
          marginTop: 10,
          marginLeft: 4,
          marginRight: 10,
        }}
      >
        New Test
      </Button>,

      <Modal
        visible={visible}
        className="test-list"
        title={ModalTitle}
        style={{ top: 0 }}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" type="secondary" onClick={this.handleCancel}>
            Cancel
          </Button>,
          renderButton(),
          <Button
            key="submit"
            htmlType="submit"
            type="primary"
            icon={<SaveOutlined />}
            disabled={this.isFormInvalid()}
            loading={loading}
            onClick={this.handleSubmit}
          >
            Save
          </Button>,
        ]}
      >
        <Form
          initialValues={{
            title: this.state.title,
            startTime: moment(this.state.test.startTime, "HH:mm:ss"),
            endTime: moment(this.state.test.endTime, "HH:mm:ss"),
            date: moment(this.state.date),
            location: this.state.selectedLocation,
            type: this.state.selectedType,
            testStudentIds: [],
          }}
          layout="vertical"
          ref={this.formRef}
          onFinish={this.handleSubmit}
        >
          <Divider orientation="left">
            {<Title level={4}>{"Test Info"}</Title>}
          </Divider>

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
                message: "Please enter the test title.",
              },
            ]}
          >
            <Input
              placeholder="Test Title"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 1 }}
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
                message: "Please enter the test type.",
              },
            ]}
          >
            <Radio.Group justify="center" align="middle">
              <Radio value={"color"}>Color</Radio>
              <Radio value={"blackbelt"}>Blackbelt</Radio>
            </Radio.Group>
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
                message: "Select the test location.",
              },
            ]}
          >
            <Select
              align="center"
              style={{ marginLeft: 0, width: "100%" }}
              Key={locationItems.id}
              placeholder={"select location"}
            >
              {locationItems.map((item) => (
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
                message: "Please enter the test date.",
              },
            ]}
          >
            <DatePicker
              inputReadOnly="true"
              align="center"
              style={{ marginLeft: 0, width: "100%" }}
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
                message: "Please select the test start time.",
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
          <span
            style={{
              display: "inline-block",
              width: "24px",
              lineHeight: "32px",
              textAlign: "center",
            }}
          ></span>
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
                message: "Please select the test end time.",
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

          <Divider orientation="left">
            {<Title level={4}>{"Students"}</Title>}
          </Divider>

          <Select
            align="center"
            style={{ width: "100%" }}
            Key={sessions.id}
            onChange={this.handleSessionChange}
            placeholder={"select students by session"}
          >
            {sessions.map((item) => (
              <Select.Option value={item.id} key={item.id}>
                {item.title + " | " + item.location}
              </Select.Option>
            ))}
          </Select>

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
            <Select
              align="center"
              showSearch
              key={(students) => students.id}
              mode="multiple"
              placeholder="select students"
              style={{ marginLeft: 0, width: "100%" }}
              optionFilterProp="children"
              value={testStudentIds}
              onChange={this.handleChange}
              onMouseEnter={this.mouseEnter}
            >
              {filteredOptions.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.firstName + " " + item.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {scoreStudentsView}
        </Form>
      </Modal>,

      <Table
        loading={this.state.loading}
        rowKey={tests.id}
        pagination={pagination}
        bordered
        columns={testCols}
        dataSource={tests}
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
        bodyStyle={{ padding: 0 }}
        className="test-list"
        bordered={false}
        title={TableTitle}
      >
        {contentList}
      </Card>
    );
  }

  saveAllStudentTestScores(student) {
    let studentId = student.id;

    var studentScores = {
      studentId: studentId,
      testId: this.state.testId,
      form: this.state.form,
      steps: this.state.steps,
      power: this.state.power,
      kiap: this.state.kiap,
      questions: this.state.questions,
      attitude: this.state.attitude,
      sparring: this.state.sparring,
      breaking: this.state.breaking,
    };

    saveStudentTestScores(studentScores)
      .then((response) => {
        notification.success({
          message: "Save Successful!",
          description: student.firstName + "'s scores were saved.",
          duration: 2,
        });
      })
      .catch((error) => {
        this.setState({
          form: 0,
          power: 0,
          steps: 0,
          kiap: 0,
          questions: 0,
          attitude: 0,
          sparring: 0,
          breaking: 0,
          testStudentScores: "",
        });
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

  changeSelectedTestStudent(value) {
    //this.saveAllStudentTestScores(this.state.selectedTestStudent);

    this.setState({ testStudentScoring: [] });
    this.loadStudentTestScores(this.state.testId, value);

    let student = this.state.allStudents.find(function (item) {
      return item.id === value;
    });

    this.setState({ selectedTestStudent: student });

    let tempform = this.state.testStudentScores.form;
    let tempsteps = this.state.testStudentScores.steps;
    let temppower = this.state.testStudentScores.power;
    let tempkiap = this.state.testStudentScores.kiap;
    let tempquestions = this.state.testStudentScores.questions;
    let tempattitude = this.state.testStudentScores.attitude;
    let tempbreaking = this.state.testStudentScores.breaking;
    let tempsparring = this.state.testStudentScores.sparring;

    this.setState({
      form: tempform,
      steps: tempsteps,
      power: temppower,
      kiap: tempkiap,
      questions: tempquestions,
      attitude: tempattitude,
      breaking: tempbreaking,
      sparring: tempsparring,
    });
  }

  loadStudentTestScores(testId, studentId) {
    console.log("load test scores " + testId + " " + studentId);
    this.setState({
      isLoading: true,
    });

    getStudentTestScores(testId, studentId)
      .then((response) => {
        this.setState({
          testStudentScores: response,
          testStudentScoring: [...this.state.testStudentScoring, response],
          isLoading: false,
        });
        this.setState({
          form: response.form,
          power: response.power,
          steps: response.steps,
          kiap: response.kiap,
          questions: response.questions,
          attitude: response.attitude,
          sparring: response.sparring,
          breaking: response.breaking,
        });
      })
      .catch((error) => {
        var tempTestStudentScoring = [
          {
            key: 1,
            form: 0,
            steps: 0,
            power: 0,
            kiap: 0,
            questions: 0,
            attitude: 0,
            sparring: 0,
            breaking: 0,
          },
        ];
        this.setState({
          testStudentScoring: [
            ...this.state.testStudentScoring,
            ...tempTestStudentScoring,
          ],
        });

        console.log("fail");
        this.setState({
          form: 0,
          power: 0,
          steps: 0,
          kiap: 0,
          questions: 0,
          attitude: 0,
          sparring: 0,
          breaking: 0,
          testStudentScores: "",
        });
        if (error.status === 404) {
          this.setState({
            notFound: true,
            isLoading: false,
          });
        } else {
          this.setState({
            serverError: true,
            isLoading: false,
          });
        }
      });
  }

  isFormInvalid() {
    return false;
    if (this.state.testId == "") {
      return true;
    } else if (this.state.selectedLocation == "Location") {
      return true;
    } else if (this.state.date == "") {
      return true;
    }

    return false;
  }

  handleRowClick(test) {
    this.showTest(test);
  }

  showTest(test) {
    this.loadStudentsByTestId(test);
    this.getAllStudentsList(0);
    this.getAllLocationsList(0);
  }

  loadStudentsByTestId(test) {
    let promise;

    promise = getAllStudentsByTestId(test.id);

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
            testStudents: response,
            initialTestStudents: response,
            selectedItems: response,
            test: test,
            selectedLocation: test.location,
            date: test.date,
            title: test.title,
            testId: test.id,
            startTime: test.startTime,
            endTime: test.endTime,
            selectedType: test.type,
            loading: false,
            visible: true,
            isSavedTest: true,
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

function onBlur() {
  console.log("blur");
}

function onFocus() {
  console.log("focus");
}

function onSearch(val) {
  console.log("search:", val);
}

export default withRouter(TestList);
