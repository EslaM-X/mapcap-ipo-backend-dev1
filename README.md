# <p align="center">👑 MapCap IPO: The Institutional-Grade Equity Protocol</p>
<p align="center">
  <i>Next-Gen Web3 Liquidity Orchestration for the Map-of-Pi Ecosystem</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Pi%20Network-gold?style=for-the-badge&logo=pi" alt="Pi Network">
  <img src="https://img.shields.io/badge/Engine-Node.js-green?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/Security-Whale--Shield%20v4-blue?style=for-the-badge" alt="Security">
  <img src="https://img.shields.io/badge/Compliance-Audit--Ready-brightgreen?style=for-the-badge" alt="Compliance">
</p>

---

## 📖 Project Manifesto
The **MapCapIPO** engine is a high-fidelity community application running within the **Pi Browser**. It is engineered to reproduce a traditional stock market **Initial Public Offering (IPO)** of Map of Pi equity ownership on the blockchain. By leveraging a dual-pool minting strategy, this protocol eliminates the **"low-price-race"** and guarantees a structural **20% capital appreciation** for early participants.

---

## 🛠️ System Architecture & Engineering Map

### 📂 Directory & Logical Structure
| Layer | Module | Description & Business Logic |
| :--- | :--- | :--- |
| **🏛️ Governance** | `initial_mint.js` | Enforces the 4M supply: **2,181,818 (IPO)** & **1,818,182 (LP)**. |
| **🚨 Security** | `server.js` | Real-time monitoring and standardized API orchestration for the Pi Browser UI. |
| **📟 Interface** | `ipo.controller.js` | Orchestrates the "Single Screen" layout with 4 essential metrics. |
| **🧠 Oracle** | `math.helper.js` | High-precision arithmetic (6-decimals) for exact **Alpha Gain** ratios. |
| **🐳 Defense** | `settlement.js` | **Anti-Whale Batch Job**: Automated 10% investment cap enforcement. |
| **⏲️ Automation** | `cron.scheduler.js` | **UTC-Synchronized** automation for daily spot-pricing and vesting. |

---

## 📈 Strategic Financial Features (Philip’s Vision)

> [!IMPORTANT]
> **The Alpha Advantage**: All IPO pioneers purchase at the same price, receiving a 20% gain at LP launch.

* **Water-Level Pricing**: Dynamic calculation where `Spot-Price = IPO_MapCap / Total_Pi_Contributed`.
* **Institutional Vesting**: Strategic 10-month release schedule (10% monthly) after LP commencement.
* **Dividend Protocol**: Automated distribution of **10% of Map of Pi profits** to MapCap holders.
* **Fixed Duration**: The IPO phase is strictly limited to four calendar weeks.

---

## 🛡️ Security Integrity (Daniel’s Standards)

### 1️⃣ Whale-Shield v4.0
No single entity can monopolize the IPO. Any stake exceeding **10%** of the pool is automatically identified and refunded via **A2UaaS**.

### 2️⃣ Immutable Audit Trail
Every system calculation and transaction is recorded in detailed logs to maintain Daniel's security and transparency standards.

### 3️⃣ UTC Synchronization
Strict adherence to the **Gregorian calendar (UTC)** for all snapshots and price points to prevent manipulation.

---

## 📊 Dashboard Intelligence: The Four Essential Values
The backend delivers a unified data object optimized for the Pi Browser smartphone UI:
1.  **Total Investors**: Number of unique pioneers who have deposited investments.
2.  **Global Water-Level**: Total amount of pi invested by all pioneers to date.
3.  **Individual Stake**: Total balance of the current user's pi in the IPO wallet.
4.  **Capital Gain Projection**: Real-time projection of the 20% increase in pi value.

---

## 🚀 Deployment & Initialization
```bash
# Clone the repository
git clone [https://github.com/Map-of-Pi/MapCap-Engine.git](https://github.com/Map-of-Pi/MapCap-Engine.git)

# Install dependencies
npm install

# Configure Environmental Variables (.env)
# MONGO_URI, PI_API_KEY, WALLET_PRIVATE_KEY

# Launch the Engine
npm run start:prod
