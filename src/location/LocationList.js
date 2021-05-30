import React, { Component } from "react";
import {
  Table,
  Popconfirm,
  Typography,
  message,
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
  QuestionCircleOutlined,
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
      ],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeLocation = this.removeLocation.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.getLocationList = this.getLocationList.bind(this);
  }

  onFill = () => {
    this.formRef.current.setFieldsValue({
      name: this.state.name,
      address: this.state.address,
    });

    this.setState({
      isSavedLocation: true,
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
      location: "",
      visible: false,
      loading: false,
      isSavedLocation: false,
    });
  };

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

  removeLocation() {
    const { location } = this.state;
    removeLocation(location.id)
      .then((response) => {
        message.success("Location deleted.");
        this.handleCancel;
        this.getLocationList(this.state.page);
        this.setState({ loading: false, visible: false });
      })
      .catch((error) => {
        message.error("Error [" + error.message + "]");
      });
  }

  handleSubmit(event) {
    let name = this.formRef.current.getFieldValue("name");
    let address = this.formRef.current.getFieldValue("address");

    this.setState({ loading: true });

    const location = {
      id: this.state.location.id,
      name: name,
      address: address,
    };
    createLocation(location)
      .then((response) => {
        message.success("Location saved.");
        this.getLocationList(this.state.page);
        this.handleCancel;
        this.setState({ loading: false, visible: false });
      })
      .catch((error) => {
        message.error("Error [" + error.message + "]");
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
    } = this.state;

    var ModalTitle;
    if (isSavedLocation) {
      ModalTitle = <Title level={2}>Edit Location</Title>;
    } else {
      ModalTitle = <Title level={2}>New Location</Title>;
    }

    const renderButton = () => {
      if (isSavedLocation) {
        return (
          <Popconfirm
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            title="Delete location?"
            onConfirm={this.removeLocation}
            okText="Yes"
            cancelText="No"
            overlayClassName="custom-style"
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
          margin: 10,
        }}
      >
        New Location
      </Button>,

      <Modal
        className="custom-style"
        visible={visible}
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
                message: "Please enter the location name.",
              },
            ]}
          >
            <Input
              placeholder="East View Elementary"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 1 }}
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
              autosize={{ minRows: 2, maxRows: 4 }}
              onChange={this.handleAddressChange}
            />
          </Form.Item>
        </Form>
      </Modal>,

      <Table
        loading={this.state.loading}
        rowClassName={(record, index) => this.getRowColor(record, index)}
        rowKey={locations.id}
        bordered
        columns={columns}
        dataSource={locations}
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
          Locations <EnvironmentOutlined />
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

  handleRowClick(location) {
    this.showLocation(location);
  }

  getRowColor(record, index) {
    if (index % 2 === 0) {
      return "table-row-light";
    } else {
      return "table-row-dark";
    }
  }

  showLocation(location) {
    this.setState(
      {
        location: location,
        name: location.name,
        address: location.address,
        loading: false,
        isSavedLocation: true,
        visible: true,
      },
      this.onFill
    );
  }
}

export default withRouter(LocationList);
