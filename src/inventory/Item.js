import React, { Component } from "react";
import { Modal, Form, Button, notification, Input, Card, Switch } from "antd";
import { getItem, createItem, removeItem } from "../util/APIUtils";

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
    description: "Item info updated.",
  });
  setTimeout(() => {
    notification.open({
      key,
      message: "Item info saved!",
      description: "Item info was saved.",
    });
  }, 1000);
};

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {
        id: "",
        name: "",
        produceCost: "",
        saleCost: "",
        description: "",
        active: "",
      },
    };

    this.itemList = this.itemList.bind(this);
    this.loadItem = this.loadItem.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleProduceCostChange = this.handleProduceCostChange.bind(this);
    this.handleSaleCostChange = this.handleSaleCostChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);

    const id = this.props.match.params.id;
    this.loadItem(id);
  }

  componentDidMount() {}

  loadItem(id) {
    this.setState({
      isLoading: true,
    });

    getItem(id)
      .then((response) => {
        this.setState({
          item: response,
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

  removeItem() {
    removeItem(this.state.item)
      .then((response) => {
        notification.success({
          message: "Removal Successful",
          description: "Item removed.",
          duration: 2,
        });
        this.props.history.push("/items");
      })
      .catch((error) => {
        notification.error({
          message: "Unsuccessful",
          description:
            error.message || "Something went wrong. Please try again!",
        });
      });
  }

  updateItem = (event) => {
    event.preventDefault();

    const item = {
      id: this.state.item.id,
      name: this.state.item.name,
      produceCost: this.state.item.produceCost,
      saleCost: this.state.item.saleCost,
      description: this.state.item.description,
    };
    createItem(item)
      .then((response) => {
        notification.success({
          message: "Update Successful!",
          description: item.name + " updated.",
          duration: 2,
        });
        this.props.history.push("/items");
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

    this.state.item.name = value;
  }

  handleProduceCostChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });

    this.state.item.produceCost = value;
  }

  handleSaleCostChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });

    this.state.item.saleCost = value;
  }

  handleDescriptionChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });

    this.state.item.description = value;
  }

  itemList = () => {
    return this.props.history.push("/items");
  };

  showConfirm = () => {
    confirm({
      title: "Do you want to remove this item?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      cancelText: "No",
      content: "This will erase all records of this item.",
      onOk: () => {
        return this.removeItem();
      },
      onCancel: () => {
        return console.log("item " + this.state.item.name);
      },
    });
  };

  toggle = () => {
    console.log("switch to" + !this.state.active);
    this.setState({
      active: !this.state.active,
    });
  };

  isFormInvalid() {
    return false; //!(this.state.student.name.validateStatus === 'success' );
  }

  render() {
    const {
      name,
      produceCost,
      saleCost,
      description,
      active,
    } = this.state.item;

    const layout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 12,
      },
    };

    const buttonItemLayout = {
      wrapperCol: { span: 10, offset: 6 },
    };

    const contentList = [
      <Form onSubmit={this.handleSubmit} className="student-form" {...layout}>
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
          label="Produce Cost"
          validateStatus={produceCost.validateStatus}
          help={produceCost.errorMsg}
        >
          <Input
            size="large"
            name="produceCost"
            autoComplete="off"
            placeholder="Produce Cost"
            value={produceCost}
            onChange={(event) =>
              this.handleProduceCostChange(event, this.validateProduceCost)
            }
          />
        </FormItem>

        <FormItem
          label="Sale Cost"
          validateStatus={saleCost.validateStatus}
          help={saleCost.errorMsg}
        >
          <Input
            size="large"
            name="saleCost"
            autoComplete="off"
            placeholder="Sale Cost"
            value={saleCost}
            onChange={(event) =>
              this.handleSaleCostChange(event, this.validateSaleCost)
            }
          />
        </FormItem>

        <FormItem
          label="Description"
          validateStatus={description.validateStatus}
          help={description.errorMsg}
        >
          <Input
            size="large"
            name="description"
            autoComplete="off"
            placeholder="Description"
            value={description}
            onChange={(event) =>
              this.handleDescriptionChange(event, this.validateDescription)
            }
          />
        </FormItem>

        <FormItem label="Product">
          <Switch checked={active} onChange={this.toggle} />
        </FormItem>

        <FormItem>
          <Button
            {...buttonItemLayout}
            icon={<SaveOutlined />}
            type="primary"
            htmlType="submit"
            //block={true}
            shape="round"
            size="large"
            onClick={this.updateItem}
            disabled={this.isFormInvalid()}
          >
            Update Item
          </Button>
        </FormItem>
        <FormItem>
          <Button
            {...buttonItemLayout}
            icon={<DeleteOutlined />}
            type="primary"
            danger
            size="large"
            //block={true}
            shape="round"
            onClick={this.showConfirm}
          >
            Remove Item
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

export default Item;
