import { API_BASE_URL, STUDENT_LIST_SIZE, ACCESS_TOKEN } from "../constants";

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

export function getAllBlogsByActive(page, size, active) {
  page = page || 0;
  size = size || STUDENT_LIST_SIZE;

  return request({
    url:
      API_BASE_URL +
      "/blogs/active/" +
      active +
      "?page=" +
      page +
      "&size=" +
      size,
    method: "GET",
  });
}

export function saveBlog(data) {
  return request({
    url:
      API_BASE_URL +
      "/blogs/save/id/" +
      data.id +
      "/active/" +
      data.active +
      "/date/" +
      data.date +
      "/author/" +
      data.author +
      "/imageId/" +
      data.imageId,
    method: "POST",
    body: JSON.stringify(data.data),
  });
}

export function getBlog(id) {
  return request({
    url: API_BASE_URL + "/blogs/" + id,
    method: "GET",
  });
}

export function removeBlog(id) {
  return request({
    url: API_BASE_URL + "/blogs/" + id,
    method: "DELETE",
    body: JSON.stringify(id),
  });
}

export function chargePayment(payment) {
  return request({
    url: API_BASE_URL + "/payment/create-payment-intent",
    method: "POST",
    body: JSON.stringify(payment),
  });
}

export function getItemImage(id) {
  return request({
    url: API_BASE_URL + "/items/image/" + id,
    method: "GET",
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

export function getAllEvents(page, size) {
  page = page || 0;
  size = size || STUDENT_LIST_SIZE;

  return request({
    url: API_BASE_URL + "/schedule/events?page=" + page + "&size=" + size,
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

export function getAllSessionsByDateAsc() {
  // most current limit 10
  return request({
    url: API_BASE_URL + "/attendance/sessions/date/asc",
    method: "GET",
  });
}

export function getAllEventsByDateAsc() {
  // most current limit 10
  return request({
    url: API_BASE_URL + "/schedule/events/date/asc",
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

export function createStudentUser(data) {
  return request({
    url: API_BASE_URL + "/user_students/saveUserStudent",
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function createStudentEvent(data) {
  return request({
    url: API_BASE_URL + "/studentevents/saveStudentEvent",
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function createStudentSession(data) {
  return request({
    url: API_BASE_URL + "/studentsessions/saveStudentSession",
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

export function createOrder(order) {
  return request({
    url: API_BASE_URL + "/orders/saveOrder",
    method: "POST",
    body: JSON.stringify(order),
  });
}

export function createLineItem(lineItem) {
  return request({
    url: API_BASE_URL + "/lineitems/saveLineItem",
    method: "POST",
    body: JSON.stringify(lineItem),
  });
}

export function removeStudentEventByStudentId(studentId) {
  return request({
    url: API_BASE_URL + "/studentevents/student/" + studentId,
    method: "DELETE",
    body: JSON.stringify(studentId),
  });
}

export function removeStudentEventByEventIdAndStudentId(eventId, studentId) {
  return request({
    url:
      API_BASE_URL +
      "/studentevents/event/" +
      eventId +
      "/student/" +
      studentId,
    method: "DELETE",
    body: JSON.stringify(studentId),
  });
}

export function removeStudentUserByUserIdAndStudentId(userId, studentId) {
  return request({
    url:
      API_BASE_URL + "/user_students/user/" + userId + "/student/" + studentId,
    method: "DELETE",
    body: JSON.stringify(studentId),
  });
}

export function removeStudentSessionBySessionIdAndStudentId(
  sessionId,
  studentId
) {
  return request({
    url:
      API_BASE_URL +
      "/studentsessions/session/" +
      sessionId +
      "/student/" +
      studentId,
    method: "DELETE",
    body: JSON.stringify(studentId),
  });
}

export function removeStudentSessionByStudentId(studentId) {
  return request({
    url: API_BASE_URL + "/studentsessions/student/" + studentId,
    method: "DELETE",
    body: JSON.stringify(studentId),
  });
}

export function removeAttendanceByStudentId(studentId) {
  return request({
    url: API_BASE_URL + "/attendance/student/" + studentId,
    method: "DELETE",
    body: JSON.stringify(studentId),
  });
}

export function removeUserPeepsByStudentId(studentId) {
  return request({
    url: API_BASE_URL + "/user_students/student/" + studentId,
    method: "DELETE",
    body: JSON.stringify(studentId),
  });
}

export function removeClassDatesBySessionId(sessionId) {
  return request({
    url: API_BASE_URL + "/attendance/classDates/session/" + sessionId,
    method: "DELETE",
    body: JSON.stringify(sessionId),
  });
}

export function removeStudentTestScores(testId) {
  return request({
    url: API_BASE_URL + "/tests/student_scores/test/" + testId,
    method: "DELETE",
    body: JSON.stringify(testId),
  });
}

export function removeStudentTestsByStudentId(studentId) {
  return request({
    url: API_BASE_URL + "/tests/student_scores/student/" + studentId,
    method: "DELETE",
    body: JSON.stringify(studentId),
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

export function removeStudentEventsByEventId(eventId) {
  return request({
    url: API_BASE_URL + "/studentevents/event/" + eventId,
    method: "DELETE",
    body: JSON.stringify(eventId),
  });
}

export function removeStudentSessionsBySessionId(sessionId) {
  return request({
    url: API_BASE_URL + "/studentsessions/session/" + sessionId,
    method: "DELETE",
    body: JSON.stringify(sessionId),
  });
}

export function removeSessionById(id) {
  return request({
    url: API_BASE_URL + "/attendance/sessions/" + id,
    method: "DELETE",
    body: JSON.stringify(id),
  });
}

export function removeStudentEvent(eventId, studentId) {
  return request({
    url:
      API_BASE_URL +
      "/studentevents/event/" +
      eventId +
      "/student/" +
      studentId,
    method: "DELETE",
    body: JSON.stringify(eventId),
  });
}

export function removeEventById(id) {
  return request({
    url: API_BASE_URL + "/schedule/events/" + id,
    method: "DELETE",
    body: JSON.stringify(id),
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

export function getStudentEventsByEventId(eventId) {
  return request({
    url: API_BASE_URL + "/studentevents/event/" + eventId,
    method: "GET",
  });
}

export function getStudentSessionsBySessionId(sessionId) {
  return request({
    url: API_BASE_URL + "/studentsessions/session/" + sessionId,
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

export function getEvent(id) {
  return request({
    url: API_BASE_URL + "/schedule/events/" + id,
    method: "GET",
  });
}

export function getSession(id) {
  return request({
    url: API_BASE_URL + "/attendance/sessions/" + id,
    method: "GET",
  });
}

export function updateUser(userData) {
  return request({
    url: API_BASE_URL + "/saveUser",
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function removeUser(id) {
  return request({
    url: API_BASE_URL + "/user/" + id,
    method: "DELETE",
    body: JSON.stringify(id),
  });
}

export function getAllUsers(page, size) {
  let newPage = page - 1;
  size = size || STUDENT_LIST_SIZE;

  return request({
    url: API_BASE_URL + "/users" + "?page=" + newPage + "&size=" + size,
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

export function getAllStudentsByActive(page, size, active) {
  let newPage = page - 1;
  size = size || STUDENT_LIST_SIZE;
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
    url: API_BASE_URL + "/studentsessions/" + studentId + "/sessions",
    method: "GET",
  });
}

export function getStudentEvents(studentId) {
  console.log("student id " + studentId);
  return request({
    url: API_BASE_URL + "/studentevents/" + studentId + "/events",
    method: "GET",
  });
}

export function getEventStudents(eventId) {
  console.log("session id " + eventId);
  return request({
    url: API_BASE_URL + "/attendance/events/" + eventId + "/events",
    method: "GET",
  });
}

export function getAllStudentsByEventId(eventId) {
  return request({
    url: API_BASE_URL + "/studentevents/" + eventId + "/students/",
    method: "GET",
  });
}

export function getAllStudentsBySessionId(sessionId) {
  return request({
    url: API_BASE_URL + "/studentsessions/" + sessionId + "/students/",
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

export function removeOrder(id) {
  return request({
    url: API_BASE_URL + "/orders/" + id,
    method: "DELETE",
    body: JSON.stringify(id),
  });
}

export function removeLineItem(id) {
  return request({
    url: API_BASE_URL + "/lineitems/lineitem/" + id,
    method: "DELETE",
    body: JSON.stringify(id),
  });
}

export function removeLineItemByOrderId(orderId) {
  return request({
    url: API_BASE_URL + "/lineitems/order/" + orderId,
    method: "DELETE",
    body: JSON.stringify(orderId),
  });
}

export function getOrders(page, size) {
  //page = page || 0;
  --page;
  size = size || STUDENT_LIST_SIZE;

  return request({
    url: API_BASE_URL + "/orders?page=" + page + "&size=" + size,
    method: "GET",
  });
}

export function getOrder(id) {
  return request({
    url: API_BASE_URL + "/orders/" + id,
    method: "GET",
  });
}

export function getOrderUsers(orderId) {
  console.log("order id " + orderId);
  return request({
    url: API_BASE_URL + "/orders/" + orderId + "/users",
    method: "GET",
  });
}

export function getOrderLineItems(orderId) {
  console.log("order id " + orderId);
  return request({
    url: API_BASE_URL + "/orders/" + orderId + "/lineItems",
    method: "GET",
  });
}

export function getAllOrdersByFulfilled(page, size, fulfilled) {
  //page = page || 0;
  let newPage = page - 1;
  size = size || STUDENT_LIST_SIZE;
  return request({
    url:
      API_BASE_URL +
      "/orders/fulfilled/" +
      fulfilled +
      "?page=" +
      newPage +
      "&size=" +
      size,
    method: "GET",
  });
}

export function getAllOrdersBySearch(page, size, searchText, fulfilled) {
  //page = page || 0;
  let newPage = page - 1;
  size = size || STUDENT_LIST_SIZE;

  return request({
    url:
      API_BASE_URL +
      "/orders/search/" +
      searchText +
      "/fulfilled/" +
      fulfilled +
      "?page=" +
      newPage +
      "&size=" +
      size,
    method: "GET",
  });
}

export function getAllItemsBySearchAndType(
  page,
  size,
  searchText,
  type,
  active
) {
  //page = page || 0;
  let newPage = page - 1;
  size = size || STUDENT_LIST_SIZE;

  console.log("search and type" + searchText + " " + type);

  return request({
    url:
      API_BASE_URL +
      "/items/search/" +
      searchText +
      "/type/" +
      type +
      "/active/" +
      active +
      "?page=" +
      newPage +
      "&size=" +
      size,
    method: "GET",
  });
}

export function getAllItemsByType(page, size, type, active) {
  //page = page || 0;
  let newPage = page - 1;
  size = size || STUDENT_LIST_SIZE;

  return request({
    url:
      API_BASE_URL +
      "/items/type/" +
      type +
      "/active/" +
      active +
      "?page=" +
      newPage +
      "&size=" +
      size,
    method: "GET",
  });
}

export function getAllItemsBySearch(page, size, searchText, active) {
  //page = page || 0;
  let newPage = page - 1;
  size = size || STUDENT_LIST_SIZE;

  console.log("search" + searchText);

  return request({
    url:
      API_BASE_URL +
      "/items/search/" +
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

export function getAllItemsByActive(page, size, active) {
  page = page || 0;
  size = size || STUDENT_LIST_SIZE;
  console.log("active " + active);
  return request({
    url:
      API_BASE_URL +
      "/items/active/" +
      active +
      "?page=" +
      page +
      "&size=" +
      size,
    method: "GET",
  });
}

export function createImage(file, id) {
  return requestImage({
    url: API_BASE_URL + "/images/saveImage/" + id,
    method: "POST",
    body: file,
  });
}

export function createItemImage(file, id) {
  return requestImage({
    url: API_BASE_URL + "/items/saveItemImage/" + id,
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

export function removeItemById(id) {
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

export function removeImage(id) {
  return request({
    url: API_BASE_URL + "/images/image/" + id,
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

export function getImage(id) {
  console.log("getImage " + id);
  return request({
    url: API_BASE_URL + "/images/image/" + id,
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

export function getAllItemsByOnlySearch(page, size, search) {
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

export function changePassword(user) {
  return request({
    url: API_BASE_URL + "/change_password",
    method: "POST",
    body: JSON.stringify(user),
  });
}

export function forgotPassword(email) {
  return request({
    url: API_BASE_URL + "/forgot_password",
    method: "POST",
    body: JSON.stringify(email),
  });
}

export function resetPassword(email) {
  return request({
    url: API_BASE_URL + "/reset_password",
    method: "POST",
    body: JSON.stringify(email),
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

export function getUser(id) {
  return request({
    url: API_BASE_URL + "/user/" + id,
    method: "GET",
  });
}
