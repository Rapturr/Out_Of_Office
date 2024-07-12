import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LeaveRequestList = ({ Loggeduser }) => {
  const [requests, setRequests] = useState([]);
  const [inputText, setInputText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
  };

  const fetchRequests = async () => {
    const result = await axios.get("http://localhost:5000/api/leave-requests");
    setRequests(result.data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const inputHandler = (e) => {
    setInputText(e.target.value.toLowerCase());
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedRequests = [...requests].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredRequests = sortedRequests.filter((request) =>
    request.request_number.toLowerCase().includes(inputText)
  );

  const handleViewDetails = async (id) => {
    const result = await axios.get(
      `http://localhost:5000/api/leave-requests/${id}`
    );
    setSelectedRequest(result.data);
  };

  return (
    <div>
      <button
        onClick={() => {
          logout();
        }}
      >
        Logout
      </button>
      <h1>Leave Requests</h1>
      <div className="search">
        <input
          type="text"
          onChange={inputHandler}
          placeholder="Search by request number"
        />
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("request_number")}>
              Request Number{" "}
              {sortConfig.key === "request_number"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : null}
            </th>
            <th onClick={() => handleSort("status")}>
              Status{" "}
              {sortConfig.key === "status"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : null}
            </th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.request_number}</td>
              <td>{request.status}</td>
              <td>{request.start_date}</td>
              <td>{request.end_date}</td>
              <td>
                <button onClick={() => handleViewDetails(request.id)}>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedRequest && (
        <RequestDetails
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
};

const RequestDetails = ({ request, onClose }) => {
  return (
    <div>
      <h2>Request Details</h2>
      <p>Request Number: {request.request_number}</p>
      <p>Status: {request.status}</p>
      <p>Start Date: {request.start_date}</p>
      <p>End Date: {request.end_date}</p>
      <p>Reason: {request.reason}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default LeaveRequestList;
