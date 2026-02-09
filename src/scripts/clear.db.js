/**
 * DB Cleanup Tool - Development Utility v1.0
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * PURPOSE: Wipes the investor collection for a fresh start.
 * ---------------------------------------------------------
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Investor from '../models/investor.model.js';

dotenv.config();

const clearDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🧹 [DB_TOOL] Preparing to wipe Investor Ledger...");
        
        const result = await Investor.deleteMany({});
        console.log(`✅ [CLEANUP_SUCCESS] Purged ${result.deletedCount} records.`);
        
        process.exit(0);
    } catch (error) {
        console.error("❌ [ERROR] Cleanup failed:", error.message);
        process.exit(1);
    }
};

clearDatabase();
