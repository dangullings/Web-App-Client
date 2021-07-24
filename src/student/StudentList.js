import React, { Component } from "react";
import moment from "moment";
import {
  Table,
  Typography,
  Divider,
  Select,
  Switch,
  Row,
  Modal,
  Form,
  notification,
  Input,
  Button,
  Card,
} from "antd";
import {
  getAllStudents,
  getAllStudentsBySearch,
  createStudent,
  removeStudent,
  removeUserPeepsByStudentId,
  removeStudentTestsByStudentId,
  removeAttendanceByStudentId,
  removeStudentEventByStudentId,
  removeStudentSessionByStudentId,
} from "../util/APIUtils";
import { getRanks } from "../util/Helpers.js";
import { STUDENT_LIST_SIZE } from "../constants";
import { withRouter } from "react-router-dom";
import "../styles/style.less";

import { SaveOutlined, PlusOutlined } from "@ant-design/icons";

const Option = Select.Option;
const ranks = getRanks();
const { Title, Text } = Typography;
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

const { Search } = Input;

class StudentList extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      showSizeChanger: true,
      current: 1,
      pageSize: STUDENT_LIST_SIZE,
      pageSizeOptions: ["10", "25", "50", "100"],
      total: 0,
      totalPages: 0,

      students: [],
      search: "",

      activeView: true,
      firstName: {
        text: "",
      },
      lastName: {
        text: "",
      },
      email: {
        text: "",
      },
      birthDateMonth: {
        text: "January",
      },
      birthDateDay: {
        text: "",
      },
      birthDateYear: {
        text: "",
      },
      rank: {
        text: "Gold Stripe",
      },
      active: true,
      loading: false,
      visible: false,

      columns: [
        {
          title: "Name",
          dataIndex: "firstName",
          key: "name",
          ellipsis: true,
          render: (text, row) => text + " " + row.lastName,
        },
        {
          title: "Rank",
          dataIndex: "ranks",
          key: "ranks",
          ellipsis: true,
        },
      ],
    };
    this.getStudentList = this.getStudentList.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
    this.handleMonthChange = this.handleMonthChange.bind(this);
    this.handleDayChange = this.handleDayChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleRankChange = this.handleRankChange.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
  }

  getStudentList() {
    if (this.state.search != "") {
      console.log("here" + this.state.search);
      this.getAllStudentsBySearchList(this.state.search);
      return;
    }

    let promise;

    promise = getAllStudents(
      this.state.current,
      this.state.pageSize,
      this.state.activeView
    );

    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise
      .then((response) => {
        this.setState({
          students: response.content,
          loading: false,
          //current: response.number,
          pageSize: response.size,
          total: response.totalElements,
          totalPages: response.totalPages,
        });
        console.log(
          "current" +
            response.number +
            " pageSize" +
            response.size +
            " total" +
            response.totalElements +
            " totalPages" +
            response.totalPages
        );
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  getAllStudentsBySearchList(search) {
    let promise;

    promise = getAllStudentsBySearch(
      this.state.current,
      this.state.pageSize,
      search,
      this.state.activeView
    );

    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise.then((response) => {
      this.setState({
        students: response.content,
        //current: response.number,
        pageSize: response.size,
        total: response.totalElements,
        totalPages: response.totalPages,
        loading: false,
      });
    });
  }

  componentDidMount() {
    this.getStudentList();
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
    this.onReset();
  };

  onReset() {
    console.log("reset forms");
    this.formRef.current.resetFields();
  }

  handleSubmit(event) {
    let firstName = this.formRef.current.getFieldValue("firstName");
    let lastName = this.formRef.current.getFieldValue("lastName");
    let email = this.formRef.current.getFieldValue("email");
    let birthDateYear = this.formRef.current.getFieldValue("year");
    let birthDateMonth = this.formRef.current.getFieldValue("month");
    let birthDateDay = this.formRef.current.getFieldValue("day");
    let ranks = this.formRef.current.getFieldValue("rank");
    let active = this.state.active;

    var d = new Date();
    d.setMonth(birthDateMonth);
    d.setDate(birthDateDay);
    d.setYear(birthDateYear);

    const studentData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      birthDate: d,
      ranks: ranks,
      active: active,
      created: moment().format("YYYY-MM-DD"),
    };

    this.setState({ loading: true });

    createStudent(studentData)
      .then((response) => {
        notification.success({
          message: "Save Successful!",
          description:
            "Student " +
            this.state.firstName.text +
            " " +
            this.state.lastName.text +
            " was saved.",
          duration: 2,
        });
        this.getStudentList(this.state.page);
        this.resetFields();
        this.props.history.push("/students");
        this.setState({ loading: false, visible: false });
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

  removeStudent(id) {
    removeStudent(id)
      .then((response) => {
        notification.success({
          message: "Removal Successful",
          description: "Student removed.",
          duration: 2,
        });
        this.getStudentList(this.state.page);
        this.setState({ loading: false, visible: false });
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

  resetFields() {
    this.formRef.current.resetFields();
    this.setState({
      firstName: {
        text: "",
      },
      lastName: {
        text: "",
      },
      email: {
        text: "",
      },
      birthDateMonth: {
        text: "",
      },
      birthDateDay: {
        text: "",
      },
      birthDateYear: {
        text: "",
      },
      rank: {
        text: "Gold Stripe",
      },
      active: true,
    });
  }

  validateName = (nameText) => {
    if (nameText.length === 0) {
      return {
        validateStatus: "error",
        errorMsg: "Please enter students first name",
      };
    } else if (nameText.length > 40) {
      return {
        validateStatus: "error",
        errorMsg: `Name is too long (Maximum ${40} characters allowed)`,
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

  handleMonthChange(value) {
    value--;
    this.setState({
      birthDateMonth: {
        text: value,
      },
    });
  }

  handleRankChange(value) {
    this.setState({
      rank: {
        text: value,
      },
    });
  }

  handleDayChange(event) {
    const value = event.target.value;
    this.setState({
      birthDateDay: {
        text: value,
        ...this.validateName(value),
      },
    });
  }
  handleYearChange(event) {
    const value = event.target.value;
    this.setState({
      birthDateYear: {
        text: value,
        ...this.validateName(value),
      },
    });
  }

  handleEmailChange(event) {
    const value = event.target.value;
    this.setState({
      email: {
        text: value,
        ...this.validateEmail(value),
      },
    });
  }

  handleFirstNameChange(event) {
    const value = event.target.value;
    this.setState({
      firstName: {
        text: value,
        ...this.validateName(value),
      },
    });
  }

  handleLastNameChange(event) {
    const value = event.target.value;
    this.setState({
      lastName: {
        text: value,
        ...this.validateName(value),
      },
    });
  }

  handleTableChange = (pagination) => {
    const { pageSize, current } = pagination;

    this.setState(
      {
        current: current,
        pageSize: pageSize,
      },
      () => this.fetchNewTableList()
    );
  };

  fetchNewTableList() {
    const { search } = this.state;
    if (search == "") {
      this.getStudentList();
      return;
    }

    this.getAllStudentsBySearchList(search);
  }

  isFormInvalid() {
    if (this.state.firstName.validateStatus !== "success") {
      return true;
    }
  }

  onSearch = (value) => {
    this.setState({
      search: value,
    });

    if (value == "") {
      this.getStudentList();
      return;
    }

    this.getAllStudentsBySearchList(value);
  };

  onChangeSearch = (value) => {
    this.setState({
      search: value.target.value,
    });

    if (value.target.value == "") {
      this.setState({ search: "" }, () => this.getStudentList());
    } else {
      this.getAllStudentsBySearchList(value.target.value);
    }
  };

  render() {
    const { students, columns, visible, loading, current, total, totalPages } =
      this.state;

    const paginations = {
      current: current,
      pageSize: STUDENT_LIST_SIZE,
      total: total,
      totalPages: totalPages,
    };

    console.log(
      "paginations current " +
        paginations.current +
        " total " +
        paginations.total +
        " totalpages " +
        paginations.totalPages
    );

    const title = [<Title level={3}>Students</Title>];
    const newStudentTitle = [<Title level={2}>New Student</Title>];

    const newHeader = [
      <Row style={{ justifyContent: "space-between" }}>
        {title}
        <Divider style={{ height: 35 }} type="vertical" />
        <Search
          size={"small"}
          placeholder="name"
          onSearch={this.onSearch}
          onChange={this.onChangeSearch}
          dropdownClassName="custom-style"
          style={{
            width: 120,
            height: 32,
          }}
        />
        <Text type="secondary" style={{ marginTop: 5, marginLeft: 8 }}>
          Active
        </Text>
        <Switch
          className="custom-style"
          defaultChecked
          style={{
            marginTop: 5,
          }}
          onChange={this.toggleActive}
        ></Switch>
      </Row>,
    ];

    const contentList = [
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={this.showModal}
        shape="round"
        style={{
          margin: 10,
        }}
      >
        New Student
      </Button>,
      <Modal
        className="custom-style"
        visible={visible}
        title={newStudentTitle}
        closable={false}
        style={{ top: 0 }}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" type="secondary" onClick={this.handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
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
          onFinish={this.handleSubmit}
          ref={this.formRef}
          layout="vertical"
          initialValues={{ month: "January", rank: "Gold Stripe" }}
        >
          <Form.Item
            name="firstName"
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
              value={this.state.firstName.text}
              onChange={this.handleFirstNameChange}
            />
          </Form.Item>

          <Form.Item
            name="lastName"
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
              value={this.state.lastName.text}
              onChange={this.handleLastNameChange}
            />
          </Form.Item>

          <Form.Item
            name="email"
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
              value={this.state.email.text}
              onChange={this.handleEmailChange}
            />
          </Form.Item>

          <Divider orientation="left">Birth Date</Divider>

          <Form.Item
            name="month"
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
              dropdownClassName="custom-style"
              onChange={this.handleMonthChange}
              style={{ width: 200 }}
            >
              {children}
            </Select>
          </Form.Item>

          <Form.Item
            className="custom-style"
            name="day"
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
              value={this.state.birthDateDay.text}
              onChange={this.handleDayChange}
            />
          </Form.Item>

          <Form.Item
            className="custom-style"
            name="year"
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
              value={this.state.birthDateYear.text}
              onChange={this.handleYearChange}
            />
          </Form.Item>
          <Divider></Divider>

          <Form.Item
            name="rank"
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
              dropdownClassName="custom-style"
              onChange={this.handleRankChange}
              style={{ width: 200 }}
            >
              {ranks.map((rank) => (
                <Select.Option value={rank}>{rank}</Select.Option>
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
            <Switch defaultChecked onChange={this.toggle} />
          </Form.Item>
        </Form>
      </Modal>,

      <Table
        loading={this.state.loading}
        rowKey={students.id}
        rowClassName={(record, index) => this.getRowColor(record, index)}
        pagination={paginations}
        bordered
        columns={columns}
        dataSource={students}
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
        title={newHeader}
        bodyStyle={{ padding: 1 }}
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

  handleRowClick(student) {
    this.props.history.push(`/students/${student.id}`);
  }

  toggle = () => {
    console.log("switch student active to" + !this.state.active);
    this.setState({
      active: !this.state.active,
    });
  };

  toggleActive = () => {
    console.log("switch---------" + !this.state.activeView);
    this.setState(
      {
        activeView: !this.state.activeView,
        search: "",
      },
      () => this.getStudentList()
    );
  };
}

export default withRouter(StudentList);
