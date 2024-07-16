import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

const EmployeeDetails = ({ employeeId, onClose }) => {
  const [employee, setEmployee] = useState(null);
  const [projects, setProjects] = useState([]);
  const [employeeProjects, setEmployeeProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const result = await axios.get(
          `http://localhost:5000/api/employees/${employeeId}`
        );
        setEmployee(result.data.user);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    const fetchProjects = async () => {
      try {
        const result = await axios.get("http://localhost:5000/api/projects");
        setProjects(result.data);
        console.log(result.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    const fetchEmployeeProjects = async () => {
      try {
        const result = await axios.get(
          `http://localhost:5000/api/employees/${employeeId}/projects`
        );
        setEmployeeProjects(result.data);
      } catch (error) {
        console.error("Error fetching employee projects:", error);
      }
    };

    fetchEmployeeDetails();
    fetchProjects();
    fetchEmployeeProjects();
  }, [employeeId]);

  const handleAssignProject = async () => {
    try {
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
    } catch (error) {
      console.error("Error assigning project:", error);
    }
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
          <li key={project.id}>{project.project_type}</li>
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
            {project.project_type}
          </option>
        ))}
      </select>
      <button className="btn" onClick={handleAssignProject}>Assign Project</button>
      <button className="btn" onClick={onClose}>Close</button>
    </div>
  );
};

export default EmployeeDetails;
