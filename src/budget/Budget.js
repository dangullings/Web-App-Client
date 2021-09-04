import React, { Component } from "react";
import { Typography, Collapse, Input, Button } from "antd";
import { getOrderUsers, getAllOrdersByFulfilled } from "../util/APIUtils";
import moment from "moment";
import { withRouter } from "react-router-dom";
import "../styles/components/Budget.less";
import "../styles/components/Budget.css";
import { QuestionCircleOutlined } from "@ant-design/icons";

const { Panel } = Collapse;
const { Text, Link } = Typography;

class Budget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: this.props.currentUser,
      incomes: [],
      expenses: [],
      orders: [],
    };

    this.getIncomes = this.getIncomes.bind(this);
    this.getExpenses = this.getExpenses.bind(this);
    this.getBudget = this.getBudget.bind(this);
    this.getSessionIncome = this.getSessionIncome.bind(this);
    this.getEventIncome = this.getEventIncome.bind(this);
    this.getTestIncome = this.getTestIncome.bind(this);

    //this.getBudget();
  }

  getBudget() {
    this.setState({
      loading: true,
    });

    this.getIncomes();
    this.getExpenses();
  }

  getIncomes() {
    let promise;

    promise = getAllOrdersByFulfilled(0, 1000, true);

    if (!promise) {
      return;
    }

    promise
      .then((response) => {})
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  getSessionIncome() {}

  getEventIncome() {}

  getTestIncome() {}

  getOrders() {}

  getExpenses() {}

  render() {
    const {} = this.state;

    return (
      <div className="budget-container">
        <div className="budget-container-header">Budget</div>
        <div className="budget-style">
          <Collapse defaultActiveKey={["1"]} onChange={this.callback}>
            <Panel header="Income" key="1" className="income">
              <Text>Add income: </Text>
              <Input placeholder="enter amount" />
              <Button>Enter</Button>
            </Panel>
            <Panel header="Expense" key="2" className="expense">
              <Text>Add expense: </Text>
              <Input placeholder="enter amount" />
              <Button>Enter</Button>
            </Panel>
            <Panel header="Overall" key="3" className="overall">
              <p>{"yep"}</p>
            </Panel>
          </Collapse>
        </div>
      </div>
    );
  }

  callback(key) {
    console.log(key);
  }
}

export default withRouter(Budget);
