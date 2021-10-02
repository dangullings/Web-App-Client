import React, { Component } from "react";
import moment from "moment";
import {
  notification,
  Typography,
  DatePicker,
  Select,
  Card,
  Table,
  Checkbox,
  Row,
  Button,
  Layout,
  Divider,
} from "antd";
import {
  createAttendanceRecord,
  getAllStudentsByActive,
  getAllClassDatesByMonthYear,
  getAllClassDatesByMonthYearAndSession,
  getAllAttendanceByClassDateAndStudent,
  getAllSessionsByDate,
  getSessionStudents,
} from "../util/APIUtils";
import "../styles/style.less";

import { CarryOutOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Content } = Layout;

class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: moment().year(),
      month: moment().month(),
      week: "",
      isLoading: true,
      classSessions: [],
      classDates: [],
      sessions: [],
      sessionStudents: [],
      students: [],
      attendanceStates: [
        {
          classDateId: "",
          studentId: "",
          firstHour: "",
          secondHour: "",
        },
      ],
      week1Dates: [],
      week2Dates: [],
      week3Dates: [],
      week4Dates: [],
      selectedWeek: "",
      selectedSessionId: -1,
      attendanceSet: false,

      dateCols: [
        {
          title: "Student",
          dataIndex: "firstName",
          width: 50,
          fixed: "left",
          render: (text, record) => (
            <Text
              style={{
                fontSize: 14,
                backgroundColor: this.getRowColor(record),
              }}
            >
              {text} {record.lastName.substring(0, 1)}.
            </Text>
          ),
        },
      ],
    };

    this.onChange = this.onChange.bind(this);
    this.handleCheckboxChangeFactory = this.handleCheckboxChangeFactory.bind(
      this
    );
    this.resetSession = this.resetSession.bind(this);
    this.saveAttendance = this.saveAttendance.bind(this);
    this.updateAttendance = this.updateAttendance.bind(this);
    this.getSessionList();
    this.getAllStudentsList();
    this.onChange(moment());
  }

  handleCheckboxChangeFactory = (rowIndex, columnKey, record) => (event) => {
    const { classDates, attendanceStates } = this.state;
    let classDateId = 0;
    let studentId = record.id;
    let firstHour = event.target.checked;

    let classDate;
    for (classDate of classDates) {
      var subDate = String(classDate.date);
      var day = parseInt(subDate.slice(8, 10));

      if (day == columnKey.day && classDate.location == columnKey.location) {
        classDateId = classDate.id;
        break;
      }
    }

    var newAttendanceStates = attendanceStates.slice();
    var attendanceState;
    for (attendanceState of newAttendanceStates) {
      if (
        attendanceState.studentId == studentId &&
        attendanceState.classDateId == classDateId
      ) {
        attendanceState.firstHour = firstHour;
        break;
      }
    }

    this.setState({
      attendanceSet: false,
      attendanceStates: newAttendanceStates,
    });
  };

  onTabChange = (key, type) => {
    const { week1Dates, week2Dates, week3Dates, week4Dates } = this.state;
    this.state.dateCols.length = 1;

    this.setState({
      [type]: key,
      selectedWeek: key,
    });

    if (key == "Week1") {
      this.handleAddColumn(week1Dates);
    }
    if (key == "Week2") {
      this.handleAddColumn(week2Dates);
    }
    if (key == "Week3") {
      this.handleAddColumn(week3Dates);
    }
    if (key == "Week4") {
      this.handleAddColumn(week4Dates);
    }
  };

  onChange(date, dateString) {
    if (dateString == "") return;
    this.setState(
      {
        year: date.year(),
        month: date.month(),
        attendanceSet: true,
      },
      () =>
        this.getAllClassDatesBySessionId(
          date.month(),
          date.year(),
          this.state.selectedSessionId
        )
    );

    if (this.state.selectedSessionId > -1) {
      return;
    }

    this.getAllClassDatesByMonthYear(0, date.month() + 1, date.year());
  }

  getAllClassDatesBySessionId(month, year, sessionId) {
    if (sessionId > -1) {
      this.getAllClassDatesByMonthYearAndSession(month, year, sessionId);
    }
  }

  getSessionList() {
    let promise;
    promise = getAllSessionsByDate();

    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise
      .then((response) => {
        let value;
        for (value of response) {
          this.getSessionStudentsList(value);
        }
        this.setState({
          sessions: response,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  getSessionStudentsList(session) {
    let promise,
      students = [],
      sessionDatas = [];
    promise = getSessionStudents(session.id);

    if (!promise) {
      return;
    }

    this.setState({
      loading: true,
    });

    promise
      .then((response) => {
        let value;
        for (value of response) {
          const student = {
            id: value.id,
            firstName: value.firstName,
            lastName: value.lastName,
            ranks: value.ranks,
          };

          students.push(student);
        }

        const sessionData = {
          sessionId: session.id,
          students: students,
        };
        sessionDatas.push(sessionData);

        this.setState({
          sessionStudents: this.state.sessionStudents.concat(sessionDatas),
          loading: false,
        });
      })
      .catch((error) => {});
  }

  getAllClassDatesByMonthYearAndSession(month, year, session) {
    let promise;
    promise = getAllClassDatesByMonthYearAndSession(month + 1, year, session);

    if (!promise) {
      return;
    }

    this.setState({
      isLoading: true,
    });

    promise
      .then((response) => {
        this.setState(
          {
            classDates: response,
          },
          () => this.calculateWeeklyDates()
        );
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  getAllClassDatesByMonthYear(page, month, year) {
    let promise;
    promise = getAllClassDatesByMonthYear(page, 100, month, year);

    if (!promise) {
      return;
    }

    this.setState({
      isLoading: true,
    });

    promise
      .then((response) => {
        this.setState(
          {
            classDates: response.content,
          },
          () => this.calculateWeeklyDates()
        );
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  getAllAttendanceByClassDateAndStudent(classDates, students) {
    var value,
      student,
      classDate,
      promises = [],
      attendences = [];
    this.state.attendanceStates.length = 0;

    for (student of students) {
      for (classDate of classDates) {
        let promise = getAllAttendanceByClassDateAndStudent(
          classDate.id,
          student.id
        );
        promises.push(promise);
      }
    }

    Promise.all(promises).then((values) => {
      for (value of values) {
        if (value != "null") {
          attendences.push(value);
        }
      }
      this.setState(
        {
          attendanceStates: this.state.attendanceStates.concat(attendences),
        },
        () => this.createAttendanceStates()
      );
    });
  }

  getAllStudentsList(page) {
    let promise;
    promise = getAllStudentsByActive(0, 200, true);

    if (!promise) {
      return;
    }

    this.setState({
      isLoading: true,
    });

    promise
      .then((response) => {
        let studentArray = response.content;
        studentArray.sort((a, b) => (a.ranks > b.ranks ? 1 : -1));
        this.setState({
          students: studentArray,
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  calculateWeeklyDates() {
    const { classDates } = this.state;

    var sortedDays = [];
    var week1 = [],
      week2 = [],
      week3 = [],
      week4 = [];
    var week1Cut = 8;
    var week2Cut = 16;
    var week3Cut = 24;
    var d;

    if (classDates.length == 0) {
      for (var i = 0; i < 1; i++) {
        classDates.push(i);
      }
    } else {
      for (d of classDates) {
        var subDate = String(d.date);
        var dayValue = parseInt(subDate.slice(8, 10));
        var loc = d.location;

        const finalDay = {
          day: dayValue,
          location: loc,
        };
        sortedDays.push(finalDay);
      }

      sortedDays.sort((a, b) => a.day - b.day);

      for (d of sortedDays) {
        if (d.day <= week1Cut) {
          week1.push(d);
        }
        if (d.day > week1Cut && d.day <= week2Cut) {
          week2.push(d);
        }
        if (d.day > week2Cut && d.day <= week3Cut) {
          week3.push(d);
        }
        if (d.day > week3Cut) {
          week4.push(d);
        }
      }
    }

    this.setState(
      {
        week1Dates: week1,
        week2Dates: week2,
        week3Dates: week3,
        week4Dates: week4,
      },
      () =>
        this.getAllAttendanceByClassDateAndStudent(
          this.state.classDates,
          this.state.students
        )
    );
  }

  handleSessionChange = (session) => {
    const { sessionStudents } = this.state;

    if (session == -1) {
      this.getAllStudentsList();
      this.setState({
        selectedSessionId: session,
      });
      this.getAllClassDatesByMonthYear(
        0,
        this.state.month + 1,
        this.state.year
      );
      return;
    }

    let sessionId;
    let ss;
    for (ss of sessionStudents) {
      if (ss.sessionId == session) {
        sessionId = ss.sessionId;
        this.setState({
          students: ss.students,
          selectedSessionId: session,
        });
        break;
      }
    }

    this.getAllClassDatesByMonthYearAndSession(
      this.state.month,
      this.state.year,
      sessionId
    );
  };

  findMinMax(arr) {
    if (arr.length == 0) {
      return "-";
    }
    let min = arr[0].day,
      max = arr[0].day;

    for (let i = 1, len = arr.length; i < len; i++) {
      let v = arr[i].day;
      min = v < min ? v : min;
      max = v > max ? v : max;
    }

    return min + "-" + max;
  }

  getRowColor(student, indexx) {
    let index = 2;

    //if (index % 2 === 0) {
    //  return "table-row-light";
    //} else {
    //  return "table-row-dark";
    //}

    if (student.ranks.includes("Gold")) {
      if (index % 2 === 0) {
        return "#ffef99"; // #ffef99
      } else {
        return "#c8ae01"; // #c8ae01
      }
    } else if (student.ranks.includes("Green")) {
      if (index % 2 === 0) {
        return "#a5bea0"; // #a5bea0
      } else {
        return "#147800"; // #147800
      }
    } else if (student.ranks.includes("Purple")) {
      if (index % 2 === 0) {
        return "#c1a4c5"; // #c1a4c5
      } else {
        return "#a401bd"; // #a401bd
      }
    } else if (student.ranks.includes("Brown")) {
      if (index % 2 === 0) {
        return "#80756d"; // #80756d
      } else {
        return "#7d5e47"; // #7d5e47
      }
    } else if (student.ranks.includes("Red")) {
      if (index % 2 === 0) {
        return "#e0bbbb"; // #e0bbbb
      } else {
        return "#e30101"; // #e30101
      }
    } else {
      if (index % 2 === 0) {
        return "#f0f0f0"; // #f0f0f0
      } else {
        return "#c2c2c2"; // #c2c2c2
      }
    }
  }

  render() {
    const {
      isLoading,
      month,
      year,
      students,
      week1Dates,
      week2Dates,
      week3Dates,
      week4Dates,
      selectedWeek,
      dateCols,
      sessions,
      selectedSessionId,
    } = this.state;

    var sessionList = sessions.slice();
    const allSessions = {
      id: -1,
      title: "All Sessions",
      location: "",
    };
    sessionList.unshift(allSessions);

    var selectedWeekArray = [];

    if (selectedWeek == "Week1") {
      selectedWeekArray = week1Dates;
    }
    if (selectedWeek == "Week2") {
      selectedWeekArray = week2Dates;
    }
    if (selectedWeek == "Week3") {
      selectedWeekArray = week3Dates;
    }
    if (selectedWeek == "Week4") {
      selectedWeekArray = week4Dates;
    }

    let tabList = [];
    tabList = [
      {
        key: "Week1",
        tab: "Wk 1 (" + (this.findMinMax(week1Dates) + ")"),
      },
      {
        key: "Week2",
        tab: "Wk 2 (" + (this.findMinMax(week2Dates) + ")"),
      },
      {
        key: "Week3",
        tab: "Wk 3 (" + (this.findMinMax(week3Dates) + ")"),
      },
      {
        key: "Week4",
        tab: "Wk 4 (" + (this.findMinMax(week4Dates) + ")"),
      },
    ];

    let { attendanceSet } = this.state;
    const renderButton = () => {
      if (attendanceSet) {
        return (
          <Button
            icon={<CarryOutOutlined />}
            disabled
            onClick={this.saveAttendance}
            size="default"
            type="primary"
          >
            Save Attendance
          </Button>
        );
      } else {
        return (
          <Button
            icon={<CarryOutOutlined />}
            onClick={this.saveAttendance}
            size="default"
            type="primary"
          >
            Save Attendance
          </Button>
        );
      }
    };

    const month_year = [
      <DatePicker
        className="attendance"
        inputReadOnly="true"
        defaultValue={moment()}
        size={"default"}
        onChange={this.onChange}
        picker="month"
        dropdownClassName="attendance"
      />,
    ];

    const weeks = {
      Week1: (
        <Table
          size="small"
          rowClassName={(record, index) => this.getRowColor(record, index)}
          pagination={false}
          loading={isLoading}
          dataSource={students}
          columns={dateCols}
          bordered={true}
          style={{
            marginTop: 2,
            width: "100%",
            height: "100%",
          }}
          scroll={{ x: "max-content" }}
        />
      ),
      Week2: (
        <Table
          size="small"
          rowClassName={(record, index) => this.getRowColor(record, index)}
          dataSource={students}
          columns={dateCols}
          bordered={true}
          pagination={false}
          loading={isLoading}
          style={{ marginTop: 2, width: "100%", height: "100%" }}
          scroll={{ x: "max-content" }}
        />
      ),
      Week3: (
        <Table
          size="small"
          rowClassName={(record, index) => this.getRowColor(record, index)}
          pagination={false}
          dataSource={students}
          columns={dateCols}
          bordered={true}
          loading={isLoading}
          style={{ marginTop: 2, width: "100%", height: "100%" }}
          scroll={{ x: "max-content" }}
        />
      ),
      Week4: (
        <Table
          size="small"
          rowClassName={(record, index) => this.getRowColor(record, index)}
          pagination={false}
          dataSource={students}
          columns={dateCols}
          bordered={true}
          loading={isLoading}
          style={{ marginTop: 2, width: "100%", height: "100%" }}
          scroll={{ x: "max-content" }}
        />
      ),
    };

    var shortName = moment.monthsShort(month);
    const title = "Attendance " + shortName + " '" + String(year).slice(-2);
    const newTitle = [<Title level={3}>{title}</Title>];

    const newHeader = [
      <Row style={{ justifyContent: "space-between" }}>
        {newTitle}
        <Divider
          style={{
            height: 34,
          }}
          type="vertical"
        />
        {month_year}
      </Row>,
      <Row style={{ justifyContent: "space-between" }}>
        {renderButton()}
        <Select
          align="center"
          size="default"
          dropdownClassName="custom-style"
          style={{ width: "50%" }}
          Key={sessionList.id}
          onChange={this.handleSessionChange}
          placeholder={"session"}
          value={selectedSessionId}
        >
          {sessionList.map((item) => (
            <Select.Option value={item.id} key={item.id}>
              {item.title + " | " + item.location}
            </Select.Option>
          ))}
        </Select>
      </Row>,
    ];

    return (
      <Content className="attendance">
        <Card
          bodyStyle={{ padding: 1 }}
          bordered={false}
          loading={isLoading}
          title={newHeader}
          tabList={tabList}
          activeTabKey={this.state.key}
          onTabChange={(key) => {
            this.onTabChange(key, "key");
          }}
        >
          {weeks[this.state.key]}
        </Card>
      </Content>
    );
  }

  updateAttendance() {
    const { attendanceStates } = this.state;

    var attendance;
    for (attendance of attendanceStates) {
      let attendanceRecord = {
        classDateId: attendance.classDateId,
        studentId: attendance.studentId,
        firstHour: attendance.firstHour,
        secondHour: attendance.secondHour,
      };

      createAttendanceRecord(attendanceRecord)
        .then((response) => {})
        .catch((error) => {});
    }

    notification.success({
      message: "Save Successful!",
      description: "Attendance was saved.",
      duration: 2,
    });
  }

  resetSession() {
    this.getAllClassDatesByMonthYear(0, this.state.month + 1, this.state.year);
  }

  saveAttendance() {
    this.updateAttendance();

    this.setState({
      attendanceSet: true,
    });
  }

  createAttendanceStates() {
    const { classDates, students, attendanceStates } = this.state;

    let totalAttendanceRecords = classDates.length * students.length;

    if (attendanceStates.length == totalAttendanceRecords) {
      this.setState({ isLoading: false });
      this.onTabChange("Week1", "key");
      return;
    }

    var newAttendanceStates = attendanceStates.slice();

    var student, classDate, attendance, pass;
    for (student of students) {
      for (classDate of classDates) {
        pass = false;
        for (attendance of attendanceStates) {
          if (
            attendance.classDateId == classDate.id &&
            attendance.studentId == student.id
          ) {
            pass = true;
            break;
          }
        }

        if (pass) {
          continue;
        }

        let attendance = {
          classDateId: classDate.id,
          studentId: student.id,
          firstHour: false,
          secondHour: false,
        };

        newAttendanceStates.push(attendance);
      }
    }

    this.setState(
      {
        attendanceSet: false,
        attendanceStates: newAttendanceStates,
        isLoading: false,
      },
      () => this.onTabChange("Week1", "key")
    );
  }

  handleCheckboxValue(columnKey, record) {
    const { classDates, attendanceStates } = this.state;
    let classDateId = 0;
    let studentId = record.id;

    let classDate;
    for (classDate of classDates) {
      var subDate = String(classDate.date);
      var day = parseInt(subDate.slice(8, 10));

      if (day == columnKey.day && classDate.location == columnKey.location) {
        classDateId = classDate.id;
        break;
      }
    }

    var attendanceState;
    for (attendanceState of attendanceStates) {
      if (
        attendanceState.studentId == studentId &&
        attendanceState.classDateId == classDateId
      ) {
        return attendanceState.firstHour;
      }
    }

    return false;
  }

  handleAddColumn = (cols) => {
    const { dateCols, classDates } = this.state;
    var newCols = [];
    var day1App, day2App, day3App, day4App, day5App, day6App, day7App;

    for (var i = 0; i < cols.length; i++) {
      if (i == 0) {
        let classDate;
        for (classDate of classDates) {
          let subDate = String(classDate.date);
          let day = parseInt(subDate.slice(8, 10));
          if (cols[i].day == day) {
            var dt = moment(classDate.date, "YYYY-MM-DD");
            day1App =
              cols[i].location.split(" ")[0] + " " + dt.format("ddd") + " ";
            break;
          }
        }

        if (String(cols[i].day).slice(-1) == "2" && cols[i].day != 12) {
          day1App += String(cols[i].day).concat("nd");
        } else if (String(cols[i].day).slice(-1) == "3" && cols[i].day != 13) {
          day1App += String(cols[i].day).concat("rd");
        } else if (String(cols[i].day).slice(-1) == "1" && cols[i].day != 11) {
          day1App += String(cols[i].day).concat("st");
        } else {
          day1App += String(cols[i].day).concat("th");
        }
      }
      if (i == 1) {
        let classDate;
        for (classDate of classDates) {
          let subDate = String(classDate.date);
          let day = parseInt(subDate.slice(8, 10));
          if (cols[i].day == day) {
            var dt = moment(classDate.date, "YYYY-MM-DD");
            day2App =
              cols[i].location.split(" ")[0] + " " + dt.format("ddd") + " ";
            break;
          }
        }

        if (String(cols[i].day).slice(-1) == "2" && cols[i].day != 12) {
          day2App += String(cols[i].day).concat("nd");
        } else if (String(cols[i].day).slice(-1) == "3" && cols[i].day != 13) {
          day2App += String(cols[i].day).concat("rd");
        } else if (String(cols[i].day).slice(-1) == "1" && cols[i].day != 11) {
          day2App = String(cols[i].day).concat("st");
        } else {
          day2App += String(cols[i].day).concat("th");
        }
      }
      if (i == 2) {
        let classDate;
        for (classDate of classDates) {
          let subDate = String(classDate.date);
          let day = parseInt(subDate.slice(8, 10));
          if (cols[i].day == day) {
            var dt = moment(classDate.date, "YYYY-MM-DD");
            day3App =
              cols[i].location.split(" ")[0] + " " + dt.format("ddd") + " ";
            break;
          }
        }

        if (String(cols[i].day).slice(-1) == "2" && cols[i].day != 12) {
          day3App += String(cols[i].day).concat("nd");
        } else if (String(cols[i].day).slice(-1) == "3" && cols[i].day != 13) {
          day3App += String(cols[i].day).concat("rd");
        } else if (String(cols[i].day).slice(-1) == "1" && cols[i].day != 11) {
          day3App += String(cols[i].day).concat("st");
        } else {
          day3App += String(cols[i].day).concat("th");
        }
      }
      if (i == 3) {
        let classDate;
        for (classDate of classDates) {
          let subDate = String(classDate.date);
          let day = parseInt(subDate.slice(8, 10));
          if (cols[i].day == day) {
            var dt = moment(classDate.date, "YYYY-MM-DD");
            day4App =
              cols[i].location.split(" ")[0] + " " + dt.format("ddd") + " ";
            break;
          }
        }

        if (String(cols[i].day).slice(-1) == "2" && cols[i].day != 12) {
          day4App += String(cols[i].day).concat("nd");
        } else if (String(cols[i].day).slice(-1) == "3" && cols[i].day != 13) {
          day4App += String(cols[i].day).concat("rd");
        } else if (String(cols[i].day).slice(-1) == "1" && cols[i].day != 11) {
          day4App += String(cols[i].day).concat("st");
        } else {
          day4App += String(cols[i].day).concat("th");
        }
      }
      if (i == 4) {
        let classDate;
        for (classDate of classDates) {
          let subDate = String(classDate.date);
          let day = parseInt(subDate.slice(8, 10));
          if (cols[i].day == day) {
            var dt = moment(classDate.date, "YYYY-MM-DD");
            day5App =
              cols[i].location.split(" ")[0] + " " + dt.format("ddd") + " ";
            break;
          }
        }

        if (String(cols[i].day).slice(-1) == "2" && cols[i].day != 12) {
          day5App += String(cols[i].day).concat("nd");
        } else if (String(cols[i].day).slice(-1) == "3" && cols[i].day != 13) {
          day5App += String(cols[i].day).concat("rd");
        } else if (String(cols[i].day).slice(-1) == "1" && cols[i].day != 11) {
          day5App += String(cols[i].day).concat("st");
        } else {
          day5App += String(cols[i].day).concat("th");
        }
      }
      if (i == 5) {
        let classDate;
        for (classDate of classDates) {
          let subDate = String(classDate.date);
          let day = parseInt(subDate.slice(8, 10));
          if (cols[i].day == day) {
            var dt = moment(classDate.date, "YYYY-MM-DD");
            day6App =
              cols[i].location.split(" ")[0] + " " + dt.format("ddd") + " ";
            break;
          }
        }

        if (String(cols[i].day).slice(-1) == "2" && cols[i].day != 12) {
          day6App += String(cols[i].day).concat("nd");
        } else if (String(cols[i].day).slice(-1) == "3" && cols[i].day != 13) {
          day6App += String(cols[i].day).concat("rd");
        } else if (String(cols[i].day).slice(-1) == "1" && cols[i].day != 11) {
          day6App += String(cols[i].day).concat("st");
        } else {
          day6App += String(cols[i].day).concat("th");
        }
      }

      if (i == 6) {
        let classDate;
        for (classDate of classDates) {
          let subDate = String(classDate.date);
          let day = parseInt(subDate.slice(8, 10));
          if (cols[i].day == day) {
            var dt = moment(classDate.date, "YYYY-MM-DD");
            day7App =
              cols[i].location.split(" ")[0] + " " + dt.format("ddd") + " ";
            break;
          }
        }

        if (String(cols[i].day).slice(-1) == "2" && cols[i].day != 12) {
          day7App += String(cols[i].day).concat("nd");
        } else if (String(cols[i].day).slice(-1) == "3" && cols[i].day != 13) {
          day7App += String(cols[i].day).concat("rd");
        } else if (String(cols[i].day).slice(-1) == "1" && cols[i].day != 11) {
          day7App += String(cols[i].day).concat("st");
        } else {
          day7App += String(cols[i].day).concat("th");
        }
      }
    }

    let widthSet = 50;
    if (cols.length == 1) {
      const newCol1 = {
        key: cols[0],
        title: day1App,
        dataIndex: cols[0],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[0], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[0],
              record
            )}
          />
        ),
      };
      newCols.push(newCol1);
    }

    if (cols.length == 2) {
      const newCol1 = {
        key: cols[0],
        title: day1App,
        dataIndex: cols[0],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[0], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[0],
              record
            )}
          />
        ),
      };
      newCols.push(newCol1);

      const newCol2 = {
        key: cols[1],
        title: day2App,
        dataIndex: cols[1],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[1], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[1],
              record
            )}
          />
        ),
      };
      newCols.push(newCol2);
    }

    if (cols.length == 3) {
      const newCol1 = {
        key: cols[0],
        title: day1App,
        dataIndex: cols[0],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[0], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[0],
              record
            )}
          />
        ),
      };
      newCols.push(newCol1);

      const newCol2 = {
        key: cols[1],
        title: day2App,
        dataIndex: cols[1],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[1], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[1],
              record
            )}
          />
        ),
      };
      newCols.push(newCol2);

      const newCol3 = {
        key: cols[2],
        title: day3App,
        dataIndex: cols[2],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[2], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[2],
              record
            )}
          />
        ),
      };
      newCols.push(newCol3);
    }

    if (cols.length == 4) {
      const newCol1 = {
        key: cols[0],
        title: day1App,
        dataIndex: cols[0],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[0], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[0],
              record
            )}
          />
        ),
      };
      newCols.push(newCol1);

      const newCol2 = {
        key: cols[1],
        title: day2App,
        dataIndex: cols[1],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[1], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[1],
              record
            )}
          />
        ),
      };
      newCols.push(newCol2);

      const newCol3 = {
        key: cols[2],
        title: day3App,
        dataIndex: cols[2],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[2], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[2],
              record
            )}
          />
        ),
      };
      newCols.push(newCol3);

      const newCol4 = {
        key: cols[3],
        title: day4App,
        dataIndex: cols[3],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[3], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[3],
              record
            )}
          />
        ),
      };
      newCols.push(newCol4);
    }

    if (cols.length == 5) {
      const newCol1 = {
        key: cols[0],
        title: day1App,
        dataIndex: cols[0],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[0], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[0],
              record
            )}
          />
        ),
      };
      newCols.push(newCol1);

      const newCol2 = {
        key: cols[1],
        title: day2App,
        dataIndex: cols[1],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[1], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[1],
              record
            )}
          />
        ),
      };
      newCols.push(newCol2);

      const newCol3 = {
        key: cols[2],
        title: day3App,
        dataIndex: cols[2],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[2], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[2],
              record
            )}
          />
        ),
      };
      newCols.push(newCol3);

      const newCol4 = {
        key: cols[3],
        title: day4App,
        dataIndex: cols[3],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[3], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[3],
              record
            )}
          />
        ),
      };
      newCols.push(newCol4);

      const newCol5 = {
        key: cols[4],
        title: day5App,
        dataIndex: cols[4],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[4], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[4],
              record
            )}
          />
        ),
      };
      newCols.push(newCol5);
    }

    if (cols.length == 6) {
      const newCol1 = {
        key: cols[0],
        title: day1App,
        dataIndex: cols[0],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[0], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[0],
              record
            )}
          />
        ),
      };
      newCols.push(newCol1);

      const newCol2 = {
        key: cols[1],
        title: day2App,
        dataIndex: cols[1],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[1], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[1],
              record
            )}
          />
        ),
      };
      newCols.push(newCol2);

      const newCol3 = {
        key: cols[2],
        title: day3App,
        dataIndex: cols[2],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[2], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[2],
              record
            )}
          />
        ),
      };
      newCols.push(newCol3);

      const newCol4 = {
        key: cols[3],
        title: day4App,
        dataIndex: cols[3],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[3], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[3],
              record
            )}
          />
        ),
      };
      newCols.push(newCol4);

      const newCol5 = {
        key: cols[4],
        title: day5App,
        dataIndex: cols[4],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[4], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[4],
              record
            )}
          />
        ),
      };
      newCols.push(newCol5);

      const newCol6 = {
        key: cols[5],
        title: day6App,
        dataIndex: cols[5],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[5], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[5],
              record
            )}
          />
        ),
      };
      newCols.push(newCol6);
    }

    if (cols.length == 7) {
      const newCol1 = {
        key: cols[0],
        title: day1App,
        dataIndex: cols[0],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[0], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[0],
              record
            )}
          />
        ),
      };
      newCols.push(newCol1);

      const newCol2 = {
        key: cols[1],
        title: day2App,
        dataIndex: cols[1],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[1], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[1],
              record
            )}
          />
        ),
      };
      newCols.push(newCol2);

      const newCol3 = {
        key: cols[2],
        title: day3App,
        dataIndex: cols[2],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[2], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[2],
              record
            )}
          />
        ),
      };
      newCols.push(newCol3);

      const newCol4 = {
        key: cols[3],
        title: day4App,
        dataIndex: cols[3],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[3], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[3],
              record
            )}
          />
        ),
      };
      newCols.push(newCol4);

      const newCol5 = {
        key: cols[4],
        title: day5App,
        dataIndex: cols[4],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[4], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[4],
              record
            )}
          />
        ),
      };
      newCols.push(newCol5);

      const newCol6 = {
        key: cols[5],
        title: day6App,
        dataIndex: cols[5],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[5], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[5],
              record
            )}
          />
        ),
      };
      newCols.push(newCol6);

      const newCol7 = {
        key: cols[6],
        title: day7App,
        dataIndex: cols[6],
        width: widthSet,
        render: (value, record, rowIndex) => (
          <Checkbox
            checked={this.handleCheckboxValue(cols[6], record)}
            onChange={this.handleCheckboxChangeFactory(
              rowIndex,
              cols[6],
              record
            )}
          />
        ),
      };
      newCols.push(newCol7);
    }

    this.setState({
      dateCols: dateCols.concat(newCols),
    });
  };
}

export default Attendance;
