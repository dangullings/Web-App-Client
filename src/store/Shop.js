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
  createOrder,
  createLineItem,
} from "../util/APIUtils";
import moment from "moment";
import { STUDENT_LIST_SIZE } from "../constants";
import { withRouter } from "react-router-dom";

import StripeContainer from "../stripe/StripeContainer";

import "../styles/style.less";
import "../styles/components/Shop.less";
import "../styles/components/Shop.css";

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
  TagsFilled,
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
      currentUser: this.props.currentUser,
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
      orderId: "",
      cartVisible: false,
      loading: false,
      selectedProduct: "",
      productDetailVisible: false,

      screenWidth: window.screen.width,
    };

    this.addToCart = this.addToCart.bind(this);
    this.handlePurchase = this.handlePurchase.bind(this);
    this.onSearch = this.onSearch.bind(this);

    this.getProducts();

    window.addEventListener("resize", this.handleResize);
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

    Promise.all(promises).then((values) => {
      for (value of values) {
        imageList.push(value);
        //for (con of value.content) {
        //  imageList.push(con);
        //}
      }
      this.setState(
        {
          productImages: imageList,
        },
        () => this.startCreateProducts(products)
      );
    });
  }

  startCreateProducts(products) {
    let newProducts = [];
    let product;
    for (product of products) {
      const newProduct = {
        id: product.id,
        name: product.name,
        type: product.type,
        saleCost: product.saleCost,
        description: product.description,
        imageId: product.imageId,
        genders: product.genders,
        colors: product.colors,
        sizes: product.sizes,
        size: "",
        color: "",
        gender: "",
      };
      newProducts.push(newProduct);
    }

    this.setState(
      {
        products: newProducts,
      },
      () => this.setProductCards(newProducts)
    );
  }

  setProductCards(products) {
    var newProductCards = [];
    products.forEach((product) => {
      newProductCards.push(this.productCard(product));
    });

    this.setState({
      productCards: newProductCards,
      loading: false,
    });
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
      this.setState({
        loading: false,
        cartVisible: false,
        productDetailVisible: false,
      });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({
      cartVisible: false,
      productDetailVisible: false,
      selectedProduct: "",
    });
  };

  addToCart(product) {
    const { cartItems, products } = this.state;

    let i, newProduct;
    for (i of products) {
      if (product.id == i.id) {
        newProduct = {
          id: product.id,
          name: product.name,
          type: product.type,
          saleCost: product.saleCost,
          description: product.description,
          imageId: product.imageId,
          genders: product.genders,
          colors: product.colors,
          sizes: product.sizes,
          size: i.size,
          color: i.color,
          gender: i.gender,
        };
        break;
      }
    }

    product = newProduct;

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
      productDetailVisible: false,
    });

    message.success("Item added to cart.");
  }

  isFormInvalid() {
    return false;
  }

  saveOrder() {
    const { total } = this.state;

    let totalPrice = this.getTotalCartCost();
    let note = "order note";

    const order = {
      id: "",
      date: moment().format("YYYY-MM-DD"),
      note: note,
      isFullfilled: false,
      isPaid: false,
      price: totalPrice,
      userId: this.state.currentUser.id,
    };

    createOrder(order)
      .then((response) => {
        this.setState(
          {
            orderId: response.id,
          },
          () => this.saveLineItems()
        );
      })
      .catch((error) => {});
  }

  saveLineItems() {
    const { cartItems, cartItemsQty, orderId } = this.state;

    let lineItems = [];
    let qty,
      id = 0;
    let item, itemQty;

    for (item of cartItems) {
      for (itemQty of cartItemsQty) {
        if (itemQty.id == item.id) {
          qty = itemQty.quantity;
          break;
        }
      }

      let num = item.product.saleCost * qty;
      let lineItemCost = (Math.round(num * 100) / 100).toFixed(2);
      const lineItem = {
        id: id++,
        color: item.product.color,
        size: item.product.size,
        gender: item.product.gender,
        itemId: item.product.id,
        orderId: orderId,
        price: lineItemCost,
        quantity: qty,
      };

      lineItems.push(lineItem);
    }

    let promises = [];

    for (item of lineItems) {
      let promise = createLineItem(item);
      promises.push(promise);
    }

    Promise.all(promises).then((response) => {
      this.completeOrder();
    });
  }

  handlePurchase() {
    this.setState({
      loading: true,
    });

    this.saveOrder();
  }

  completeOrder() {
    this.setState({
      cartItems: [],
      cartItemsQty: [],
      search: "",
      page: 0,
      searchText: "",
      searchedColumn: "",
      total: 0,
      orderId: "",
      loading: false,
      cartVisible: false,
    });

    notification.success({
      message: "Thank you for your purchase!",
      description:
        "The receipt has been emailed to " + this.state.currentUser.email,
      duration: 6,
    });
  }

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

  changeSelectedGender = (tags) => (value) => {
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
    product.gender = value;
    products[ii] = product;
    this.setState({ products });
  };

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

    let num = item.saleCost * this.getItemQty(itemId);
    let totalItemCost = (Math.round(num * 100) / 100).toFixed(2);
    let itemQty = this.getItemQty(itemId);
    const image = this.getProductImage(product.imageId);

    return (
      <div className="cart-item-container">
        <div className="cart-item-info-container">
          <div className="cart-item-info-one">
            <div className="cart-item-info-name">{item.name}</div>
            <div className="cart-item-qty-container">
              <div className="cart-item-qty-minus">
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
              </div>
              <div className="cart-item-qty">{itemQty}</div>
              <div className="cart-item-qty-plus">
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
              </div>
              <div className="cart-item-total">${totalItemCost}</div>
            </div>
          </div>
          <div className="cart-item-footer-container">
            <div className="cart-item-option-container">
              <div>{item.type}</div>
              <div>{item.color}</div>
              <div>{item.size}</div>
              <div>{item.gender}</div>
            </div>
          </div>
          <div className="cart-item-info-two">
            <div className="cart-item-info-desc">{item.description}</div>
          </div>
        </div>
        <div className="cart-item-qty-remove">
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
        </div>
      </div>
    );
  }

  productCardDetail(product) {
    let saleCost = (Math.round(product.saleCost * 100) / 100).toFixed(2);
    let productColors = product.colors.split(",");
    let productSizes = product.sizes.split(",");
    let productGenders = product.genders.split(",");

    return (
      <div className="product-detail-container">
        <img
          src={`data:image/jpeg;base64,${this.getProductImage(
            product.imageId
          )}`}
        />

        <div className="product-detail-options-container">
          <Select
            align="center"
            placeholder="Genders"
            dropdownClassName="custom-style"
            onChange={this.changeSelectedGender(product)}
            //Key={eventDates.index}
          >
            {productGenders.map((gender) => (
              <Select.Option value={gender} key={gender}>
                {gender}
              </Select.Option>
            ))}
          </Select>
          <Select
            align="center"
            placeholder="Colors"
            dropdownClassName="custom-style"
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
            placeholder="Sizes"
            dropdownClassName="custom-style"
            onChange={this.changeSelectedSize(product)}
            //Key={eventDates.index}
          >
            {productSizes.map((size) => (
              <Select.Option value={size} key={size}>
                {size}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className="product-detail-info">
          <div className="product-detail-info-name">{product.name}</div>
          <div className="product-detail-info-desc">{product.description}</div>
          <div className="product-detail-info-price">${saleCost}</div>
        </div>
      </div>
    );
  }

  productCard(product) {
    let saleCost = (Math.round(product.saleCost * 100) / 100).toFixed(2);

    const saleCostLabel = [
      <Title
        style={{
          width: "100%",
          textAlign: "center",
          margin: 0,
          color: "darkgray",
        }}
        level={5}
      >
        ${saleCost}
      </Title>,
    ];

    const nameLabel = [
      <Title
        style={{
          width: "100%",
          textAlign: "center",
          margin: 0,
        }}
        level={4}
      >
        {product.name}
      </Title>,
    ];

    const image = this.getProductImage(product.imageId);

    const content = [
      <Row style={{ marginBottom: 15 }}>
        <Col>
          <Card
            style={{
              borderRadius: "10px",
              boxShadow: "0 2px 6px 0 rgba(0, 0, 0, 0.4)",
            }}
            bodyStyle={{
              padding: 6,
            }}
            hoverable
            key={product.id}
            cover={
              <Image
                preview={false}
                style={{ left: -1 }}
                width={"100%"}
                height={"100%"}
                src={`data:image/jpeg;base64,${image}`}
                onClick={() => this.selectProduct(product)}
              />
            }
          >
            {nameLabel}
            {saleCostLabel}
          </Card>
        </Col>
      </Row>,
    ];

    return content;
  }

  selectProduct(product) {
    const { products } = this.state;

    let i, newProduct;
    for (i of products) {
      if (product.id == i.id) {
        newProduct = {
          id: product.id,
          name: product.name,
          type: product.type,
          saleCost: product.saleCost,
          description: product.description,
          imageId: product.imageId,
          genders: product.genders,
          colors: product.colors,
          sizes: product.sizes,
          size: i.size,
          color: i.color,
          gender: i.gender,
        };
        break;
      }
    }

    this.setState({ selectedProduct: newProduct, productDetailVisible: true });
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

    return (Math.round(totalCost * 100) / 100).toFixed(2);
  }

  render() {
    const {
      products,
      pagination,
      totalPages,
      search,
      screenWidth,
      cartItems,
      cartItemsQty,
      loading,
      cartVisible,
      selectedProduct,
      productDetailVisible,
      productCards,
    } = this.state;

    const stripeView = <StripeContainer />;

    var cartCards = [];
    if (cartItems) {
      cartItems.forEach((item) => {
        cartCards.push(this.cartItemCard(item));
      });
    }

    let totalCartCost = "$" + this.getTotalCartCost();

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

    var productDetailView = [];

    if (selectedProduct) {
      productDetailView = [this.productCardDetail(selectedProduct)];
    }

    const ModalTitle = [
      <Row>
        <ShoppingCartOutlined
          style={{
            color: "white",
            fontSize: "40px",
            marginLeft: 0,
            marginRight: 15,
          }}
        />
        <Title level={2}>Cart</Title>
      </Row>,
    ];
    const cartView = [
      <Modal
        className="shop"
        visible={cartVisible}
        title={ModalTitle}
        style={{ top: 0 }}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" type="secondary" onClick={this.handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            icon={<DollarCircleOutlined />}
            disabled={this.isFormInvalid()}
            loading={loading}
            onClick={this.handlePurchase}
          >
            Purchase
          </Button>,
        ]}
      >
        <div className="cart-container">{cartCards}</div>
        {totals}
        {stripeView}
      </Modal>,
    ];

    const title = [<Title level={3}>Store</Title>];

    const newHeader = [
      <Row style={{ justifyContent: "space-around" }}>
        {title}
        <Divider style={{ height: 35 }} type="vertical" />
        <Search
          size={"small"}
          placeholder="search"
          onSearch={this.onSearch}
          style={{
            width: 120,
            height: 32,
          }}
          dropdownClassName="custom-style"
        />
        <Select
          align="center"
          style={{
            width: 120,
            height: 32,
          }}
          placeholder={"type"}
          onChange={this.handleTypeDropdownChange}
          dropdownClassName="custom-style"
        >
          {children}
        </Select>
      </Row>,
    ];

    var content = [];

    content = [
      <Spin spinning={loading}>
        <List
          grid={{
            gutter: 16,
            xs: 2,
            sm: 3,
            md: 4,
            lg: 5,
            xl: 6,
            xxl: 7,
          }}
          dataSource={productCards}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />

        <Affix
          offsetTop={55}
          style={{ position: "absolute", top: 0, left: -50 }}
        >
          <Badge count={cartItems.length}>
            <Button
              style={{
                boxShadow:
                  "0 2px 4px 0 rgba(0, 0, 0, 0.4), 0 4px 10px 0 rgba(0, 0, 0, 0.39)",
                borderRadius: "14px",
                height: "60px",
                width: "80px",
              }}
              size={"large"}
              onClick={this.showModal}
              icon={
                <ShoppingCartOutlined
                  offset={[0, 0]}
                  style={{ fontSize: "40px", marginLeft: 30 }}
                />
              }
            ></Button>
          </Badge>
        </Affix>
        {cartView}
      </Spin>,
      <Modal
        className="shop"
        closable={false}
        visible={productDetailVisible}
        title={""}
        style={{ top: 0 }}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" type="secondary" onClick={this.handleCancel}>
            {"<"} Products
          </Button>,
          <Button
            type="primary"
            onClick={() => this.addToCart(selectedProduct)}
            icon={<ShoppingCartOutlined />}
          >
            Add to Cart
          </Button>,
        ]}
      >
        {productDetailView}
      </Modal>,
    ];
    return (
      <Card
        className="custom-style"
        bordered={false}
        headStyle={{ marginBottom: 8 }}
        bodyStyle={{ padding: 16 }}
        title={newHeader}
      >
        {content}
      </Card>
    );
  }
}

export default withRouter(Shop);

/* 
<Row
        style={{
          marginTop: 10,
          marginBottom: 30,
          paddingLeft: 10,
          paddingRight: 10,
          width: "100%",
        }}
      >
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
              {genderLabel}
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
                marginLeft: 4,
                marginTop: 10,
              }}
            >
              {saleCostLabel}
            </Row>,
          ]}
        >
          <Meta title={item.name} description={item.description} />
        </Card>
      </Row> */
