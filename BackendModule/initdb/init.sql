DROP TABLE IF EXISTS transfer;
DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS account_status;
DROP TABLE IF EXISTS app_user;
DROP TABLE IF EXISTS user_status;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS client;

CREATE TABLE client (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(32) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
    curp CHAR(18) UNIQUE NOT NULL,
    rfc VARCHAR(13) UNIQUE NOT NULL,
    phone CHAR(10) UNIQUE NOT NULL,
    email VARCHAR(32) UNIQUE NOT NULL
);

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(16) NOT NULL
);

CREATE TABLE user_status (
    id SERIAL PRIMARY KEY,
    status_name VARCHAR(16) NOT NULL
);

CREATE TABLE app_user (
    id SERIAL PRIMARY KEY,
    client_id int,
    role_id int NOT NULL,
    user_status_id int NOT NULL,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(8) NOT NULL,
    failed_attempts INT DEFAULT 0,
    CONSTRAINT fk_client FOREIGN KEY (client_id)
    REFERENCES client(id),
    CONSTRAINT fk_role FOREIGN KEY (role_id)
    REFERENCES role(id),
    CONSTRAINT fk_user_status FOREIGN KEY (user_status_id)
    REFERENCES user_status(id)
);

CREATE TABLE account_status (
    id SERIAL PRIMARY KEY,
    status_name VARCHAR(16) NOT NULL
);

CREATE TABLE account (
    id SERIAL PRIMARY KEY,
    client_id int NOT NULL,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    clabe CHAR(18) UNIQUE NOT NULL,
    balance DECIMAL(14,2) DEFAULT 0.00 NOT NULL,
    aperture_date DATE NOT NULL,
    account_status_id int NOT NULL,
    CONSTRAINT fk_client FOREIGN KEY (client_id)
    REFERENCES client(id),
    CONSTRAINT fk_account_status FOREIGN KEY (account_status_id)
    REFERENCES account_status(id)
);

CREATE TABLE transfer (
    id SERIAL PRIMARY KEY,
    source_account_id int NOT NULL,
    destination_account_id int NOT NULL,
    transfer_date DATE NOT NULL,
    amount DECIMAL(14,2) NOT NULL,
    concept VARCHAR(20) NOT NULL,
    CONSTRAINT fk_source_account FOREIGN KEY (source_account_id)
    REFERENCES account(id),
    CONSTRAINT fk_destination_account FOREIGN KEY (destination_account_id)
    REFERENCES account(id)
);

INSERT INTO client (first_name, last_name, curp, rfc, phone, email) VALUES
('Ana', 'Gomez', 'GOMA850101HDFLNR09', 'GOMA850101AB1', '5551234567', 'ana.gomez@example.com'),
('Luis', 'Martinez', 'MAML900202HDFRTS03', 'MAML900202CD2', '5559876543', 'luis.martinez@example.com'),
('Carla', 'Reyes', 'REYC920305MDFDYN01', 'REYC920305EF3', '5552468135', 'carla.reyes@example.com');

INSERT INTO role (role_name) VALUES
('admin'),
('user'),
('auditor');

INSERT INTO user_status (status_name) VALUES
('active'),
('inactive'),
('blocked');

INSERT INTO account_status (status_name) VALUES
('active'),
('closed'),
('frozen');

INSERT INTO app_user (client_id, role_id, user_status_id, username, password) VALUES
(1, 1, 1, 'ana_admin', 'pass1234'),
(2, 2, 1, 'luis_user', 'word5678'),
(3, 3, 3, 'carla_audit', 'audit999');

INSERT INTO account (client_id, account_number, clabe, balance, aperture_date, account_status_id) VALUES
(1, 'ACC000001', '646180123456789001', 15000.00, '2023-01-10', 1),
(2, 'ACC000002', '646180123456789002', 7500.50, '2023-05-15', 1),
(3, 'ACC000003', '646180123456789003', 3000.00, '2024-02-20', 3);

INSERT INTO transfer (source_account_id, destination_account_id, transfer_date, amount, concept) VALUES
(1, 2, '2024-03-10', 1000.00, 'Rent Payment'),
(2, 3, '2024-04-01', 500.50, 'Gift'),
(1, 3, '2024-04-15', 250.00, 'Groceries');
