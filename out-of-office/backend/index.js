const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "out_of_office",
  password: "password",
  port: 5432,
});

// Sample route to get all employees
app.get("/api/employees", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employees");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new employee
app.post("/api/employees", async (req, res) => {
  const {
    full_name,
    subdivision,
    position,
    people_partner,
    out_of_office_balance,
    photo,
  } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO employees (full_name, subdivision, position, status, people_partner, out_of_office_balance, photo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        full_name,
        subdivision,
        position,
        "Active",
        people_partner,
        out_of_office_balance,
        photo,
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update an existing employee
app.put("/api/employees/:id", async (req, res) => {
  const { id } = req.params;
  const {
    full_name,
    subdivision,
    position,
    status,
    people_partner,
    out_of_office_balance,
    photo,
  } = req.body;
  try {
    const result = await pool.query(
      "UPDATE employees SET full_name = $1, subdivision = $2, position = $3, status = $4, people_partner = $5, out_of_office_balance = $6, photo = $7 WHERE id = $8 RETURNING *",
      [
        full_name,
        subdivision,
        position,
        status,
        people_partner,
        out_of_office_balance,
        photo,
        id,
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deactivate an employee
app.put("/api/employees/:id/deactivate", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE employees SET status = $1 WHERE id = $2 RETURNING *",
      ["Inactive", id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get an employee's details
app.get("/api/employees/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM employees WHERE id = $1", [
      id,
    ]);
    if (result.rows.length > 0) {
      res
        .status(200)
        .json({ message: "Login successful", user: result.rows[0] });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: err.message });
  }
});

// Get projects assigned to an employee
app.get("/api/employees/:id/projects", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT p.* FROM projects p
       INNER JOIN employee_projects ep ON p.id = ep.project_id
       WHERE ep.employee_id = $1`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assign a project to an employee
app.post("/api/employees/:id/projects", async (req, res) => {
  const { id } = req.params;
  const { projectId } = req.body;
  try {
    await pool.query(
      "INSERT INTO employee_projects (employee_id, project_id) VALUES ($1, $2)",
      [id, projectId]
    );
    res
      .status(201)
      .json({ message: "Project assigned to employee successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all projects
app.get("/api/projects", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch details of a specific project
app.get("/api/projects/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM projects WHERE id = $1", [
      id,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new project
app.post("/api/projects", async (req, res) => {
  const {
    project_type,
    start_date,
    end_date,
    project_manager,
    comment,
    status,
  } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO projects (project_type, start_date, end_date, project_manager, comment, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [project_type, start_date, end_date, project_manager, comment, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing project
app.put("/api/projects/:id", async (req, res) => {
  const { id } = req.params;
  const { project_number, name, status, start_date, end_date, description } =
    req.body;
  try {
    const result = await pool.query(
      "UPDATE projects SET project_number = $1, name = $2, status = $3, start_date = $4, end_date = $5, description = $6 WHERE id = $7 RETURNING *",
      [project_number, name, status, start_date, end_date, description, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deactivate a project
app.put("/api/projects/:id/deactivate", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE projects SET status = $1 WHERE id = $2 RETURNING *",
      ["Inactive", id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//==============================================================
//Approval Requests

// Fetch all approval requests
app.get("/api/approval-requests", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM approval_requests");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch details of a specific request
app.get("/api/approval-requests/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM approval_requests WHERE id = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve a request
app.put("/api/approval-requests/:id/approve", async (req, res) => {
  const { id } = req.params;
  try {
    const approvalResult = await pool.query(
      "UPDATE approval_requests SET status = 'Approved' WHERE id = $1 RETURNING *",
      [id]
    );
    const leaveRequestId = approvalResult.rows[0].leave_request_id;

    await pool.query(
      "UPDATE leave_requests SET status = 'Approved' WHERE id = $1",
      [leaveRequestId]
    );

    // Recalculate employee absence balance (pseudo code)
    // const employeeId = // fetch from leave_request by leaveRequestId
    // const absenceBalance = // calculate new balance
    // await pool.query("UPDATE employees SET absence_balance = $1 WHERE id = $2", [absenceBalance, employeeId]);

    res.json(approvalResult.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reject a request
app.put("/api/approval-requests/:id/reject", async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body; // Expecting a comment in the request body
  try {
    const approvalResult = await pool.query(
      "UPDATE approval_requests SET status = 'Rejected', comment = $1 WHERE id = $2 RETURNING *",
      [comment, id]
    );
    const leaveRequestId = approvalResult.rows[0].leave_request_id;

    await pool.query(
      "UPDATE leave_requests SET status = 'Rejected' WHERE id = $1",
      [leaveRequestId]
    );

    res.json(approvalResult.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch leave requests
app.get("/api/leave-requests", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM leave_requests");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch details of a specific leave request
app.get("/api/leave-requests/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM leave_requests WHERE id = $1",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Add a new leave request
app.post("/api/leave-requests", async (req, res) => {
  const { employee, absence_reason, start_date, end_date, comment } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO leave_requests (employee, absence_reason, start_date, end_date, comment, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [employee, absence_reason, start_date, end_date, comment, "new"]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
// Fetch personal leave requests
app.get("/api/personal-leave-requests/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM leave_requests WHERE employee = 3"
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
*/
// Get an employee's details
app.get("/api/personal-leave-requests/:id", async (req, res) => {
  const { id } = req.params;
  console.log("ID = ", id);
  try {
    const result = await pool.query(
      "SELECT * FROM leave_requests where employee = $1",
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
});
/*
app.get("/api/personal-leave-requests/:id", async (req, res) => {
  const { id } = req.params;
  console.log("User ", id);
  try {
    const result = await pool.query(
      "SELECT * FROM leave_requests where employee = $1",
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
*/
