import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navigator from "./Navigator";

const ProjectList = ({ Loggeduser }) => {
  const [projects, setProjects] = useState([]);
  const [inputText, setInputText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedProject, setSelectedProject] = useState(null);
  const [form, setForm] = useState({
    project_type: "",
    start_date: "",
    end_date: "",
    project_manager: 2,
    comment: "",
    status: "",
  });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();


  const fetchProjects = async () => {
    const result = await axios.get("http://localhost:5000/api/projects");
    setProjects(result.data);
  };

  useEffect(() => {
    fetchProjects();
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

  const sortedProjects = [...projects].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredProjects = sortedProjects.filter((project) =>
    project.project_type.toLowerCase().includes(inputText)
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddOrUpdateProject = async () => {
    if (editingId) {
      await axios.put(`http://localhost:5000/api/projects/${editingId}`, form);
    } else {
      await axios.post("http://localhost:5000/api/projects", form);
    }
    fetchProjects();
    setForm({
      project_type: "",
      start_date: "",
      end_date: "",
      project_manager: 2,
      comment: "",
      status: "",
    });
    setEditingId(null);
  };

  const handleEditProject = (project) => {
    setForm(project);
    setEditingId(project.id);
  };

  const handleDeactivateProject = async (id) => {
    await axios.put(`http://localhost:5000/api/projects/${id}/deactivate`);
    fetchProjects();
  };

  const handleViewDetails = async (id) => {
    const result = await axios.get(`http://localhost:5000/api/projects/${id}`);
    setSelectedProject(result.data);
  };

  return (
    <div>
      <Navigator />
      
      <h1>Projects</h1>
      <div className="search">
        <input
          type="text"
          onChange={inputHandler}
          placeholder="Search by project number"
        />
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("project_type")}>
              project_type{" "}
              {sortConfig.key === "project_type"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : null}
            </th>
            <th onClick={() => handleSort("start_date")}>
              start_date{" "}
              {sortConfig.key === "start_date"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : null}
            </th>
            <th>End Date</th>
            <th onClick={() => handleSort("project_manager")}>
              project_manager{" "}
              {sortConfig.key === "project_manager"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : null}
            </th>
            <th>comment</th>
            <th>status</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project) => (
            <tr key={project.id}>
              <td>{project.project_type}</td>
              <td>{project.start_date}</td>
              <td>{project.end_date}</td>
              <td>{project.project_manager}</td>
              <td>{project.comment}</td>
              <td>{project.status}</td>
              <td>
                <button onClick={() => handleEditProject(project)}>Edit</button>
                <button onClick={() => handleDeactivateProject(project.id)}>
                  Deactivate
                </button>
                <button onClick={() => handleViewDetails(project.id)}>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h2>{editingId ? "Edit Project" : "Add Project"}</h2>
        <form>
          <input
            name="project_type"
            value={form.project_type}
            onChange={handleFormChange}
            placeholder="Project Type"
          />
          <input
            name="start_date"
            value={form.start_date}
            onChange={handleFormChange}
            placeholder="Start Date"
            type="date"
          />
          <input
            name="end_date"
            value={form.end_date}
            onChange={handleFormChange}
            placeholder="End Date"
            type="date"
          />
          <input
            name="project_manager"
            value={form.project_manager}
            onChange={handleFormChange}
            placeholder="project_manager"
          />
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleFormChange}
            placeholder="comment"
          ></textarea>
          <input
            name="status"
            value={form.status}
            onChange={handleFormChange}
            placeholder="status"
          />
          <button type="button" onClick={handleAddOrUpdateProject}>
            {editingId ? "Update" : "Add"}
          </button>
        </form>
      </div>
      {selectedProject && (
        <ProjectDetails
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

const ProjectDetails = ({ project, onClose }) => {
  return (
    <div>
      <h2>Project Details</h2>
      <p>project type: {project.project_type}</p>
      <p>Start Date: {project.start_date}</p>
      <p>End Date: {project.end_date}</p>
      <p>project_manager: {project.project_manager}</p>
      <p>comment: {project.comment}</p>
      <p>Status: {project.status}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ProjectList;
