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
  getLocation,
  createLocation,
  removeLocation,
} from "../util/APIUtils";
import { STUDENT_LIST_SIZE } from "../constants";
import { withRouter } from "react-router-dom";
import "../styles/style.less";

import {
  PlusOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

class LocationList extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      isSavedLocation: false,
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
      name: "",
      address: "",
      location: "",

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

  onReset() {
    this.formRef.current.resetFields();
  }

  onFill() {
    if (this.formRef.current) {
      this.formRef.current.setFieldsValue({
        name: this.state.name,
        address: this.state.address,
      });
    }

    this.setState({
      isSavedLocation: true,
      visible: true,
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.onReset();
  };

  onReset() {
    this.formRef.current.resetFields();
    this.setState({
      name: "",
      address: "",
      visible: false,
    });
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
        this.onReset;
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
        this.onReset;
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
    const {
      locations,
      visible,
      loading,
      pagination,
      columns,
      isSavedLocation,
      name,
      address,
    } = this.state;

    //this.formRef.current.getFieldDecorator("name", { initialValue: {} });

    var ModalTitle;
    if (isSavedLocation) {
      ModalTitle = <Title level={2}>Edit Location</Title>;
    } else {
      ModalTitle = <Title level={2}>New Location</Title>;
    }

    const renderButton = () => {
      if (isSavedLocation) {
        return (
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            loading={loading}
            onClick={this.removeLocation}
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
          marginBottom: 10,
          marginTop: 10,
          marginLeft: 4,
          marginRight: 10,
        }}
      >
        New Location
      </Button>,

      <Modal
        className="location-list"
        visible={visible}
        title={ModalTitle}
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
          initialValues={{ name: name, address: address }}
          layout="vertical"
          onFinish={this.handleSubmit}
          ref={this.formRef}
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
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                {"Address"}
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter the location address.",
              },
            ]}
          >
            <Input
              placeholder="1234 Street City State"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 2 }}
              value={this.state.address.text}
              onChange={this.handleAddressChange}
            />
          </Form.Item>
        </Form>
      </Modal>,

      <Table
        style={{ padding: 2 }}
        loading={this.state.loading}
        rowKey={locations.id}
        bordered
        columns={columns}
        dataSource={locations}
        size="small"
        scroll={{ y: 300 }}
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

    const title = [
      <Title level={5}>
        <div>
          Locations <EnvironmentOutlined />
        </div>
      </Title>,
    ];

    return (
      <Card
        className="location-list"
        bordered={false}
        bodyStyle={{ padding: 0 }}
        style={{
          width: "100%",
          textShadow: "1px 1px 1px rgba(0,0,0,0.1)",
          borderRadius: 6,
        }}
        title={title}
      >
        {contentList}
      </Card>
    );
  }

  handleRowClick(location) {
    this.showLocation(location);
  }

  showLocation(location) {
    this.setState(
      {
        location: location,
        name: location.name,
        address: location.address,
        loading: false,
      },
      () => this.onFill()
    );
  }

  loadLocation(location) {
    let promise;

    promise = getLocation(location.id);

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
            location: response,
            name: response.name,
            address: response.address,
            loading: false,
          },
          () => this.onFill()
        );
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }
}

export default withRouter(LocationList);
