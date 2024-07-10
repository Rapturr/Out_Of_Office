import React, { useEffect, useState } from "react";
import axios from "axios";
import EmployeeDetails from "./EmployeeDetails";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [inputText, setInputText] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    subdivision: "",
    position: "",
    status: "Active",
  });
  const [editingId, setEditingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployees = async () => {
    const result = await axios.get("http://localhost:5000/api/employees");
    setEmployees(result.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const inputHandler = (e) => {
    setInputText(e.target.value.toLowerCase());
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddOrUpdateEmployee = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/employees/${editingId}`, form);
      } else {
        await axios.post("http://localhost:5000/api/employees", form);
      }
      fetchEmployees();
      setForm({
        full_name: "",
        subdivision: "",
        position: "",
        status: "Active",
      });
      setEditingId(null);
    } catch (error) {
      console.error("There was an error adding/updating the employee!", error);
    }
  };

  const handleEditEmployee = (employee) => {
    setForm(employee);
    setEditingId(employee.id);
  };

  const handleDeactivateEmployee = async (id) => {
    await axios.put(`http://localhost:5000/api/employees/${id}/deactivate`);
    fetchEmployees();
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  return (
    <div>
      <h1>Employees</h1>
      <div className="search">
        <input type="text" onChange={inputHandler} placeholder="Search" />
      </div>
      <div>
        <h2>{editingId ? "Edit Employee" : "Add Employee"}</h2>
        <form>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleFormChange}
            placeholder="Full Name"
          />
          <input
            name="subdivision"
            value={form.subdivision}
            onChange={handleFormChange}
            placeholder="Subdivision"
          />
          <input
            name="position"
            value={form.position}
            onChange={handleFormChange}
            placeholder="Position"
          />
          <button type="button" onClick={handleAddOrUpdateEmployee}>
            {editingId ? "Update" : "Add"}
          </button>
        </form>
      </div>
      {selectedEmployee && (
        <EmployeeDetails
          employeeId={selectedEmployee.id}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
      <List
        employees={sortedEmployees}
        input={inputText}
        onEdit={handleEditEmployee}
        onDeactivate={handleDeactivateEmployee}
        onSelect={setSelectedEmployee}
        handleSort={handleSort}
        sortConfig={sortConfig}
      />
    </div>
  );
};

function List({ employees, input, onEdit, onDeactivate, onSelect, handleSort, sortConfig }) {
  const filterData = employees.filter((employee) => {
    if (input === "") {
      return true;
    } else {
      return employee.full_name.toLowerCase().includes(input);
    }
  });

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("full_name")}>
              Full Name {sortConfig.key === "full_name" ? (sortConfig.direction === "asc" ? "↑" : "↓") : null}
            </th>
            <th onClick={() => handleSort("subdivision")}>
              Subdivision {sortConfig.key === "subdivision" ? (sortConfig.direction === "asc" ? "↑" : "↓") : null}
            </th>
            <th onClick={() => handleSort("position")}>
              Position {sortConfig.key === "position" ? (sortConfig.direction === "asc" ? "↑" : "↓") : null}
            </th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filterData.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.full_name}</td>
              <td>{employee.subdivision}</td>
              <td>{employee.position}</td>
              <td>{employee.status}</td>
              <td>
                <button onClick={() => onEdit(employee)}>Edit</button>
                <button onClick={() => onDeactivate(employee.id)}>Deactivate</button>
                <button onClick={() => onSelect(employee)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;
