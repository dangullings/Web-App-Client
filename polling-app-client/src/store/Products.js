import React, { Component } from "react";
import {
  Table,
  Switch,
  Tag,
  Space,
  Icon,
  notification,
  Input,
  Button,
  Card,
  Row,
  Divider,
} from "antd";
import { getAllItemsByActive } from "../util/APIUtils";
import { STUDENT_LIST_SIZE } from "../constants";
import { withRouter } from "react-router-dom";

import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      productCards: [],
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
    };
  }

  getProducts(page, pageSize) {
    let promise;

    promise = getAllItemsByActive(page, pageSize);

    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise
      .then((response) => {
        this.setState({
          products: response.content,
          //page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last,
          loading: false,
          pagination: {
            showSizeChanger: true,
            pageSizeOptions: ["10", "25", "50", "100"],
            current: response.page,
            pageSize: response.size,
            total: response.totalElements,
          },
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  componentDidMount() {
    this.getProducts(this.state.pagination.current, 1000);

    this.setState({
      productCards: [],
    });
  }

  productCard(product) {
    return (
      <Row style={{ marginBottom: 30 }} key={product.id}>
        <Card
          className="custom-card"
          bordered={true}
          title={product.name}
          key={product.id}
          style={{
            width: "100%",
            borderRadius: "16px",
            marginRight: "8px",
            boxShadow: "2px 3px 8px 2px rgba(208, 216, 243, 0.6)",
          }}
        >
          <Row>Description: {product.description}</Row>
          <Row>$: {product.saleCost}</Row>
          <Divider />
          <Button block={true} size="large" shape="round" type="primary">
            Purchase
          </Button>
        </Card>
      </Row>
    );
  }

  render() {
    const {
      productCards,
      products,
      pagination,
      totalPages,
      search,
    } = this.state;

    products.forEach((product) => {
      productCards.push(this.productCard(product));
    });

    return (
      <Card
        bodyStyle={{ padding: 0 }}
        style={{
          width: "100%",
          borderRadius: 6,
          marginRight: 0,
          boxShadow: "1px 1px 4px 1px rgba(208, 216, 243, 0.6)",
        }}
        title="Merchandise"
      >
        {productCards}
      </Card>
    );
  }

  handleRowClick(item) {
    this.props.history.push(`/items/${item.id}`);
  }
}

const mapStateToProps = (state) => {
  return {
    itemObject: state.item,
  };
};

export default withRouter(Products);
