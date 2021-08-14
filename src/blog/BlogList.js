import React, { Component } from "react";
import {
  Table,
  Typography,
  message,
  Button,
  Card,
  Modal,
  Row,
  Divider,
  Switch,
  Image,
  Upload,
} from "antd";
import {
  getAllBlogsByActive,
  saveBlog,
  removeBlog,
  getItemImage,
  createItemImage,
} from "../util/APIUtils";
import { STUDENT_LIST_SIZE } from "../constants";
import { withRouter } from "react-router-dom";
import "../styles/style.less";
import "../styles/components/BlogList.less";
import moment from "moment";

import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  FormOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import EditorJs from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./Tools";

const { confirm } = Modal;
const { Title, Text } = Typography;
const Compress = require("compress.js");
const compress = new Compress();

class BlogList extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      isSavedBlog: false,
      blogs: [],
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
      visible: false,
      active: false,
      activeView: false,
      count: 0,

      blogId: "",
      date: "",
      dataState: {},
      author: "",
      header: "",

      fileList: [],
      photo: "",
      imageIds: "",
      itemImage: "",

      columns: [
        {
          title: "Date",
          dataIndex: "date",
          width: "40%",
          ellipsis: true,
        },
        {
          title: "Author",
          dataIndex: "author",
          width: "20%",
          ellipsis: true,
        },
        {
          title: "Header",
          dataIndex: "header",
          ellipsis: true,
        },
      ],
    };
    this.onSave = this.onSave.bind(this);
    this.removeBlog = this.removeBlog.bind(this);
    this.getBlogList = this.getBlogList.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.resizeImageFn = this.resizeImageFn.bind(this);
  }

  componentDidMount() {
    if (this.props.currentUser !== null) {
      this.setState({
        author: this.props.currentUser.name,
      });
    }
    this.getBlogList(this.state.page);
  }

  onFill = () => {
    this.setState({
      isSavedBlog: true,
      visible: true,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
      blogId: -1,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      loading: false,
      isSavedBlog: false,
      active: false,
      dataState: {},
    });
  };

  getBlogList(page) {
    let promise;
    promise = getAllBlogsByActive(page, this.state.size, this.state.activeView);

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
            page: response.page,
            size: response.size,
            totalElements: response.totalElements,
            totalPages: response.totalPages,
            last: response.last,
            loading: false,
          },
          () => this.setBlogHeader(response.content)
        );
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  setBlogHeader(blogs) {
    let newBlogs = [];
    let blog;
    for (blog of blogs) {
      const data = {
        id: blog.id,
        date: blog.date,
        author: blog.author,
        dataState: JSON.parse(blog.jsonData),
        header: JSON.parse(blog.jsonData).blocks[0].data.text,
      };

      newBlogs.push(data);
    }

    this.setState({ blogs: newBlogs });
  }

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

  showConfirm = () => {
    confirm({
      className: "confirm-custom-style",
      title: "Do you want to remove this location?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      content:
        "This will erase all records of this location. [Session Location, Event Location, Test Location, Location List]",
      onOk: () => {
        return this.removeBlog();
      },
      onCancel: () => {
        return console.log("");
      },
    });
  };

  removeBlog() {
    const { blog } = this.state;
    removeBlog(blog.id)
      .then((response) => {
        message.success("Location deleted.");
        this.handleCancel;
        this.getBlogList(this.state.page);
        this.setState({ loading: false, visible: false });
      })
      .catch((error) => {
        message.error("Error [" + error.message + "]");
      });
  }

  async onSave() {
    this.setState({ loading: true });

    const outputData = await this.editorInstance.save();

    const data = {
      id: this.state.blogId,
      active: this.state.active,
      data: outputData,
      author: this.state.author,
      date: moment().format("YYYY-MM-DD, h:mm a"),
      imageIds: this.state.imageIds,
    };

    /* createItemImage(data, imageId)
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
      }); */

    saveBlog(data)
      .then((response) => {
        message.success("Blog saved.");
        this.handleCancel;
        this.getBlogList(this.state.page);
        this.setState({ loading: false, visible: false });
      })
      .catch((error) => {});
  }

  clearInput(event) {
    event.target.value = "";
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

  render() {
    const { blogs, visible, loading, active, columns, isSavedBlog, dataState } =
      this.state;

    const renderButton = () => {
      if (isSavedBlog) {
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

    {
      /* <Title style={{ marginBottom: 8 }} level={5}>
            Current Images
          </Title>,
          <Image
            width={"100%"}
            height={"100%"}
            src={`data:image/jpeg;base64,${itemImage.photo}`}
            placeholder={
              <Image preview={false} src="../img/TestImage.png" width={10} />
            }
          />, */
    }

    const contentList = [
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={this.showModal}
        style={{
          margin: 10,
        }}
      >
        New Blog
      </Button>,

      <Modal
        className="blog-style"
        style={{ top: "0px" }}
        visible={visible}
        closable={false}
        destroyOnClose={true}
        onCancel={this.handleCancel}
        footer={[
          <Upload
            listType="picture"
            maxCount={3}
            multiple
            onChange={this.handleUpload}
            beforeUpload={() => false}
          >
            <Button
              style={{ marginTop: 20, marginBottom: 10 }}
              icon={<UploadOutlined />}
            >
              Upload Image (Max: 3)
            </Button>
          </Upload>,

          <Text type="secondary" style={{ marginRight: 10, fontSize: 24 }}>
            Publish
          </Text>,
          <Switch
            style={{ marginTop: 0, marginRight: 20 }}
            checked={active}
            onChange={this.toggleActive}
          />,
          <Button key="back" type="secondary" onClick={this.handleCancel}>
            Cancel
          </Button>,
          renderButton(),
          <Button
            key="submit"
            type="primary"
            icon={<SaveOutlined />}
            loading={loading}
            onClick={this.onSave}
          >
            Save
          </Button>,
        ]}
      >
        <EditorJs
          instanceRef={(instance) => (this.editorInstance = instance)}
          tools={EDITOR_JS_TOOLS}
          data={dataState}
          enableReInitialize={false}
          autofocus={true}
        />
      </Modal>,

      <Table
        loading={loading}
        rowClassName={(record, index) => this.getRowColor(record, index)}
        rowKey={blogs.id}
        bordered
        columns={columns}
        dataSource={blogs}
        size="small"
        scroll={{ y: 500 }}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              this.handleRowClick(record);
            },
          };
        }}
      />,
    ];

    const title = [
      <Title level={3}>
        <div>
          Blogs <FormOutlined />
        </div>
      </Title>,
    ];

    const newHeader = [
      <Row>
        {title}
        <Divider
          style={{ height: 35, marginLeft: 20, marginRight: 10 }}
          type="vertical"
        />
        <Text type="secondary" style={{ marginLeft: 10, marginTop: 5 }}>
          Published
        </Text>
        <Switch
          dropdownClassName="custom-style"
          style={{
            marginTop: 6,
            marginLeft: 6,
          }}
          onChange={this.toggleActiveView}
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

  handleRowClick(blog) {
    this.showBlog(blog);
  }

  getRowColor(record, index) {
    if (index % 2 === 0) {
      return "table-row-light";
    } else {
      return "table-row-dark";
    }
  }

  showBlog(blog) {
    this.setState(
      {
        blog: blog,
        blogId: blog.id,
        date: blog.date,
        loading: false,
        author: blog.author,
        dataState: blog.dataState,
        isSavedBlog: true,
        visible: true,
      },
      this.onFill
    );
  }

  toggleActive = () => {
    this.setState({
      active: !this.state.active,
    });
  };

  toggleActiveView = () => {
    this.setState(
      {
        activeView: !this.state.activeView,
      },
      () => this.getBlogList(this.state.page)
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

export default withRouter(BlogList);
