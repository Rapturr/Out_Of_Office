import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigator from "./Navigator";

const ApprovalRequests = ({ Loggeduser }) => {
  const [requests, setRequests] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [inputText, setInputText] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const result = await axios.get(
        `http://localhost:5000/api/personal-approval-requests/${Loggeduser}`
      );
      setRequests(result.data);
    } catch (error) {
      console.error("Error fetching approval requests:", error);
    }
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
    request.id.toString().includes(inputText)
  );

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setComment(request.comment || "");
  };

  const handleApprove = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/approval-requests/${selectedRequest.id}`,
        {
          status: "Approved",
          comment,
        }
      );
      fetchRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/approval-requests/${selectedRequest.id}`,
        {
          status: "Rejected",
          comment,
        }
      );
      fetchRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };
  if (Loggeduser == 1 || Loggeduser == 2)
    return (
      <div>
        <Navigator />
        <h1>Approval Requests</h1>
        <div className="search">
          <input
            type="text"
            onChange={(e) => setInputText(e.target.value.toLowerCase())}
            placeholder="Search by request number"
          />
        </div>
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("id")}>
                Request Number{" "}
                {sortConfig.key === "id"
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.status}</td>
                <td>
                  <button onClick={() => handleViewDetails(request)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedRequest && (
          <div>
            <h2>Request Details</h2>
            <p>Request Number: {selectedRequest.id}</p>
            <p>Status: {selectedRequest.status}</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comment"
            />
            <button onClick={handleApprove}>Approve</button>
            <button onClick={handleReject}>Reject</button>
            <button onClick={() => setSelectedRequest(null)}>Close</button>
          </div>
        )}
      </div>
    );
  else {
    return (
      <div>
        <Navigator />
      </div>
    );
  }
};

export default ApprovalRequests;
