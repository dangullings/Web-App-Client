import React, { Component } from "react";
import {
  createItem,
  createItemImage,
  removeItem,
  getAllItems,
  removeItemImage,
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
  Icon,
  Select,
  Col,
  notification,
  Popconfirm,
  Typography,
  Switch,
  message,
} from "antd";

import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import "../styles/style.less";

const { Title, Text } = Typography;
const Compress = require("compress.js");
const compress = new Compress();

const Option = Select.Option;
const children = [
  <Option key={"Clothing"}>Clothing</Option>,
  <Option key={"Drinkware"}>Drinkware</Option>,
  <Option key={"Training Gear"}>Training Gear</Option>,
  <Option key={"Arts and Crafts"}>Arts and Crafts</Option>,
];
const clothingSizes = [
  <Option key={"Extra Small"}>Extra Small</Option>,
  <Option key={"Small"}>Small</Option>,
  <Option key={"Medium"}>Medium</Option>,
  <Option key={"Large"}>Large</Option>,
  <Option key={"Extra Large"}>Extra Large</Option>,
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
      active: false,
      loading: false,
      visible: false,
      fileList: [],
      photo: "",
      imageId: "",
      isSavedItem: false,

      columns: [
        {
          title: "Name",
          dataIndex: "name",
        },
        {
          title: "Description",
          dataIndex: "description",
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
    this.handleUpload = this.handleUpload.bind(this);
    this.resizeImageFn = this.resizeImageFn.bind(this);
  }

  formRef = React.createRef();

  componentDidMount() {
    this.getItemList(this.state.page, this.state.pageSize);
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({ visible: false });
    this.resetFields();
  };

  getItemList(page, pageSize) {
    let promise;
    promise = getAllItems(page, pageSize);

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
          isLoading: false,
        });
      });
  }

  removeItem(item) {
    removeItemImage(item.imageId)
      .then((response) => {})
      .catch((error) => {});

    removeItem(item.id)
      .then((response) => {
        message.success("Item deleted.");
        this.getItemList(this.state.page, this.state.pageSize);
      })
      .catch((error) => {
        message.error("Error [" + error.message + "]");
      });
  }

  resetFields() {
    this.formRef.current.resetFields();
    this.setState({
      name: {
        text: "",
      },
      description: {
        text: "",
      },
      saleCost: {
        text: "",
      },
      selectedType: "",
      photo: "",
      imageId: "",
      isClothingSelected: false,
      fileList: [],
      selectedSizes: "",
      selectedColor: "",
      active: false,
    });
  }

  handleSubmit(event) {
    var data = new FormData();
    data.append("file", this.state.photo);

    this.setState({
      loading: true,
    });
    createItemImage(data)
      .then((response) => {
        this.setState(
          {
            imageId: response.id,
          },
          () => this.saveItem()
        );
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
    let saleCost = this.formRef.current.getFieldValue("saleCost");
    let active = this.formRef.current.getFieldValue("active");

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

    const itemData = {
      name: name,
      type: type,
      sizes: sizes.toString(),
      colors: colors.toString(),
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
        this.resetFields();
        message.success("Item saved.");
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  handleUpload(info) {
    const file = info.file;

    const newFile = this.resizeImageFn(file);

    console.log("new file " + newFile);
  }

  onChange = ({ fileList: newFileList }) => {
    this.setState({
      fileList: newFileList,
    });
  };

  validateName = (nameText) => {
    if (nameText.length === 0) {
      return {
        validateStatus: "error",
        errorMsg: "Please enter item name",
      };
    } else if (nameText.length > 40) {
      return {
        validateStatus: "error",
        errorMsg: `Name is too long (Maximum ${40} characters allowed)`,
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null,
      };
    }
  };

  validateSaleCost = (nameText) => {
    if (nameText.length === 0) {
      return {
        validateStatus: "error",
        errorMsg: "Please enter item sale cost",
      };
    } else if (nameText.length > 8) {
      return {
        validateStatus: "error",
        errorMsg: `Sale Cost is too long (Maximum ${8} characters allowed)`,
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null,
      };
    }
  };

  validateDescription = (nameText) => {
    if (nameText.length === 0) {
      return {
        validateStatus: "error",
        errorMsg: "Please enter item description",
      };
    } else if (nameText.length > 100) {
      return {
        validateStatus: "error",
        errorMsg: `Description is too long (Maximum ${100} characters allowed)`,
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null,
      };
    }
  };

  handleNameChange(event) {
    const value = event.target.value;
    this.setState({
      name: {
        text: value,
        ...this.validateName(value),
      },
    });
  }

  handleSaleCostChange(event) {
    const value = event.target.value;
    this.setState({
      saleCost: {
        text: value,
        ...this.validateSaleCost(value),
      },
    });
  }

  handleDescriptionChange(event) {
    const value = event.target.value;
    this.setState({
      description: {
        text: value,
        ...this.validateDescription(value),
      },
    });
  }

  handleTypeDropdownChange = (value) => {
    this.setState({ selectedType: value });

    if (value == "Clothing") {
      this.setState({ isClothingSelected: true });
    } else {
      this.setState({ isClothingSelected: false });
    }
  };

  handleSizeDropdownChange = (value) => {
    console.log("values " + value);
    this.setState({ selectedSizes: value });
  };

  handleColorDropdownChange = (value) => {
    console.log("values " + value);
    this.setState({ selectedColors: value });
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
    if (this.state.saleCost == "") {
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

  onReset() {
    this.formRef.current.resetFields();
    this.setState({
      name: "",
      address: "",
      location: "",
      visible: false,
      loading: false,
      isSavedItem: false,
    });
  }

  onFill() {
    if (this.formRef.current) {
      this.formRef.current.setFieldsValue({
        name: this.state.item.name,
        description: this.state.item.description,
        type: this.state.item.type,
        saleCost: this.state.item.saleCost,
        sizes: this.state.item.sizes,
        colors: this.state.item.colors,
        active: this.state.item.active,
      });
    }

    this.setState({
      isSavedItem: true,
      visible: true,
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.onReset();
  };

  onReset() {
    this.formRef.current.resetFields();
    this.setState({
      name: "",
      type: "",
      description: "",
      saleCost: "",
      colors: "",
      sizes: "",
      visible: false,
      loading: false,
      isSavedItem: false,
    });
  }

  removeItem() {
    const { item } = this.state;
    removeItem(item.id)
      .then((response) => {
        message.success("Item deleted.");
        this.onReset;
        this.getItemList(this.state.page);
        this.setState({ loading: false, visible: false });
      })
      .catch((error) => {
        message.error("Error [" + error.message + "]");
      });
  }

  render() {
    const {
      name,
      columns,
      selectedType,
      selectedColors,
      selectedSizes,
      saleCost,
      description,
      pagination,
      active,
      fileList,
      loading,
      visible,
      items,
      isClothingSelected,
      isSavedItem,
    } = this.state;

    var ModalTitle;
    if (isSavedItem) {
      ModalTitle = <Title level={2}>Edit Item</Title>;
    } else {
      ModalTitle = <Title level={2}>New Item</Title>;
    }
    const TableTitle = <Title level={3}>Item List</Title>;

    const renderButton = () => {
      if (isSavedItem) {
        return (
          <Popconfirm
            title="Delete item?"
            onConfirm={this.removeItem}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              loading={loading}
              onClick={this.confirmRemoveItem}
            >
              Delete
            </Button>
          </Popconfirm>
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
          marginBottom: 10,
          marginTop: 10,
          marginLeft: 2,
          marginRight: 10,
        }}
      >
        New Item
      </Button>,

      <Modal
        className="location-list"
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
            onClick={this.handleSubmit}
          >
            Save
          </Button>,
        ]}
      >
        <Form
          initialValues={{
            name: name,
            description: description,
            saleCost: saleCost,
            active: active,
            sizes: this.state.sizes,
            colors: this.state.colors,
            type: this.state.selectedType,
          }}
          layout="vertical"
          onFinish={this.handleSubmit}
          ref={this.formRef}
        >
          <Form.Item
            name="type"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                Type
              </Title>
            }
          >
            <Select
              align="center"
              style={{ marginLeft: 0, width: "100%" }}
              placeholder={"select type"}
              onChange={this.handleTypeDropdownChange}
            >
              {children}
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
              onChange={this.handleSizeDropdownChange}
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
              onChange={this.handleColorDropdownChange}
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
            validateStatus={this.state.name.validateStatus}
            help={this.state.name.errorMsg}
          >
            <Input
              placeholder="Name"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 1 }}
            />
          </Form.Item>

          <Form.Item
            name="saleCost"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                Sale Cost
              </Title>
            }
            validateStatus={this.state.saleCost.validateStatus}
            help={this.state.saleCost.errorMsg}
            className="student-form-row"
          >
            <Input
              placeholder="$4.99"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 1 }}
              name="saleCost"
              value={this.state.saleCost.text}
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
            validateStatus={this.state.description.validateStatus}
            help={this.state.description.errorMsg}
            className="student-form-row"
          >
            <Input
              placeholder="detailed description"
              style={{ fontSize: "16px" }}
              autosize={{ minRows: 1, maxRows: 4 }}
              name="description"
              value={this.state.description.text}
              onChange={this.handleDescriptionChange}
            />
          </Form.Item>

          <Form.Item
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                Image
              </Title>
            }
            className="student-form-row"
          >
            <Upload
              listType="picture-card"
              onChange={this.handleUpload}
              beforeUpload={() => false}
            >
              {fileList.length < 2 && "+ Upload"}
            </Upload>
          </Form.Item>

          <Divider></Divider>

          <Form.Item
            name="active"
            label={
              <Title style={{ marginBottom: 0 }} level={5}>
                Product On Store
              </Title>
            }
          >
            <Switch value={active} onChange={this.toggle} />
          </Form.Item>
        </Form>
      </Modal>,
      <Table
        loading={loading}
        rowKey={items.id}
        pagination={pagination}
        bordered
        columns={columns}
        dataSource={items}
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

    return (
      <Card
        className="item-list"
        bordered={false}
        bodyStyle={{ padding: 0 }}
        title="Items"
      >
        {contentList}
      </Card>
    );
  }

  handleRowClick(item) {
    this.showItem(item);
  }

  showItem(item) {
    this.setState(
      {
        item: item,
        name: item.name,
        description: item.description,
        type: item.type,
        saleCost: item.saleCost,
        sizes: item.sizes,
        colors: item.colors,
        active: item.active,
        loading: false,
      },
      () => this.onFill()
    );
  }

  toggle = () => {
    console.log("switch to" + !this.state.active);
    this.setState({
      active: !this.state.active,
    });
  };

  resizeImageFn(file) {
    compress
      .compress([file], {
        size: 0.1, // the max size in MB, defaults to 2MB
        quality: 1, // the quality of the image, max is 1,
        maxWidth: 200, // the max width of the output image, defaults to 1920px
        maxHeight: 200, // the max height of the output image, defaults to 1920px
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

export default NewItem;
