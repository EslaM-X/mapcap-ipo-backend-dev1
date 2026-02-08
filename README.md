# <p align="center">👑 MapCap IPO — Institutional-Grade Equity Protocol</p>

<p align="center">
  <i>Next-Generation Web3 Liquidity Orchestration for the Map-of-Pi Ecosystem</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Pi%20Network-gold?style=for-the-badge&logo=pi" />
  <img src="https://img.shields.io/badge/Runtime-Node.js-green?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Security-Whale--Shield%20v4-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Audit--Ready-brightgreen?style=for-the-badge" />
</p>

---

## 📖 Project Manifesto

**MapCap IPO** is an institutional-grade equity issuance engine designed exclusively for the **Pi Browser**, enabling a fully on-chain, community-driven simulation of a traditional **Initial Public Offering (IPO)**.

The protocol replicates real-world capital markets while eliminating common Web3 exploit patterns such as:
- Low-price gas wars
- Early-buyer front-running
- Whale accumulation dominance

By leveraging a **Dual-Pool Minting Architecture**, MapCap IPO guarantees:
- Equal entry pricing for all pioneers
- Structural **20% capital appreciation**
- Predictable liquidity transition into open market trading

This is **not speculation** — it is engineered market structure.

---

## 🧠 Core Design Philosophy

| Principle | Implementation |
|--------|---------------|
| Fair Entry | Single water-level pricing |
| Capital Protection | Anti-whale enforcement |
| Institutional Discipline | Fixed calendars & vesting |
| Transparency | Deterministic math & logs |
| Pi-Native | Built exclusively for Pi Network |

---

## 🏗️ System Architecture

### 📂 Directory Structure

| Layer | Module | Responsibility |
|----|----|----|
| 🏛️ Governance | `initial_mint.js` | Enforces the fixed **4,000,000 MapCap** supply |
| 🚨 Security | `server.js` | Secure API gateway & Pi Browser orchestration |
| 📟 Interface | `ipo.controller.js` | Single-screen metric delivery (mobile-optimized) |
| 🧠 Oracle | `math.helper.js` | High-precision (6-decimal) deterministic math |
| 🐳 Defense | `settlement.js` | Whale-Shield v4 automated enforcement |
| ⏲️ Automation | `cron.scheduler.js` | UTC-synchronized pricing & vesting logic |

---

## 🪙 Token Supply Model

**Total Supply:** `4,000,000 MapCap`

| Allocation | Amount | Purpose |
|---------|--------|--------|
| IPO Pool | `2,181,818` | Pioneer distribution |
| LP Pool | `1,818,182` | Guaranteed 20% appreciation |

This ratio mathematically enforces the Alpha Advantage.

---

## 📈 Financial Mechanics

### 🔹 Water-Level Pricing

Spot Price = IPO_MapCap / Total_Pi_Contributed

All participants receive the **exact same entry price**, regardless of time.

### 🔹 Alpha Advantage
> Every IPO participant receives a **guaranteed +20% valuation uplift** at LP launch.

### 🔹 Institutional Vesting
- LP opens at month boundary (UTC)
- 10-month vesting schedule
- 10% unlocked monthly
- Zero discretionary control

### 🔹 Dividend Protocol
- 10% of Map-of-Pi net profits
- Automatically distributed
- Proportional to MapCap holdings

---

## 🛡️ Security Model

### 🐳 Whale-Shield v4.0
- Maximum ownership: **10%**
- Automatic detection
- Excess funds refunded via **A2UaaS**
- Zero manual intervention

### 📜 Immutable Audit Trail
- All calculations logged
- Deterministic math
- Replay-safe accounting

### ⏱️ UTC Enforcement
- Gregorian calendar alignment
- No timezone manipulation
- No snapshot ambiguity

---

## 📊 Dashboard Metrics (Pi Browser UI)

The backend exposes a single optimized data object containing:

1. **Total Investors**
2. **Global Water-Level (Total Pi)**
3. **Individual Contribution**
4. **Projected Capital Gain (+20%)**

Designed for clarity, speed, and trust.

---

🗓️IPO Lifecycle
PHASE 1 — IPO Launch
• Fixed 4-week duration
• Equal pricing for all pioneers
PHASE 2 — Anti-Whale Settlement
• Automatic >10% enforcement
• Excess refunds processed
PHASE 3 — LP Activation
• Begins at next Gregorian month
• 10-month vesting schedule
🧬 Designed For
Institutional-grade Web3 markets
Pi Network native capital flows
Transparent community ownership
Long-term protocol sustainability
👑 Closing Statement
MapCap IPO is not a token sale.
It is a market primitive engineered for fairness, discipline, and scale —
purpose-built for the Pi Network era.
�
Built with conviction for the Pi ecosystem 
Full-Stack Developer • Web3 Architect • Map-of-Pi Core 
```



## 🚀 Deployment

```bash
# Clone repository
git clone https://github.com/Map-of-Pi/MapCap-Engine.git

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# MONGO_URI
# PI_API_KEY
# WALLET_PRIVATE_KEY

# Launch production
npm run start:prod 
