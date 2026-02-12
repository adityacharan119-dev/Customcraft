# Customcraft Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Frontend (React + Vite)                                  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ Components:                                         │  │  │
│  │  │  • ProductCatalog                                   │  │  │
│  │  │  • TShirtCustomizer                                 │  │  │
│  │  │  • PillowCustomizer                                 │  │  │
│  │  │  • ChainCustomizer                                  │  │  │
│  │  │  • Checkout                                         │  │  │
│  │  │  • AIBot ◄── NEW!                                   │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ HTTP/HTTPS
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                  BACKEND (Express.js)                           │
│  Port: 5000                                                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  API Endpoints:                                           │  │
│  │                                                           │  │
│  │  Authentication:                                          │  │
│  │    • POST /api/auth/register                              │  │
│  │    • POST /api/auth/login                                 │  │
│  │                                                           │  │
│  │  Products & Orders:                                       │  │
│  │    • GET /api/products                                    │  │
│  │    • POST /api/orders                                     │  │
│  │    • POST /api/upload                                     │  │
│  │                                                           │  │
│  │  AI Bot (NEW):                                            │  │
│  │    • POST /api/ai/chat ◄────────────┐                    │  │
│  │    • GET /api/ai/chat-history       │                    │  │
│  │    • GET /api/ai/suggestions/:type  │                    │  │
│  │    • POST /api/ai/create-design     │                    │  │
│  │    • POST /api/ai/product-suggestions                     │  │
│  │                                     │                     │  │
│  └─────────────────────────────────────┼─────────────────────┘  │
└──────────────────────┬────────────────────┬─────────────────────┘
                       │                    │
                   ┌───┴────┐         ┌─────┴──────┐
                   │         │         │            │
                   ▼         ▼         ▼            ▼
        ┌──────────────────┐   ┌────────────────┐   ┌────────────────┐
        │  PostgreSQL DB   │   │  OpenAI API    │   │  Image Storage │
        │                  │   │  (GPT-3.5)     │   │  (/uploads)    │
        │  Tables:         │   │                │   │                │
        │  • users         │   │  Endpoints:    │   │  Processed:    │
        │  • products      │   │  • chat.       │   │  • Images      │
        │  • orders        │   │  • completions │   │  • Icons       │
        │  • order_items   │   │  • models      │   │                │
        │  • ai_chat_*     │   │                │   └────────────────┘
        │  • design_*      │   └────────────────┘
        │                  │
        │  Host:localhost  │
        │  Port: 5432      │
        │  User:customcraft│
        │  DB:customcraft  │
        └──────────────────┘
```

---

## AI Bot Flow

```
┌─────────────────┐
│   User Opens    │
│   Chat Widget   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│  Type Message   │─────►│ Frontend sends   │
│                 │      │ to /api/ai/chat  │
└─────────────────┘      └─────────┬────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │ Backend receives│
                          │ and validates   │
                          └─────────┬───────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │ Calls OpenAI    │
                          │ API with message│
                          └─────────┬───────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │ OpenAI returns  │
                          │ response text   │
                          └─────────┬───────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │ Backend saves   │
                          │ to ai_chat_*    │
                          │ table           │
                          └─────────┬───────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │ Sends response  │
                          │ to frontend     │
                          └─────────┬───────┘
                                   │
                                   ▼
┌──────────────────────┐
│ User sees bot reply  │
│ in chat widget       │
└──────────────────────┘
```

---

## Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                          │
│                        (customcraft)                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│    USERS     │
├──────────────┤
│ id (PK)      │
│ email (UNQ)  │
│ password     │
│ name         │
│ created_at   │
└──────┬───────┘
       │ (1:N)
       │
       ├──────────────────┐
       │                  │
       ▼                  ▼
┌────────────────┐  ┌──────────────────────┐
│    ORDERS      │  │ AI_CHAT_HISTORY ◄── NEW
├────────────────┤  ├──────────────────────┤
│ id (PK)        │  │ id (PK)              │
│ user_id (FK)   │  │ user_id (FK)         │
│ total          │  │ message              │
│ status         │  │ response             │
│ created_at     │  │ conversation_type    │
└────────┬───────┘  │ created_at           │
         │ (1:N)    └──────────────────────┘
         │
         ▼
┌─────────────────────┐
│    ORDER_ITEMS      │
├─────────────────────┤
│ id (PK)             │
│ order_id (FK)       │
│ product_id (FK)     │
│ quantity            │
│ customizations      │
│ price               │
└────────┬────────────┘
         │ (N:1)
         │
         ▼
    ┌──────────────┐
    │  PRODUCTS    │
    ├──────────────┤
    │ id (PK)      │
    │ name         │
    │ type         │
    │ category     │
    │ base_price   │
    │ image        │
    │ description  │
    │ custom_opts  │
    │ created_at   │
    └──────────────┘

┌──────────────────────────────┐
│ DESIGN_SUGGESTIONS ◄─── NEW  │
├──────────────────────────────┤
│ id (PK)                      │
│ user_id (FK)                 │
│ product_type                 │
│ suggestion (text)            │
│ design_specs (JSON)          │
│ created_at                   │
└──────────────────────────────┘

Legend:
PK = Primary Key
FK = Foreign Key
UNQ = Unique
◄─ NEW = Added in this update
```

---

## Request/Response Flow

### Chat Request
```
Request:
POST /api/ai/chat
Header: Authorization: Bearer {token}
Body: {
  "message": "What colors look good?",
  "conversationType": "design"
}

↓ Processing ↓

Response:
{
  "message": "What colors look good?",
  "response": "Try navy blue, burgundy, or forest green...",
  "conversationType": "design"
}

↓ Stored in Database ↓

ai_chat_history table:
- user_id: 123
- message: "What colors look good?"
- response: "Try navy blue..."
- conversation_type: "design"
- created_at: 2026-02-12T14:30:00Z
```

### Design Suggestions Request
```
Request:
GET /api/ai/suggestions/tshirt
Header: Authorization: Bearer {token}

↓ Processing ↓

Response:
{
  "text": "Consider minimalist designs...",
  "specs": {
    "layout": "center-front",
    "colorSchemes": ["monochrome", "two-tone"],
    "styles": ["minimalist", "vintage", "modern"]
  }
}

↓ Stored in Database ↓

design_suggestions table:
- user_id: 123
- product_type: "tshirt"
- suggestion: "Consider minimalist..."
- design_specs: {...}
```

---

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **shadcn/ui** - Component library

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **OpenAI API** - AI services
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads

### AI
- **OpenAI GPT-3.5-Turbo** - Language model
- Chat completions API

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│              Internet / Users                       │
└───────────────┬─────────────────────────────────────┘
                │
    ┌───────────┴───────────┐
    │                       │
    ▼                       ▼
┌─────────────┐       ┌──────────────┐
│   CDN/      │       │   Backend    │
│  Frontend   │       │   Server     │
│ Hosting     │       │   (Node.js)  │
│             │       │              │
│ - React App │       │ - Express.js │
│ - Assets    │       │ - Port 5000  │
│ - Static    │       └───────┬──────┘
└─────────────┘               │
                              │
                    ┌─────────┴────────┐
                    │                  │
                    ▼                  ▼
              ┌──────────────┐   ┌─────────────┐
              │ PostgreSQL   │   │  OpenAI API │
              │ Server       │   │  (External) │
              │ - Port 5432  │   │             │
              │ - Database   │   │ https://    │
              │ - Backups    │   │ api.openai. │
              └──────────────┘   │ com         │
                                 └─────────────┘
```

---

## Security Model

```
┌─────────────────────────────────────────────────────┐
│  User Request                                       │
└───────────────┬─────────────────────────────────────┘
                │
                ▼
        ┌──────────────────┐
        │  CORS Check      │ ◄── Only allow frontend domain
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  JWT Auth Check  │ ◄── Verify token from header
        └────────┬─────────┘
                 │
        ┌────────┴──────────┐
        │ Valid?            │
        ▼                   ▼
      YES                  NO
       │                   └──► Return 401/403
       │
       ▼
    ┌──────────────────┐
    │  Execute Query   │
    │ (Parameterized)  │ ◄── Prevent SQL injection
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │  Return Result   │
    │  (User's data)   │
    └──────────────────┘

Database Security:
├─ User authentication (passwords hashed)
├─ Role-based access
├─ Parameterized queries (SQL injection safe)
├─ SSL/TLS in production
└─ Regular backups
```

---

## Data Flow Summary

```
1. User Interface
   ↓
2. Frontend (React)
   ↓
3. API Call (HTTP/HTTPS)
   ↓
4. Express.js Server
   ├─ Auth validation
   ├─ Input validation
   └─ Route handling
       ↓
   5. Processing
      ├─ Generate AI response (OpenAI)
      ├─ Query database
      └─ Format response
          ↓
      6. PostgreSQL Database
         ├─ Save/retrieve data
         └─ Return results
             ↓
          7. Response to Frontend
             ↓
          8. Display to User
```

---

## Scalability Notes

### Current Setup
- Single backend server
- Single PostgreSQL database
- Direct OpenAI API calls

### For High Traffic (Future)
```
Backend Scaling:
- Load balancer
- Multiple backend instances
- Connection pooling
- Caching layer (Redis)

Database Scaling:
- Read replicas
- Automatic backups
- Sharding (if needed)
- Monitoring and alerts

API Scaling:
- Rate limiting
- Request queuing
- Response caching
- CDN for static assets
```

---

Created: February 12, 2026
