export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://kkc-webapp-backend.herokuapp.com/api"; //'http://192.168.1.18:8080/api' , 'http://localhost:8080/api'  https://kkc-webapp-backend.herokuapp.com/api
export const ACCESS_TOKEN = "accessToken";

export const STUDENT_LIST_SIZE = 50;

export const POLL_LIST_SIZE = 30;
export const MAX_CHOICES = 6;
export const POLL_QUESTION_MAX_LENGTH = 140;
export const POLL_CHOICE_MAX_LENGTH = 40;

export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 40;

export const USERNAME_MIN_LENGTH = 2;
export const USERNAME_MAX_LENGTH = 20;

export const EMAIL_MAX_LENGTH = 40;

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 20;
