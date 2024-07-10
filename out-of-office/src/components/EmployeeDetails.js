import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeDetails = ({ employeeId, onClose }) => {
  const [employee, setEmployee] = useState(null);
  const [projects, setProjects] = useState([]);
  const [employeeProjects, setEmployeeProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      const result = await axios.get(
        `http://localhost:5000/api/employees/${employeeId}`
      );
      setEmployee(result.data);
    };

    const fetchProjects = async () => {
      const result = await axios.get("http://localhost:5000/api/projects");
      setProjects(result.data);
    };

    const fetchEmployeeProjects = async () => {
      const result = await axios.get(
        `http://localhost:5000/api/employees/${employeeId}/projects`
      );
      setEmployeeProjects(result.data);
    };

    fetchEmployeeDetails();
    fetchProjects();
    fetchEmployeeProjects();
  }, [employeeId]);

  const handleAssignProject = async () => {
    await axios.post(
      `http://localhost:5000/api/employees/${employeeId}/projects`,
      {
        projectId: selectedProject,
      }
    );
    const updatedEmployeeProjects = await axios.get(
      `http://localhost:5000/api/employees/${employeeId}/projects`
    );
    setEmployeeProjects(updatedEmployeeProjects.data);
  };

  if (!employee) return <div>Loading...</div>;

  return (
    <div>
      <h2>Employee Details</h2>
      <p>Full Name: {employee.full_name}</p>
      <p>Subdivision: {employee.subdivision}</p>
      <p>Position: {employee.position}</p>
      <p>Status: {employee.status}</p>
      <h3>Projects</h3>
      <ul>
        {employeeProjects.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
      <select
        value={selectedProject}
        onChange={(e) => setSelectedProject(e.target.value)}
      >
        <option value="" disabled>
          Select a project
        </option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
      <button onClick={handleAssignProject}>Assign Project</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default EmployeeDetails;
