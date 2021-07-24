import React, { Component } from "react";
import "../styles/components/Order.css";
import "../styles/style.less";
import moment from "moment";
import { Link, withRouter } from "react-router-dom";
import {
  Typography,
  Modal,
  Form,
  Card,
  List,
  Alert,
  Input,
  Button,
  message,
} from "antd";
import {
  getItem,
  getUser,
  getOrder,
  getOrderLineItems,
  removeLineItemByOrderId,
  createOrder,
  removeOrder,
} from "../util/APIUtils";

import {
  UnorderedListOutlined,
  SaveOutlined,
  ExclamationCircleOutlined,
  LikeOutlined,
  DislikeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

const { confirm } = Modal;

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: "",
      lineItems: [],
      items: [],
      user: "",
      note: "",
      fulfillAlertVisible: false,
      noteAlertVisible: false,
    };

    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.fulfillOrderChange = this.fulfillOrderChange.bind(this);
    this.saveNote = this.saveNote.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);

    const id = this.props.match.params.id;
    this.getOrder(id);
  }

  getOrder(id) {
    let promise;
    promise = getOrder(id);

    if (!promise) {
      return;
    }

    promise
      .then((response) => {
        this.setState(
          {
            order: response,
            note: response.note,
          },
          () => this.getLineItems(response)
        );
      })
      .catch((error) => {});
  }

  getLineItems(order) {
    let promise,
      lineItems = [];
    promise = getOrderLineItems(order.id);

    if (!promise) {
      return;
    }

    promise
      .then((response) => {
        console.log("response " + response);
        let value;
        for (value of response) {
          console.log("value " + value);
          lineItems.push(value);
        }

        this.setState(
          {
            lineItems: lineItems,
          },
          () => this.getItems(order, lineItems)
        );
      })
      .catch((error) => {});
  }

  getItems(order, lineItems) {
    let promises = [];
    let newItems = [];
    let lineItem;
    for (lineItem of lineItems) {
      let promise = getItem(lineItem.itemId);
      promises.push(promise);
    }

    Promise.all(promises).then((values) => {
      let value;
      for (value of values) {
        if (value != "null") {
          newItems.push(value);
        }
      }
      this.setState(
        {
          items: newItems,
        },
        () => this.getUser(order.userId)
      );
    });
  }

  getUser(id) {
    let promise;
    promise = getUser(id);

    if (!promise) {
      return;
    }

    promise
      .then((response) => {
        this.setState({
          user: response,
          loading: false,
        });
      })
      .catch((error) => {});
  }

  formatPhoneNumber(phoneNumber) {
    return (
      "(" +
      phoneNumber.substring(0, 3) +
      ")" +
      phoneNumber.substring(3, 6) +
      "-" +
      phoneNumber.substring(6, 11)
    );
  }

  saveNote() {
    this.setState(
      (prevState) => ({
        order: {
          ...prevState.order,
          note: this.state.note,
        },
      }),
      () => this.saveOrder()
    );

    this.setState({
      noteAlertVisible: true,
    });
    setTimeout(
      function () {
        this.setState({ noteAlertVisible: false });
      }.bind(this),
      3000
    );
  }

  handleNoteChange(event) {
    const value = event.target.value;
    this.setState({
      note: value,
    });
  }

  fulfillOrderChange() {
    this.setState(
      (prevState) => ({
        order: {
          ...prevState.order,
          isFulfilled: !prevState.order.isFulfilled,
        },
      }),
      () => this.saveOrder()
    );

    this.setState({
      fulfillAlertVisible: true,
    });
    setTimeout(
      function () {
        this.setState({ fulfillAlertVisible: false });
      }.bind(this),
      3000
    );
  }

  showConfirm = () => {
    confirm({
      className: "confirm-custom-style",
      title: "Do you want to remove this order?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      content: "This will erase all records of this order.",
      onOk: () => {
        return this.deleteOrder();
      },
      onCancel: () => {
        return console.log("");
      },
    });
  };

  deleteOrder() {
    const { order } = this.state;

    removeOrder(order.id)
      .then((response) => {
        message.success("Order deleted.");
        this.props.history.push(`/orders/`);
      })
      .catch((error) => {
        message.error("Error [" + error.message + "]");
      });

    removeLineItemByOrderId(order.id)
      .then((response) => {})
      .catch((error) => {
        message.error("Error [" + error.message + "]");
      });
  }

  saveOrder() {
    const { order } = this.state;

    this.setState({
      loading: true,
    });

    createOrder(order)
      .then((response) => {
        this.setState({
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  render() {
    const {
      order,
      lineItems,
      user,
      items,
      fulfillAlertVisible,
      noteAlertVisible,
      note,
    } = this.state;

    var fulFillAlert = [];
    var fulfillBtn = [];

    if (order.isFulfilled) {
      if (fulfillAlertVisible) {
        fulFillAlert = [
          <Alert
            message="Order fulfilled"
            type="success"
            style={{ marginTop: 5 }}
          />,
        ];
      }
      fulfillBtn = [
        <Button
          key="submit"
          type="primary"
          block={true}
          icon={<DislikeOutlined />}
          onClick={this.fulfillOrderChange}
          style={{ marginTop: 5 }}
        >
          Unfulfill Order
        </Button>,
      ];
    } else {
      if (fulfillAlertVisible) {
        fulFillAlert = [
          <Alert
            message="Order unfulfilled"
            type="warning"
            style={{ marginTop: 5 }}
          />,
        ];
      }
      fulfillBtn = [
        <Button
          key="submit"
          type="primary"
          block={true}
          icon={<LikeOutlined />}
          onClick={this.fulfillOrderChange}
          style={{ marginTop: 5 }}
        >
          Fulfill Order
        </Button>,
      ];
    }

    const fulfill = [fulfillBtn];

    var noteAlert = [];
    const saveNoteBtn = [
      <Button
        key="submit"
        type="primary"
        block={true}
        icon={<SaveOutlined />}
        onClick={this.saveNote}
        style={{ marginTop: 3, marginBottom: 10 }}
      >
        Save Note
      </Button>,
    ];

    const deleteOrderBtn = [
      <Button
        type="primary"
        block={true}
        style={{ marginTop: 15 }}
        danger
        icon={<DeleteOutlined />}
        onClick={this.showConfirm}
      >
        Delete
      </Button>,
    ];

    if (noteAlertVisible) {
      noteAlert = [
        <Alert message="Note saved" type="success" style={{ marginTop: 5 }} />,
      ];
    }

    const back = [
      <Link to={"/orders"}>
        {
          <Button
            style={{ marginTop: 15 }}
            type="secondary"
            block={true}
            icon={<UnorderedListOutlined />}
          >
            Order List
          </Button>
        }
      </Link>,
    ];

    const title = [
      <div className="list-title">
        <div>Summary</div>
        <div>Price USD</div>
      </div>,
    ];

    const businessContent = [
      <div className="info business">
        <div className="info business-header">Some Company</div>
        <div>787 Brunswick, Minneapolis, Mn 55313</div>
        <div>support@some-company.com</div>
        <div>(432)432-5434</div>
      </div>,
    ];

    const userContent = [
      <div className="info user">
        <div className="info user-header">{user.name}</div>
        <div>{user.address}</div>
        <div>{user.email}</div>
        <div>{this.formatPhoneNumber(String(user.phoneNumber))}</div>
      </div>,
    ];

    const date = moment(order.date).format("Do MMMM, YYYY");
    const orderDate = <div className="info order-date">{date}</div>;

    let lineItemsList = [];
    let item, lineItem;

    for (lineItem of lineItems) {
      for (item of items) {
        if (lineItem.itemId == item.id) {
          lineItemsList.push({
            key: item.id,
            id: lineItem.id,
            name: item.name,
            description: item.description,
            saleCost: item.saleCost,
            price: lineItem.price,
            itemPrice: item.saleCost,
            color: lineItem.color,
            size: lineItem.size,
            quantity: lineItem.quantity,
          });
          break;
        }
      }
    }

    const lineItemList = [
      <List
        size="small"
        itemLayout="horizontal"
        dataSource={lineItemsList}
        renderItem={(item) => this.getListItem(item)}
      />,
    ];

    const content = [
      <Card
        className="order-list"
        bordered={false}
        bodyStyle={{ padding: 0 }}
        title={title}
      >
        {lineItemList}
      </Card>,
    ];

    const noteTextArea = [
      <TextArea
        placeholder="note"
        style={{ fontSize: "16px", marginTop: 0 }}
        maxLength={200}
        value={note}
        onChange={this.handleNoteChange}
      />,
    ];

    return (
      <div className="order">
        <div>{businessContent}</div>
        <div>{userContent}</div>
        <div>{orderDate}</div>
        <div>{content}</div>
        <div className="total-price">
          Total: ${this.getPriceFormatted(order.price)}
        </div>
        <div>{noteTextArea}</div>
        {noteAlert}
        <div>{saveNoteBtn}</div>

        {fulFillAlert}
        <div>{fulfill}</div>
        <div>{deleteOrderBtn}</div>
        <div>{back}</div>
      </div>
    );
  }

  getListItem(item) {
    const listItem = [
      <div className="list-item-container">
        <div className="list-item name">{item.name}</div>
        <div className="list-item detail">
          ${item.itemPrice} x {item.quantity}
        </div>
        <div className="list-item desc">
          {item.size} {item.color} {item.gender}
        </div>
        <div className="list-item price">
          ${this.getPriceFormatted(item.price)}
        </div>
      </div>,
    ];

    return <List.Item style={{ padding: 0 }}>{listItem}</List.Item>;
  }

  getPriceFormatted(price) {
    return (Math.round(price * 100) / 100).toFixed(2);
  }
}

export default withRouter(Order);
