# <p align="center">👑 MapCap IPO: The Institutional-Grade Equity Engine</p>
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
[span_0](start_span)The **MapCapIPO** engine is a high-fidelity community application running within the **Pi Browser**[span_0](end_span). [span_1](start_span)It is engineered to reproduce a traditional stock market **Initial Public Offering (IPO)** on the blockchain[span_1](end_span). [span_2](start_span)[span_3](start_span)[span_4](start_span)By leveraging a dual-pool minting strategy, this protocol eliminates the **"low-price-race"** and guarantees a structural **20% capital appreciation** for early participants[span_2](end_span)[span_3](end_span)[span_4](end_span).

---

## 🛠️ System Architecture & Engineering Map

### 📂 Directory & Logical Structure
| Layer | Module | Description & Business Logic |
| :--- | :--- | :--- |
| **🏛️ Governance** | `initial_mint.js` | [span_5](start_span)Enforces the 4M supply: **2,181,818 (IPO)** & **1,818,182 (LP)**[span_5](end_span). |
| **🚨 Security** | `server.js` | [span_6](start_span)Real-time monitoring and standardized API orchestration[span_6](end_span). |
| **📟 Interface** | `ipo.controller.js` | [span_7](start_span)[span_8](start_span)Orchestrates the "Single Screen" layout with 4 essential metrics[span_7](end_span)[span_8](end_span). |
| **🧠 Oracle** | `math.helper.js` | [span_9](start_span)[span_10](start_span)High-precision arithmetic (6-decimals) for exact **Alpha Gain** ratios[span_9](end_span)[span_10](end_span). |
| **🐳 Defense** | `settlement.js` | **[span_11](start_span)Anti-Whale Batch Job**: Automated 10% investment cap enforcement[span_11](end_span). |
| **⏲️ Automation** | `cron.scheduler.js` | **[span_12](start_span)[span_13](start_span)[span_14](start_span)UTC-Synchronized** automation for daily spot-pricing and vesting[span_12](end_span)[span_13](end_span)[span_14](end_span). |

---

## 📈 Strategic Financial Features (Philip’s Vision)

> [!IMPORTANT]
> **[span_15](start_span)[span_16](start_span)The Alpha Advantage**: All IPO pioneers purchase at the same price, receiving a 20% gain at LP launch[span_15](end_span)[span_16](end_span).

* **[span_17](start_span)Water-Level Pricing**: Dynamic calculation where `Spot-Price = IPO_MapCap / Total_Pi_Contributed`[span_17](end_span).
* **[span_18](start_span)[span_19](start_span)Institutional Vesting**: Strategic 10-month release schedule (10% monthly) after LP commencement[span_18](end_span)[span_19](end_span).
* **[span_20](start_span)Dividend Protocol**: Automated distribution of **10% of Map of Pi profits** to MapCap holders[span_20](end_span).

---

## 🛡️ Security Integrity (Daniel’s Standards)

### 1️⃣ Whale-Shield v4.0
No single entity can monopolize the IPO. [span_21](start_span)Any stake exceeding **10%** of the pool is automatically identified and refunded via **A2UaaS**[span_21](end_span).

### 2️⃣ Immutable Audit Trail
[span_22](start_span)[span_23](start_span)Every system calculation and transaction is recorded in detailed logs for full accountability and post-IPO auditing[span_22](end_span)[span_23](end_span).

### 3️⃣ UTC Synchronization
[span_24](start_span)[span_25](start_span)Strict adherence to the **Gregorian calendar (UTC)** for all snapshots and price points to prevent manipulation[span_24](end_span)[span_25](end_span).

---

## 📊 Dashboard Intelligence: The Four Essential Values
The backend delivers a unified data object optimized for the Pi Browser UI:
1.  **[span_26](start_span)Total Investors**: Unique Pioneer participation count[span_26](end_span).
2.  **[span_27](start_span)Global Water-Level**: Aggregate Pi liquidity currently in the pool[span_27](end_span).
3.  **[span_28](start_span)Individual Stake**: Personal user contribution balance[span_28](end_span).
4.  **[span_29](start_span)Capital Gain Projection**: Real-time 20% alpha increase calculation[span_29](end_span).

---

## 🚀 Deployment & Initialization
```bash
# Clone and install
git clone [https://github.com/Map-of-Pi/MapCap-Engine.git](https://github.com/Map-of-Pi/MapCap-Engine.git)
npm install

# Configure Environmental Variables
# MONGO_URI, PI_API_KEY, WALLET_PRIVATE_KEY

# Launch the Engine
npm run start:prod

 Roadmap: The 4-Week Cycle
​PHASE 1: IPO Launch (4 Weeks Fixed Duration).  
​PHASE 2: Anti-Whale Settlement & A2UaaS Refund Batch.  
​PHASE 3: LP Open Trading & 10-Month Linear Vesting.  
​<div align="center">
​Developed with Passion for the Pi Network Ecosystem. AppDev @Map-of-Pi | Building Scalable Web3 Solutions
​</div>
