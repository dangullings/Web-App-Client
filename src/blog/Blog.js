import React, { Component } from "react";
import { Typography, Button, Card } from "antd";
import { saveBlog, getBlog } from "../util/APIUtils";
import { withRouter } from "react-router-dom";
import "../styles/style.less";
import { SaveOutlined, FormOutlined } from "@ant-design/icons";
import EditorJs from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./Tools";

import imgSplashOne from "../img/BackgroundOne.jpg";

const { Title } = Typography;

class Blog extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      blogId: "",
      active: "",
      date: "",
      author: "",
      dataState: {},
      checked: false,
    };

    this.loadBlog();
  }

  componentDidMount() {}

  loadBlog() {
    let promise;
    promise = getBlog(3);

    promise
      .then((response) => {
        this.setState({
          blogId: response.id,
          active: response.active,
          author: response.author,
          date: response.date,
          dataState: JSON.parse(response.jsonData),
        });
      })
      .catch((error) => {});
  }

  async onSave() {
    const outputData = await this.editorInstance.save();

    const data = {
      id: 3,
      active: this.state.active,
      data: outputData,
      author: this.state.author,
      date: this.state.date,
    };

    saveBlog(data)
      .then((response) => {
        console.log("response " + response);
      })
      .catch((error) => {});
  }

  render() {
    const { dataState, active, date, author } = this.state;

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
        <EditorJs
          instanceRef={(instance) => (this.editorInstance = instance)}
          tools={EDITOR_JS_TOOLS}
          data={dataState}
          enableReInitialize={true}
          onChange={this.onSave.bind(this)}
        />
        <Button
          type="primary"
          block={true}
          icon={<SaveOutlined />}
          onClick={this.onSave.bind(this)}
        >
          Save
        </Button>
      </Card>
    );
  }
}

export default withRouter(Blog);
