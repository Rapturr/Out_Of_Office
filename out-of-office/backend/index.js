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
    status = "Active",
  } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO employees (full_name, subdivision, position, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [full_name, subdivision, position, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing employee
app.put("/api/employees/:id", async (req, res) => {
  const { id } = req.params;
  const { full_name, subdivision, position, status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE employees SET full_name = $1, subdivision = $2, position = $3, status = $4 WHERE id = $5 RETURNING *",
      [full_name, subdivision, position, status, id]
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
