CREATE TABLE IF NOT EXISTS USERS(
    id serial PRIMARY KEY,
    name text NOT NULL,
    pin char(4) NOT NULL
);

CREATE TABLE IF NOT EXISTS ORDERS (
  id serial PRIMARY KEY,
  table_id integer,
  item_ids jsonb
);

CREATE TABLE IF NOT EXISTS ITEMS (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  price numeric(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS TABLES(
    id integer PRIMARY KEY,
    occupied boolean,
    order_id integer,
    FOREIGN KEY (order_id) REFERENCES ORDERS(id)
);
