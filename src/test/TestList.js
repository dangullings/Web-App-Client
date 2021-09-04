import React, { Component } from "react";
import {
  Table,
  Typography,
  DatePicker,
  Row,
  TimePicker,
  Divider,
  Select,
  Radio,
  Modal,
  message,
  Form,
  notification,
  Input,
  Button,
  Card,
  Checkbox,
  List,
  Collapse,
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
  getAllLocations,
  getAllSessionsByDate,
  getSessionStudents,
  removeStudentTestScore,
  createStudent,
} from "../util/APIUtils";
import moment from "moment";
import { getRanks } from "../util/Helpers.js";
import { STUDENT_LIST_SIZE } from "../constants";
import { withRouter } from "react-router-dom";
//import "../styles/style.less";
import "../styles/components/TestList.less";
import "../styles/components/TestList.css";

import {
  CheckOutlined,
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Panel } = Collapse;
const { confirm } = Modal;
const ranks = getRanks();
const { Title, Text } = Typography;

class TestList extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      tests: [],
      sessions: [],
      sessionStudents: [],
      groupOptions: [],
      studentScoresList: [],
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
      price: 0,
      isSavedTest: false,
      needTestSaved: false,
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

    this.clickInput = this.clickInput.bind(this);

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
    this.startSavingStudentTestScores = this.startSavingStudentTestScores.bind(
      this
    );
    this.onChangePaid = this.onChangePaid.bind(this);

    this.getTestList(this.state.page);
    this.getSessionList();
  }

  onFill = () => {
    this.formRef.current.setFieldsValue({
      title: this.state.title,
      startTime: moment(this.state.test.startTime, "HH:mm a"),
      endTime: moment(this.state.test.endTime, "HH:mm a"),
      date: moment(this.state.date),
      location: this.state.selectedLocation,
      type: this.state.selectedType,
      price: this.state.test.price,
      testStudentIds: [],
    });

    this.loadStudentTestScores();
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
            ranks: value.ranks,
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

  clickInput = (studentScore) => {
    this.setState({ selectedTestStudent: studentScore.studentId });
  };

  handleFormScoreChange(event) {
    const { selectedTestStudent } = this.state;
    const value = event.target.value;

    if (event.target) {
      this.setState((prevState) => ({
        studentScoresList: prevState.studentScoresList.map((el) =>
          el.studentId === selectedTestStudent ? { ...el, form: value } : el
        ),
      }));
    }
  }

  handleStepsScoreChange(event) {
    const { selectedTestStudent } = this.state;
    const value = event.target.value;

    if (event.target) {
      this.setState((prevState) => ({
        studentScoresList: prevState.studentScoresList.map((el) =>
          el.studentId === selectedTestStudent ? { ...el, steps: value } : el
        ),
      }));
    }
  }

  handlePowerScoreChange(event) {
    const { selectedTestStudent } = this.state;
    const value = event.target.value;

    if (event.target) {
      this.setState((prevState) => ({
        studentScoresList: prevState.studentScoresList.map((el) =>
          el.studentId === selectedTestStudent ? { ...el, power: value } : el
        ),
      }));
    }
  }

  handleQuestionsScoreChange(event) {
    const { selectedTestStudent } = this.state;
    const value = event.target.value;

    if (event.target) {
      this.setState((prevState) => ({
        studentScoresList: prevState.studentScoresList.map((el) =>
          el.studentId === selectedTestStudent
            ? { ...el, questions: value }
            : el
        ),
      }));
    }
  }

  handleAttitudeScoreChange(event) {
    const { selectedTestStudent } = this.state;
    const value = event.target.value;

    if (event.target) {
      this.setState((prevState) => ({
        studentScoresList: prevState.studentScoresList.map((el) =>
          el.studentId === selectedTestStudent ? { ...el, attitude: value } : el
        ),
      }));
    }
  }

  handleSparringScoreChange(event) {
    const { selectedTestStudent } = this.state;
    const value = event.target.value;

    if (event.target) {
      this.setState((prevState) => ({
        studentScoresList: prevState.studentScoresList.map((el) =>
          el.studentId === selectedTestStudent ? { ...el, sparring: value } : el
        ),
      }));
    }
  }

  handleBreakingScoreChange(event) {
    const { selectedTestStudent } = this.state;
    const value = event.target.value;

    if (event.target) {
      this.setState((prevState) => ({
        studentScoresList: prevState.studentScoresList.map((el) =>
          el.studentId === selectedTestStudent ? { ...el, breaking: value } : el
        ),
      }));
    }
  }

  handleKiapScoreChange(event) {
    const { selectedTestStudent } = this.state;
    const value = event.target.value;

    if (event.target) {
      this.setState((prevState) => ({
        studentScoresList: prevState.studentScoresList.map((el) =>
          el.studentId === selectedTestStudent ? { ...el, kiap: value } : el
        ),
      }));
    }
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
        this.setState(
          {
            testStudents: ss.students,
          },
          () => this.createGroups(ss.students)
        );
        break;
      }
    }
  };

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
      testStudents: joined,
      needTestSaved: true,
    });
  };

  createGroups(students) {
    const { studentScoresList } = this.state;

    let newGroupOptions = [];
    let student;
    let rank;

    for (rank of ranks) {
      let newGroup = [];
      for (student of students) {
        if (student.ranks == rank) {
          newGroup.push(student);
        }
      }

      if (newGroup.length > 0) {
        const newGroupOption = {
          rank: rank,
          students: newGroup,
        };
        newGroupOptions.push(newGroupOption);
      }
    }

    let test, newStudent;
    let newStudentScoresList = [];
    for (student of students) {
      newStudent = true;
      for (test of studentScoresList) {
        if (student.id == test.studentId) {
          newStudent = false;
        }
      }

      if (newStudent) {
        const newStudentScore = {
          studentId: student.id,
          testId: this.state.testId,
          attitude: "",
          breaking: "",
          form: "",
          kiap: "",
          power: "",
          questions: "",
          sparring: "",
          steps: "",
          ranks: student.ranks,
          passed: false,
          paid: false,
        };
        newStudentScoresList.push(newStudentScore);
      }
    }

    if (newStudentScoresList.length > 0) {
      this.setState({
        studentScoresList: this.state.studentScoresList.concat(
          newStudentScoresList
        ),
      });
    }

    this.setState({
      groupOptions: newGroupOptions,
    });
  }

  saveNewStudentTestScores(studentScores) {
    this.setState({
      loading: true,
    });

    let student;
    let promises = [];

    for (student of studentScores) {
      let promise = saveStudentTestScores(student);
      promises.push(promise);
    }

    Promise.all(promises).then(() => {
      this.setState({
        loading: false,
      });
    });
  }

  mouseEnter = (e) => {};

  filterOption = (inputValue, students) =>
    students.lastName.indexOf(inputValue) > -1;

  onTypeChange = (e) => {
    this.setState({
      selectedType: e.target.value,
    });
  };

  handleStudentChange = (targetKeys, direction, moveKeys) => {
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

  startSavingStudentTestScores() {
    this.setState({
      loading: true,
    });

    const { studentScoresList, testStudents } = this.state;
    let student, ts;
    let promises = [];

    for (student of studentScoresList) {
      for (ts of testStudents) {
        if (student.studentId == ts.id) {
          let promise = saveStudentTestScores(student);
          promises.push(promise);
          break;
        }
      }
    }

    Promise.all(promises).then(() => {
      notification.success({
        message: "Save Successful!",
        description: "Student scores saved.",
        duration: 2,
      });
      this.setState({
        loading: false,
      });
    });
  }

  createAddedStudentTests() {
    const { initialTestStudents, testId, testStudents } = this.state;

    let promises = [];
    let addedStudent, student, initial;
    for (student of testStudents) {
      addedStudent = true;
      for (initial of initialTestStudents) {
        if (initial.id == student.id) {
          addedStudent = false;
          break;
        }
      }

      let studentScore = {
        studentId: student.id,
        testId: testId,
        ranks: student.ranks,
        form: "",
        steps: "",
        power: "",
        kiap: "",
        questions: "",
        attitude: "",
        sparring: "",
        breaking: "",
        passed: false,
        paid: false,
      };

      if (addedStudent) {
        let promise = saveStudentTestScores(studentScore);
        promises.push(promise);
      }
    }

    if (promises.length > 0) {
      Promise.all(promises).then(() => {});
    }
  }

  deleteRemovedStudentTests() {
    const { initialTestStudents, testId, testStudents } = this.state;

    let removedStudent, student, initial;
    let promises = [];
    for (initial of initialTestStudents) {
      removedStudent = true;
      for (student of testStudents) {
        if (initial.id == student.id) {
          removedStudent = false;
          break;
        }
      }

      if (removedStudent) {
        let promise = removeStudentTestScore(testId, initial.id);
        promises.push(promise);
      }
    }

    if (promises.length > 0) {
      Promise.all(promises).then(() => {});
    }
  }

  handleSubmit = () => {
    let title = this.formRef.current.getFieldValue("title");
    let location = this.formRef.current.getFieldValue("location");
    let startTime = this.formRef.current.getFieldValue("startTime");
    let formattedStartTime = moment(startTime, "h:mm a").format("LT");
    let endTime = this.formRef.current.getFieldValue("endTime");
    let formattedEndTime = moment(endTime, "h:mm a").format("LT");
    let date = this.formRef.current.getFieldValue("date").format("YYYY-MM-DD");
    let type = this.formRef.current.getFieldValue("type");
    let price = this.formRef.current.getFieldValue("price");

    this.setState({ loading: true });

    this.deleteRemovedStudentTests();
    this.createAddedStudentTests();

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
      price: price,
    };

    createTest(TestData)
      .then((response) => {
        notification.success({
          message: "Save Successful!",
          description: "Test was saved.",
          duration: 2,
        });
        this.getTestList(this.state.page);
        this.props.history.push("/tests");
        this.setState(
          {
            testId: response.id,
            loading: false,
            visible: false,
          },
          () => this.startSavingStudentTestScores()
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
    promise = getAllStudentsByActive(0, 200, true);

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
        testId: "",
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
      price: 0,
      date: moment(),
      startTime: startTime,
      endTime: endTime,
      testStudents: [],
      selectedTestStudent: "",
      visible: false,
      loading: false,
      isSavedTest: false,
      studentScoresList: [],
      groupOptions: [],
      sessionStudents: [],
      sessions: [],
    });
  };

  handleTitleChange(event) {
    const value = event.target.value;
    this.setState({
      titleText: value,
    });
  }

  showConfirm = () => {
    confirm({
      className: "confirm-custom-style",
      title: "Do you want to remove this test?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      content:
        "This will erase all records of this test. [Student Test Records, My Group, Calendar, Test List]",
      onOk: () => {
        return this.removeTest();
      },
      onCancel: () => {
        return console.log("");
      },
    });
  };

  removeTest = () => {
    const id = this.state.testId;
    removeTest(id)
      .then((response) => {
        message.success("Test deleted.");
        this.handleCancel();
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

  getColumns(studentId) {
    const { studentScoresList } = this.state;
    let sc;
    var studentScore = "";
    for (sc of studentScoresList) {
      if (studentId == sc.studentId) {
        studentScore = sc;
        break;
      }
    }

    var columns = [];

    if (studentScore == "") {
      return columns;
    }

    columns = [
      {
        title: "Form",
        dataIndex: "form",
        key: "form",
        ellipsis: true,
        width: 50,
        render: () => (
          <Input
            size="small"
            onClick={() => {
              this.clickInput(studentScore);
            }}
            maxLength={1}
            value={studentScore.form}
            style={{ fontSize: 20, width: "100%", textAlign: "center" }}
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
        width: 50,
        render: () => (
          <Input
            size="small"
            onClick={() => {
              this.clickInput(studentScore);
            }}
            maxLength={1}
            value={studentScore.steps}
            style={{ fontSize: 20, width: "100%", textAlign: "center" }}
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
        width: 50,
        render: () => (
          <Input
            size="small"
            onClick={() => {
              this.clickInput(studentScore);
            }}
            maxLength={1}
            value={studentScore.power}
            style={{ fontSize: 20, width: "100%", textAlign: "center" }}
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
        width: 50,
        render: () => (
          <Input
            size="small"
            onClick={() => {
              this.clickInput(studentScore);
            }}
            maxLength={1}
            value={studentScore.kiap}
            style={{ fontSize: 20, width: "100%", textAlign: "center" }}
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
        width: 50,
        render: () => (
          <Input
            size="small"
            onClick={() => {
              this.clickInput(studentScore);
            }}
            maxLength={1}
            value={studentScore.questions}
            style={{ fontSize: 20, width: "100%", textAlign: "center" }}
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
        width: 50,
        render: () => (
          <Input
            size="small"
            onClick={() => {
              this.clickInput(studentScore);
            }}
            maxLength={1}
            value={studentScore.attitude}
            style={{ fontSize: 20, width: "100%", textAlign: "center" }}
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
        width: 50,
        render: () => (
          <Input
            size="small"
            onClick={() => {
              this.clickInput(studentScore);
            }}
            maxLength={1}
            value={studentScore.sparring}
            style={{ fontSize: 20, width: "100%", textAlign: "center" }}
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
        width: 50,
        render: () => (
          <Input
            size="small"
            onClick={() => {
              this.clickInput(studentScore);
            }}
            maxLength={1}
            value={studentScore.breaking}
            style={{ fontSize: 20, width: "100%", textAlign: "center" }}
            type="text"
            onChange={this.handleBreakingScoreChange}
          />
        ),
      },
    ];

    return columns;
  }

  getStudentScore(studentId) {
    const { studentScoresList } = this.state;

    let ssl;

    for (ssl of studentScoresList) {
      if (ssl.studentId == studentId) {
        return [ssl];
      }
    }

    const bogus = {
      paid: false,
    };

    return [bogus];
  }

  getGroupColor(rank) {
    let index = 1;

    //if (index % 2 === 0) {
    //  return "table-row-light";
    //} else {
    //  return "table-row-dark";
    //}

    if (rank.includes("Gold")) {
      if (index % 2 === 0) {
        return "#ffef99"; // #ffef99
      } else {
        return "#FFD700"; // #c8ae01
      }
    } else if (rank.includes("Green")) {
      if (index % 2 === 0) {
        return "#a5bea0"; // #a5bea0
      } else {
        return "#228b22"; // #147800
      }
    } else if (rank.includes("Purple")) {
      if (index % 2 === 0) {
        return "#c1a4c5"; // #c1a4c5
      } else {
        return "#5B3B8C"; // #a401bd
      }
    } else if (rank.includes("Brown")) {
      if (index % 2 === 0) {
        return "#80756d"; // #80756d
      } else {
        return "#6f4e37"; // #7d5e47
      }
    } else if (rank.includes("Red")) {
      if (index % 2 === 0) {
        return "#e0bbbb"; // #e0bbbb
      } else {
        return "#ce2029"; // #e30101
      }
    } else {
      if (index % 2 === 0) {
        return "#f0f0f0"; // #f0f0f0
      } else {
        return "#6b6b6b"; // #c2c2c2
      }
    }
  }

  getPassButton(item) {
    if (this.getStudentScore(item.id)[0].passed) {
      return (
        <Button
          type="primary"
          size={"small"}
          icon={<CheckOutlined />}
          onClick={this.failStudent.bind(this, item)}
        >
          Passed!
        </Button>
      );
    } else {
      return (
        <Button
          type="primary"
          size={"small"}
          danger
          onClick={this.passStudent.bind(this, item)}
        >
          Pass to {this.getNextRank(item.ranks)}
        </Button>
      );
    }
  }

  render() {
    const { pagination, visible, loading } = this.state;
    const { passed } = this.state;
    const {
      isSavedTest,
      tests,
      selectedItems,
      selectedTestStudent,
      locationItems,
      students,
      testStudents,
      sessions,
      groupOptions,
      needTestSaved,
      studentScoresList,
    } = this.state;
    const filteredOptions = students.filter((o) => !selectedItems.includes(o));

    let go;
    let test = [];
    let defaultPanel;

    if (studentScoresList.length > 0) {
      for (go of groupOptions) {
        defaultPanel = go.rank;
        test.push(
          <Panel
            header={go.rank}
            key={defaultPanel}
            style={{ backgroundColor: this.getGroupColor(go.rank) }}
          >
            <List
              size="small"
              dataSource={go.students}
              renderItem={(item) => (
                <List.Item>
                  {item.firstName} {item.lastName.substring(0, 1)}.
                  <Checkbox
                    onChange={() => {
                      this.onChangePaid(item);
                    }}
                    checked={this.getStudentScore(item.id)[0].paid}
                    style={{ marginLeft: 10 }}
                  >
                    Paid
                  </Checkbox>
                  {this.getPassButton(item)}
                  <Table
                    rowKey={item.id}
                    pagination={false}
                    bordered
                    columns={this.getColumns(item.id)}
                    dataSource={this.getStudentScore(item.id)}
                    size="small"
                    style={{
                      width: "100%",
                    }}
                    scroll={{ x: 400 }}
                  />
                </List.Item>
              )}
            />
          </Panel>
        );
      }
    }

    let finalList = [
      <Collapse defaultActiveKey={[defaultPanel]}>{test}</Collapse>,
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
    if (selectedTestStudent || !needTestSaved) {
      if (passed) {
        studentTestTitle = [
          <Title level={4}>
            <CheckOutlined style={{ color: "green" }} />
            {" " +
              selectedTestStudent.firstName +
              " " +
              selectedTestStudent.lastName +
              " | " +
              selectedTestStudent.ranks}
          </Title>,
        ];
      } else {
        studentTestTitle = [
          <Title level={4}>
            {selectedTestStudent.firstName +
              " " +
              selectedTestStudent.lastName +
              " | " +
              selectedTestStudent.ranks}
          </Title>,
        ];
      }
    }

    var scoreStudentsView = [];
    if (isSavedTest && !needTestSaved) {
      scoreStudentsView = [
        <Divider orientation="left">
          {<Title level={4}>{"Score Students"}</Title>}
        </Divider>,

        finalList,
        <Button
          key="submit"
          htmlType="submit"
          type="primary"
          icon={<SaveOutlined />}
          loading={loading}
          style={{ marginTop: 10 }}
          block={true}
          onClick={this.startSavingStudentTestScores}
        >
          Save All Scores
        </Button>,
      ];
    } else {
      scoreStudentsView = [warningText];
    }

    const renderButton = () => {
      if (isSavedTest) {
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
        style={{
          margin: 10,
        }}
      >
        New Test
      </Button>,

      <Modal
        visible={visible}
        className="test-list-style"
        title={ModalTitle}
        closable={false}
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
            startTime: moment(this.state.test.startTime, "HH:mm a"),
            endTime: moment(this.state.test.endTime, "HH:mm a"),
            date: moment(this.state.date),
            location: this.state.selectedLocation,
            type: this.state.selectedType,
            price: this.state.price,
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
              dropdownClassName="test-list-style"
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
              dropdownClassName="test-list-style"
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
              showNow={false}
              popupClassName="test-list-style"
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
              showNow={false}
              popupClassName="test-list-style"
            />
          </Form.Item>

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
                message: "Please enter the test price.",
              },
            ]}
          >
            <Input
              placeholder="US$"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 1 }}
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
              dropdownClassName="test-list-style"
            >
              {filteredOptions.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.firstName + " " + item.lastName + " | " + item.ranks}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
        {scoreStudentsView}
      </Modal>,

      <Table
        loading={this.state.loading}
        rowKey={tests.id}
        rowClassName={(record, index) => this.getRowColor(record, index)}
        pagination={pagination}
        bordered
        columns={testCols}
        dataSource={tests}
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
        bodyStyle={{ padding: 1 }}
        className="test-list-style"
        bordered={false}
        title={TableTitle}
      >
        {contentList}
      </Card>
    );
  }

  onChange(checkedValues) {
    console.log("checked = ", checkedValues);
  }

  getRowColor(record, index) {
    if (index % 2 === 0) {
      return "table-row-light";
    } else {
      return "table-row-dark";
    }
  }

  onChangePaid = (item) => {
    let studentScore = this.getStudentScore(item.id);
    const newPaid = !studentScore[0].paid;

    this.setState((prevState) => ({
      studentScoresList: prevState.studentScoresList.map((el) =>
        el.studentId === studentScore[0].studentId
          ? { ...el, paid: newPaid }
          : el
      ),
    }));

    studentScore[0].paid = newPaid;
    this.saveStudentScores(studentScore[0]);
  };

  failStudent(student) {
    let rankIndex = ranks.indexOf(student.ranks);
    let newRank;

    if (rankIndex < ranks.length) {
      newRank = ranks[--rankIndex];
    }

    let studentScore = this.getStudentScore(student.id);

    this.setState((prevState) => ({
      studentScoresList: prevState.studentScoresList.map((el) =>
        el.studentId === studentScore[0].studentId
          ? { ...el, passed: false }
          : el
      ),
    }));

    studentScore[0].passed = false;
    studentScore[0].ranks = newRank;
    student.ranks = newRank;

    this.saveStudentScoresAndRank(studentScore[0], student, newRank);
  }

  getNextRank(rank) {
    let rankIndex = ranks.indexOf(rank);
    if (rankIndex < ranks.length) {
      return ranks[++rankIndex];
    } else {
      return "";
    }
  }

  passStudent(student) {
    let rankIndex = ranks.indexOf(student.ranks);
    let newRank;

    if (rankIndex < ranks.length) {
      newRank = ranks[++rankIndex];
    }

    let studentScore = this.getStudentScore(student.id);

    this.setState((prevState) => ({
      studentScoresList: prevState.studentScoresList.map((el) =>
        el.studentId === studentScore[0].studentId
          ? { ...el, passed: true }
          : el
      ),
    }));

    studentScore[0].passed = true;
    studentScore[0].ranks = newRank;
    student.ranks = newRank;

    this.saveStudentScoresAndRank(studentScore[0], student, newRank);
  }

  saveStudentScores(studentScore) {
    saveStudentTestScores(studentScore)
      .then((response) => {})

      .catch((error) => {});
  }

  saveStudentScoresAndRank(studentScore, student, newRank) {
    saveStudentTestScores(studentScore)
      .then((response) => {
        this.updateStudentRank(student, newRank);
      })
      .catch((error) => {});
  }

  updateStudentRank(student, newRank) {
    createStudent(student)
      .then((response) => {
        notification.success({
          message: student.firstName + " Updated.",
          description: student.firstName + " is now " + newRank + ".",
          duration: 2,
        });
      })
      .catch((error) => {});
  }

  saveAllStudentTestScores(student) {
    let studentId = student.id;
    let testId = this.state.testId;

    var studentScores = {
      studentId: studentId,
      testId: testId,
      ranks: student.ranks,
      form: this.state.form,
      steps: this.state.steps,
      power: this.state.power,
      kiap: this.state.kiap,
      questions: this.state.questions,
      attitude: this.state.attitude,
      sparring: this.state.sparring,
      breaking: this.state.breaking,
      passed: this.state.passed,
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
          passed: false,
        });
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

  changeSelectedTestStudent(value) {
    this.setState({ testStudentScoring: [] });
    this.loadStudentTestScores(this.state.testId, value);

    let student = this.state.allStudents.find(function(item) {
      return item.id === value;
    });

    this.setState({ selectedTestStudent: student });
  }

  loadStudentTestScores() {
    const { testId, testStudents } = this.state;

    this.setState({
      isLoading: true,
    });

    var promises = [],
      newStudentScoresList = [];
    this.state.studentScoresList.length = 0;

    let ts, value;
    for (ts of testStudents) {
      let promise = getStudentTestScores(testId, ts.id);
      promises.push(promise);
    }

    Promise.all(promises).then((values) => {
      for (value of values) {
        if (value != "null") {
          newStudentScoresList.push(value);
        }
      }
      this.setState(
        {
          studentScoresList: newStudentScoresList,
          loading: false,
        },
        () => this.createGroups(testStudents)
      );
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
            price: test.price,
            selectedType: test.type,
            loading: false,
            visible: true,
            isSavedTest: true,
            needTestSaved: false,
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
