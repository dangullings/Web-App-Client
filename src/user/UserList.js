import React, { Component } from "react";
import {
  Table,
  Popconfirm,
  Typography,
  message,
  Select,
  notification,
  Form,
  Input,
  Button,
  Card,
  Modal,
} from "antd";
import {
  getAllUsers,
  updateUser,
  removeUser,
  getMyPeeps,
  getAllStudentsByActive,
  createStudentUser,
  removeStudentUserByUserIdAndStudentId,
} from "../util/APIUtils";
import { STUDENT_LIST_SIZE } from "../constants";
import { withRouter } from "react-router-dom";
import "../styles/style.less";
import moment from "moment";

import {
  PlusOutlined,
  DeleteOutlined,
  TeamOutlined,
  SaveOutlined,
  PlusCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { confirm } = Modal;
const { Title } = Typography;

class UserList extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      isSavedUser: false,
      userId: "",
      users: [],
      allStudents: [],
      selectedStudentId: "",
      assignStudents: [],
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
      visible: false,
      count: 0,
      name: "",
      username: "",
      address: "",
      email: "",
      phoneNumber: "",
      enabled: true,
      selectedStudentId: "",

      columns: [
        {
          title: "Name (Username)",
          dataIndex: "name",
          render: (text, row) => text + " (" + row.username + ")",
        },
        {
          title: "Email",
          dataIndex: "email",
        },
      ],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStudentChange = this.handleStudentChange.bind(this);
    this.assignStudent = this.assignStudent.bind(this);

    this.getAllStudentsList();
  }

  getAllStudentsList() {
    let promise;
    promise = getAllStudentsByActive(0, 200, true);

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
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  getMyPeepsList(user) {
    let promise;
    promise = getMyPeeps(user.id); //this.state.currentUser.id
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
            assignStudents: response,
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

  handleDelete = (studentId) => {
    const { userId } = this.state;
    removeStudentUserByUserIdAndStudentId(userId, studentId)
      .then((response) => {
        message.success("Student removed from assignments.");
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

    const { assignStudents } = this.state;

    let assign, student;
    let newAssignList = assignStudents;
    for (assign of assignStudents) {
      if (assign.id == studentId) {
        student = assign;
        newAssignList = assignStudents.filter(function(value) {
          return value.id != studentId;
        });
        break;
      }
    }

    this.setState({
      assignStudents: newAssignList,
      allStudents: this.state.allStudents.concat(student),
      loading: false,
    });
  }

  updateStudentAssignList(studentId) {
    this.setState({
      loading: true,
    });

    var { assignStudents } = this.state;

    var newAssignList = assignStudents.filter(function(value, index, arr) {
      return value.id != studentId;
    });

    this.setState({
      assignStudents: newAssignList,
      loading: false,
    });
  }

  updateAllStudentList() {
    var { allStudents, assignStudents } = this.state;

    var newStudentList = allStudents;
    newStudentList = allStudents.filter(function(value) {
      return checkCondition(value, assignStudents);
    });

    this.setState({
      allStudents: newStudentList,
      loading: false,
    });
  }

  assignStudent() {
    const { userId, selectedStudentId } = this.state;

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
      userId: userId,
      studentId: selectedStudentId,
    };

    createStudentUser(data)
      .then((response) => {
        this.setState(
          {
            loading: false,
            selectedStudentId: "",
            assignStudents: this.state.assignStudents.concat(student),
          },
          () => this.updateAllStudentList()
        );
        notification.success({
          message: "Assign Successful!",
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

  onFill = () => {
    this.formRef.current.setFieldsValue({
      name: this.state.name,
      username: this.state.username,
      email: this.state.email,
      phoneNumber: this.state.phoneNumber,
      address: this.state.address,
    });

    this.setState({
      isSavedUser: true,
      visible: true,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.formRef.current.resetFields();

    this.setState({
      name: "",
      address: "",
      email: "",
      username: "",
      phoneNumber: "",
      visible: false,
      loading: false,
      isSavedUser: false,
      selectedStudentId: "",
      assignStudents: [],
    });
  };

  getUserList() {
    let promise;

    promise = getAllUsers(this.state.current, this.state.pageSize);

    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise.then((response) => {
      this.setState({
        users: response.content,
        //current: response.number,
        pageSize: response.size,
        total: response.totalElements,
        totalPages: response.totalPages,
        loading: false,
      });
    });
  }

  componentDidMount() {
    this.getUserList(this.state.page);
  }

  handleSubmit() {
    let name = this.formRef.current.getFieldValue("name");
    let username = this.formRef.current.getFieldValue("username");
    let email = this.formRef.current.getFieldValue("email");
    let phoneNumber = this.formRef.current.getFieldValue("phoneNumber");
    let address = this.formRef.current.getFieldValue("address");

    this.setState({ loading: true });

    const user = {
      id: this.state.user.id,
      name: name,
      username: username,
      email: email,
      phoneNumber: phoneNumber,
      address: address,
      createdAt: this.state.user.createdAt,
      updatedAt: moment().format("YYY-MM-DD, h:mm a"),
      password: this.state.user.password,
      enabled: this.state.user.enabled,
      role: this.state.user.role,
    };
    updateUser(user)
      .then((response) => {
        message.success("User saved.");
        this.getUserList(this.state.page);
        this.handleCancel();
        this.setState({ loading: false, visible: false });
      })
      .catch((error) => {
        message.error("Error [" + error.message + "]");
      });
  }

  handleStudentChange(value) {
    this.setState({
      selectedStudentId: value,
    });
  }

  clearInput(event) {
    event.target.value = "";
    console.log("clear");
  }

  render() {
    const {
      user,
      users,
      visible,
      loading,
      current,
      total,
      totalPages,
      columns,
      isSavedUser,
      allStudents,
      selectedStudentId,
      assignStudents,
    } = this.state;

    const paginations = {
      current: current,
      pageSize: STUDENT_LIST_SIZE,
      total: total,
      totalPages: totalPages,
    };

    var ModalTitle;
    if (isSavedUser) {
      ModalTitle = <Title level={2}>Edit {user.role}</Title>;
    } else {
      ModalTitle = <Title level={2}>New User</Title>;
    }

    const studentCols = [
      {
        title: "Name",
        dataIndex: "firstName",
        key: "firstName",
        ellipsis: true,
        render: (text, record) => (
          <a
            href={"/students/" + record.id}
            target="_blank"
            rel="noopener noreferrer"
          >
            {text + " " + record.lastName}
          </a>
        ),
      },
      {
        title: "Rank",
        dataIndex: "ranks",
        key: "ranks",
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
            onConfirm={() => this.handleDelete(record.id)}
          >
            <DeleteOutlined style={{ color: "red" }} />
          </Popconfirm>
        ),
      },
    ];

    var myPeepsView = [];
    myPeepsView = [
      <Form.Item
        label={
          <Title style={{ marginBottom: 0, marginTop: 0 }} level={5}>
            {"Assign Student"}
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
          onClick={this.assignStudent}
          disabled={selectedStudentId == ""}
          size={"default"}
          block={true}
          style={{ marginTop: 10 }}
        >
          Assign
        </Button>
      </Form.Item>,
    ];

    const renderButton = () => {
      if (isSavedUser) {
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

    // users should not be creatable, users have to signup themselves. Admin can then edit/assign students to user
    {
      /* <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={this.showModal}
        style={{
          margin: 10,
        }}
      >
        New User
      </Button>, */
    }

    const contentList = [
      <Modal
        className="custom-style"
        visible={visible}
        style={{ top: 0 }}
        title={ModalTitle}
        closable={false}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" type="secondary" onClick={this.handleCancel}>
            Cancel
          </Button>,
          renderButton(),
          <Button
            key="submit"
            type="primary"
            icon={<SaveOutlined />}
            loading={loading}
            onClick={this.handleSubmit}
          >
            Save
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          onFinish={this.handleSubmit}
          ref={this.formRef}
          name="control-ref"
        >
          <Form.Item
            name="name"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                {"Name"}
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter the user's name.",
              },
            ]}
          >
            <Input
              placeholder="Full Name"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 1 }}
            />
          </Form.Item>

          <Form.Item
            name="username"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                {"Username"}
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter the users username.",
              },
            ]}
          >
            <Input
              placeholder="Username"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 1 }}
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
                required: true,
                type: "email",
                message: "Please enter users email.",
              },
            ]}
          >
            <Input
              placeholder="myemail@gmail.com"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 1 }}
            />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                {"Phone Number"}
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter the user's phone number.",
              },
            ]}
          >
            <Input
              placeholder="777-777-7777"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 2 }}
            />
          </Form.Item>

          <Form.Item
            name="address"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                {"Address"}
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter the user's address.",
              },
            ]}
          >
            <Input
              placeholder="1234 Street City State"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 2, maxRows: 4 }}
            />
          </Form.Item>

          {myPeepsView}

          <Form.Item
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                {"Students Assigned"}
              </Title>
            }
          >
            <Table
              loading={loading}
              rowKey={assignStudents.id}
              rowClassName={(record, index) => this.getRowColor(record, index)}
              pagination={false}
              bordered
              columns={studentCols}
              dataSource={assignStudents}
              size="small"
              style={{ width: "100%" }}
              scroll={{ x: 400 }}
            />
          </Form.Item>
        </Form>
      </Modal>,

      <Table
        loading={this.state.loading}
        pagination={paginations}
        rowClassName={(record, index) => this.getRowColor(record, index)}
        rowKey={users.id}
        bordered
        columns={columns}
        dataSource={users}
        size="small"
        scroll={{ y: 400 }}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              this.handleRowClick(record);
            },
          };
        }}
      />,
    ];

    const title = [
      <Title level={3}>
        <div>
          Users <TeamOutlined />
        </div>
      </Title>,
    ];

    return (
      <Card
        className="custom-style"
        bordered={false}
        bodyStyle={{ padding: 1 }}
        title={title}
      >
        {contentList}
      </Card>
    );
  }

  removeUser() {
    const { user } = this.state;
    removeUser(user.id)
      .then((response) => {
        message.success("User deleted.");
        this.handleCancel();
        this.getUserList(this.state.page);
        this.setState({ loading: false, visible: false });
      })
      .catch((error) => {
        message.error("Error [" + error.message + "]");
      });
  }

  showConfirm = () => {
    confirm({
      className: "confirm-custom-style",
      title: "Do you want to remove this user?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      content: "This will erase all records of this user.",
      onOk: () => {
        return this.removeUser();
      },
      onCancel: () => {
        return console.log("");
      },
    });
  };

  handleRowClick(user) {
    this.getMyPeepsList(user);
    this.showUser(user);
  }

  getRowColor(record, index) {
    if (index % 2 === 0) {
      return "table-row-light";
    } else {
      return "table-row-dark";
    }
  }

  showUser(user) {
    this.setState(
      {
        user: user,
        userId: user.id,
        name: user.name,
        address: user.address,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        loading: false,
        isSavedUser: true,
        visible: true,
      },
      this.onFill
    );
  }
}

export default withRouter(UserList);

function checkCondition(student, assignStudents) {
  let se;

  for (se of assignStudents) {
    if (se.id == student.id) {
      return false;
    }
  }

  return true;
}
