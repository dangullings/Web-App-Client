import React, { Component } from "react";
import {
  createItem,
  createItemImage,
  removeItemById,
  getAllItems,
  getAllItemsByActive,
  removeItemImage,
  getItemImage,
  getAllItemsBySearch,
} from "../util/APIUtils";
import {
  Upload,
  Table,
  Card,
  Modal,
  Divider,
  Form,
  Input,
  Button,
  Image,
  Select,
  Typography,
  Switch,
  message,
  Row,
} from "antd";
import { withRouter } from "react-router-dom";
import {
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import "../styles/style.less";

const { Search } = Input;
const { confirm } = Modal;
const { Title, Text } = Typography;
const Compress = require("compress.js");
const compress = new Compress();

const Option = Select.Option;
const children = [
  <Option key={"Clothing"}>Clothing</Option>,
  <Option key={"Drinkware"}>Drinkware</Option>,
  <Option key={"Gear"}>Gear</Option>,
  <Option key={"Arts and Crafts"}>Arts and Crafts</Option>,
];
const clothingSizes = [
  <Option key={"XX-Small"}>XX-Small</Option>,
  <Option key={"X-Small"}>X-Small</Option>,
  <Option key={"Small"}>Small</Option>,
  <Option key={"Medium"}>Medium</Option>,
  <Option key={"Large"}>Large</Option>,
  <Option key={"X-Large"}>X-Large</Option>,
  <Option key={"XX-Large"}>XX-Large</Option>,
];
const clothingGenders = [
  <Option key={"Mens"}>Mens</Option>,
  <Option key={"Womans"}>Womens</Option>,
];
const colorsAvailable = [
  <Option key={"White"}>White</Option>,
  <Option key={"Grey"}>Grey</Option>,
  <Option key={"Black"}>Black</Option>,
  <Option key={"Red"}>Red</Option>,
  <Option key={"Green"}>Green</Option>,
  <Option key={"Blue"}>Blue</Option>,
  <Option key={"Brown"}>Brown</Option>,
  <Option key={"Purple"}>Purple</Option>,
  <Option key={"Yellow"}>Yellow</Option>,
  <Option key={"Orange"}>Orange</Option>,
  <Option key={"Pink"}>Pink</Option>,
];
const { TextArea } = Input;

class NewItem extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      items: [],

      name: "",
      description: "",
      saleCost: 0,
      selectedType: "",
      selectedSizes: "",
      selectedColors: "",
      selectedGender: "",
      active: false,
      loading: false,
      visible: false,
      fileList: [],
      photo: "",
      imageId: "",
      itemImage: "",
      isSavedItem: false,
      activeView: true,
      search: "",

      columns: [
        {
          title: "Name",
          dataIndex: "name",
          width: "40%",
          ellipsis: true,
        },
        {
          title: "Description",
          dataIndex: "description",
          ellipsis: true,
        },
      ],
    };

    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSaleCostChange = this.handleSaleCostChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
    this.onChange = this.onChange.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.resizeImageFn = this.resizeImageFn.bind(this);
  }

  componentDidMount() {
    this.getItemList(this.state.page, this.state.pageSize);
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  loadItemImage(item) {
    let promise;
    promise = getItemImage(item.imageId);

    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise
      .then((response) => {
        this.setState(
          {
            itemImage: response,
            loading: false,
          },
          this.showItem(item)
        );
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  getItemList(page, pageSize) {
    let promise;

    if (this.state.search !== "") {
      promise = this.getAllItemsBySearch(
        this.state.page,
        this.state.pageSize,
        this.state.search,
        this.state.activeView
      );
    } else {
      promise = getAllItemsByActive(page, pageSize, this.state.activeView);
    }

    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise
      .then((response) => {
        this.setState({
          items: response.content,
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
          loading: false,
        });
      });
  }

  showConfirm = () => {
    confirm({
      className: "confirm-custom-style",
      title: "Do you want to remove this item?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      content:
        "This will erase all records of this item. [Orders, Store, Item List]",
      onOk: () => {
        return this.removeItem();
      },
      onCancel: () => {
        return console.log("");
      },
    });
  };

  removeItem() {
    const { item } = this.state;
    removeItemImage(item.imageId)
      .then((response) => {})
      .catch((error) => {});

    removeItemById(item.id)
      .then((response) => {
        message.success("Item deleted.");
        this.handleCancel();
        this.getItemList(this.state.page, this.state.pageSize);
      })
      .catch((error) => {
        message.error("Error [" + error.message + "]");
      });
  }

  handleSubmit(event) {
    var data = new FormData();
    data.append("file", this.state.photo);

    this.setState({
      loading: true,
    });

    let imageId;
    if (this.state.isSavedItem) {
      imageId = this.state.item.imageId;
    } else {
      imageId = 0;
    }

    createItemImage(data, imageId)
      .then((response) => {
        if (imageId == 0) {
          this.setState(
            {
              imageId: response.id,
            },
            () => this.saveItem()
          );
        } else {
          this.setState(
            {
              imageId: this.state.item.imageId,
            },
            () => this.saveItem()
          );
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  saveItem() {
    let name = this.formRef.current.getFieldValue("name");
    let description = this.formRef.current.getFieldValue("description");
    let type = this.formRef.current.getFieldValue("type");
    let colors = this.formRef.current.getFieldValue("colors");
    let sizes = this.formRef.current.getFieldValue("sizes");
    let genders = this.formRef.current.getFieldValue("genders");
    let saleCost = this.formRef.current.getFieldValue("saleCost");
    let active = this.state.active;

    if (typeof sizes == "undefined") {
      sizes = "";
    }
    if (typeof genders == "undefined") {
      genders = "";
    }
    if (typeof colors == "undefined") {
      colors = "";
    }

    console.log(
      "name " +
        name +
        " desc " +
        description +
        " type " +
        type +
        " colors " +
        colors +
        " sizes " +
        sizes +
        " saleCost " +
        saleCost,
      " active " + active
    );

    let itemId;
    if (this.state.isSavedItem) {
      itemId = this.state.item.id;
    } else {
      itemId = 0;
    }

    const itemData = {
      id: itemId,
      name: name,
      type: type,
      sizes: sizes.toString(),
      colors: colors.toString(),
      genders: genders.toString(),
      saleCost: saleCost,
      description: description,
      active: active,
      imageId: this.state.imageId,
    };

    createItem(itemData)
      .then((response) => {
        this.setState({
          loading: false,
          visible: false,
        });
        this.getItemList(this.state.page, this.state.pageSize);
        this.resetForm();
        if (active) {
          message.success("Item saved and posted on the store!");
        } else {
          message.success("Item saved.");
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  resetForm() {
    this.formRef.current.resetFields();

    this.setState({
      name: "",
      type: "",
      description: "",
      saleCost: "",
      colors: "",
      sizes: "",
      selectedColors: "",
      selectedSizes: "",
      genders: "",
      photo: "",
      itemImage: "",
      active: false,
      visible: false,
      loading: false,
      isSavedItem: false,
    });
  }

  handleUpload(info) {
    if (info.file instanceof File) {
      this.resizeImageFn(info.file);
    } else {
      this.setState({
        photo: "",
      });
    }
  }

  onChange = ({ fileList: newFileList }) => {
    this.setState({
      fileList: newFileList,
    });
  };

  validateCost = (rule, value, callback) => {
    if (isNaN(value)) {
      callback("Please enter a number");
    } else {
      callback();
    }
  };

  handleNameChange(event) {
    const value = event.target.value;
    this.setState({
      name: value,
    });
  }

  handleSaleCostChange(event) {
    const value = event.target.value;
    this.setState({
      saleCost: value,
    });
  }

  handleDescriptionChange(event) {
    const value = event.target.value;
    this.setState({
      description: value,
    });
  }

  handleTypeDropdownChange = (value) => {
    this.setState({ selectedType: value });

    if (value == "Clothing") {
      this.setState({ isClothingSelected: true });
    } else {
      this.setState({
        isClothingSelected: false,
        selectedSizes: "",
        selectedGenders: "",
        selectedColor: "",
      });
    }
  };

  handleSizeDropdownChange = (value) => {
    this.setState({ selectedSizes: value });
  };

  handleColorDropdownChange = (value) => {
    this.setState({ selectedColors: value });
  };

  handleGenderDropdownChange = (value) => {
    this.setState({ selectedGenders: value });
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.getItemList(pagination.current, pagination.pageSize);
    /* this.fetch({
          sortField: sorter.field,
          sortOrder: sorter.order,
          pagination,
          ...filter
        }); */
  };

  isFormInvalid() {
    if (this.state.selectedType == "") {
      return true;
    }
    if (this.state.name == "") {
      return true;
    }
    if (this.state.saleCost == "" || isNaN(this.state.saleCost) == true) {
      return true;
    }
    if (this.state.description == "") {
      return true;
    }
    if (this.state.photo == "") {
      return true;
    }

    return false;
  }

  onFill = () => {
    this.formRef.current.setFieldsValue({
      name: this.state.name,
      description: this.state.description,
      type: this.state.type,
      saleCost: this.state.saleCost,
      active: this.state.active,
      itemImage: this.state.itemImage.photo,
      colors: this.state.selectedColors,
      sizes: this.state.selectedSizes,
      genders: this.state.selectedGenders,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel() {
    this.formRef.current.resetFields();
    this.setState({
      name: "",
      type: "",
      description: "",
      saleCost: "",
      colors: "",
      sizes: "",
      selectedColors: "",
      selectedSizes: "",
      selectedGenders: "",
      photo: "",
      itemImage: "",
      itemId: "",
      active: false,
      visible: false,
      loading: false,
      isSavedItem: false,
    });
  }

  render() {
    const {
      columns,
      pagination,
      active,
      loading,
      visible,
      items,
      isClothingSelected,
      isSavedItem,
      selectedColors,
      selectedSizes,
      itemImage,
    } = this.state;

    var ModalTitle;
    if (isSavedItem) {
      ModalTitle = <Title level={2}>Edit Item</Title>;
    } else {
      ModalTitle = <Title level={2}>New Item</Title>;
    }

    const warningText = [
      <Text type="warning">*only last image uploaded will save with item</Text>,
    ];

    const renderButton = () => {
      if (isSavedItem) {
        return (
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={this.showConfirm}
          >
            Delete
          </Button>
        );
      } else {
        return [];
      }
    };

    const contentList = [
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={this.showModal}
        style={{
          margin: 10,
        }}
      >
        New Item
      </Button>,

      <Modal
        className="custom-style"
        //destroyOnClose={true}
        closable={false}
        style={{ top: 0 }}
        visible={visible}
        title={ModalTitle}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" type="secondary" onClick={this.handleCancel}>
            Cancel
          </Button>,
          renderButton(),
          <Button
            key="submit"
            type="primary"
            icon={<SaveOutlined />}
            loading={loading}
            disabled={this.isFormInvalid()}
            onClick={this.handleSubmit}
          >
            Save
          </Button>,
        ]}
      >
        <Form layout="vertical" onFinish={this.handleSubmit} ref={this.formRef}>
          <Form.Item
            name="type"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                Type
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter item type.",
              },
            ]}
          >
            <Select
              align="center"
              style={{ marginLeft: 0, width: "100%" }}
              placeholder={"select type"}
              onChange={this.handleTypeDropdownChange}
              dropdownClassName="custom-style"
            >
              {children}
            </Select>
          </Form.Item>
          <Form.Item
            name="genders"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                Genders Available
              </Title>
            }
          >
            <Select
              disabled={!isClothingSelected}
              mode="multiple"
              allowClear
              align="center"
              style={{ marginLeft: 0, width: "100%" }}
              placeholder={"select genders"}
              value={selectedSizes}
              onChange={this.handleGenderDropdownChange}
              dropdownClassName="custom-style"
            >
              {clothingGenders}
            </Select>
          </Form.Item>
          <Form.Item
            name="sizes"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                Sizes Available
              </Title>
            }
          >
            <Select
              disabled={!isClothingSelected}
              mode="multiple"
              allowClear
              align="center"
              style={{ marginLeft: 0, width: "100%" }}
              placeholder={"select sizes"}
              value={selectedSizes}
              onChange={this.handleSizeDropdownChange}
              dropdownClassName="custom-style"
            >
              {clothingSizes}
            </Select>
          </Form.Item>
          <Form.Item
            name="colors"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                Colors Available
              </Title>
            }
          >
            <Select
              //disabled={!isClothingSelected}
              mode="multiple"
              allowClear
              align="center"
              style={{ marginLeft: 0, width: "100%" }}
              placeholder={"select colors"}
              value={selectedColors}
              onChange={this.handleColorDropdownChange}
              dropdownClassName="custom-style"
            >
              {colorsAvailable}
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                Name
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter item name.",
              },
            ]}
          >
            <Input
              placeholder="Name"
              style={{ fontSize: "16px" }}
              maxLength={35}
              onChange={this.handleNameChange}
            />
          </Form.Item>
          <Form.Item
            name="saleCost"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                Sale Cost
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter item cost.",
              },
              { validator: this.validateCost },
            ]}
          >
            <Input
              placeholder="$4.99"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 1 }}
              onChange={this.handleSaleCostChange}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                Description
              </Title>
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter item description.",
              },
            ]}
          >
            <TextArea
              placeholder="detailed description"
              style={{ fontSize: "16px" }}
              showCount
              maxLength={200}
              onChange={this.handleDescriptionChange}
            />
          </Form.Item>
          <Title style={{ marginBottom: 8 }} level={5}>
            Current Image
          </Title>
          <Image
            width={"100%"}
            height={"100%"}
            src={`data:image/jpeg;base64,${itemImage.photo}`}
            placeholder={
              <Image preview={false} src="../img/TestImage.png" width={10} />
            }
          />

          <Upload
            listType="picture"
            maxCount={1}
            onChange={this.handleUpload}
            beforeUpload={() => false}
          >
            <Button
              style={{ marginTop: 20, marginBottom: 10 }}
              icon={<UploadOutlined />}
            >
              Upload Image (Max: 1)
            </Button>
          </Upload>
          {warningText}
          <Divider></Divider>
          <Form.Item
            name="active"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                Product On Store
              </Title>
            }
          >
            <Switch checked={active} onChange={this.toggle} />
          </Form.Item>
        </Form>
      </Modal>,
      <Table
        loading={loading}
        rowKey={items.id}
        rowClassName={(record, index) => this.getRowColor(record, index)}
        pagination={pagination}
        bordered
        columns={columns}
        dataSource={items}
        size="small"
        scroll={{ y: 400 }}
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

    const title = [
      <Title level={3}>
        <div>Items</div>
      </Title>,
    ];

    const newHeader = [
      <Row style={{ justifyContent: "space-between" }}>
        {title}
        <Divider style={{ height: 35 }} type="vertical" />
        <Search
          size={"small"}
          placeholder="name"
          onSearch={this.onSearch}
          onChange={this.onChangeSearch}
          dropdownClassName="custom-style"
          style={{
            width: 120,
            height: 32,
          }}
        />
        <Text type="secondary" style={{ marginTop: 5, marginLeft: 8 }}>
          Active
        </Text>
        <Switch
          className="custom-style"
          defaultChecked
          style={{
            marginTop: 5,
          }}
          onChange={this.toggleActive}
        ></Switch>
      </Row>,
    ];

    return (
      <Card
        className="custom-style"
        bordered={false}
        bodyStyle={{ padding: 1 }}
        title={newHeader}
      >
        {contentList}
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

  handleRowClick(item) {
    this.loadItemImage(item);
  }

  showItem(item) {
    var sizes = item.sizes.split(",");
    var colors = item.colors.split(",");
    var arraySize = [],
      arrayColor = [];

    let i;
    for (i of sizes) {
      arraySize.push(i);
    }
    for (i of colors) {
      arrayColor.push(i);
    }

    let sizesEnabled = false;
    if (item.type == "Clothing") {
      sizesEnabled = true;
    }

    this.setState(
      {
        item: item,
        name: item.name,
        description: item.description,
        type: item.type,
        photo: "image",
        saleCost: item.saleCost,
        selectedSizes: arraySize,
        selectedColors: arrayColor,
        selectedType: item.type,
        active: item.active,
        isClothingSelected: sizesEnabled,
        loading: false,
        isSavedItem: true,
        visible: true,
      },
      this.onFill
    );
  }

  getAllItemsBySearchList(search) {
    let promise;

    promise = getAllItemsBySearch(
      this.state.current,
      this.state.pageSize,
      search,
      this.state.activeView
    );

    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise.then((response) => {
      this.setState({
        items: response.content,
        //current: response.number,
        pageSize: response.size,
        total: response.totalElements,
        totalPages: response.totalPages,
        loading: false,
      });
    });
  }

  onSearch = (value) => {
    this.setState({
      search: value,
    });

    if (value == "") {
      this.getItemList();
      return;
    }

    this.getAllItemsBySearchList(value);
  };

  onChangeSearch = (value) => {
    this.setState({
      search: value.target.value,
    });

    if (value.target.value == "") {
      this.setState({ search: "" }, () => this.getItemList());
    } else {
      this.getAllItemsBySearchList(value.target.value);
    }
  };

  toggle = () => {
    console.log("switch to" + !this.state.active);
    this.setState({
      active: !this.state.active,
    });
  };

  toggleActive = () => {
    console.log("switch---------" + !this.state.activeView);
    this.setState(
      {
        activeView: !this.state.activeView,
        search: "",
      },
      () => this.getItemList()
    );
  };

  resizeImageFn(file) {
    compress
      .compress([file], {
        size: 2, // the max size in MB, defaults to 2MB
        quality: 1, // the quality of the image, max is 1,
        maxWidth: 1280, // the max width of the output image, defaults to 1920px
        maxHeight: 720, // the max height of the output image, defaults to 1920px
        resize: true, // defaults to true, set false if you do not want to resize the image width and height
      })
      .then((data) => {
        const img = data[0];
        const base64str = img.data;
        const imgExt = img.ext;

        this.setState({
          photo: Compress.convertBase64ToFile(base64str, imgExt),
          loading: false,
        });
      });
  }
}

export default withRouter(NewItem);
