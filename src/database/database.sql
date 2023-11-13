CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    displayname VARCHAR(50) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('user', 'admin')) NOT NULL,
    password VARCHAR(255) NOT NULL,
    sessionid UUID,
    refreshid UUID
);


CREATE TABLE IF NOT EXISTS default_categories (
    id SERIAL PRIMARY KEY,
    label VARCHAR(50) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('income', 'expense')) NOT NULL,
    ismutable BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO default_categories (label, type, ismutable)
VALUES ('Salary', 'income', true),
       ('Food', 'expense', true),
       ('Groceries', 'expense', true),
       ('Entertainment', 'expense', true),
       ('Others', 'expense', false);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    label VARCHAR(50) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('income', 'expense')) NOT NULL,
    isMutable BOOLEAN NOT NULL DEFAULT true,
    owner INTEGER,
    FOREIGN KEY(owner) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    label VARCHAR(50) NOT NULL,
    amount NUMERIC,
    date DATE NOT NULL,
    owner INTEGER,
    FOREIGN KEY(owner) REFERENCES users(id),
    category INTEGER,
    FOREIGN KEY(category) REFERENCES categories(id)
);

