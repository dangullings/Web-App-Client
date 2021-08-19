import React, { Component } from "react";
import { Typography, Button, Card, List, Divider } from "antd";
import { getBlog, getAllBlogsByActive } from "../util/APIUtils";
import { withRouter } from "react-router-dom";
import "../styles/style.less";
import "../styles/components/Blog.css";
import { FormOutlined } from "@ant-design/icons";
import { STUDENT_LIST_SIZE } from "../constants";
import moment from "moment";
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
    let newBlogs = [];
    let blog;
    for (blog of blogs) {
      var date = moment(blog.date);
      let headerParse = JSON.parse(blog.jsonData).blocks[0].data.text;

      const data = {
        id: blog.id,
        date: date.format("dddd, MMMM Do YYYY"),
        author: blog.author,
        dataState: JSON.parse(blog.jsonData),
        header: headerParse.replace(/&nbsp;/g, " "),
      };

      newBlogs.push(data);
    }

    this.setState({ blogs: newBlogs });
  }

  blogCard(blog) {
    let bodyParse = blog.dataState.blocks[1].data.text;
    let body = bodyParse.replace(/&nbsp;/g, " ");

    return (
      <div
        className="blog-item-container"
        onClick={() => this.selectBlog(blog)}
      >
        <div className="blog-item-date">{blog.date}</div>
        <div className="blog-item-header">{blog.header}</div>
        <div className="blog-item-body">{body}</div>
      </div>
    );
  }

  selectBlog(blog) {
    this.props.history.push(`/blogs/${blog.id}`);
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

    return blogView;
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
