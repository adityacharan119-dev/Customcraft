# MyCraft - PostgreSQL & AI Bot Setup Guide

## Summary of Changes

Your MyCraft website has been upgraded with:
1. **PostgreSQL Database** - Migrated from SQLite for better scalability
2. **AI Bot Assistant** - Provides design suggestions and creates custom designs

---

## Part 1: PostgreSQL Setup

### Prerequisites
- PostgreSQL installed on your system
- Node.js 16+ installed

### Step 1: Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

### Step 2: Create Database and User

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE customcraft;

# Create user
CREATE USER customcraft_user WITH PASSWORD 'your_secure_password';

# Grant privileges
ALTER ROLE customcraft_user SET client_encoding TO 'utf8';
ALTER ROLE customcraft_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE customcraft_user SET default_transaction_deferrable TO on;
ALTER ROLE customcraft_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE customcraft TO customcraft_user;

# Exit psql
\q
```

### Step 3: Configure Environment Variables

1. Copy the example file:
```bash
cd backend
cp .env.example .env
```

2. Edit `.env` with your PostgreSQL credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=customcraft_user
DB_PASSWORD=your_secure_password
DB_NAME=customcraft
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Step 4: Update Backend Dependencies

```bash
cd backend
# Remove old SQLite dependencies
npm uninstall sqlite3

# Install new PostgreSQL dependencies
npm install pg@8.11.3

# Install all dependencies
npm install
```

---

## Part 2: AI Bot Setup

### Prerequisites
- OpenAI API Key (get one from https://platform.openai.com/api-keys)

### Step 1: Add OpenAI API Key

Update your `.env` file:
```
OPENAI_API_KEY=sk-your-api-key-here
```

### Step 2: Understanding AI Bot Features

The AI Bot provides:

1. **Chat Interface** - Real-time conversation with design suggestions
2. **Design Suggestions** - Tailored to product type (T-shirt, Pillow, Chain)
3. **Custom Design Creation** - Generate designs based on customer requirements
4. **Design Improvements** - Get feedback on existing designs

### Step 3: Frontend Integration

The AIBot component has already been added to your project at:
```
src/app/components/AIBot.tsx
```

To use it in your pages, add this to your component:

```tsx
import AIBot from '@/app/components/AIBot';

export function YourComponent() {
  return (
    <div>
      {/* Your content */}
      <AIBot 
        productType="tshirt"
        onDesignSuggestion={(design) => {
          console.log('New design suggestion:', design);
        }}
      />
    </div>
  );
}
```

---

## Part 3: Database Tables Overview

### New Tables Created:

1. **ai_chat_history** - Stores chat messages between users and AI
   - Tracks conversation type (general, design)
   - Stores timestamps for each interaction

2. **design_suggestions** - Stores generated design suggestions
   - Linked to user
   - Product type specific
   - Includes design specifications in JSON format

### Existing Tables (Migrated to PostgreSQL):
- `users` - User accounts and authentication
- `products` - Product catalog
- `orders` - Customer orders
- `order_items` - Order line items

---

## Part 4: API Endpoints

### AI Bot Endpoints

**POST /api/ai/chat**
- Send a message to the AI bot
- Returns: `{ message, response, conversationType }`

**GET /api/ai/chat-history**
- Get user's chat history (last 50 messages)
- Returns: Array of chat messages

**GET /api/ai/suggestions/:productType**
- Get design suggestions for a product type
- Returns: `{ text, specs }`

**POST /api/ai/create-design**
- Create custom design based on requirements
- Body: `{ productType, requirements, style, colors }`
- Returns: `{ success, design, message }`

**POST /api/ai/product-suggestions**
- Get improvement suggestions for a design
- Body: `{ productType, currentDesign }`
- Returns: `{ suggestions: Array }`

---

## Part 5: Running the Application

### Start Backend
```bash
cd backend
npm run dev
# or for production
npm start
```

### Start Frontend
```bash
cd ..
npm run dev
```

---

## Part 6: Troubleshooting

### PostgreSQL Connection Issues
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Restart PostgreSQL
sudo service postgresql restart

# Test connection
psql -U customcraft_user -d customcraft -h localhost
```

### OpenAI API Issues
- Verify your API key is valid
- Check your OpenAI account has sufficient credits
- Ensure the key is properly added to `.env`

### Database Migration Issues
If tables don't exist on first run:
```bash
# The app will auto-create tables on startup
# If issues persist, manually run:
psql -U customcraft_user -d customcraft -f schema.sql
```

---

## Part 7: Performance Tips

1. **Index Important Columns** - For large datasets, add indexes to frequently queried fields
2. **Connection Pooling** - Already configured in backend (pg Pool)
3. **Cache AI Responses** - Consider caching common design suggestions
4. **Backup Database** - Regular backups recommended for production
   ```bash
   pg_dump -U customcraft_user customcraft > backup.sql
   ```

---

## Part 8: Security Considerations

1. Change default JWT_SECRET in production
2. Use strong PostgreSQL passwords
3. Enable SSL/TLS for database connections in production
4. Restrict API keys and never commit them to version control
5. Use HTTPS in production
6. Implement rate limiting for AI endpoints

---

## Next Steps

1. ✅ Database is set up - PostgreSQL ready
2. ✅ AI Bot endpoints are configured
3. ✅ Frontend component is created
4. ⏭️ Integrate AIBot component into your pages
5. ⏭️ Test the AI functionality
6. ⏭️ Deploy to production

---

## Support

For issues with:
- **PostgreSQL**: https://www.postgresql.org/docs/
- **OpenAI API**: https://platform.openai.com/docs/
- **Express.js**: https://expressjs.com/

---

Created: February 12, 2026
