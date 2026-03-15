🔗 CloneChain
AI Agents Negotiating Secure Trust on the Ledger.

CloneChain is an autonomous negotiation framework that bridges the gap between LLM reasoning and verifiable economic settlement. By utilizing Gemini 1.5 Flash and the IQ ADK, CloneChain enables stateful, boundary-aware AI agents to negotiate deals and finalize them directly on an immutable ledger.

🚀 Overview
In the current AI landscape, agents are "stateless"—they forget context and lack the authority to close deals. CloneChain solves this by providing:

Stateful Memory: Persistent chat history injection for consistent long-form negotiation.

Economic Agency: Boundary-aware agents that respect "floor" and "ceiling" price constraints.

Immutable Settlement: Automatic "Deal Detection" that triggers database and on-chain logging.

🛠️ Technical Stack
Core Brain: Google Gemini 2.5 Flash (Primary Reasoning)

Local Redundancy: Ollama (Llama 3)

Agent Framework: IQ ADK (v1.0)

Frontend: React.js, Vite, Tailwind CSS, Framer Motion

Backend: Node.js, Express, MongoDB

Web3 Integration: Ethereum Mainnet (Ledger Verification)

🏗️ Architecture
CloneChain operates on a Dual-Boot Neural Link:

Negotiation Layer: Gemini 2.5 Flash processes user intent and maintains negotiation "vibe."

Constraint Layer: System instructions enforce price boundaries and closing protocols.

Settlement Layer: Once an agreement is reached, the system freezes the state and pushes the AGREEMENT_REACHED event to the ledger.

📦 Installation
Clone the repository:

Bash
git clone https://github.com/your-username/clonechain.git
cd clonechain
Install Dependencies:

Bash
# Install Backend
cd backend && npm install

# Install Frontend
cd ../frontend && npm install
Environment Setup:
Create a .env file in the backend directory:

Code snippet
GOOGLE_API_KEY=your_gemini_key
MONGO_URI=your_mongodb_connection
PORT=5000
Run the Project:

Bash
# Start Backend
npm run dev (inside /backend)

# Start Frontend
npm run dev (inside /frontend)
📊 Features
Live Negotiation Arena: Real-time chat interface with AI reasoning visibility.

Internal Logic Panel: View the "Brain" of the agent as it calculates its next move.

Verified Ledger: A dedicated dashboard showing finalized hashes, gas used, and terms.

Dynamic Goals: Users can set custom goals (e.g., "Sell API access for 5000 IQ").

🛡️ Trust & Safety
CloneChain uses Constraint-Based Prompting to ensure agents never exceed their authorized financial boundaries, preventing hallucinated concessions.
