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
  Row,
  Col,
  Divider,
  Button,
} from "antd";
import {
  getItem,
  getUser,
  getOrder,
  getOrderLineItems,
} from "../util/APIUtils";

import { LeftOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const { confirm } = Modal;

const FormItem = Form.Item;

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: "",
      lineItems: [],
      items: [],
      user: "",
    };

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
      console.log("line item " + lineItem.id);
      let promise = getItem(lineItem.itemId);
      promises.push(promise);
    }

    Promise.all(promises).then((values) => {
      let value;
      for (value of values) {
        if (value != "null") {
          newItems.push(value);
          console.log("value id " + value.id);
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

  render() {
    const { order, lineItems, user, items } = this.state;

    const back = [
      <Link to={"/orders"}>
        {
          <Button
            style={{ marginTop: 10, marginBottom: 0 }}
            type="text"
            icon={<LeftOutlined />}
          ></Button>
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

    return (
      <div className="order">
        {back}
        <div>{businessContent}</div>
        <div>{userContent}</div>
        <div>{orderDate}</div>
        <div>{content}</div>
        <div className="total-price">
          Total: ${this.getPriceFormatted(order.price)}
        </div>
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
          {item.size} {item.color} {item.description}
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
