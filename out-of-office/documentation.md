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

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    project_type VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    project_manager INT NOT NULL REFERENCES employees(id),
    comment TEXT,
    status VARCHAR(50) NOT NULL
);



npm start
npm run serve

