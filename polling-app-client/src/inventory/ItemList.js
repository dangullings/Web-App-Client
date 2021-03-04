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
import ImgCrop from "antd-img-crop";
import Resizer from "react-image-file-resizer";
import {
  UploadOutlined,
  DeleteOutlined,
  PlusOutlined,
  LoadingOutlined,
  SaveOutlined,
  ReloadOutlined,
  CarryOutOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

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
const FormItem = Form.Item;
const { TextArea } = Input;

const layout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 12,
  },
};

class NewItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],

      name: {
        text: "",
      },
      saleCost: {
        text: "",
      },
      description: {
        text: "",
      },
      selectedType: "",
      selectedSizes: "",
      selectedColors: "",
      active: false,
      loading: false,
      visible: false,
      fileList: [],
      photo: "",
      imageId: "",

      columns: [
        {
          title: "Name",
          dataIndex: "name",
        },
        {
          title: "Description",
          dataIndex: "description",
        },
        {
          title: <DeleteOutlined />,
          dataIndex: "operation",
          width: "10%",
          render: (text, record) =>
            this.state.items.length >= 1 ? (
              <Popconfirm
                title={"Sure to delete " + record.name + "?"}
                onConfirm={() => this.removeItem(record)}
              >
                <a>{<DeleteOutlined />}</a>
              </Popconfirm>
            ) : null,
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
        notification.success({
          message: "Removal Successful",
          description: "Item removed.",
          duration: 2,
        });
        this.getItemList(this.state.page, this.state.pageSize);
      })
      .catch((error) => {
        notification.error({
          message: "Unsuccessful",
          description:
            error.message || "Something went wrong. Please try again!",
        });
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
    const itemData = {
      name: this.state.name.text,
      type: this.state.selectedType,
      sizes: this.state.selectedSizes.toString(),
      colors: this.state.selectedColors.toString(),
      saleCost: this.state.saleCost.text,
      description: this.state.description.text,
      active: this.state.active,
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
        notification.success({
          message: "Save Successful!",
          description: itemData.name + " was saved.",
          duration: 2,
        });
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
    } = this.state;

    const ModalTitle = <Title level={2}>New Item</Title>;
    const TableTitle = <Title level={3}>Item List</Title>;

    const contentList = [
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={this.showModal}
        size={"default"}
        style={{
          marginBottom: 10,
          marginTop: 10,
          marginLeft: 2,
          marginRight: 10,
        }}
      >
        New Item
      </Button>,

      <Form {...layout} onFinish={this.handleSubmit} ref={this.formRef}>
        <Modal
          visible={visible}
          title={ModalTitle}
          style={{ top: 0 }}
          bodyStyle={{ padding: 20, marginBottom: 20 }}
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
              icon={<SaveOutlined />}
              disabled={this.isFormInvalid()}
              loading={loading}
              onClick={this.handleSubmit}
              style={{
                boxShadow: "0px 0px 5px rgba(0,0,0,0.2)",
              }}
            >
              Submit
            </Button>,
          ]}
        >
          <Form.Item label={<Title level={5}>Type</Title>}>
            <Select
              align="center"
              style={{ marginLeft: 0, width: "100%" }}
              placeholder={"select type"}
              onChange={this.handleTypeDropdownChange}
            >
              {children}
            </Select>
          </Form.Item>

          <Form.Item label={<Title level={5}>Sizes Available</Title>}>
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

          <Form.Item label={<Title level={5}>Colors Available</Title>}>
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
            label={<Title level={5}>Name</Title>}
            validateStatus={this.state.name.validateStatus}
            help={this.state.name.errorMsg}
            className="student-form-row"
          >
            <Input
              placeholder="T-Shirt"
              style={{ fontSize: "16px" }}
              rules={[
                {
                  required: true,
                  message: "Please enter item name.",
                },
              ]}
              autosize={{ minRows: 1, maxRows: 1 }}
              name="name"
              value={this.state.name.text}
              onChange={this.handleNameChange}
            />
          </Form.Item>

          <Form.Item
            label={<Title level={5}>Sale Cost</Title>}
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
            label={<Title level={5}>Description</Title>}
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
            label={<Title level={5}>Image</Title>}
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

          {/* <ImgCrop rotate>
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileList}
            onChange={this.handleUpload}
            onPreview={this.onPreview}
          >
            {fileList.length < 1 && "+ Upload"}
          </Upload>
        </ImgCrop> */}

          <Divider></Divider>

          <Form.Item label={<Title level={5}>Product On Store</Title>}>
            <Switch value={active} onChange={this.toggle} />
          </Form.Item>
        </Modal>
      </Form>,

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
      />,
    ];

    return (
      <Card
        bodyStyle={{ padding: 10 }}
        style={{
          width: "100%",
          textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
          borderRadius: 6,
          marginRight: 0,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
        title="New Item"
      >
        {contentList}
      </Card>
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
