//import logo from './logo.svg';
import "./App.css";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getEmployees = async () => {
  return await axios.get(`${API_URL}/employees`);
};

export const getLeaveRequests = async () => {
  return await axios.get(`${API_URL}/leaverequests`);
};
export const getApprovalRequests = async () => {
  return await axios.get(`${API_URL}/approvalrequests`);
};
export const getProjects = async () => {
  return await axios.get(`${API_URL}/projects`);
};
