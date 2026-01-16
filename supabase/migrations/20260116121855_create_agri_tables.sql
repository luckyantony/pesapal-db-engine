-- Items/Inventory table
CREATE TABLE items (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),   -- <-- Add extensions.
  name TEXT NOT NULL,
  stock_level INTEGER NOT NULL DEFAULT 0,
  unit_price DECIMAL(10, 2) NOT NULL,
  low_threshold INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),   -- <-- Add extensions.
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sales table
CREATE TABLE sales (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),   -- <-- Add extensions.
  date TIMESTAMP NOT NULL DEFAULT NOW(),
  item_id uuid NOT NULL REFERENCES items(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  payment_method TEXT NOT NULL DEFAULT 'Cash',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);