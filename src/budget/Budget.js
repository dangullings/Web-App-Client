import React, { Component } from "react";
import {
  Typography,
  Collapse,
  Input,
  Button,
  List,
  Row,
  DatePicker,
} from "antd";
import {
  getAllOrdersByFulfilled,
  getAllEvents,
  getAllTests,
  getAllSessions,
  getStudentSessionsBySessionId,
  getStudentEventsByEventId,
  getTestScoresByTestId,
  getBudget,
  createBudget,
} from "../util/APIUtils";
import moment from "moment";
import { withRouter } from "react-router-dom";
import "../styles/components/Budget.less";
import "../styles/components/Budget.css";
import { QuestionCircleOutlined } from "@ant-design/icons";

const { Panel } = Collapse;
const { Text, Link, Title } = Typography;

class Budget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: this.props.currentUser,
      income: "",
      expenses: [],
      budgetIncome: "",
      budgetExpense: "",
      totalIncome: 0,
      totalExpense: 0,
      inputIncome: 0,
      inputExpense: 0,
      inputIncomeNote: "",
      inputExpenseNote: "",
      beginDate: moment().subtract(1, "years"),
      endDate: moment(),
    };

    this.getIncomes = this.getIncomes.bind(this);
    this.getExpenses = this.getExpenses.bind(this);
    this.getBudget = this.getBudget.bind(this);
    this.getSessionIncome = this.getSessionIncome.bind(this);
    this.getEventIncome = this.getEventIncome.bind(this);
    this.getTestIncome = this.getTestIncome.bind(this);
    this.submitIncome = this.submitIncome.bind(this);
    this.onChangeIncomeNote = this.onChangeIncomeNote.bind(this);
    this.onChangeIncomeAmount = this.onChangeIncomeAmount.bind(this);
    this.submitExpense = this.submitExpense.bind(this);
    this.onChangeExpenseNote = this.onChangeExpenseNote.bind(this);
    this.onChangeExpenseAmount = this.onChangeExpenseAmount.bind(this);
    this.onBeginDateChange = this.onBeginDateChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);

    this.getIncomeBudgetTransactions();
    this.getExpenseBudgetTransactions();
    //this.getBudget();
  }

  getBudget() {
    this.getIncomes();
    this.getExpenses();
  }

  getIncomes() {
    this.getOrders();
  }

  getOrders() {
    let promise;

    promise = getAllOrdersByFulfilled(0, 1000, true);

    if (!promise) {
      return;
    }

    promise
      .then((response) => {
        this.getSessionIncome(response.content);
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  getSessionIncome(orders) {
    let promise;

    promise = getAllSessions(0, 1000);

    if (!promise) {
      return;
    }

    promise
      .then((response) => {
        this.getEventIncome(orders, response.content);
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  getEventIncome(orders, sessions) {
    let promise;

    promise = getAllEvents(0, 1000);

    if (!promise) {
      return;
    }

    promise
      .then((response) => {
        this.getTestIncome(orders, sessions, response.content);
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  getTestIncome(orders, sessions, events) {
    let promise;

    promise = getAllTests(0, 1000);

    if (!promise) {
      return;
    }

    promise
      .then((response) => {
        let income = {
          orders: orders,
          sessions: sessions,
          events: events,
          tests: response.content,
        };
        this.getIncomeContinued(income);
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  getIncomeContinued(income) {
    let session, event, test;
    let sessionStudentPromises = [];
    let eventStudentPromises = [];
    let testStudentPromises = [];

    for (session of income.sessions) {
      let promise = getStudentSessionsBySessionId(session.id);
      sessionStudentPromises.push(promise);
    }

    for (event of income.events) {
      let promise = getStudentEventsByEventId(event.id);
      eventStudentPromises.push(promise);
    }

    for (test of income.tests) {
      let promise = getTestScoresByTestId(test.id);
      testStudentPromises.push(promise);
    }

    Promise.all(sessionStudentPromises).then((sessionStudents) => {
      Promise.all(eventStudentPromises).then((eventStudents) => {
        Promise.all(testStudentPromises).then((testStudents) => {
          let newIncome = {
            orders: income.orders,
            sessions:
              sessionStudents.length === undefined
                ? sessionStudents
                : sessionStudents[0],
            events:
              eventStudents.length === undefined
                ? eventStudents
                : eventStudents[0],
            tests:
              testStudents.length === undefined
                ? testStudents
                : testStudents[0],
          };

          this.setState(
            {
              income: newIncome,
            },
            () => this.tallyIncomes(newIncome)
          );
        });
      });
    });
  }

  tallyIncomes(income) {
    let tally;
    var totalIncome = 0;

    for (tally of income) {
      totalIncome = totalIncome + tally.amount;
    }

    let roundedIncome = Math.round(totalIncome * 100) / 100;

    this.setState({
      totalIncome: roundedIncome,
    });

    /* for (tally of income.orders) {
      totalIncome = totalIncome + tally.price;
    }

    for (tally of income.sessions) {
      totalIncome = totalIncome + tally.paid;
    }

    for (tally of income.events) {
      totalIncome = totalIncome + tally.paid;
    }

    for (tally of income.tests) {
      totalIncome = totalIncome + tally.paidAmount;
    }

    this.setState(
      {
        totalIncome: totalIncome,
      },
      () => this.getIncomeBudgetTransactions(),
      this.getExpenseBudgetTransactions()
    ); */
  }

  tallyExpenses(expense) {
    let tally;
    var totalExpense = 0;

    for (tally of expense) {
      totalExpense = totalExpense + tally.amount;
    }

    let roundedExpense = Math.round(totalExpense * 100) / 100;

    this.setState({
      totalExpense: roundedExpense,
    });
  }

  getIncomeBudgetTransactions() {
    const { beginDate, endDate } = this.state;

    let newBeginDate = beginDate.format("YYYY-MM-DD");
    let newEndDate = endDate.format("YYYY-MM-DD");
    let promise;

    promise = getBudget(0, 1000, false, newBeginDate, newEndDate);

    if (!promise) {
      return;
    }

    promise
      .then((response) => {
        this.setState(
          {
            loading: false,
            budgetIncome: response.content,
          },
          () => this.tallyIncomes(response.content)
        );
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  getExpenseBudgetTransactions() {
    const { beginDate, endDate } = this.state;

    let newBeginDate = beginDate.format("YYYY-MM-DD");
    let newEndDate = endDate.format("YYYY-MM-DD");
    let promise;

    promise = getBudget(0, 1000, true, newBeginDate, newEndDate);

    if (!promise) {
      return;
    }

    promise
      .then((response) => {
        this.setState(
          {
            loading: false,
            budgetExpense: response.content,
          },
          () => this.tallyExpenses(response.content)
        );
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  getExpenses() {}

  submitIncome() {
    let budget = {
      id: "",
      date: moment().format("YYYY-MM-DD"),
      expense: false,
      amount: this.state.inputIncome,
      assignRef: "",
      type: "custom",
      note: this.state.inputIncomeNote,
    };

    let newBudgetIncome = [budget].concat(this.state.budgetIncome);

    let incomeAmt = parseFloat(this.state.inputIncome);
    let totalIncomeAmt = parseFloat(this.state.totalIncome);
    let totalIncome = totalIncomeAmt + incomeAmt;

    createBudget(budget)
      .then((response) => {
        this.setState({
          budgetIncome: newBudgetIncome,
          totalIncome: totalIncome,
          inputIncome: 0,
          inputIncomeNote: "",
        });
      })
      .catch((error) => {});
  }

  submitExpense() {
    let budget = {
      id: "",
      date: moment().format("YYYY-MM-DD"),
      expense: true,
      amount: this.state.inputExpense,
      assignRef: "",
      type: "custom",
      note: this.state.inputExpenseNote,
    };

    let newBudgetExpense = [budget].concat(this.state.budgetExpense);

    let expenseAmt = parseFloat(this.state.inputExpense);
    let totalExpenseAmt = parseFloat(this.state.totalExpense);
    let totalExpense = totalExpenseAmt + expenseAmt;

    createBudget(budget)
      .then((response) => {
        this.setState({
          budgetExpense: newBudgetExpense,
          totalExpense: totalExpense,
          inputExpense: 0,
          inputExpenseNote: "",
        });
      })
      .catch((error) => {});
  }

  onChangeIncomeNote(event) {
    const value = event.target.value;
    this.setState({
      inputIncomeNote: value,
    });
  }

  onChangeExpenseNote(event) {
    const value = event.target.value;
    this.setState({
      inputExpenseNote: value,
    });
  }

  onChangeIncomeAmount(event) {
    const value = event.target.value;
    this.setState({
      inputIncome: value,
    });
  }

  onChangeExpenseAmount(event) {
    const value = event.target.value;
    this.setState({
      inputExpense: value,
    });
  }

  onBeginDateChange(date, dateString) {
    if (dateString == "") return;
    this.setState(
      {
        beginDate: date,
      },
      () => this.getIncomeBudgetTransactions(),
      this.getExpenseBudgetTransactions()
    );
  }

  onEndDateChange(date, dateString) {
    if (dateString == "") return;
    this.setState(
      {
        endDate: date,
      },
      () => this.getIncomeBudgetTransactions(),
      this.getExpenseBudgetTransactions()
    );
  }

  render() {
    const {
      budgetIncome,
      budgetExpense,
      incomes,
      totalIncome,
      totalExpense,
      beginDate,
      endDate,
    } = this.state;

    return (
      <div className="budget-container">
        <div className="budget-container-header">
          Budget
          <Row style={{ marginRight: 20, marginTop: 5, marginBottom: 0 }}>
            <DatePicker
              inputReadOnly="true"
              align="center"
              placeholder={"begin"}
              onChange={this.onBeginDateChange}
              style={{
                display: "inline",
                width: "calc(50%)",
              }}
              value={beginDate}
              dropdownClassName="budget-style"
            />
            <DatePicker
              inputReadOnly="true"
              align="center"
              placeholder={"end"}
              onChange={this.onEndDateChange}
              style={{
                display: "inline",
                width: "calc(50%)",
              }}
              value={endDate}
              dropdownClassName="budget-style"
            />
          </Row>
        </div>
        <div className="budget-style">
          <Collapse defaultActiveKey={["1"]} onChange={this.callback}>
            <Panel
              header={"Income $" + totalIncome.toFixed(2)}
              key="1"
              className="income"
            >
              <Text
                style={{
                  paddingLeft: "6px",
                  marginBottom: "20px",
                  fontSize: "18px",
                }}
              >
                Add income
              </Text>

              <Row>
                <Input
                  className="note"
                  onChange={this.onChangeIncomeNote}
                  placeholder="note"
                  value={this.state.inputIncomeNote}
                />
                <Input
                  onChange={this.onChangeIncomeAmount}
                  onClick={this.clearInput}
                  placeholder="$"
                  value={this.state.inputIncome}
                />
                <Button onClick={this.submitIncome}>Enter</Button>
              </Row>
              <List
                header={<div>Transactions</div>}
                bordered
                dataSource={budgetIncome}
                size={"small"}
                renderItem={(item) => (
                  <List.Item>
                    <Title>
                      {item.type} {" | "} {item.note}
                    </Title>
                    <div className="testme">
                      <div className="date">{item.date}</div>{" "}
                      <div className="amount">${item.amount.toFixed(2)}</div>
                    </div>
                  </List.Item>
                )}
              />
            </Panel>
            <Panel
              header={"Expense $" + totalExpense.toFixed(2)}
              key="2"
              className="expense"
            >
              <Text
                style={{
                  paddingLeft: "6px",
                  marginBottom: "20px",
                  fontSize: "18px",
                }}
              >
                Add expense
              </Text>

              <Row>
                <Input
                  className="note"
                  onChange={this.onChangeExpenseNote}
                  placeholder="note"
                  value={this.state.inputExpenseNote}
                />
                <Input
                  onChange={this.onChangeExpenseAmount}
                  placeholder="$"
                  value={this.state.inputExpense}
                />
                <Button onClick={this.submitExpense}>Enter</Button>
              </Row>

              <List
                header={<div>Transactions</div>}
                bordered
                dataSource={budgetExpense}
                size={"small"}
                renderItem={(item) => (
                  <List.Item>
                    <Title>
                      {item.type} {" | "} {item.note}
                    </Title>
                    <div className="testme">
                      <div className="date">{item.date}</div>{" "}
                      <div className="amount">${item.amount.toFixed(2)}</div>
                    </div>
                  </List.Item>
                )}
              />
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
