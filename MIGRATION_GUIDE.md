# SQLite to PostgreSQL Migration Guide

If you have existing data in your SQLite database, follow this guide to migrate it to PostgreSQL.

---

## Step 1: Export SQLite Data

```bash
cd backend

# Dump SQLite database to SQL file
sqlite3 customcraft.db ".dump" > sqlite_dump.sql
```

---

## Step 2: Clean Up SQLite Dump

The SQLite dump needs some modifications for PostgreSQL. Open `sqlite_dump.sql` and:

1. **Remove SQLite-specific syntax:**
   - Remove lines like: `PRAGMA foreign_keys=OFF;`
   - Remove lines like: `PRAGMA ...`

2. **Update data types** (do a find/replace):
   - `AUTOINCREMENT` → `SERIAL` (already handled by new schema)
   - `DATETIME` → `TIMESTAMP`

3. **Example cleanup script:**
```bash
# Create a cleaned version
sed -i '' '/PRAGMA/d' sqlite_dump.sql
sed -i '' '/BEGIN TRANSACTION/d' sqlite_dump.sql
sed -i '' '/COMMIT/d' sqlite_dump.sql
```

---

## Step 3: Create PostgreSQL Tables

First, ensure PostgreSQL tables exist by starting the backend once:

```bash
# This will automatically create all tables
npm run dev
# Let it run for a few seconds, then stop with Ctrl+C
```

---

## Step 4: Manual Data Migration (Recommended)

Instead of using SQL dumps, use a Node.js script for safer migration:

### Create `migrate.js`

```javascript
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
require('dotenv').config();

const sqliteDb = new sqlite3.Database('./customcraft.db');
const pgPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function migrateUsers() {
  return new Promise((resolve, reject) => {
    sqliteDb.all('SELECT * FROM users', async (err, rows) => {
      if (err) {
        console.error('Error reading users from SQLite:', err);
        return reject(err);
      }

      for (const user of rows) {
        try {
          await pgPool.query(
            'INSERT INTO users (id, email, password, name, created_at) VALUES ($1, $2, $3, $4, $5)',
            [user.id, user.email, user.password, user.name, user.created_at]
          );
        } catch (error) {
          console.warn('Error inserting user:', error.message);
        }
      }
      resolve();
    });
  });
}

async function migrateProducts() {
  return new Promise((resolve, reject) => {
    sqliteDb.all('SELECT * FROM products', async (err, rows) => {
      if (err) {
        console.error('Error reading products from SQLite:', err);
        return reject(err);
      }

      for (const product of rows) {
        try {
          await pgPool.query(
            'INSERT INTO products (id, name, type, category, base_price, image, description, customization_options, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [product.id, product.name, product.type, product.category, product.base_price, product.image, product.description, product.customization_options, product.created_at]
          );
        } catch (error) {
          console.warn('Error inserting product:', error.message);
        }
      }
      resolve();
    });
  });
}

async function migrateOrders() {
  return new Promise((resolve, reject) => {
    sqliteDb.all('SELECT * FROM orders', async (err, rows) => {
      if (err) {
        console.error('Error reading orders from SQLite:', err);
        return reject(err);
      }

      for (const order of rows) {
        try {
          await pgPool.query(
            'INSERT INTO orders (id, user_id, total, status, created_at) VALUES ($1, $2, $3, $4, $5)',
            [order.id, order.user_id, order.total, order.status, order.created_at]
          );
        } catch (error) {
          console.warn('Error inserting order:', error.message);
        }
      }
      resolve();
    });
  });
}

async function migrateOrderItems() {
  return new Promise((resolve, reject) => {
    sqliteDb.all('SELECT * FROM order_items', async (err, rows) => {
      if (err) {
        console.error('Error reading order_items from SQLite:', err);
        return reject(err);
      }

      for (const item of rows) {
        try {
          await pgPool.query(
            'INSERT INTO order_items (id, order_id, product_id, quantity, customizations, price) VALUES ($1, $2, $3, $4, $5, $6)',
            [item.id, item.order_id, item.product_id, item.quantity, item.customizations, item.price]
          );
        } catch (error) {
          console.warn('Error inserting order item:', error.message);
        }
      }
      resolve();
    });
  });
}

async function migrate() {
  try {
    console.log('🚀 Starting migration from SQLite to PostgreSQL...\n');

    console.log('📦 Migrating users...');
    await migrateUsers();

    console.log('📦 Migrating products...');
    await migrateProducts();

    console.log('📦 Migrating orders...');
    await migrateOrders();

    console.log('📦 Migrating order items...');
    await migrateOrderItems();

    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    sqliteDb.close();
    pgPool.end();
  }
}

migrate();
```

### Run Migration

```bash
cd backend

# Install sqlite3 if not already installed
npm install sqlite3

# Run the migration script
node migrate.js
```

---

## Step 5: Verify Migration

```bash
# Connect to PostgreSQL database
psql -U customcraft_user -d customcraft

# Check data in each table
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM orders;
SELECT COUNT(*) FROM order_items;

# Exit psql
\q
```

---

## Step 6: Backup Old SQLite Database

```bash
# Make a backup of the SQLite database
cp customcraft.db customcraft.db.backup

# Optional: Move backup to safe location
mkdir -p backups
mv customcraft.db.backup backups/customcraft-$(date +%Y%m%d).db.backup
```

---

## Step 7: Remove SQLite References

```bash
cd backend

# Uninstall SQLite package
npm uninstall sqlite3

# Install PostgreSQL package
npm install pg
```

---

## Step 8: Update Backend Code

The backend code has already been updated to use PostgreSQL. Just verify:

1. Open `backend/server.js`
2. Confirm it uses `pg` instead of `sqlite3`
3. Confirm `.env` has PostgreSQL credentials

---

## Step 9: Test Application

```bash
# Start backend
cd backend
npm run dev

# In another terminal, start frontend
npm run dev

# Test:
# 1. Login with existing user credentials
# 2. Verify orders and products are showing
# 3. Try creating a new order
# 4. Test AI bot features
```

---

## Troubleshooting Migration

### Issue: Foreign Key Constraint Errors

**Solution**: Migrate in correct order:
1. Users first
2. Products
3. Orders
4. Order Items

(This is already handled in the script above)

### Issue: ID Conflicts

**Solution**: PostgreSQL sequences might conflict. Reset them:

```bash
psql -U customcraft_user -d customcraft

-- Reset sequences
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users)+1);
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products)+1);
SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders)+1);
SELECT setval('order_items_id_seq', (SELECT MAX(id) FROM order_items)+1);

\q
```

### Issue: Date Format Problems

**Solution**: Ensure dates are being converted properly. Update migration script:

```javascript
// Convert SQLite date strings to ISO format
const createdAt = new Date(user.created_at).toISOString();

await pgPool.query(
  'INSERT INTO users (..., created_at) VALUES (..., $x)',
  [..., createdAt]
);
```

---

## Backup Strategy

After successful migration, maintain backups:

```bash
# Daily PostgreSQL backup
pg_dump -U customcraft_user customcraft > backups/pg-backup-$(date +%Y%m%d).sql

# Add to cron for daily backups
0 2 * * * pg_dump -U customcraft_user customcraft > /path/to/backups/pg-backup-$(date +\%Y\%m\%d).sql
```

---

## Rollback Plan (If Needed)

If migration fails:

1. **Restore SQLite backup**
   ```bash
   cp customcraft.db.backup customcraft.db
   ```

2. **Reinstall SQLite**
   ```bash
   cd backend
   npm install sqlite3
   ```

3. **Revert backend changes** (see git for previous version)

4. **Restart backend with SQLite**

---

## Performance Comparison

### SQLite
- File-based
- Single user
- Good for: Development, small projects

### PostgreSQL
- Server-based
- Multiple concurrent users
- Good for: Production, large projects, high traffic

---

## Post-Migration Checklist

- [ ] All tables have data
- [ ] User authentication works
- [ ] Products display correctly
- [ ] Orders can be created
- [ ] AI bot features work
- [ ] No console errors
- [ ] Backup of old database kept
- [ ] Performance is good

---

## Next Steps

1. ✅ Complete migration
2. ✅ Verify all data
3. ✅ Test application thoroughly
4. ✅ Set up automated backups
5. ✅ Monitor performance
6. ✅ Deploy to production

---

**Last Updated**: February 12, 2026
