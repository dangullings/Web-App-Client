import React, { Component } from "react";
import { Typography, Button, Card, List, Divider } from "antd";
import { getBlog, getAllBlogsByActive } from "../util/APIUtils";
import { withRouter } from "react-router-dom";
import "../styles/style.less";
import "../styles/components/Blog.css";
import { FormOutlined } from "@ant-design/icons";
import { STUDENT_LIST_SIZE } from "../constants";
import EditorJs from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./Tools";

const { Title } = Typography;

class Blog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blogs: [],
      blogCards: [],
      size: STUDENT_LIST_SIZE,
      page: 0,
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        pageSizeOptions: ["10", "25", "50", "100"],
      },
      total: 0,
    };
  }

  componentDidMount() {
    this.getBlogList(this.state.page);
  }

  getBlogList(page) {
    let promise;
    promise = getAllBlogsByActive(page, this.state.size, true);

    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise
      .then((response) => {
        console.log("response " + response.content);
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
    console.log("setblogheader " + blogs[0]);
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

  blogCard(blog) {
    return (
      <div className="blog-item-container">
        <div className="blog-item-header">{blog.header}</div>
        <div className="blog-item-footer">
          <div className="blog-item-author">{blog.author}</div>
          <div className="blog-item-date">{blog.date}</div>
        </div>
        <Divider
          style={{
            marginTop: 5,
            marginBottom: 5,
          }}
        />
      </div>
    );
  }

  render() {
    const { blogs } = this.state;

    var blogCards = [];
    if (blogs) {
      blogs.forEach((blog) => {
        blogCards.push(this.blogCard(blog));
      });
    }

    const blogView = [<div className="blog-container">{blogCards}</div>];

    const title = [
      <Title level={3}>
        <div>
          Blog <FormOutlined />
        </div>
      </Title>,
    ];

    return (
      <Card
        className="custom-style"
        bordered={false}
        bodyStyle={{ padding: 20 }}
        title={title}
      >
        {blogView}
      </Card>
    );
  }
}

export default withRouter(Blog);

{
  /* <EditorJs
  tools={EDITOR_JS_TOOLS}
  data={dataState}
  enableReInitialize={true}
  readOnly={true}
/>; */
}
