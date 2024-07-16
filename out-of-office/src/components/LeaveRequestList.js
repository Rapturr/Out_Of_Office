import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigator from "./Navigator";

const LeaveRequestList = ({ Loggeduser }) => {
  const [requests, setRequests] = useState([]);
  const [inputText, setInputText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [form, setForm] = useState({
    absence_reason: "",
    start_date: "",
    end_date: "",
    comment: "",
    status: "new",
  });
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      let result;
      if (Loggeduser == 1 || Loggeduser == 2) {
        result = await axios.get(`http://localhost:5000/api/leave-requests`);
      } else {
        result = await axios.get(
          `http://localhost:5000/api/personal-leave-requests/${Loggeduser}`
        );
      }
      setRequests(result.data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  };

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

  const handleAddOrUpdateRequest = async () => {
    try {
      if (selectedRequest) {
        await axios.put(
          `http://localhost:5000/api/leave-requests/${selectedRequest.id}`,
          { ...form, employee: Loggeduser }
        );
      } else {
        await axios.post("http://localhost:5000/api/leave-requests", {
          ...form,
          employee: Loggeduser,
        });
      }
      fetchRequests();
      setForm({
        absence_reason: "",
        start_date: "",
        end_date: "",
        comment: "",
        status: "new",
      });
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error adding/updating leave request:", error);
    }
  };

  const onCancel = async () => {
    try {
      console.log("DBG");
      await axios.put(
        `http://localhost:5000/api/leave-requests/${selectedRequest.id}/cancel`
      );
      console.log("DBG-2");

      fetchRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error adding/updating leave request:", error);
    }
  };

  const filteredRequests = sortedRequests.filter((request) =>
    request.absence_reason.toLowerCase().includes(inputText)
  );

  const handleViewDetails = async (id) => {
    try {
      const result = await axios.get(
        `http://localhost:5000/api/leave-requests/${id}`
      );
      setSelectedRequest(result.data);
    } catch (error) {
      console.error("Error fetching request details:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  return (
    <div>
      <Navigator />

      <h1>Leave Requests</h1>
      <div className="search">
        <input
          type="text"
          onChange={inputHandler}
          placeholder="Search by reason"
        />
      </div>
      <h2>Add new request</h2>
      <form
        className="edit-horizontal"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddOrUpdateRequest();
        }}
      >
        <input
          type="text"
          name="absence_reason"
          value={form.absence_reason}
          onChange={handleChange}
          placeholder="Absence Reason"
          required
        />
        <input
          type="date"
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="end_date"
          value={form.end_date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="comment"
          value={form.comment}
          onChange={handleChange}
          placeholder="Comment"
        />
        <button className="btn" type="submit">
          Submit
        </button>
      </form>
      <div className="employeeList">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("absence_reason")}>
                Absence Reason{" "}
                {sortConfig.key === "absence_reason"
                  ? sortConfig.direction === "asc"
                    ? "↑"
                    : "↓"
                  : null}
              </th>
              <th onClick={() => handleSort("start_date")}>
                Start Date{" "}
                {sortConfig.key === "start_date"
                  ? sortConfig.direction === "asc"
                    ? "↑"
                    : "↓"
                  : null}
              </th>
              <th onClick={() => handleSort("end_date")}>
                End Date{" "}
                {sortConfig.key === "end_date"
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
                <td>{request.absence_reason}</td>
                <td>{request.start_date}</td>
                <td>{request.end_date}</td>
                <td>{request.status}</td>
                <td>
                  <button
                    className="btn"
                    onClick={() => handleViewDetails(request.id)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedRequest && (
        <RequestDetails
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onCancel={onCancel}
        />
      )}
    </div>
  );
};

const RequestDetails = ({ request, onClose, onCancel }) => {
  return (
    <div>
      <h2>Request Details</h2>
      <p>Absence Reason: {request.absence_reason}</p>
      <p>Status: {request.status}</p>
      <p>Start Date: {request.start_date}</p>
      <p>End Date: {request.end_date}</p>
      <p>Comment: {request.comment}</p>
      <button className="btn" onClick={onClose}>
        Close
      </button>
      <button className="btn" onClick={onCancel}>
        Cancel Request
      </button>
    </div>
  );
};

export default LeaveRequestList;
