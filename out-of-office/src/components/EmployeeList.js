import React, { useEffect, useState } from "react";
import axios from "axios";
import EmployeeDetails from "./EmployeeDetails";
import Navigator from "./Navigator";
import "../App.css";

const EmployeeList = ({ Loggeduser }) => {
  const [employees, setEmployees] = useState([]);
  const [inputText, setInputText] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    subdivision: "",
    position: "",
    people_partner: null,
    out_of_office_balance: 0,
    photo: null,
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
        await axios.put(
          `http://localhost:5000/api/employees/${editingId}`,
          form
        );
      } else {
        await axios.post("http://localhost:5000/api/employees", form);
      }
      fetchEmployees();
      setForm({
        full_name: "",
        subdivision: "",
        position: "",
        people_partner: "",
        out_of_office_balance: "",
      });
      setEditingId(null);
    } catch (error) {
      console.error("There was an error adding/updating the employee!", error);
    }
  };

  const handleEditEmployee = (employee) => {
    setForm(employee);
    console.log(form);
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

  if (Loggeduser == 1)
    return (
      <div>
        <Navigator />
        <h1>Employees</h1>
        <div className="block">
          <div className="search">
            <input type="text" onChange={inputHandler} placeholder="Search" />
          </div>
          <div>
            <form className="edit">
              <h2>{editingId ? "Edit Employee" : "Add Employee"}</h2>
              <input
                name="full_name"
                onChange={handleFormChange}
                placeholder="Full Name"
                value={form.full_name}
              />
              <input
                name="subdivision"
                onChange={handleFormChange}
                placeholder="Subdivision"
                value={form.subdivision}
              />
              <input
                name="position"
                onChange={handleFormChange}
                placeholder="Position"
                value={form.position}
              />
              <input
                type="number"
                name="people_partner"
                onChange={handleFormChange}
                placeholder="People Partner"
                value={form.people_partner}
              />
              <input
                type="number"
                name="out_of_office_balance"
                onChange={handleFormChange}
                placeholder="Out of Office Balance"
                value={form.out_of_office_balance}
                required
              />
              <input
                type="file"
                name="photo"
                onChange={(e) => setForm({ ...form, photo: e.target.files[0] })}
              />
              <button className="btn" type="button" onClick={handleAddOrUpdateEmployee}>
                {editingId ? "Update" : "Add"}
              </button>
            </form>
          </div>
        </div>

        <List_HR
          employees={sortedEmployees}
          input={inputText}
          onEdit={handleEditEmployee}
          onDeactivate={handleDeactivateEmployee}
          handleSort={handleSort}
          sortConfig={sortConfig}
        />
      </div>
    );
  else if (Loggeduser == 2)
    return (
      <div>
        <Navigator />
        <h1>Employees</h1>
        <div className="search">
          <input type="text" onChange={inputHandler} placeholder="Search" />
        </div>

        {selectedEmployee && (
          <EmployeeDetails
            employeeId={selectedEmployee.id}
            onClose={() => setSelectedEmployee(null)}
          />
        )}
        <List_PM
          employees={sortedEmployees}
          input={inputText}
          onSelect={setSelectedEmployee}
          handleSort={handleSort}
          sortConfig={sortConfig}
        />
      </div>
    );
  else {
    return (
      <div>
        <Navigator />
        <h1>Employees</h1>
        <div className="search">
          <input type="text" onChange={inputHandler} placeholder="Search" />
        </div>

        {
          <EmployeeDetails
            employeeId={Loggeduser}
            onClose={() => setSelectedEmployee(null)}
          />
        }
      </div>
    );
  }
};
function List_HR({
  employees,
  input,
  onEdit,
  onDeactivate,
  handleSort,
  sortConfig,
}) {
  const filterData = employees.filter((employee) => {
    if (input === "") {
      return true;
    } else {
      return employee.full_name.toLowerCase().includes(input);
    }
  });

  return (
    <div className="employeeList">
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("full_name")}>
              Full Name{" "}
              {sortConfig.key === "full_name"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : null}
            </th>
            <th onClick={() => handleSort("subdivision")}>
              Subdivision{" "}
              {sortConfig.key === "subdivision"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : null}
            </th>
            <th onClick={() => handleSort("position")}>
              Position{" "}
              {sortConfig.key === "position"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : null}
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
                <button className="btn" onClick={() => onEdit(employee)}>Edit</button>
                <button className="btn" onClick={() => onDeactivate(employee.id)}>
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function List_PM({ employees, input, onSelect, handleSort, sortConfig }) {
  const filterData = employees.filter((employee) => {
    if (input === "") {
      return true;
    } else {
      return employee.full_name.toLowerCase().includes(input);
    }
  });

  return (
    <div className="employeeList">
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("full_name")}>
              Full Name{" "}
              {sortConfig.key === "full_name"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : null}
            </th>
            <th onClick={() => handleSort("subdivision")}>
              Subdivision{" "}
              {sortConfig.key === "subdivision"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : null}
            </th>
            <th onClick={() => handleSort("position")}>
              Position{" "}
              {sortConfig.key === "position"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : null}
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
                <button className="btn" onClick={() => onSelect(employee)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;
