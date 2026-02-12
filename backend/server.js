const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
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

// PostgreSQL Database setup
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'customcraft',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err.stack);
  } else {
    console.log('Connected to PostgreSQL database.');
    initDatabase();
    release();
  }
});

// Initialize database tables
async function initDatabase() {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        base_price DECIMAL(10, 2) NOT NULL,
        image TEXT,
        description TEXT,
        customization_options JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Order items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        customizations JSONB,
        price DECIMAL(10, 2) NOT NULL
      )
    `);

    // AI Chat history table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_chat_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        message TEXT NOT NULL,
        response TEXT NOT NULL,
        conversation_type VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Design suggestions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS design_suggestions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        product_type VARCHAR(100),
        suggestion TEXT NOT NULL,
        design_specs JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert sample products if not exists
    const result = await pool.query("SELECT COUNT(*) as count FROM products");
    if (result.rows[0].count === 0) {
      insertSampleProducts();
    }
    
    console.log('Database tables initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Insert sample products
async function insertSampleProducts() {
  const products = [
    {
      name: 'T Shirt',
      type: 'tshirt',
      category: 'apparel',
      base_price: 699,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
      description: 'Soft premium cotton t-shirt with custom designs',
      customization_options: JSON.stringify({
        colors: ['#FFFFFF', '#000000', '#FF6B6B', '#4ECDC4', '#45B7D1'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        allowText: true,
        allowImage: true
      })
    },
    {
      name: 'Pillow',
      type: 'pillow',
      category: 'home',
      base_price: 999,
      image: 'https://images.unsplash.com/photo-1558769132-cb5aea458c5e?w=800&h=800&fit=crop',
      description: 'Customizable decorative pillow',
      customization_options: JSON.stringify({
        colors: ['#FFFFFF', '#000000', '#FFC0CB'],
        sizes: ['Small', 'Medium', 'Large'],
        allowText: true,
        allowImage: true
      })
    },
    {
      name: 'Chain',
      type: 'chain',
      category: 'jewelry',
      base_price: 1499,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
      description: 'Custom chain jewelry',
      customization_options: JSON.stringify({
        materials: ['Gold', 'Silver', 'Platinum'],
        lengths: ['16in', '18in', '20in', '24in'],
        allowCustomText: true
      })
    }
  ];

  for (const product of products) {
    try {
      await pool.query(
        `INSERT INTO products (name, type, category, base_price, image, description, customization_options) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [product.name, product.type, product.category, product.base_price, product.image, product.description, product.customization_options]
      );
    } catch (error) {
      console.error('Error inserting product:', error);
    }
  }
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
    const result = await pool.query(
      `INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name`,
      [email, hashedPassword, name]
    );
    res.status(201).json({ message: 'User created successfully', user: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'User already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key');
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM products`);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create order
app.post('/api/orders', authenticateToken, async (req, res) => {
  const { items, total } = req.body;
  const userId = req.user.id;

  try {
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id`,
      [userId, total]
    );

    const orderId = orderResult.rows[0].id;
    
    for (const item of items) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, customizations, price) VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.productId, item.quantity, JSON.stringify(item.customizations), item.price]
      );
    }

    res.status(201).json({ orderId });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
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

// ==================== AI BOT ROUTES ====================

// AI Chat endpoint - Get design suggestions
app.post('/api/ai/chat', authenticateToken, async (req, res) => {
  const { message, conversationType = 'general' } = req.body;
  const userId = req.user.id;

  try {
    // Call OpenAI or your preferred AI service
    const aiResponse = await getAIResponse(message, conversationType);
    
    // Save chat history
    await pool.query(
      `INSERT INTO ai_chat_history (user_id, message, response, conversation_type) VALUES ($1, $2, $3, $4)`,
      [userId, message, aiResponse, conversationType]
    );

    res.json({ message, response: aiResponse, conversationType });
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// Get chat history for user
app.get('/api/ai/chat-history', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT * FROM ai_chat_history WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get design suggestions
app.get('/api/ai/suggestions/:productType', authenticateToken, async (req, res) => {
  const { productType } = req.params;
  const userId = req.user.id;

  try {
    const suggestions = await generateDesignSuggestions(productType);
    
    // Save suggestion to database
    await pool.query(
      `INSERT INTO design_suggestions (user_id, product_type, suggestion, design_specs) VALUES ($1, $2, $3, $4)`,
      [userId, productType, suggestions.text, JSON.stringify(suggestions.specs)]
    );

    res.json(suggestions);
  } catch (error) {
    console.error('Design suggestion error:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

// Create custom design based on requirements
app.post('/api/ai/create-design', authenticateToken, async (req, res) => {
  const { productType, requirements, style, colors } = req.body;
  const userId = req.user.id;

  try {
    const design = await generateCustomDesign({
      productType,
      requirements,
      style,
      colors
    });

    // Save generated design suggestion
    await pool.query(
      `INSERT INTO design_suggestions (user_id, product_type, suggestion, design_specs) VALUES ($1, $2, $3, $4)`,
      [userId, productType, `Custom design: ${requirements}`, JSON.stringify(design)]
    );

    res.json({
      success: true,
      design,
      message: 'Design created based on your requirements'
    });
  } catch (error) {
    console.error('Design creation error:', error);
    res.status(500).json({ error: 'Failed to create design' });
  }
});

// Get AI suggestions for product improvements
app.post('/api/ai/product-suggestions', authenticateToken, async (req, res) => {
  const { productType, currentDesign } = req.body;

  try {
    const suggestions = await getProductSuggestions(productType, currentDesign);
    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

// ==================== AI HELPER FUNCTIONS ====================

// Function to call OpenAI API (using environment variables for API key)
async function getAIResponse(message, conversationType) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // If conversationType is 'design', provide design-focused responses
    const systemPrompt = conversationType === 'design'
      ? 'You are a creative design assistant helping customers customize products. Provide design suggestions, color combinations, and layout recommendations. Be specific and helpful.'
      : 'You are a helpful customer service assistant. Provide product suggestions and answer questions about customization options.';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    // Fallback response if API fails
    return getDefaultAIResponse(message);
  }
}

// Function to generate design suggestions
async function generateDesignSuggestions(productType) {
  const suggestions = {
    tshirt: {
      text: 'Consider minimalist designs with bold typography or vintage-inspired graphics. Trending colors include charcoal, burgundy, and sage green.',
      specs: {
        layout: 'center-front',
        colorSchemes: ['monochrome', 'two-tone', 'vintage'],
        styles: ['minimalist', 'vintage', 'modern']
      }
    },
    pillow: {
      text: 'Soft pastel colors work well for pillows. Try geometric patterns or nature-inspired designs. Consider symmetrical layouts.',
      specs: {
        layout: 'full-cover',
        colorSchemes: ['pastels', 'neutral', 'earth-tones'],
        patterns: ['geometric', 'floral', 'abstract']
      }
    },
    chain: {
      text: 'Minimalist pendants are popular. Consider engraving initials or symbols. Gold and silver remain timeless.',
      specs: {
        styles: ['minimalist', 'classic', 'modern'],
        materials: ['gold', 'silver', 'platinum'],
        engravingOptions: true
      }
    }
  };

  return suggestions[productType] || suggestions.tshirt;
}

// Function to create custom design
async function generateCustomDesign(params) {
  const { productType, requirements, style, colors } = params;

  return {
    productType,
    description: `Custom ${productType} design with ${style} style`,
    requirements,
    style,
    colors,
    layout: 'custom',
    timestamp: new Date().toISOString(),
    preview: `Design preview for: ${requirements}`,
    suggestions: [
      'Consider adjusting colors for better contrast',
      'This layout works well for ' + productType,
      'Recommended size adjustments for better visibility'
    ]
  };
}

// Function to get product improvement suggestions
async function getProductSuggestions(productType, currentDesign) {
  const suggestions = {
    design: 'Consider simplifying the design for better visibility',
    colors: 'The color combination could benefit from better contrast',
    layout: 'Try centering the main element for better balance',
    text: 'Increase font size for better readability'
  };

  return Object.entries(suggestions).map(([category, suggestion]) => ({
    category,
    suggestion,
    priority: Math.random() > 0.5 ? 'high' : 'medium'
  }));
}

// Fallback AI response when API is unavailable
function getDefaultAIResponse(message) {
  const defaultResponses = {
    'color': 'I recommend trying vibrant colors like navy blue, burgundy, or forest green. These colors work great for custom apparel!',
    'design': 'Consider minimalist designs or vintage-inspired graphics. They tend to be timeless and look great on all products.',
    'price': 'Our pricing varies based on customization complexity. More custom work means higher prices, but better results!',
    'custom': 'We can create custom designs based on your specifications. Tell me more about what you\'re looking for!'
  };

  for (const [key, response] of Object.entries(defaultResponses)) {
    if (message.toLowerCase().includes(key)) {
      return response;
    }
  }

  return 'I\'m here to help with your custom design! What would you like to know about our products or customization options?';
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});