CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    subdivision VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL
);

insert into employees(id, full_name, subdivision, position, status) values(1,'John Doe', 'HQ', 'Director', 'Employed');

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
insert into projects(id, name, description) values(1,'Out of office app', 'An out of office app solution');

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

insert into employee_projects(employee_id, project_id) values(1, 1);

CREATE TABLE employee_projects (
    employee_id INT REFERENCES employees(id),
    project_id INT REFERENCES projects(id),
    PRIMARY KEY (employee_id, project_id)
);



npm start
npm run serve

