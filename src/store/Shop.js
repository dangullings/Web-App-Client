import React, { Component } from "react";
import {
  Table,
  Switch,
  message,
  Space,
  Icon,
  notification,
  List,
  Badge,
  Typography,
  Input,
  Button,
  Card,
  Col,
  Row,
  Select,
  Divider,
  Affix,
  Spin,
  Modal,
  Image,
} from "antd";
import {
  getAllItemsByActive,
  getImageByItem,
  getAllItemsByActiveSearch,
} from "../util/APIUtils";
import { STUDENT_LIST_SIZE } from "../constants";
import { withRouter } from "react-router-dom";

import "../styles/style.less";

import Highlighter from "react-highlight-words";
import {
  SearchOutlined,
  EditOutlined,
  EllipsisOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  DollarCircleOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const Option = Select.Option;
const children = [
  <Option key={"All"}>All</Option>,
  <Option key={"Clothing"}>Clothing</Option>,
  <Option key={"Drinkware"}>Drinkware</Option>,
  <Option key={"Training Gear"}>Training Gear</Option>,
  <Option key={"Arts and Crafts"}>Arts and Crafts</Option>,
];

const { Search } = Input;
const { Title, Text } = Typography;
const { Meta } = Card;

const handleResize = (e) => {
  this.setState({ windowWidth: window.innerWidth });
};

class Shop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      productCards: [],
      cartItems: [],
      cartItemsQty: [],
      productImages: [],
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
      cartVisible: false,
      loading: false,

      windowWidth: window.innerWidth,
    };

    this.addToCart = this.addToCart.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  getProducts() {
    const { page, pageSize } = this.state;
    let promise;

    promise = getAllItemsByActive(page, pageSize);

    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise.then((response) => {
      this.setState(
        {
          products: response.content,
          //page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last,
          pagination: {
            showSizeChanger: true,
            pageSizeOptions: ["10", "25", "50", "100"],
            current: response.page,
            pageSize: response.size,
            total: response.totalElements,
          },
        },
        () => this.getProductImages()
      );
    });
  }

  getProductImages() {
    const { products } = this.state;

    var value,
      promises = [],
      imageList = [];

    let product;
    for (product of products) {
      let promise = getImageByItem(product.imageId);
      promises.push(promise);
    }

    let con;
    Promise.all(promises).then((values) => {
      for (value of values) {
        console.log("value " + value.name);
        imageList.push(value);
        //for (con of value.content) {
        //  imageList.push(con);
        //}
      }
      this.setState({
        productImages: imageList,
        loading: false,
      });
    });

    let newProducts = [];
    for (product of this.state.products) {
      const newProduct = {
        id: product.id,
        name: product.name,
        type: product.type,
        saleCost: product.saleCost,
        description: product.description,
        imageId: product.imageId,
        colors: product.colors,
        sizes: product.sizes,
        size: "",
        color: "",
      };
      newProducts.push(newProduct);
    }

    this.setState({
      products: newProducts,
    });
  }

  componentDidMount() {
    this.getProducts();

    this.setState({
      productCards: [],
    });

    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnMount() {
    window.addEventListener("resize", this.handleResize);
  }

  showModal = () => {
    this.setState({
      cartVisible: true,
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, cartVisible: false });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({ cartVisible: false });
  };

  addToCart(product) {
    const { cartItems } = this.state;

    let item;
    let cartItemIds = [];
    for (item of cartItems) {
      cartItemIds.push(item.id);
    }

    var newId = Math.floor(Math.random() * 1000);
    while (cartItemIds.includes(newId)) {
      newId = Math.floor(Math.random() * 1000);
    }

    const newCartItemQty = {
      id: newId,
      quantity: 1,
    };

    const newCartItem = {
      id: newId,
      product: product,
    };

    this.setState({
      cartItemsQty: [...this.state.cartItemsQty, newCartItemQty],
      cartItems: [...this.state.cartItems, newCartItem],
    });

    message.success("Item added to cart.");
  }

  isFormInvalid() {
    return false;
  }

  handlePurchase() {}

  reduceItemQty(itemId) {
    const { cartItemsQty } = this.state;

    let item,
      qty,
      index = 0;
    for (item of cartItemsQty) {
      if (item.id == itemId) {
        qty = item.quantity;
        break;
      }
      index++;
    }

    if (qty == 0) {
      return;
    } else {
      qty--;
    }

    const newCartItemQty = {
      id: itemId,
      quantity: qty,
    };

    var newCartItemsQty = [...cartItemsQty];
    newCartItemsQty[index] = newCartItemQty;
    this.setState({ cartItemsQty: [...newCartItemsQty] });
  }

  increaseItemQty(itemId) {
    const { cartItemsQty } = this.state;

    let item,
      qty,
      index = 0;
    for (item of cartItemsQty) {
      if (item.id == itemId) {
        qty = item.quantity;
        break;
      }
      index++;
    }

    if (qty >= 100) {
      return;
    } else {
      qty++;
    }

    const newCartItemQty = {
      id: itemId,
      quantity: qty,
    };

    var newCartItemsQty = [...cartItemsQty];
    newCartItemsQty[index] = newCartItemQty;
    this.setState({ cartItemsQty: [...newCartItemsQty] });
  }

  getItemQty(itemId) {
    const { cartItemsQty } = this.state;

    let item;
    for (item of cartItemsQty) {
      if (item.id == itemId) {
        return item.quantity;
      }
    }
  }

  getProductImage(id) {
    const { productImages } = this.state;
    let img;
    for (img of productImages) {
      if (img.id == id) {
        return img.photo;
      }
    }
  }

  onSearch = (value) => {
    if (value == "") {
      this.getProducts();
      return;
    }

    this.getProductsBySearch(value);
  };

  handleTypeDropdownChange = (value) => {
    console.log("drop value " + value);
    if (value == "All") {
      this.getProducts();
      return;
    }
    this.getProductsBySearch(value);
  };

  getProductsBySearch(search) {
    let promise;

    promise = getAllItemsByActiveSearch(
      this.state.page,
      this.state.pageSize,
      search
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
          products: response.content,
          //page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last,
          pagination: {
            showSizeChanger: true,
            pageSizeOptions: ["10", "25", "50", "100"],
            current: response.page,
            pageSize: response.size,
            total: response.totalElements,
          },
        },
        () => this.getProductImages()
      );
    });
  }

  changeSelectedColor = (tags) => (value) => {
    let i,
      ii = 0;
    for (i of this.state.products) {
      if (i.id == tags.id) {
        break;
      }
      ii++;
    }

    let products = [...this.state.products];
    let product = { ...products[ii] };
    product.color = value;
    products[ii] = product;
    this.setState({ products });
  };

  changeSelectedSize = (tags) => (value) => {
    let i,
      ii = 0;
    for (i of this.state.products) {
      if (i.id == tags.id) {
        break;
      }
      ii++;
    }

    let products = [...this.state.products];
    let product = { ...products[ii] };
    product.size = value;
    products[ii] = product;
    this.setState({ products });
  };

  removeCartItem(itemId) {
    const { cartItems } = this.state;

    let newCartItems = cartItems;
    newCartItems = newCartItems.filter(function (obj) {
      return obj.id !== itemId;
    });

    this.setState({ cartItems: newCartItems });

    message.success("Item removed from cart.");
  }

  cartItemCard(product) {
    const item = product.product;
    const itemId = product.id;
    const colorLabel = [
      <Space size="small">
        <Text type="secondary">Color:</Text>
        <Text strong> {item.color}</Text>
      </Space>,
    ];
    const sizeLabel = [
      <Space size="small">
        <Text type="secondary">Size:</Text>
        <Text strong>{item.size}</Text>
      </Space>,
    ];
    let num = item.saleCost * this.getItemQty(itemId);
    let totalItemCost = (Math.round(num * 100) / 100).toFixed(2);
    const saleCostLabel = [
      <Space size="small">
        <Text type="secondary"></Text>
        <Text strong>${totalItemCost}</Text>
      </Space>,
    ];
    const itemQty = [
      <Space size="small">
        <Text type="secondary">Qty:</Text>
        <Text strong>{this.getItemQty(itemId)}</Text>
      </Space>,
    ];

    return (
      <Row style={{ marginTop: 20, width: "100%" }}>
        <Card
          hoverable
          key={itemId}
          style={{
            width: "100%",
            borderRadius: "10px",
            boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.39)",
          }}
          headStyle={{ backgroundColor: "#fafafa" }}
          bodyStyle={{ backgroundColor: "#fafafa" }}
          cover={
            <Image
              width={"100%"}
              height={"100%"}
              style={{ left: -1 }}
              src={`data:image/jpeg;base64,${this.getProductImage(
                item.imageId
              )}`}
            />
          }
          actions={[
            <Row style={{ width: "33%", marginLeft: 8, marginTop: -8 }}>
              {colorLabel}
              {sizeLabel}
            </Row>,

            <Row
              justify="space-around"
              style={{ width: "100%", marginTop: -14 }}
            >
              <Col style={{ width: "100%" }}>{itemQty}</Col>
              <Col>
                <Button
                  style={{ marginRight: 35 }}
                  size="small"
                  onClick={() => this.reduceItemQty(itemId)}
                  style={{
                    boxShadow:
                      "0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 3px 6px 0 rgba(0, 0, 0, 0.39)",
                  }}
                >
                  <MinusOutlined />
                </Button>
              </Col>
              <Col>
                <Button
                  size="small"
                  onClick={() => this.increaseItemQty(itemId)}
                  style={{
                    boxShadow:
                      "0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 3px 6px 0 rgba(0, 0, 0, 0.39)",
                  }}
                >
                  <PlusOutlined />
                </Button>
              </Col>
              <Col style={{ width: "100%", marginTop: 5 }}>
                <Button
                  size="small"
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => this.removeCartItem(itemId)}
                  style={{
                    boxShadow:
                      "0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 3px 6px 0 rgba(0, 0, 0, 0.39)",
                  }}
                >
                  Remove
                </Button>
              </Col>
            </Row>,

            <Row
              align="bottom"
              style={{
                marginLeft: 16,
                marginTop: 10,
              }}
            >
              {saleCostLabel}
            </Row>,
          ]}
        >
          <Meta title={item.name} description={item.description} />
        </Card>
      </Row>
    );
  }

  productCard(product) {
    let saleCost = (Math.round(product.saleCost * 100) / 100).toFixed(2);

    const saleCostLabel = [
      <Title style={{ marginLeft: 50 }} level={3}>
        ${saleCost}
      </Title>,
    ];

    let productColors = product.colors.split(",");
    let productSizes = product.sizes.split(",");

    return (
      <Row style={{ marginBottom: 15 }}>
        <Col>
          <Card
            hoverable
            key={product.id}
            style={{
              width: "100%",
              borderRadius: "10px",
              boxShadow:
                "0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.39)",
            }}
            headStyle={{ backgroundColor: "#fafafa" }}
            bodyStyle={{ backgroundColor: "#fafafa" }}
            cover={
              <Image
                style={{ left: -1 }}
                width={"100%"}
                height={"100%"}
                src={`data:image/jpeg;base64,${this.getProductImage(
                  product.imageId
                )}`}
              />
            }
            actions={[
              <Row style={{ padding: 8 }}>
                <Select
                  align="center"
                  style={{
                    width: "100%",
                    marginLeft: 0,
                    boxShadow:
                      "0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 4px 10px 0 rgba(0, 0, 0, 0.39)",
                  }}
                  placeholder="Colors"
                  onChange={this.changeSelectedColor(product)}
                  //Key={eventDates.index}
                >
                  {productColors.map((color) => (
                    <Select.Option value={color} key={color}>
                      {color}
                    </Select.Option>
                  ))}
                </Select>
                <Select
                  align="center"
                  style={{
                    width: "100%",
                    marginLeft: 0,
                    boxShadow:
                      "0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 4px 10px 0 rgba(0, 0, 0, 0.39)",
                  }}
                  placeholder="Sizes"
                  onChange={this.changeSelectedSize(product)}
                  //Key={eventDates.index}
                >
                  {productSizes.map((size) => (
                    <Select.Option value={size} key={size}>
                      {size}
                    </Select.Option>
                  ))}
                </Select>
              </Row>,
              <Row style={{ marginLeft: 0 }}>
                {saleCostLabel}
                <Button
                  size="default"
                  shape="round"
                  type="primary"
                  onClick={() => this.addToCart(product)}
                  style={{
                    marginLeft: 10,
                    marginRight: 10,
                    width: "100%",
                    borderRadius: "10px",
                    boxShadow:
                      "0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 4px 10px 0 rgba(0, 0, 0, 0.39)",
                  }}
                >
                  Add to Cart
                </Button>
              </Row>,
            ]}
          >
            <Meta title={product.name} description={product.description} />
          </Card>
        </Col>
      </Row>
    );
  }

  getTotalCartCost() {
    const { cartItems, cartItemsQty } = this.state;

    var item, itemQty;
    var totalCost = 0;
    for (item of cartItems) {
      for (itemQty of cartItemsQty) {
        if (itemQty.id == item.id) {
          totalCost += itemQty.quantity * item.product.saleCost;
          break;
        }
      }
    }

    return "$" + (Math.round(totalCost * 100) / 100).toFixed(2);
  }

  render() {
    const {
      products,
      pagination,
      totalPages,
      search,
      windowWidth,
      cartItems,
      cartItemsQty,
      loading,
      cartVisible,
    } = this.state;

    var productCards = [];
    if (products) {
      products.forEach((product) => {
        productCards.push(this.productCard(product));
      });
    }

    var cartCards = [];
    if (cartItems) {
      cartItems.forEach((item) => {
        cartCards.push(this.cartItemCard(item));
      });
    }

    let totalCartCost = this.getTotalCartCost();

    const totals = [
      <Row align="end" style={{ marginTop: 35, marginRight: 20 }}>
        <Space size="small">
          <Title level={4}>Cart Total:</Title>
          <Title type="success" level={3}>
            {totalCartCost}
          </Title>
        </Space>
      </Row>,
    ];

    const ModalTitle = <Title level={2}>Cart</Title>;
    const cartView = [
      <Modal
        className="shop"
        visible={cartVisible}
        title={ModalTitle}
        style={{ top: 0 }}
        bodyStyle={{ padding: 4, marginBottom: 20 }}
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
            icon={<DollarCircleOutlined />}
            disabled={this.isFormInvalid()}
            loading={loading}
            onClick={this.handlePurchase}
            style={{
              boxShadow:
                "0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 4px 10px 0 rgba(0, 0, 0, 0.39)",
            }}
          >
            Purchase
          </Button>,
        ]}
      >
        {cartCards}
        {totals}
      </Modal>,
    ];

    const title = [<Title level={3}>Store</Title>];

    const newHeader = [
      <Row>
        {title}
        <Divider style={{ height: 35, marginLeft: 10 }} type="vertical" />
        <Search
          size={"small"}
          placeholder="search"
          onSearch={this.onSearch}
          style={{
            marginLeft: 8,
            width: 120,
            height: 32,
            boxShadow:
              "0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 4px 10px 0 rgba(0, 0, 0, 0.39)",
          }}
        />
        <Select
          align="center"
          style={{
            marginLeft: 8,
            width: 120,
            height: 32,
            boxShadow:
              "0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 4px 10px 0 rgba(0, 0, 0, 0.39)",
          }}
          placeholder={"type"}
          onChange={this.handleTypeDropdownChange}
        >
          {children}
        </Select>
      </Row>,
    ];
    return (
      <Card
        className="shop"
        bordered={false}
        headStyle={{ padding: 6, marginBottom: 8 }}
        bodyStyle={{ padding: 6 }}
        title={newHeader}
      >
        <Spin spinning={loading}>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 6,
              xxl: 3,
            }}
            dataSource={productCards}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
          ,
          <Affix
            offsetTop={10}
            style={{ position: "absolute", top: 0, left: windowWidth - 80 }}
          >
            <Badge count={cartItems.length} offset={[-10, 15]}>
              <Button
                style={{
                  boxShadow:
                    "0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 4px 10px 0 rgba(0, 0, 0, 0.39)",
                }}
                shape="round"
                size={"large"}
                onClick={this.showModal}
                icon={
                  <ShoppingCartOutlined
                    offset={[-30, -10]}
                    style={{ fontSize: "50px", marginLeft: -16 }}
                  />
                }
              ></Button>
            </Badge>
          </Affix>
          {cartView}
        </Spin>
      </Card>
    );
  }
}

export default withRouter(Shop);
