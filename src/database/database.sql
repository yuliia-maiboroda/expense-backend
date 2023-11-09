-- Define custom types
-- CREATE TYPE category AS (
--     id SERIAL PRIMARY KEY,
--     label VARCHAR(50) NOT NULL,
--     type VARCHAR(10) CHECK (type IN ('income', 'expense')) NOT NULL,
--     owner INTEGER,
--     FOREIGN KEY(owner) REFERENCES users(id)
-- );

-- CREATE TYPE transaction AS (
--     id SERIAL PRIMARY KEY,
--     label VARCHAR(50) NOT NULL,
--     amount NUMERIC 
--     owner INTEGER,
--     FOREIGN KEY(owner) REFERENCES users(id)
-- );
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    displayname VARCHAR(50) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('user', 'admin')) NOT NULL,
    password VARCHAR(30) NOT NULL,
    sessionId UUID
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    label VARCHAR(50) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('income', 'expense')) NOT NULL,
    owner INTEGER,
    FOREIGN KEY(owner) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    label VARCHAR(50) NOT NULL,
    amount NUMERIC,
    owner INTEGER,
    FOREIGN KEY(owner) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS default_categories (
    id SERIAL PRIMARY KEY,
    label VARCHAR(50) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('income', 'expense')) NOT NULL
);