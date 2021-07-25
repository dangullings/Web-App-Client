import React, { Component } from "react";
import {
  Table,
  Typography,
  message,
  Row,
  Divider,
  Input,
  Switch,
  Button,
  Card,
  Modal,
  Alert,
} from "antd";
import {
  getOrderUsers,
  removeOrder,
  getAllOrdersBySearch,
  getAllOrdersByFulfilled,
} from "../util/APIUtils";
import { STUDENT_LIST_SIZE } from "../constants";
import { withRouter } from "react-router-dom";
import Order from "./Order";
import "../styles/style.less";

import { ShoppingOutlined, SaveOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Search } = Input;

class OrderList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderList: [],
      selectedOrder: "",
      search: "",
      searchText: "",
      searchedColumn: "",
      loading: false,
      visible: false,
      count: 0,

      showSizeChanger: true,
      current: 1,
      pageSize: STUDENT_LIST_SIZE,
      pageSizeOptions: ["10", "25", "50", "100"],
      total: 0,
      totalPages: 0,

      search: "",

      fulfilledView: false,

      orderCols: [
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
          align: "right",
        },
        {
          title: "Fulfilled",
          dataIndex: "isFulfilled",
          key: "isFulfilled",
          render: (text, record) => this.getFulfillRender(record.isFulfilled),
        },
      ],
    };

    this.removeOrder = this.removeOrder.bind(this);
    this.getOrderList = this.getOrderList.bind(this);

    this.getOrderList();
  }

  getFulfillRender(fulfilled) {
    if (fulfilled) {
      return <Alert message="YES" type="success" />;
    } else {
      return <Alert message="NO" type="warning" />;
    }
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

  getAllOrdersBySearchList(search) {
    let promise;

    promise = getAllOrdersBySearch(
      this.state.current,
      this.state.pageSize,
      search,
      this.state.fulfilledView
    );

    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise.then((response) => {
      this.setState(
        {
          pageSize: response.size,
          total: response.totalElements,
          totalPages: response.totalPages,
        },
        () => this.getOrdersUserList(response.content)
      );
    });
  }

  getOrderList() {
    let promise;

    this.setState({
      loading: true,
    });

    promise = getAllOrdersByFulfilled(
      this.state.current,
      this.state.pageSize,
      this.state.fulfilledView
    );

    if (!promise) {
      return;
    }

    promise
      .then((response) => {
        if (response.content === undefined) {
          this.setState({
            loading: false,
          });
          return;
        }

        this.setState(
          {
            pageSize: response.size,
            total: response.totalElements,
            totalPages: response.totalPages,
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
        if (user == null) {
          const newOrder = {
            id: order.id,
            date: order.date,
            user: "no record",
            price: "$" + order.price,
            isFulfilled: order.isFulfilled,
          };
          orderList.push(newOrder);
          break;
        }
        if (order.userId == user.id) {
          const newOrder = {
            id: order.id,
            date: order.date,
            user: user.name,
            price: "$" + order.price,
            isFulfilled: order.isFulfilled,
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
      this.getOrderList();
      return;
    }

    this.getAllOrdersBySearchList(search);
  }

  onSearch = (value) => {
    this.setState({
      search: value,
    });

    if (value == "") {
      this.getOrderList();
      return;
    }

    this.getAllOrdersBySearchList(value);
  };

  onChangeSearch = (value) => {
    this.setState({
      search: value.target.value,
    });

    if (value.target.value == "") {
      this.setState({ search: "" }, () => this.getOrderList());
    } else {
      this.getAllOrdersBySearchList(value.target.value);
    }
  };

  render() {
    const {
      orderList,
      visible,
      loading,
      current,
      total,
      totalPages,
      selectedOrder,
      orderCols,
    } = this.state;

    const paginations = {
      current: current,
      pageSize: STUDENT_LIST_SIZE,
      total: total,
      totalPages: totalPages,
    };

    const title = [
      <Title level={3}>
        <div>
          Orders <ShoppingOutlined />
        </div>
      </Title>,
    ];

    const newHeader = [
      <Row style={{ justifyContent: "space-between" }}>
        {title}
        <Divider style={{ height: 35 }} type="vertical" />
        <Search
          size={"small"}
          placeholder="search note"
          onSearch={this.onSearch}
          onChange={this.onChangeSearch}
          dropdownClassName="custom-style"
          style={{
            width: 100,
            height: 32,
          }}
        />
        <Text type="secondary" style={{ marginTop: 5 }}>
          Fulfilled
        </Text>
        <Switch
          dropdownClassName="custom-style"
          style={{
            marginTop: 5,
            marginLeft: 0,
          }}
          onChange={this.toggleActive}
        ></Switch>
      </Row>,
    ];

    const contentList = [
      <Table
        loading={loading}
        rowKey={orderList.id}
        rowClassName={(record, index) => this.getRowColor(record, index)}
        pagination={paginations}
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
        className="custom-style"
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

    return (
      <Card
        className="custom-style"
        bordered={false}
        bodyStyle={{ padding: 1 }}
        title={newHeader}
      >
        {contentList}
        {orderModal}
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

  handleRowClick(order) {
    this.props.history.push(`/orders/${order.id}`);
  }

  showOrder(order) {
    this.setState({
      selectedOrder: order,
      visible: true,
    });
  }

  toggleActive = () => {
    this.setState(
      {
        fulfilledView: !this.state.fulfilledView,
        search: "",
      },
      () => this.getOrderList()
    );
  };
}

export default withRouter(OrderList);
