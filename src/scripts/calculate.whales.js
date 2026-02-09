/**
 * Whale Audit Tool - Compliance Verification v1.0
 * -------------------------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * PURPOSE: Identifies pioneers exceeding the 10% decentralization ceiling.
 * -------------------------------------------------------------------------
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Investor from '../models/investor.model.js';

dotenv.config();

const auditWhales = async () => {
    const GLOBAL_SUPPLY = 2181818; // MapCap Scarcity Spec
    const CEILING_LIMIT = 0.10;    // 10% Anti-Whale Rule

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🔍 [AUDIT] Scanning Global Ledger for Whale activity...");

        const investors = await Investor.find();
        let whaleCount = 0;

        for (let inv of investors) {
            const sharePct = inv.allocatedMapCap / GLOBAL_SUPPLY;
            
            if (sharePct > CEILING_LIMIT) {
                whaleCount++;
                console.warn(`⚠️ [WHALE_DETECTED] Pioneer: ${inv.piAddress} | Share: ${(sharePct * 100).toFixed(2)}%`);
                
                // Flagging in DB for Daniel's settlement review
                inv.isWhale = true;
                await inv.save();
            } else {
                inv.isWhale = false;
                await inv.save();
            }
        }

        console.log(`✅ [AUDIT_COMPLETE] Scan finished. Total Whales Flagged: ${whaleCount}`);
        process.exit(0);
    } catch (error) {
        console.error("❌ [CRITICAL] Audit failed:", error.message);
        process.exit(1);
    }
};

auditWhales();

