import {
  API_BASE_URL,
  POLL_LIST_SIZE,
  STUDENT_LIST_SIZE,
  ACCESS_TOKEN,
} from "../constants";

const request = (options) => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem(ACCESS_TOKEN)
    );
  }

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options)
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      if (data) {
        return JSON.parse(data);
      } else {
        return "null";
      }
    })
    .catch((error) => {
      Promise.reject(error);
    });
};

const requestImage = (options) => {
  const headers = new Headers({});

  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem(ACCESS_TOKEN)
    );
  }

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options)
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      if (data) {
        return JSON.parse(data);
      } else {
        return "null";
      }
    })
    .catch((error) => {
      Promise.reject(error);
    });
};

/* .then(response => 
    response.json().then(json => {
        if(!response.ok) {
            return Promise.reject(json);
        }
        return json;
    })
); */

/* .then(response => {
    return response.text()
  })
  .then((data) => {
    resolve(data ? JSON.parse(data) : {})
  })
  .catch((error) => {
    reject(error)
  }) */

export function chargePayment(payment) {
  console.log("chargePayment " + payment);
  return request({
    url: API_BASE_URL + "/payment/charge",
    method: "POST",
    body: JSON.stringify(payment),
  });
}

export function getLocation(id) {
  return request({
    url: API_BASE_URL + "/locations/" + id,
    method: "GET",
  });
}

export function getRanks(page, size) {
  page = page || 0;
  size = size || STUDENT_LIST_SIZE;

  return request({
    url: API_BASE_URL + "/ranks?page=" + page + "&size=" + size,
    method: "GET",
  });
}

export function createEvent(eventData) {
  return request({
    url: API_BASE_URL + "/schedule/events/saveEvent",
    method: "POST",
    body: JSON.stringify(eventData),
  });
}

export function getLocationByName(name) {
  console.log("get location bynae " + name);
  return request({
    url: API_BASE_URL + "/locations/name/" + name,
    method: "GET",
  });
}

export function getAllLocations(page, size) {
  page = page || 0;
  size = size || STUDENT_LIST_SIZE;

  return request({
    url: API_BASE_URL + "/locations?page=" + page + "&size=" + size,
    method: "GET",
  });
}

export function createLocation(locationData) {
  return request({
    url: API_BASE_URL + "/locations/saveLocation",
    method: "POST",
    body: JSON.stringify(locationData),
  });
}

export function removeLocation(id) {
  return request({
    url: API_BASE_URL + "/locations/" + id,
    method: "DELETE",
    body: JSON.stringify(id),
  });
}

export function getTest(id) {
  return request({
    url: API_BASE_URL + "/tests/" + id,
    method: "GET",
  });
}

export function getAllTests(page, size) {
  page = page || 0;
  size = size || STUDENT_LIST_SIZE;

  console.log("getalltests");
  return request({
    url: API_BASE_URL + "/tests?page=" + page + "&size=" + size,
    method: "GET",
  });
}

export function getAllSessions(page, size) {
  page = page || 0;
  size = size || STUDENT_LIST_SIZE;

  return request({
    url: API_BASE_URL + "/attendance/sessions?page=" + page + "&size=" + size,
    method: "GET",
  });
}

export function getAllSessionsByDate() {
  // most current limit 10
  return request({
    url: API_BASE_URL + "/attendance/sessions/date",
    method: "GET",
  });
}

export function getAllEventsByDate() {
  // most current limit 10
  return request({
    url: API_BASE_URL + "/schedule/events/date",
    method: "GET",
  });
}

export function getAllTestsBySearch(search, page, size) {
  page = page || 0;
  size = size || STUDENT_LIST_SIZE;

  return request({
    url:
      API_BASE_URL +
      "/tests/search/" +
      search +
      "?page=" +
      page +
      "&size=" +
      STUDENT_LIST_SIZE,
    method: "GET",
  });
}

export function createStudentEvent(data) {
  return request({
    url: API_BASE_URL + "/students/saveStudentEvent",
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function createStudentSession(data) {
  return request({
    url: API_BASE_URL + "/students/saveStudentSession",
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function createSession(sessionData) {
  return request({
    url: API_BASE_URL + "/attendance/sessions/saveSession",
    method: "POST",
    body: JSON.stringify(sessionData),
  });
}

export function createAttendanceRecord(recordData) {
  return request({
    url: API_BASE_URL + "/attendance/saveAttendance",
    method: "POST",
    body: JSON.stringify(recordData),
  });
}

export function getAllTestsByMonthYear(page, size, month, year) {
  page = page || 0;
  size = size || STUDENT_LIST_SIZE;

  console.log("get all tests by " + month + " " + year);

  return request({
    url:
      API_BASE_URL +
      "/tests/search/month/" +
      month +
      "/year/" +
      year +
      "?page=" +
      page +
      "&size=" +
      size,
    method: "GET",
  });
}

export function getAllEventsByMonthYear(page, size, month, year) {
  page = page || 0;
  size = size || STUDENT_LIST_SIZE;

  return request({
    url:
      API_BASE_URL +
      "/schedule/events/search/month/" +
      month +
      "/year/" +
      year +
      "?page=" +
      page +
      "&size=" +
      size,
    method: "GET",
  });
}

export function getAllAttendanceByClassDateAndStudent(classDateId, studentId) {
  return request({
    url: API_BASE_URL + "/attendance/" + classDateId + "/" + studentId,
    method: "GET",
  });
}

export function getAllClassDatesBySessionId(sessionId) {
  console.log("sessionId " + sessionId);
  return request({
    url: API_BASE_URL + "/attendance/classDates/sessions/" + sessionId,
    method: "GET",
  });
}

export function getStudentTests(studentId) {
  return request({
    url: API_BASE_URL + "/tests/student_scores/" + studentId + "/tests",
    method: "GET",
  });
}

export function getAllClassDatesByMonthYear(page, size, month, year) {
  page = page || 0;
  size = size || STUDENT_LIST_SIZE;

  return request({
    url:
      API_BASE_URL +
      "/attendance/classDates/search/month/" +
      month +
      "/year/" +
      year +
      "?page=" +
      page +
      "&size=" +
      size,
    method: "GET",
  });
}

export function getAllClassDatesByMonthYearAndSession(month, year, session) {
  console.log("year" + year + " month" + month + " session" + session);

  return request({
    url:
      API_BASE_URL +
      "/attendance/classDates/search/month/" +
      month +
      "/year/" +
      year +
      "/session/" +
      session,
    method: "GET",
  });
}

export function createClassDate(classDateData) {
  return request({
    url: API_BASE_URL + "/attendance/classDates/saveClassDate",
    method: "POST",
    body: JSON.stringify(classDateData),
  });
}

export function createTest(testData) {
  console.log("createTest " + testData.month);
  return request({
    url: API_BASE_URL + "/tests/saveTest",
    method: "POST",
    body: JSON.stringify(testData),
  });
}

export function removeTest(id) {
  return request({
    url: API_BASE_URL + "/tests/" + id,
    method: "DELETE",
    body: JSON.stringify(id),
  });
}

export function removeStudentTestScores(testId) {
  return request({
    url: API_BASE_URL + "/tests/student_scores/test/" + testId,
    method: "DELETE",
    body: JSON.stringify(testId),
  });
}

export function removeStudentTestScore(testId, studentId) {
  return request({
    url:
      API_BASE_URL +
      "/tests/student_scores/test/" +
      testId +
      "/student/" +
      studentId,
    method: "DELETE",
    body: JSON.stringify(testId),
  });
}

export function saveStudentTestScores(test_studentData) {
  return request({
    url: API_BASE_URL + "/tests/student_scores/saveTest_Student",
    method: "POST",
    body: JSON.stringify(test_studentData),
  });
}

export function getAllTestScoresByStudentId(page, size, studentId) {
  page = page || 0;
  size = size || STUDENT_LIST_SIZE;

  return request({
    url:
      API_BASE_URL +
      "/tests/student_scores/student/" +
      studentId +
      "?page=" +
      page +
      "&size=" +
      size,
    method: "GET",
  });
}

export function getTestScoresByStudentIdAndTestId(studentId, testId) {
  return request({
    url: API_BASE_URL + "/tests/student_scores/" + testId + "/" + studentId,
    method: "GET",
  });
}

export function getAllStudentsByTestId(testId) {
  return request({
    url: API_BASE_URL + "/tests/student_scores/" + testId + "/students/",
    method: "GET",
  });
}

export function getStudentTestScores(testId, studentId) {
  return request({
    url: API_BASE_URL + "/tests/student_scores/" + testId + "/" + studentId,
    method: "GET",
  });
}

export function getStudent(id) {
  return request({
    url: API_BASE_URL + "/students/" + id,
    method: "GET",
  });
}

export function getAllStudents(page, size, active) {
  //page = page || 0;
  //--page;
  let newPage = page - 1;
  size = size || STUDENT_LIST_SIZE;

  console.log("get " + active);

  return request({
    url:
      API_BASE_URL +
      "/students/active/" +
      active +
      "?page=" +
      newPage +
      "&size=" +
      size,
    method: "GET",
  });
}

export function getAllStudentsByActive(active) {
  return request({
    url: API_BASE_URL + "/students/active/" + active,
    method: "GET",
  });
}

export function getMyPeeps(userId) {
  return request({
    url: API_BASE_URL + "/users/" + userId + "/group",
    method: "GET",
  });
}

export function createUserStudent(userStudent) {
  console.log(
    "user student save" + userStudent.userId + " " + userStudent.studentId
  );
  return request({
    url: API_BASE_URL + "/user_students/saveUserStudent",
    method: "POST",
    body: JSON.stringify(userStudent),
  });
}

export function getStudentSessions(studentId) {
  console.log("student id " + studentId);
  return request({
    url: API_BASE_URL + "/students/" + studentId + "/sessions",
    method: "GET",
  });
}

export function getStudentEvents(studentId) {
  console.log("student id " + studentId);
  return request({
    url: API_BASE_URL + "/students/" + studentId + "/events",
    method: "GET",
  });
}

export function getSessionStudents(sessionId) {
  console.log("session id " + sessionId);
  return request({
    url: API_BASE_URL + "/attendance/sessions/" + sessionId + "/students",
    method: "GET",
  });
}

export function getAllStudentsBySearch(page, size, searchText, active) {
  //page = page || 0;
  let newPage = page - 1;
  size = size || STUDENT_LIST_SIZE;

  console.log("active " + active);

  return request({
    url:
      API_BASE_URL +
      "/students/search/" +
      searchText +
      "/active/" +
      active +
      "?page=" +
      newPage +
      "&size=" +
      size,
    method: "GET",
  });
}

export function createStudent(studentData) {
  console.log(
    "student save" + studentData.id + " name" + studentData.firstName
  );
  return request({
    url: API_BASE_URL + "/students/saveStudent",
    method: "POST",
    body: JSON.stringify(studentData),
  });
}

export function removeStudent(id) {
  return request({
    url: API_BASE_URL + "/students/" + id,
    method: "DELETE",
    body: JSON.stringify(id),
  });
}

export function getAllItemsByActiveSearch(page, size, search) {
  page = page || 0;
  size = size || STUDENT_LIST_SIZE;
  console.log("page " + page + " size " + size + " search " + search);
  return request({
    url:
      API_BASE_URL +
      "/items/search/" +
      search +
      "?page=" +
      page +
      "&size=" +
      size,
    method: "GET",
  });
}

export function getAllItemsByActive() {
  return request({
    url: API_BASE_URL + "/items/active",
    method: "GET",
  });
}

export function createItemImage(file) {
  return requestImage({
    url: API_BASE_URL + "/items/saveItemImage",
    method: "POST",
    body: file,
  });
}

export function createItem(itemData) {
  return request({
    url: API_BASE_URL + "/items/saveItem",
    method: "POST",
    body: JSON.stringify(itemData),
  });
}

export function removeItem(id) {
  return request({
    url: API_BASE_URL + "/items/" + id,
    method: "DELETE",
    body: JSON.stringify(id),
  });
}

export function getItem(id) {
  return request({
    url: API_BASE_URL + "/items/" + id,
    method: "GET",
  });
}

export function removeItemImage(id) {
  return request({
    url: API_BASE_URL + "/items/image/" + id,
    method: "DELETE",
    body: JSON.stringify(id),
  });
}

export function getImageByItem(id) {
  return request({
    url: API_BASE_URL + "/items/image/" + id,
    method: "GET",
  });
}

export function getAllItems(page, size) {
  //page = page || 0;
  --page;
  size = size || STUDENT_LIST_SIZE;

  return request({
    url: API_BASE_URL + "/items?page=" + page + "&size=" + size,
    method: "GET",
  });
}

export function getAllItemsBySearch(page, size, search) {
  page = page || 0;
  size = size || STUDENT_LIST_SIZE;

  return request({
    url:
      API_BASE_URL +
      "/items/search/" +
      search +
      "?page=" +
      page +
      "&size=" +
      size,
    method: "GET",
  });
}

export function getAllPolls(page, size) {
  page = page || 0;
  size = size || POLL_LIST_SIZE;

  return request({
    url: API_BASE_URL + "/polls?page=" + page + "&size=" + size,
    method: "GET",
  });
}

export function createPoll(pollData) {
  return request({
    url: API_BASE_URL + "/polls",
    method: "POST",
    body: JSON.stringify(pollData),
  });
}

export function castVote(voteData) {
  return request({
    url: API_BASE_URL + "/polls/" + voteData.pollId + "/votes",
    method: "POST",
    body: JSON.stringify(voteData),
  });
}

export function login(loginRequest) {
  return request({
    url: API_BASE_URL + "/auth/signin",
    method: "POST",
    body: JSON.stringify(loginRequest),
  });
}

export function signup(signupRequest) {
  return request({
    url: API_BASE_URL + "/auth/signup",
    method: "POST",
    body: JSON.stringify(signupRequest),
  });
}

export function checkUsernameAvailability(username) {
  return request({
    url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
    method: "GET",
  });
}

export function checkEmailAvailability(email) {
  return request({
    url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
    method: "GET",
  });
}

export function getCurrentUser() {
  console.log("getCurrentUser before");
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  console.log("getCurrentUser");
  return request({
    url: API_BASE_URL + "/user/me",
    method: "GET",
  });
}

export function getUserProfile(username) {
  return request({
    url: API_BASE_URL + "/users/" + username,
    method: "GET",
  });
}

export function getUserCreatedPolls(username, page, size) {
  page = page || 0;
  size = size || POLL_LIST_SIZE;

  return request({
    url:
      API_BASE_URL +
      "/users/" +
      username +
      "/polls?page=" +
      page +
      "&size=" +
      size,
    method: "GET",
  });
}

export function getUserVotedPolls(username, page, size) {
  page = page || 0;
  size = size || POLL_LIST_SIZE;

  return request({
    url:
      API_BASE_URL +
      "/users/" +
      username +
      "/votes?page=" +
      page +
      "&size=" +
      size,
    method: "GET",
  });
}
