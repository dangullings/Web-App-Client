import React, { Component } from "react";
import {
  Table,
  Popconfirm,
  Typography,
  Tag,
  Space,
  Icon,
  notification,
  Form,
  Input,
  Button,
  Card,
  Modal,
} from "antd";
import {
  getAllLocations,
  createLocation,
  removeLocation,
} from "../util/APIUtils";
import { STUDENT_LIST_SIZE } from "../constants";
import { withRouter } from "react-router-dom";
import "./LocationList.css";

import {
  PlusOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
};

class LocationList extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      locations: [],
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
      name: {
        text: "",
      },
      address: {
        text: "",
      },

      columns: [
        {
          title: "Name",
          dataIndex: "name",
        },
        {
          title: "Address",
          dataIndex: "address",
        },
        {
          title: <DeleteOutlined />,
          dataIndex: "operation",
          width: "10%",
          render: (text, record) =>
            this.state.locations.length >= 1 ? (
              <Popconfirm
                title={"Sure to delete " + record.name + "?"}
                onConfirm={() => this.removeLocation(record.id)}
              >
                <a>{<DeleteOutlined />}</a>
              </Popconfirm>
            ) : null,
        },
      ],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeLocation = this.removeLocation.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.getLocationList = this.getLocationList.bind(this);
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

  getLocationList(page) {
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
          locations: response.content,
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

  componentDidMount() {
    this.getLocationList(this.state.page);
  }

  removeLocation(id) {
    removeLocation(id)
      .then((response) => {
        notification.success({
          message: "Removal Successful",
          description: "Location removed.",
          duration: 2,
        });
        this.getLocationList(this.state.page);
      })
      .catch((error) => {
        notification.error({
          message: "Unsuccessful",
          description:
            error.message || "Something went wrong. Please try again!",
        });
      });
  }

  handleSubmit(event) {
    let name = this.formRef.current.getFieldValue("name");
    let address = this.formRef.current.getFieldValue("address");

    this.setState({ loading: true });

    const location = {
      name: name,
      address: address,
    };
    createLocation(location)
      .then((response) => {
        this.getLocationList(this.state.page);
        this.resetFields();
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

  resetFields() {
    this.formRef.current.resetFields();
    this.setState({
      name: {
        text: "",
      },
      address: {
        text: "",
      },
    });
  }

  handleNameChange(event) {
    const value = event.target.value;
    this.setState({
      name: value,
    });
  }

  handleAddressChange(event) {
    const value = event.target.value;
    this.setState({
      address: value,
    });
  }

  clearInput(event) {
    event.target.value = "";
    console.log("clear");
  }

  render() {
    const { locations, visible, loading, pagination, columns } = this.state;

    const ModalTitle = <Title level={2}>New Location</Title>;

    const contentList = [
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={this.showModal}
        size={"default"}
        style={{
          marginBottom: 10,
          marginTop: 10,
          marginLeft: 2,
          marginRight: 10,
        }}
      >
        New Location
      </Button>,

      <Form {...layout} onFinish={this.handleSubmit} ref={this.formRef}>
        <Modal
          visible={visible}
          title={ModalTitle}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={this.handleSubmit}
            >
              Submit
            </Button>,
          ]}
        >
          <Form.Item
            name="name"
            label={<Title level={5}>{"Name"}</Title>}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter the location name.",
              },
            ]}
          >
            <Input
              placeholder="East View Elementary"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 1 }}
              value={this.state.name.text}
              onChange={this.handleNameChange}
            />
          </Form.Item>

          <Form.Item
            name="address"
            label={<Title level={5}>{"Address"}</Title>}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter the location address.",
              },
            ]}
          >
            <Input
              placeholder="1234 Grand Ave Buffalo Mn"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 1 }}
              value={this.state.address.text}
              onChange={this.handleAddressChange}
            />
          </Form.Item>
        </Modal>
      </Form>,

      <Table
        style={{ padding: 2 }}
        loading={this.state.loading}
        rowKey={locations.id}
        bordered
        columns={columns}
        dataSource={locations}
        size="small"
        scroll={{ y: 300 }}
      />,
    ];

    const title = [
      <Title level={5}>
        <div>
          Locations <EnvironmentOutlined />
        </div>
      </Title>,
    ];

    return (
      <Card
        bodyStyle={{ padding: 0 }}
        style={{
          width: "100%",
          textShadow: "1px 1px 1px rgba(0,0,0,0.1)",
          borderRadius: 6,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
        title={title}
      >
        {contentList}
      </Card>
    );
  }
}

export default withRouter(LocationList);
