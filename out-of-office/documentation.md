CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    subdivision VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    people_partner INT,
    out_of_office_balance INT NOT NULL,
    photo BYTEA,
    CONSTRAINT fk_people_partner FOREIGN KEY (people_partner) REFERENCES employees(id)
);

-- Create a partial unique index to ensure that only one employee can be an HR Manager
CREATE UNIQUE INDEX unique_hr_manager ON employees (id) WHERE position = 'HR Manager';

INSERT INTO employees (full_name, subdivision, position, status, out_of_office_balance)
VALUES ('John Doe', 'HR', 'HR Manager', 'Active', 10);

INSERT INTO employees (full_name, subdivision, position, status, out_of_office_balance, people_partner)
VALUES ('Jane Smith', 'IT', 'Project Manager', 'Active', 15, 1);

INSERT INTO employees (full_name, subdivision, position, status, out_of_office_balance, people_partner)
VALUES ('Alice Johnson', 'IT', 'Employee', 'Active', 20, 1);

CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    employee INT NOT NULL REFERENCES employees(id),
    absence_reason VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    comment TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'New'
);

CREATE TABLE approval_requests (
    id SERIAL PRIMARY KEY,
    approver INT NOT NULL REFERENCES employees(id),
    leave_request INT NOT NULL REFERENCES leave_requests(id),
    status VARCHAR(50) NOT NULL DEFAULT 'New',
    comment TEXT
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    project_type VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    project_manager INT NOT NULL REFERENCES employees(id),
    comment TEXT,
    status VARCHAR(50) NOT NULL
);

CREATE TABLE employee_projects (
    employee_id INT REFERENCES employees(id),
    project_id INT REFERENCES projects(id),
    PRIMARY KEY (employee_id, project_id)
);


drop table employee_projects, projects, approval_requests, leave_requests, employees;

npm start
npm run serve

