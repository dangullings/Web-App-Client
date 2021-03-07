import React, { Component } from "react";
import { Modal, Form, Button, notification, Input, Card, Switch } from "antd";
import { getLocation, createLocation, removeLocation } from "../util/APIUtils";

import {
  SaveOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { confirm } = Modal;

const FormItem = Form.Item;
const key = "updatable";
const openNotification = () => {
  notification.open({
    key,
    message: "Save Successful!",
    description: "Location info updated.",
  });
  setTimeout(() => {
    notification.open({
      key,
      message: "Location info saved!",
      description: "Location info was saved.",
    });
  }, 1000);
};

class Location extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {
        id: "",
        name: "",
        address: "",
      },
      isSavedLocation: false,
    };

    this.LocationList = this.LocationList.bind(this);
    this.loadLocation = this.loadLocation.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);

    const id = this.props.match.params.id;
    this.loadLocation(id);
  }

  componentDidMount() {}

  loadLocation(id) {
    this.setState({
      isLoading: true,
    });

    getLocation(id)
      .then((response) => {
        this.setState({
          location: response,
          isLoading: false,
        });
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

  removeLocation() {
    removeLocation(this.state.location)
      .then((response) => {
        notification.success({
          message: "Removal Successful",
          description: "Location removed.",
          duration: 2,
        });
        this.props.history.push("/locations");
      })
      .catch((error) => {
        notification.error({
          message: "Unsuccessful",
          description:
            error.message || "Something went wrong. Please try again!",
        });
      });
  }

  updateLocation = (event) => {
    event.preventDefault();

    const location = {
      id: this.state.location.id,
      name: this.state.location.name,
      address: this.state.location.address,
    };
    createLocation(location)
      .then((response) => {
        notification.success({
          message: "Update Successful!",
          description: location.name + " updated.",
          duration: 2,
        });
        this.props.history.push("/locations");
      })
      .catch((error) => {
        notification.error({
          message: "Unsuccessful",
          description:
            error.message || "Something went wrong. Please try again!",
        });
      });
  };

  handleNameChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });

    this.state.location.name = value;
  }

  handleAddressChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });

    this.state.location.address = value;
  }

  LocationList = () => {
    return this.props.history.push("/locations");
  };

  isFormInvalid() {
    return false; //!(this.state.student.name.validateStatus === 'success' );
  }

  render() {
    const { name, address } = this.state.location;

    const buttonLocationLayout = {
      wrapperCol: { span: 10, offset: 6 },
    };

    const contentList = [
      <Form layout="vertical" onSubmit={this.handleSubmit}>
        <FormItem
          label="Name"
          validateStatus={name.validateStatus}
          help={name.errorMsg}
        >
          <Input
            size="large"
            name="name"
            autoComplete="off"
            placeholder="Item Name"
            value={name}
            onChange={(event) =>
              this.handleNameChange(event, this.validateName)
            }
          />
        </FormItem>

        <FormItem
          label="Address"
          validateStatus={address.validateStatus}
          help={address.errorMsg}
        >
          <Input
            size="large"
            name="address"
            autoComplete="off"
            placeholder="Address"
            value={address}
            onChange={(event) =>
              this.handleAddressChange(event, this.validateAddress)
            }
          />
        </FormItem>

        <FormItem>
          <Button
            {...buttonLocationLayout}
            icon={<SaveOutlined />}
            type="primary"
            htmlType="submit"
            size="large"
            onClick={this.updateLocation}
            disabled={this.isFormInvalid()}
          >
            Update Location
          </Button>
        </FormItem>
        <FormItem>
          <Button
            {...buttonLocationLayout}
            icon={<DeleteOutlined />}
            type="primary"
            danger
            size="large"
            onClick={this.showConfirm}
          >
            Remove Location
          </Button>
        </FormItem>
      </Form>,
    ];

    return (
      <Card
        bodyStyle={{ padding: 0 }}
        style={{
          width: "100%",
          textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
          borderRadius: 6,
          marginRight: 0,
          boxShadow: "1px 1px 4px 1px rgba(208, 216, 243, 0.6)",
        }}
        title="Item"
      >
        {contentList}
      </Card>
    );
  }
}

export default Location;
