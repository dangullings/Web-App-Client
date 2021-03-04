import React, { Component } from "react";
import {
  Table,
  Switch,
  Tag,
  Space,
  Icon,
  notification,
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
  Badge,
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

import "./Shop.css";

import Highlighter from "react-highlight-words";
import {
  SearchOutlined,
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
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
    const newCartItemQty = {
      id: product.id,
      quantity: 1,
    };

    this.setState({
      cartItemsQty: [...this.state.cartItemsQty, newCartItemQty],
      cartItems: [...this.state.cartItems, product],
    });
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

  cartItemCard(item) {
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
    const saleCostLabel = [
      <Space size="small">
        <Text type="secondary">Total:</Text>
        <Text strong>${item.saleCost}</Text>
      </Space>,
    ];

    const itemQty = this.getItemQty(item.id);
    return (
      <Row style={{ marginBottom: 15 }}>
        <Col>
          <Card
            hoverable
            key={item.id}
            style={{
              width: "100%",
              borderRadius: "10px",
              boxShadow: "0px 2px 10px 0px rgba(208, 216, 243, 0.6)",
            }}
            headStyle={{ backgroundColor: "#fafafa" }}
            bodyStyle={{ backgroundColor: "#fafafa" }}
            cover={
              <Image
                width={"100%"}
                height={"100%"}
                src={`data:image/jpeg;base64,${this.getProductImage(
                  item.imageId
                )}`}
              />
            }
            actions={[
              <Row style={{ marginLeft: 10, marginRight: 0 }}>
                {colorLabel}
                {sizeLabel}
              </Row>,
              <Row style={{ marginLeft: 5, marginRight: 5 }}>
                <Button onClick={() => this.reduceItemQty(item.id)}>
                  <MinusOutlined />
                </Button>
                Qty: {itemQty},
                <Button onClick={() => this.increaseItemQty(item.id)}>
                  <PlusOutlined />
                </Button>
              </Row>,
              <Row style={{ marginLeft: 10, marginRight: 10 }}>
                {saleCostLabel}
              </Row>,
            ]}
          >
            <Meta title={item.name} description={item.description} />
          </Card>
        </Col>
      </Row>
    );
  }

  productCard(product) {
    const saleCostLabel = [
      <Title style={{ marginLeft: 50 }} level={3}>
        ${product.saleCost}
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
              boxShadow: "0px 2px 10px 0px rgba(208, 216, 243, 0.6)",
            }}
            headStyle={{ backgroundColor: "#fafafa" }}
            bodyStyle={{ backgroundColor: "#fafafa" }}
            cover={
              <Image
                width={"99.5%"}
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
                    boxShadow: "0px 1px 4px rgba(0,0,0,0.2)",
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
                    boxShadow: "0px 1px 4px rgba(0,0,0,0.2)",
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
                    boxShadow: "0px 1px 5px rgba(0,0,0,0.2)",
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

  render() {
    const {
      products,
      pagination,
      totalPages,
      search,
      windowWidth,
      cartItems,
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

    const ModalTitle = <Title level={2}>Cart</Title>;
    const cartView = [
      <Modal
        visible={cartVisible}
        title={ModalTitle}
        style={{ top: 0 }}
        bodyStyle={{ padding: 4, marginBottom: 20 }}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button
            key="back"
            onClick={this.handleCancel}
            style={{
              boxShadow: "0px 0px 5px rgba(0,0,0,0.2)",
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
              boxShadow: "0px 0px 5px rgba(0,0,0,0.2)",
            }}
          >
            Purchase
          </Button>,
        ]}
      >
        {cartCards}
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
            boxShadow: "0px 1px 4px rgba(0,0,0,0.2)",
          }}
        />
        <Select
          align="center"
          style={{
            marginLeft: 8,
            width: 120,
            height: 32,
            boxShadow: "0px 1px 4px rgba(0,0,0,0.2)",
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
        bordered={false}
        headStyle={{ padding: 6, marginBottom: 0 }}
        bodyStyle={{ padding: 6 }}
        title={newHeader}
      >
        <Spin spinning={loading}>
          {productCards}
          <Affix
            offsetTop={10}
            style={{ position: "absolute", top: 0, left: windowWidth - 80 }}
          >
            <Badge count={cartItems.length} offset={[-10, 15]}>
              <Button
                style={{ boxShadow: "1px 1px 1px rgba(0,0,0,0.5)" }}
                shape="round"
                size={"large"}
                onClick={this.showModal}
                icon={
                  <ShoppingCartOutlined
                    offset={[-30, -10]}
                    style={{ fontSize: "30px" }}
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
