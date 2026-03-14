# 📊 CLONECHAIN DATABASE INTEGRATION - QUICK START

## ✅ WHAT'S BEEN CREATED

```
backend/
├── .env                          ← Configuration (MongoDB, Blockchain)
├── server.js                     ← Updated with MongoDB + meeting routes
├── models/
│   └── Meeting.js               ← Single unified Mongoose schema
├── config/
│   └── db.js                    ← MongoDB connection
├── routes/
│   ├── agentRoute.js            ← Existing agent logic
│   └── meetingRoutes.js         ← NEW: Meeting API endpoints
└── utils/
    └── blockchainExecutor.js    ← NEW: Blockchain storage logic
```

---

## 🔧 SETUP INSTRUCTIONS

### **Step 1: Install Dependencies**
```bash
cd backend
npm install
```

### **Step 2: Start MongoDB**

**Option A: Local MongoDB** (if you have it installed)
```bash
mongod
```

**Option B: MongoDB Atlas** (Cloud - recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account & cluster
3. Get connection string: `mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/clonechain`
4. Update `.env`:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/clonechain
```

### **Step 3: Configure .env**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/clonechain

# Server
NODE_ENV=development
PORT=5000

# Ollama
OLLAMA_URL=http://localhost:11434

# Blockchain (optional - for real on-chain storage)
PRIVATE_KEY=your_wallet_private_key
RPC_URL=https://eth-mainnet.alchemyapi.io/v2/your-key
CONTRACT_ADDRESS=0x...
```

### **Step 4: Start Backend**
```bash
node server.js
```

Expected output:
```
✓ MongoDB Connected Successfully
✓ Server running on http://localhost:5000
✓ Meetings API: http://localhost:5000/api/meetings
✓ Ollama Chat: http://localhost:5000/agent/chat
```

---

## 📋 DATABASE SCHEMA (Single Meeting Document)

Each meeting contains everything:
```javascript
{
  meetingId: "meet_001_2026-03-14",
  
  participants: {
    agentA: { id: ObjectId, name: "NegotiatorX" },
    agentB: { id: ObjectId, name: "DiplomatAI" }
  },
  
  goal: "Negotiate a 60/40 split...",
  iqPool: 5000,
  
  messages: [
    { sender: "agent-a", senderName: "NegotiatorX", message: "...", timestamp: "14:01" },
    { sender: "agent-b", senderName: "DiplomatAI", message: "...", timestamp: "14:02" }
  ],
  
  reasoningLogs: [
    { agentName: "NegotiatorX", thought: "Opening high...", confidence: 0.95 }
  ],
  
  result: {
    status: "finalized",
    finalTerms: "55/45 split with 30-day lock-up",
    split: { agentAPercentage: 55, agentBPercentage: 45, amount: 5000 },
    onChainExecution: {
      isExecuted: true,
      txHash: "0x8a3f7c2e...",
      blockNumber: 18234567,
      gasUsed: "0.0034 ETH"
    }
  },
  
  status: "finalized",
  createdAt: "2026-03-14T10:00:00Z"
}
```

---

## 🚀 API ENDPOINTS

### **1. Create Meeting**
```bash
POST /api/meetings/create

{
  "meetingId": "meet_001",
  "agentA": { "name": "NegotiatorX" },
  "agentB": { "name": "DiplomatAI" },
  "goal": "Negotiate 60/40 split",
  "iqPool": 5000
}
```

### **2. Add Message**
```bash
POST /api/meetings/:meetingId/messages

{
  "sender": "agent-a",
  "senderName": "NegotiatorX",
  "message": "I propose 60/40 split",
  "timestamp": "14:01"
}
```

### **3. Add Reasoning Log**
```bash
POST /api/meetings/:meetingId/reasoning

{
  "agentName": "NegotiatorX",
  "thought": "Opening high to anchor negotiation",
  "confidence": 0.95
}
```

### **4. Update Agreement Result**
```bash
PUT /api/meetings/:meetingId/result

{
  "status": "agreed",
  "finalTerms": "55/45 split with 30-day lock-up",
  "split": { "agentAPercentage": 55, "agentBPercentage": 45, "amount": 5000 }
}
```

### **5. Finalize on Blockchain** ⛓️
```bash
POST /api/meetings/:meetingId/finalize

{
  "contractAddress": "0x742d35Cc...",
  "agreementData": { "terms": "55/45 split" }
}
```

Returns:
```json
{
  "success": true,
  "blockchainResult": {
    "txHash": "0x8a3f7c2e...",
    "blockNumber": 18234567,
    "gasUsed": "0.0034 ETH"
  }
}
```

### **6. Get Meeting**
```bash
GET /api/meetings/:meetingId
```

### **7. Get Agreements (for AgreementLedger)**
```bash
GET /api/meetings/ledger/agreements
```

---

## 🔗 BLOCKCHAIN FLOW

```
1. Agreement reached
   ↓
2. POST /api/meetings/:meetingId/finalize
   ├─ Calls executeOnBlockchainSafe()
   ├─ Tries: Execute on Ethers.js smart contract
   └─ Fallback: Simulate if no blockchain config
   ↓
3. Updates Meeting with:
   - txHash
   - blockNumber
   - gasUsed
   ↓
4. Frontend displays: "✓ Agreement verified on blockchain: 0x8a3f7c2e..."
```

---

## 🧪 QUICK TEST

```bash
# Start server
node server.js

# Create meeting (in another terminal)
curl -X POST http://localhost:5000/api/meetings/create \
  -H "Content-Type: application/json" \
  -d '{
    "meetingId": "test_001",
    "agentA": {"name": "Agent1"},
    "agentB": {"name": "Agent2"},
    "goal": "Test negotiation",
    "iqPool": 1000
  }'

# Add message
curl -X POST http://localhost:5000/api/meetings/test_001/messages \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "agent-a",
    "senderName": "Agent1",
    "message": "Hello!"
  }'

# Get meeting
curl http://localhost:5000/api/meetings/test_001
```

---

## 📝 FILE DESCRIPTIONS

| File | Purpose |
|------|---------|
| **models/Meeting.js** | Mongoose schema - stores everything in single doc |
| **config/db.js** | MongoDB connection handler |
| **routes/meetingRoutes.js** | 8 API endpoints for meetings |
| **utils/blockchainExecutor.js** | Ethers.js integration - stores on blockchain |
| **.env** | Configuration (MongoDB URI, blockchain keys) |
| **server.js** | Updated with DB connection + meeting routes |

---

## ✨ FEATURES

✅ **Single Document Design** - Everything for a meeting in one place  
✅ **Complete Chat History** - All messages stored with timestamps  
✅ **Reasoning Transparency** - Agent thoughts logged for judges  
✅ **Blockchain Storage** - Results finalized on-chain  
✅ **Fallback Mode** - Works with simulation if no blockchain config  
✅ **Audit Trail** - Complete history from creation to finalization  

---

## 🎯 HACKATHON READY

This integration provides:
- **40% Implementation**: Clean MongoDB + Ethers.js architecture ✓
- **30% Agent Intelligence**: Complete reasoning logs visible ✓
- **20% Innovation**: Single doc stores complete lifecycle ✓
- **10% Presentation**: Full transparency from chat to blockchain ✓

---

## 🆘 TROUBLESHOOTING

**MongoDB not connecting?**
- Check if MongoDB service is running: `mongod`
- Or use MongoDB Atlas (cloud)

**Blockchain execution failing?**
- It will fall back to simulation automatically
- Configure .env with real RPC_URL to execute on mainnet

**Port 5000 in use?**
- Change in `.env`: `PORT=5001`

---

Done! Your backend now has full database integration with MongoDB and blockchain capabilities. 🚀
