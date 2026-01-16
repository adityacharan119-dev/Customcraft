const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database setup
const db = new sqlite3.Database('./customcraft.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initDatabase();
  }
});

// Initialize database tables
function initDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Products table
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      base_price REAL NOT NULL,
      image TEXT,
      description TEXT,
      customization_options TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      total REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Order items table
    db.run(`CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      product_id INTEGER,
      quantity INTEGER NOT NULL,
      customizations TEXT,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    )`);

    // Insert sample products if not exists
    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
      if (row.count === 0) {
        insertSampleProducts();
      }
    });
  });
}

// Insert sample products
function insertSampleProducts() {
  const products = [
    {
      name: 'T Shirt',
      type: 'tshirt',
      category: 'apparel',
      base_price: 699,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
      description: 'Soft premium cotton t-shirt with custom designs',
      customization_options: JSON.stringify({
        colors: ['#FFFFFF', '#000000', '#FF6B6B'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        allowText: true,
        allowImage: true
      })
    },
    // Add more products as needed
  ];

  const stmt = db.prepare(`INSERT INTO products (name, type, category, base_price, image, description, customization_options) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  products.forEach(product => {
    stmt.run(product.name, product.type, product.category, product.base_price, product.image, product.description, product.customization_options);
  });
  stmt.finalize();
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes

// User registration
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(`INSERT INTO users (email, password, name) VALUES (?, ?, ?)`,
      [email, hashedPassword, name],
      function(err) {
        if (err) {
          return res.status(400).json({ error: 'User already exists' });
        }
        res.status(201).json({ message: 'User created successfully' });
      });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key');
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  });
});

// Get products
app.get('/api/products', (req, res) => {
  db.all(`SELECT * FROM products`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json(rows.map(row => ({
      ...row,
      customizationOptions: JSON.parse(row.customization_options)
    })));
  });
});

// Create order
app.post('/api/orders', authenticateToken, (req, res) => {
  const { items, total } = req.body;
  const userId = req.user.id;

  db.run(`INSERT INTO orders (user_id, total) VALUES (?, ?)`,
    [userId, total],
    function(err) {
      if (err) return res.status(500).json({ error: 'Server error' });

      const orderId = this.lastID;
      const stmt = db.prepare(`INSERT INTO order_items (order_id, product_id, quantity, customizations, price) VALUES (?, ?, ?, ?, ?)`);

      items.forEach(item => {
        stmt.run(orderId, item.productId, item.quantity, JSON.stringify(item.customizations), item.price);
      });
      stmt.finalize();

      res.status(201).json({ orderId });
    });
});

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Upload custom image
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const inputPath = req.file.path;
  const outputPath = path.join('uploads', 'processed_' + req.file.filename);

  // Call Python script to process image
  const python = spawn('python', ['image_processor.py', inputPath, outputPath]);

  python.on('close', (code) => {
    if (code === 0) {
      // Remove original file and return processed image URL
      require('fs').unlinkSync(inputPath);
      res.json({ imageUrl: `/uploads/processed_${req.file.filename}` });
    } else {
      res.status(500).json({ error: 'Image processing failed' });
    }
  });

  python.on('error', (err) => {
    console.error('Failed to start Python script:', err);
    res.status(500).json({ error: 'Image processing failed' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});