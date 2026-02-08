# 🚀 MapCap IPO - The Heart of Map-of-Pi Ecosystem
### *Empowering Pioneers through Scalable Web3 Equity Solutions*

![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)
![Security](https://img.shields.io/badge/Security-Whale--Shield%20Lvl4-blue)
![Architecture](https://img.shields. ://img.shields.io/badge/Architecture-Clean%20MVC-orange)
![License](https://img.shields.io/badge/License-PIOS-gold)

---

## 🌟 Executive Overview
[span_2](start_span)[span_3](start_span)MapCapIPO is a professional-grade Pi Network community application designed to reproduce a stock market **Initial Public Offering (IPO)** on the Pi blockchain[span_2](end_span)[span_3](end_span). [span_4](start_span)[span_5](start_span)It enables Pioneers to invest Pi in exchange for **MapCap tokens**, establishing a fair "Stop-Price" before Liquidity Pool (LP) open trading begins[span_4](end_span)[span_5](end_span).

> **[span_6](start_span)[span_7](start_span)[span_8](start_span)Vision Statement:** To eliminate the "Low-price-race" and provide a 20% capital increase for early IPO Pioneers[span_6](end_span)[span_7](end_span)[span_8](end_span).

---

## 🛠️ System Architecture & Mapping
[span_9](start_span)[span_10](start_span)The backend is built with a high-performance **MERN Stack** (Node.js/Express/MongoDB) optimized for UTC-synchronized financial operations[span_9](end_span)[span_10](end_span).

### 📂 Directory Map & File Functions
| Module | File | Purpose & Functionality |
| :--- | :--- | :--- |
| **Config** | `initial_mint.js` | [span_11](start_span)Defines the 4M total supply: **2,181,818 for IPO** and **1,818,182 for LP**[span_11](end_span). |
| **Core** | `server.js` | The engine room. [span_12](start_span)Integrated with **Morgan Audit Logging** for full transparency[span_12](end_span). |
| **Controllers** | `ipo.controller.js` | [span_13](start_span)[span_14](start_span)Serves the "Single Screen" layout with 4 real-time essential values[span_13](end_span)[span_14](end_span). |
| **Utilities** | `math.helper.js` | The "Financial Brain". [span_15](start_span)Handles 6-decimal Pi precision and 20% Alpha Gain calculations[span_15](end_span). |
| **Utilities** | `response.helper.js` | Ensures standardized, professional API responses for seamless Frontend integration. |
| **Automation** | `cron.scheduler.js` | [span_16](start_span)[span_17](start_span)[span_18](start_span)Orchestrates daily spot-prices, 10-month vesting, and anti-whale checks in **UTC**[span_16](end_span)[span_17](end_span)[span_18](end_span). |
| **Jobs** | `settlement.js` | The **Whale-Shield**. [span_19](start_span)Executes automated A2UaaS refunds for investments exceeding 10%[span_19](end_span). |

---

## 💎 Key Financial Features (Philip’s Vision)
* **[span_20](start_span)[span_21](start_span)The 20% Alpha Advantage:** IPO Pioneers purchase MapCap at a price 20% below the opening LP value[span_20](end_span)[span_21](end_span).
* **[span_22](start_span)Water-Level Pricing:** A fair pricing model where `Spot-Price = IPO_POOL / Total_Pi_Contributed`[span_22](end_span).
* **[span_23](start_span)[span_24](start_span)Linear Vesting:** Safe delivery of tokens over 10 months (10% monthly) to maintain market stability[span_23](end_span)[span_24](end_span).
* **[span_25](start_span)Automated Dividends:** Future-ready logic to distribute 10% of Map of Pi profits to token holders[span_25](end_span).

---

## 🛡️ Security & Integrity (Daniel’s Standards)
* **Whale Protection:** No single entity can control more than 10% of the IPO pool. [span_26](start_span)[span_27](start_span)Excess is automatically refunded[span_26](end_span)[span_27](end_span).
* **[span_28](start_span)Audit Trail:** Every transaction and system calculation is logged in `logs/audit.log` for full accountability[span_28](end_span).
* **[span_29](start_span)UTC Synchronization:** All financial snapshots occur at 00:00 UTC to ensure global fairness[span_29](end_span).
* **High-Performance Aggregation:** Uses MongoDB Aggregation Pipelines to handle millions of pioneers with sub-second latency.

---

## 📊 The "Four Essential Values" (Dashboard Logic)
[span_30](start_span)[span_31](start_span)As per the requirement for the Pi Browser smartphone UI[span_30](end_span)[span_31](end_span), the backend serves:
1.  **[span_32](start_span)Total Investors:** Unique Pioneers in the IPO[span_32](end_span).
2.  **[span_33](start_span)Total Pi Invested:** The current "Water-Level" of the pool[span_33](end_span).
3.  **[span_34](start_span)User Balance:** Individual Pi contribution[span_34](end_span).
4.  **[span_35](start_span)Capital Gain:** Real-time projection of the 20% increase[span_35](end_span).



---

## 🚀 Execution & Deployment
1. **Environment Setup:** Configure `MONGO_URI` and `PI_API_KEY` in `.env`.
2. **Install Dependencies:** `npm install`
3. **Launch Pulse Engine:** `npm start`
4. **Audit Logs:** Monitor `tail -f logs/audit.log` for real-time system health.

---

## 📈 Future Roadmap
* **[span_36](start_span)Phase 1:** IPO Launch (4 Weeks Fixed Duration)[span_36](end_span).
* **[span_37](start_span)[span_38](start_span)Phase 2:** Anti-Whale Settlement & A2UaaS Refunds[span_37](end_span)[span_38](end_span).
* **[span_39](start_span)[span_40](start_span)Phase 3:** LP Open Trading & 10-Month Vesting Kick-off[span_39](end_span)[span_40](end_span).

---
**Developed with Passion for the Pi Network Ecosystem.**
*AppDev @Map-of-Pi | Building Scalable Web3 Solutions*
