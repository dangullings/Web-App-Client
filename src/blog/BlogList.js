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
} from "antd";
import { getAllBlogsByActive, saveBlog, removeBlog } from "../util/APIUtils";
import { STUDENT_LIST_SIZE } from "../constants";
import { withRouter } from "react-router-dom";
import "../styles/style.less";
import moment from "moment";

import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  FormOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import EditorJs from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./Tools";

const { confirm } = Modal;
const { Title, Text } = Typography;

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

    console.log("getblog list");

    promise
      .then((response) => {
        this.setState(
          {
            //blogs: response.content,
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
    //const { blogs } = this.state;

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
    };

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

  render() {
    const { blogs, visible, loading, active, columns, isSavedBlog, dataState } =
      this.state;

    let b;
    for (b of blogs) {
      console.log("blogs " + b.dataState.blocks[0].data.text);
    }

    var ModalTitle;
    if (isSavedBlog) {
      ModalTitle = <Title level={2}>Edit Blog</Title>;
    } else {
      ModalTitle = <Title level={2}>New Blog</Title>;
    }

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
        className="custom-style"
        style={{ top: "0px" }}
        visible={visible}
        title={ModalTitle}
        closable={false}
        destroyOnClose={true}
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
          enableReInitialize={true}
        />
        <Row>
          <Divider />
          <Text type="secondary" style={{ marginRight: 10, fontSize: 20 }}>
            Published
          </Text>
          <Switch
            style={{ marginTop: 5 }}
            checked={active}
            onChange={this.toggleActive}
          />
        </Row>
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
}

export default withRouter(BlogList);
