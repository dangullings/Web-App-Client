import React, { Component } from "react";
import {
  Table,
  Popconfirm,
  Typography,
  message,
  Space,
  List,
  Icon,
  notification,
  Button,
  Card,
  Modal,
} from "antd";
import {
  getOrders,
  getOrderLineItems,
  getOrderUsers,
  removeOrder,
} from "../util/APIUtils";
import { STUDENT_LIST_SIZE } from "../constants";
import { withRouter } from "react-router-dom";
import Order from "./Order";
import "../styles/style.less";

import {
  PlusOutlined,
  DeleteOutlined,
  ShoppingOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

class OrderList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderList: [],
      //orderLineItems: [],
      selectedOrder: "",
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
      loading: false,
      visible: false,
      count: 0,
    };
    this.removeOrder = this.removeOrder.bind(this);
    this.getOrderList = this.getOrderList.bind(this);

    this.getOrderList(0, STUDENT_LIST_SIZE);
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      loading: false,
    });
  };

  getOrderList(page, size) {
    let promise;
    promise = getOrders(page, size);

    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise
      .then((response) => {
        if (response.content === undefined) {
          this.setState({
            loading: false,
          });
          return;
        }
        /* let value;
        for (value of response.content) {
          this.getOrderLineItemList(value);
        } */
        this.setState(
          {
            //orders: response.content,
            page: response.page,
            size: response.size,
            totalElements: response.totalElements,
            totalPages: response.totalPages,
            last: response.last,
          },
          () => this.getOrdersUserList(response.content)
        );
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  getOrdersUserList(orders) {
    let promises = [];
    let order;
    var userList = [];

    for (order of orders) {
      let promise = getOrderUsers(order.id);
      promises.push(promise);
    }

    Promise.all(promises).then((values) => {
      let value;
      for (value of values) {
        userList.push(value[0]);
      }
      this.translateOrderList(orders, userList);
    });
  }

  translateOrderList(orders, users) {
    let order, user;
    let orderList = [];

    for (order of orders) {
      for (user of users) {
        if (order.userId == user.id) {
          const newOrder = {
            id: order.id,
            date: order.date,
            user: user.name,
            price: "$" + order.price,
          };
          orderList.push(newOrder);
          break;
        }
      }
    }

    this.setState({
      orderList: orderList,
      loading: false,
    });
  }

  /* getOrderLineItemList(order) {
    let promise,
      lineItems = [];
    promise = getOrderLineItems(order.id);

    if (!promise) {
      return;
    }

    promise
      .then((response) => {
        let value;
        for (value of response) {
          const lineItem = {
            id: value.id,
            color: value.color,
            size: value.size,
            itemId: value.itemId,
            price: value.price,
            quantity: value.quantity,
          };

          lineItems.push(lineItem);
        }

        const orderData = {
          order: order,
          lineItems: lineItems,
        };

        this.setState({
          orders: this.state.orders.concat(orderData),
          orderLineItems: lineItems,
        });
      })
      .catch((error) => {});
  } */

  componentDidMount() {
    this.getOrderList(this.state.page, this.state.STUDENT_LIST_SIZE);
  }

  removeOrder() {
    const { selectedOrder } = this.state;
    removeOrder(selectedOrder.id)
      .then((response) => {
        message.success("Order deleted.");
        this.handleCancel;
        this.getOrderList(this.state.page, STUDENT_LIST_SIZE);
        this.setState({ loading: false, visible: false });
      })
      .catch((error) => {
        message.error("Error [" + error.message + "]");
      });
  }

  /*   expandedRowRender = (order) => {
    const lineItems = order.lineItems;
    const data = [];
    for (let i = 0; i < lineItems.length; ++i) {
      data.push({
        key: i,
        id: lineItems[i].id,
        itemId: lineItems[i].itemId,
        color: lineItems[i].color,
        size: lineItems[i].size,
        price: lineItems[i].price,
        quantity: lineItems[i].quantity,
      });
    }

    return (
      <List
        size="small"
        header={
          <Text strong style={{ marginLeft: 10 }}>
            Line Items
          </Text>
        }
        bordered
        dataSource={data}
        renderItem={(lineItem) => (
          <List.Item>
            <Text style={{ textShadow: "0px 1px 0px rgba(255,255,255,1.0)" }}>
              {lineItem.itemId} {lineItem.price} | {lineItem.quantity}
            </Text>
          </List.Item>
        )}
      />
    );
  }; */

  render() {
    const {
      orderList,
      visible,
      loading,
      pagination,
      columns,
      selectedOrder,
    } = this.state;

    /* const tableProps = {
      expandedRowRender: (record) => this.expandedRowRender(record),
    }; */

    const orderCols = [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
      },
      {
        title: "User",
        dataIndex: "user",
        key: "user",
      },
      {
        title: "Total",
        dataIndex: "price",
        key: "price",
      },
    ];

    const contentList = [
      <Table
        loading={loading}
        rowKey={orderList.id}
        pagination={pagination}
        bordered
        columns={orderCols}
        dataSource={orderList}
        size="small"
        scroll={{ y: 350 }}
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
        //{...tableProps}
      />,
    ];

    const order = [<Order order={selectedOrder} />];

    const modalTitle = [
      <Title style={{ marginBottom: 0, marginTop: 10 }} level={3}>
        Order #{selectedOrder.id}
      </Title>,
    ];

    const orderModal = [
      <Modal
        className="sessionList"
        visible={visible}
        title={modalTitle}
        closable={false}
        style={{ top: 0 }}
        bodyStyle={{ padding: 8, marginBottom: 20 }}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button
            key="back"
            type="secondary"
            onClick={this.handleCancel}
            style={{
              boxShadow:
                "0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 4px 10px 0 rgba(0, 0, 0, 0.39)",
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            icon={<SaveOutlined />}
            loading={loading}
            onClick={this.handleSubmit}
            style={{
              boxShadow:
                "0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 4px 10px 0 rgba(0, 0, 0, 0.39)",
            }}
          >
            Save
          </Button>,
        ]}
      >
        {order}
      </Modal>,
    ];

    const title = [
      <Title level={3}>
        <div>
          Orders <ShoppingOutlined />
        </div>
      </Title>,
    ];

    return (
      <Card
        className="order-list"
        bordered={false}
        bodyStyle={{ padding: 0 }}
        title={title}
      >
        {contentList}
        {orderModal}
      </Card>
    );
  }

  handleRowClick(order) {
    this.props.history.push(`/orders/${order.id}`);
    //this.showOrder(order);
  }

  showOrder(order) {
    this.setState({
      selectedOrder: order,
      visible: true,
    });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.getOrderList(pagination.current, pagination.pageSize);
    /* this.fetch({
          sortField: sorter.field,
          sortOrder: sorter.order,
          pagination,
          ...filter
        }); */
  };
}

export default withRouter(OrderList);
