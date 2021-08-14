import React, { Component } from "react";
import { Typography, Button } from "antd";
import { getBlog } from "../util/APIUtils";
import { withRouter, Link } from "react-router-dom";
import "../styles/style.less";
import "../styles/components/BlogDetail.css";
import { UnorderedListOutlined } from "@ant-design/icons";
import moment from "moment";
import EditorJs from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./Tools";

const { Title } = Typography;

class BlogDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blog: "",
    };

    this.loadBlog(this.props.match.params.id);
  }

  loadBlog(id) {
    this.setState({
      loading: true,
    });

    let promise;
    promise = getBlog(id);

    if (!promise) {
      this.setState({
        loading: false,
      });
      return;
    }

    promise
      .then((response) => {
        var date = moment(response.date);
        const data = {
          id: response.id,
          date: moment(response.date).format("dddd, MMMM Do YYYY"),
          time: moment(response.date).format("h:mm a"),
          author: response.author,
          dataState: JSON.parse(response.jsonData),
        };
        this.setState({
          blog: data,
          loading: false,
        });
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
      const data = {
        id: blog.id,
        date: date.format("dddd, MMMM Do YYYY"),
        time: date.format("h:mm a"),
        author: blog.author,
        dataState: JSON.parse(blog.jsonData),
        header: JSON.parse(blog.jsonData).blocks[0].data.text,
      };

      newBlogs.push(data);
    }

    this.setState({ blogs: newBlogs });
  }

  render() {
    const { blog } = this.state;

    const blogView = [
      <div>
        <Link to={"/blog"}>
          {
            <Button
              type="secondary"
              block={true}
              icon={<UnorderedListOutlined />}
            >
              Blog List
            </Button>
          }
        </Link>
        <div className="blog-container">
          <div className="blog-date">{blog.date}</div>
          <div className="blog-body-container">
            <EditorJs
              minHeight={0}
              tools={EDITOR_JS_TOOLS}
              data={blog.dataState}
              enableReInitialize={true}
              readOnly={true}
            />
          </div>
          <div className="blog-author">
            {blog.author}
            {" at "}
            {blog.time}
          </div>
        </div>
      </div>,
    ];

    return blogView;
  }
}

export default withRouter(BlogDetail);

{
  /* <EditorJs
  tools={EDITOR_JS_TOOLS}
  data={dataState}
  enableReInitialize={true}
  readOnly={true}
/>; */
}
