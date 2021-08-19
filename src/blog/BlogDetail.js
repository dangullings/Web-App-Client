import React, { Component } from "react";
import { Button, Image } from "antd";
import { getBlog, getImage } from "../util/APIUtils";
import { withRouter, Link } from "react-router-dom";
import "../styles/style.less";
import "../styles/components/BlogDetail.css";
import { UnorderedListOutlined } from "@ant-design/icons";
import moment from "moment";
import EditorJs from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./Tools";

class BlogDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blog: "",
      blogImage: "",
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
          imageId: response.imageId,
        };
        this.setState(
          {
            blog: data,
          },
          () => this.loadBlogImage(data)
        );
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  loadBlogImage(blog) {
    let promise;
    promise = getImage(blog.imageId);

    if (!promise) {
      return;
    }

    promise
      .then((response) => {
        this.setState({
          blogImage: response,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  render() {
    const { blog, blogImage } = this.state;

    const blogView = [
      <div>
        <Link to={"/blog"}>
          {
            <Button
              type="text"
              style={{ marginTop: 0, marginBottom: 0 }}
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
              minHeight={20}
              tools={EDITOR_JS_TOOLS}
              data={blog.dataState}
              enableReInitialize={true}
              readOnly={true}
            />
          </div>
          <Image
            style={{
              width: "100%",
              height: "100%",
              margin: "0px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "5px",
            }}
            width={"100%"}
            height={"100%"}
            src={`data:image/jpeg;base64,${blogImage.photo}`}
          />
          <div className="blog-author">
            {blog.author}
            {" | "}
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
