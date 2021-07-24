import React, { Component } from "react";
import "../styles/style.less";
import moment from "moment";
import { Link, withRouter } from "react-router-dom";
import { getRanks } from "../util/Helpers.js";
import {
  Typography,
  Modal,
  Table,
  Row,
  Form,
  Button,
  notification,
  Input,
  Card,
  Switch,
  Divider,
  Select,
  Tabs,
} from "antd";
import {
  getStudent,
  createStudent,
  removeStudent,
  getTest,
  getAllTestScoresByStudentId,
  removeUserPeepsByStudentId,
  removeStudentTestsByStudentId,
  removeAttendanceByStudentId,
  removeStudentEventByStudentId,
  removeStudentSessionByStudentId,
} from "../util/APIUtils";
import { NAME_MIN_LENGTH, NAME_MAX_LENGTH } from "../constants";

import {
  SaveOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;
const Option = Select.Option;
const rankList = getRanks();
const { Title } = Typography;
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

const { confirm } = Modal;

const key = "updatable";
const openNotification = () => {
  notification.open({
    key,
    message: "Save Successful!",
    description: "Student info updated.",
  });
  setTimeout(() => {
    notification.open({
      key,
      message: "Student info saved!",
      description: "Student info was saved.",
    });
  }, 1000);
};

class Student extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,
      student: {
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        birthDate: "",
        ranks: "",
        active: false,
        key: "Bios",
      },
      firstNameText: "",
      lastNameText: "",
      emailText: "",
      ranksText: "",
      activeText: false,
      birthDateMonth: "January",
      birthDateDay: "",
      birthDateYear: "",
      tests: [],
      testScores: [],
      testData: [],
      loading: false,
    };

    this.studentList = this.studentList.bind(this);
    this.loadStudentTests = this.loadStudentTests.bind(this);
    this.loadStudent = this.loadStudent.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
    this.handleMonthChange = this.handleMonthChange.bind(this);
    this.handleDayChange = this.handleDayChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleRankChange = this.handleRankChange.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    const id = this.props.match.params.id;
    this.loadStudent(id);
  }

  handleResize = (e) => {
    this.setState({ windowWidth: window.innerWidth });

    console.log("resize" + window.innerWidth);
  };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnMount() {
    window.addEventListener("resize", this.handleResize);
  }

  onTabChange = (key) => {
    console.log(key);
    this.setState({ key: key });
  };

  loadStudent(id) {
    getStudent(id)
      .then((response) => {
        this.setState(
          {
            student: response,
          },
          () => this.loadStudentTestScores(id)
        );
      })
      .catch((error) => {
        console.log("fail");
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

  loadStudentTestScores(studentId) {
    const dateParts = this.state.student.birthDate.split("-");
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    const monthName = moment.months(month - 1);

    this.setState({
      birthDateDay: day,
      birthDateMonth: monthName,
      birthDateYear: year,
      firstNameText: this.state.student.firstName,
      lastNameText: this.state.student.lastName,
      emailText: this.state.student.email,
      ranksText: this.state.student.ranks,
      activeText: this.state.student.active,
    });

    getAllTestScoresByStudentId(this.state.page, this.state.size, studentId)
      .then((response) => {
        this.setState(
          {
            testScores: response.content,
          },
          () => this.loadStudentTests()
        );
      })
      .catch((error) => {
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

  loadStudentTests() {
    var testScores = this.state.testScores;
    var value,
      promises = [],
      testResults = [];
    this.state.tests.length = 0;

    var score;
    for (score of testScores) {
      let promise = getTest(score.testId);
      promises.push(promise);
    }

    Promise.all(promises).then((values) => {
      for (value of values) {
        if (value != "null") {
          testResults.push(value);
        }
      }
      this.setState(
        {
          tests: this.state.tests.concat(testResults),
        },
        () => this.createTestData()
      );
    });
  }

  createTestData() {
    const { student, tests, testScores } = this.state;
    this.state.testData.length = 0;
    var datas = [];

    var test, score, i;
    for (test of tests) {
      for (score of testScores) {
        if (score.testId == test.id) {
          i++;
          datas.push({
            key: i,
            date: test.date,
            location: test.location,
            ranks: score.ranks,
            form: score.form,
            power: score.power,
            steps: score.steps,
            kiap: score.kiap,
            questions: score.questions,
            sparring: score.sparring,
            breaking: score.breaking,
            attitude: score.attitude,
          });
        }
      }
    }

    this.setState(
      {
        testData: this.state.testData.concat(datas),
      },
      () => this.onTabChange("Bios", "key")
    );
  }

  handleSubmit(event) {
    this.setState({ loading: true });

    console.log("birth month " + this.state.birthDateMonth);

    var monthNum = -1;
    if (this.state.birthDateMonth == "January") {
      monthNum = 0;
    } else if (this.state.birthDateMonth == "February") {
      monthNum = 1;
    } else if (this.state.birthDateMonth == "March") {
      monthNum = 2;
    } else if (this.state.birthDateMonth == "April") {
      monthNum = 3;
    } else if (this.state.birthDateMonth == "May") {
      monthNum = 4;
    } else if (this.state.birthDateMonth == "June") {
      monthNum = 5;
    } else if (this.state.birthDateMonth == "July") {
      monthNum = 6;
    } else if (this.state.birthDateMonth == "August") {
      monthNum = 7;
    } else if (this.state.birthDateMonth == "September") {
      monthNum = 8;
    } else if (this.state.birthDateMonth == "October") {
      monthNum = 9;
    } else if (this.state.birthDateMonth == "November") {
      monthNum = 10;
    } else if (this.state.birthDateMonth == "December") {
      monthNum = 11;
    }

    if (monthNum > -1) {
      var d = new Date(
        this.state.birthDateYear,
        monthNum,
        this.state.birthDateDay
      );
    } else {
      var d = new Date(
        this.state.birthDateYear,
        this.state.birthDateMonth,
        this.state.birthDateDay
      );
    }

    const studentData = {
      id: this.state.student.id,
      firstName: this.state.firstNameText,
      lastName: this.state.lastNameText,
      email: this.state.emailText,
      birthDate: d,
      ranks: this.state.ranksText,
      active: this.state.activeText,
      joined: this.state.student.joined,
    };

    createStudent(studentData)
      .then((response) => {
        notification.success({
          message: "Update Successful!",
          description:
            "Student " +
            this.state.firstNameText +
            " " +
            this.state.lastNameText +
            " was updated.",
          duration: 2,
        });
        this.setState({ loading: false });
        this.props.history.push(`/students/`);
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

  handleMonthChange(value) {
    value--;
    this.setState({
      birthDateMonth: value,
    });
  }

  handleRankChange(value) {
    this.setState({
      ranksText: value,
    });
  }

  handleDayChange(event) {
    const value = event.target.value;
    this.setState({
      birthDateDay: value,
    });
  }
  handleYearChange(event) {
    const value = event.target.value;
    this.setState({
      birthDateYear: value,
    });
  }

  handleEmailChange(event) {
    const value = event.target.value;
    this.setState({
      emailText: value,
      ...this.validateEmail(value),
    });
  }

  handleFirstNameChange(event) {
    const value = event.target.value;
    this.setState({
      firstNameText: value,
      ...this.validateName(value),
    });
  }

  handleLastNameChange(event) {
    const value = event.target.value;
    this.setState({
      lastNameText: value,
      ...this.validateName(value),
    });
  }

  isFormInvalid() {}

  render() {
    const { firstName, lastName, email, ranks, active } = this.state.student;
    const { firstNameText, lastNameText, emailText, activeText } = this.state;
    const {
      testData,
      size,
      birthDateDay,
      birthDateYear,
      birthDateMonth,
      loading,
    } = this.state;

    var testCols = [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        width: 50,
      },
      {
        title: "Rank",
        dataIndex: "ranks",
        key: "ranks",
        width: 50,
        ellipsis: true,
      },
      {
        title: "Scores",
        children: [
          {
            title: "Form",
            dataIndex: "form",
            key: "form",
            align: "right",
            width: 40,
            ellipsis: true,
          },
          {
            title: "Steps",
            dataIndex: "steps",
            key: "steps",
            align: "right",
            width: 40,
            ellipsis: true,
          },
          {
            title: "Power",
            dataIndex: "power",
            align: "right",
            key: "power",
            width: 40,
            ellipsis: true,
          },
          {
            title: "Kiap",
            dataIndex: "kiap",
            align: "right",
            key: "kiap",
            width: 40,
            ellipsis: true,
          },
          {
            title: "Questions",
            dataIndex: "questions",
            align: "right",
            key: "questions",
            width: 40,
            ellipsis: true,
          },
          {
            title: "Attitude",
            dataIndex: "attitude",
            align: "right",
            key: "attitude",
            width: 40,
            ellipsis: true,
          },
          {
            title: "Sparring",
            dataIndex: "sparring",
            align: "right",
            key: "sparring",
            width: 40,
            ellipsis: true,
          },
          {
            title: "Breaking",
            dataIndex: "breaking",
            align: "right",
            key: "breaking",
            width: 40,
            ellipsis: true,
          },
        ],
      },
    ];

    const contentBios = [
      <Form
        layout="vertical"
        initialValues={{
          firstName: firstName,
          lastName: lastName,
          email: email,
          ranks: ranks,
          active: active,
          birthDateDay: birthDateDay,
          birthDateMonth: birthDateMonth,
          birthDateYear: birthDateYear,
        }}
      >
        <Form.Item
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
            value={firstNameText}
            onChange={this.handleFirstNameChange}
          />
        </Form.Item>

        <Form.Item
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
            value={lastNameText}
            onChange={this.handleLastNameChange}
          />
        </Form.Item>

        <Form.Item
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
            value={emailText}
            onChange={this.handleEmailChange}
          />
        </Form.Item>

        <Divider orientation="left">Birth Date</Divider>

        <Form.Item
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
          <Select
            size={size}
            onChange={this.handleMonthChange}
            style={{ width: 200 }}
            value={birthDateMonth}
          >
            {children}
          </Select>
        </Form.Item>

        <Form.Item
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
            value={birthDateDay}
            onChange={this.handleDayChange}
          />
        </Form.Item>

        <Form.Item
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
            value={birthDateYear}
            onChange={this.handleYearChange}
          />
        </Form.Item>
        <Divider></Divider>

        <Form.Item
          label={
            <Title style={{ marginBottom: 0 }} level={5}>
              {"Rank"}
            </Title>
          }
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please select student rank.",
            },
          ]}
        >
          <Select
            size={size}
            onChange={this.handleRankChange}
            style={{ width: 200 }}
            value={ranks}
          >
            {rankList.map((rank) => (
              <Select.Option key={rank} value={rank}>
                {rank}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={
            <Title style={{ marginBottom: 0 }} level={5}>
              {"Active"}
            </Title>
          }
        >
          <Switch checked={activeText} onChange={this.toggle} />
        </Form.Item>

        <Divider />

        <Row
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <Form.Item
            style={{
              marginBottom: 15,
            }}
          >
            <Link to={"/students"}>
              {
                <Button
                  type="secondary"
                  block={true}
                  icon={<UnorderedListOutlined />}
                >
                  Student List
                </Button>
              }
            </Link>
          </Form.Item>

          <Form.Item
            style={{
              marginBottom: 15,
            }}
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={this.showConfirm}
            >
              Delete
            </Button>
          </Form.Item>
          <Form.Item
            style={{
              marginBottom: 15,
            }}
          >
            <Button
              type="primary"
              icon={<SaveOutlined />}
              disabled={this.isFormInvalid()}
              loading={loading}
              onClick={this.handleSubmit}
              disabled={this.isFormInvalid()}
            >
              Save
            </Button>
          </Form.Item>
        </Row>
      </Form>,
    ];

    const contentTests = [
      <Table
        rowKey={key}
        rowClassName={(record, index) => this.getRowColor(record, index)}
        pagination={true}
        bordered
        columns={testCols}
        dataSource={testData}
        size="small"
        style={{ marginTop: 2, width: "100%", height: "100%" }}
        scroll={{ x: 800 }}
      />,
    ];

    const title = [
      <Title style={{ marginBottom: 0, marginTop: 10 }} level={3}>
        {firstName + " " + lastName}
      </Title>,
    ];

    return (
      <Card
        headStyle={{ borderBottom: 0 }}
        className="custom-style"
        bordered={false}
        bodyStyle={{ padding: 15 }}
        title={title}
      >
        <Tabs defaultActiveKey="Bios" onChange={this.onTabChange}>
          <TabPane tab="Bios" key="Bios">
            {contentBios}
          </TabPane>
          <TabPane tab="Tests" key="Tests">
            {contentTests}
          </TabPane>
        </Tabs>
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

  removeStudent() {
    const { id } = this.state.student;
    removeStudent(id)
      .then((response) => {
        notification.success({
          message: "Removal Successful",
          description: "Student removed.",
          duration: 2,
        });
        this.props.history.push("/students");
      })
      .catch((error) => {
        notification.error({
          message: "Unsuccessful",
          description:
            error.message || "Something went wrong. Please try again!",
        });
      });

    removeStudentTestsByStudentId(id);
    removeUserPeepsByStudentId(id);
    removeAttendanceByStudentId(id);
    removeStudentEventByStudentId(id);
    removeStudentSessionByStudentId(id);
  }

  validateName = (name) => {
    if (name.length < NAME_MIN_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`,
      };
    } else if (name.length > NAME_MAX_LENGTH) {
      return {
        validationStatus: "error",
        errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`,
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

  isFormInvalid() {
    return false; //!(this.state.student.name.validateStatus === 'success' );
  }

  studentList = () => {
    return this.props.history.push("/students");
  };

  showConfirm = () => {
    confirm({
      className: "confirm-custom-style",
      title: "Do you want to remove this student?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      content: "This will erase all records of this student.",
      onOk: () => {
        return this.removeStudent();
      },
      onCancel: () => {
        return console.log("");
      },
    });
  };

  toggle = () => {
    console.log("switch to" + !this.state.activeText);
    this.setState({
      activeText: !this.state.activeText,
    });
  };
}

const tabList = [
  {
    key: "Bios",
    tab: <Title level={4}>{"Bios"}</Title>,
  },
  {
    key: "Tests",
    tab: <Title level={4}>{"Tests"}</Title>,
  },
];

export default withRouter(Student);
