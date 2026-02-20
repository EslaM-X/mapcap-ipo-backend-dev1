/**
 * White-Label Branding Configuration v1.5.5
 * ---------------------------------------------------------
 * Lead Architect: EslaM-X | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Multi-Tenant Scalability
 * ---------------------------------------------------------
 * PURPOSE:
 * Centralizes application identity, visual branding, and core 
 * IPO parameters. This configuration powers both the UI theme 
 * and the mathematical engine (PriceService/Pulse).
 * ---------------------------------------------------------
 */

const brandingConfig = {
    // --- Project Identity ---
    projectName: "MapCap IPO",
    dashboardTitle: "IPO Pulse Dashboard", 
    providerName: "Map-of-Pi",
    
    // --- Visual Identity System (Frontend Theme Sync) ---
    theme: {
        primaryColor: "#d4af37", // MapCap Signature Gold
        secondaryColor: "#1a1a1a", // Deep Onyx for contrast
        accentColor: "#2ecc71", // Success Green for "Value 4" Alpha Gains
        currencySymbol: "π",
        fontFamily: "'Inter', sans-serif"
    },
    
    // --- IPO Core Mechanics (Philip's Strategic Specs) ---
    // These constants drive the Scarcity Model and Settlement Job.
    mechanics: {
        ipoDurationWeeks: 4, 
        totalMapCapSupply: 2181818, // Fixed supply for scarcity modeling (Value 2)
        vestingPeriodMonths: 10, // Linear monthly release schedule
        whaleCapPercentage: 10, // 10% Anti-Whale Ceiling (Post-IPO enforcement)
    },
    
    // --- Ecosystem & Support Links ---
    links: {
        supportChat: "M.A.C AI Assistant", 
        termsUrl: "https://mapofpi.com/terms",
        privacyUrl: "https://mapofpi.com/privacy",
        officialWebsite: "https://mapofpi.com"
    },
    
    // --- Deployment & Compliance Metadata ---
    metadata: {
        isLive: false, // Deployment status for the 4-week window
        version: "1.5.5-Enterprise",
        complianceAudit: "Daniel_Standard_v2", // Updated to reflect new settlement logic
        engineType: "A2UaaS_Standard"
    }
};

/**
 * Object.freeze ensures immutability, preventing runtime 
 * changes to core financial and branding parameters.
 */
export default Object.freeze(brandingConfig);
