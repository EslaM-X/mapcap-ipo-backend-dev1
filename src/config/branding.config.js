/**
 * White-Label Branding Configuration v1.5
 * ---------------------------------------------------------
 * Lead Architect: Eslam Kora | AppDev @Map-of-Pi
 * Project: MapCap Ecosystem | Spec: Multi-Tenant Scalability
 * * PURPOSE:
 * Centralizes application identity, visual branding, and core 
 * IPO parameters. This file allows for rapid re-branding and 
 * deployment of the MapCap ecosystem for future partners.
 * ---------------------------------------------------------
 */

const brandingConfig = {
    // --- Project Identity ---
    projectName: "MapCap IPO",
    dashboardTitle: "IPO Pulse Dashboard", // Core UX Hook
    providerName: "Map-of-Pi",
    
    // --- Visual Identity System ---
    theme: {
        primaryColor: "#d4af37", // MapCap Signature Gold
        secondaryColor: "#1a1a1a", // Deep Onyx for contrast
        accentColor: "#2ecc71", // Success Green for "Value 4" Alpha Gains
        currencySymbol: "π",
        fontFamily: "'Inter', sans-serif"
    },
    
    // --- IPO Core Mechanics (Philip's Spec) ---
    // These constants power the PriceService and Pulse Engine.
    mechanics: {
        ipoDurationWeeks: 4, 
        totalMapCapSupply: 2181818, // Fixed supply for scarcity modeling
        vestingPeriodMonths: 10, // Linear monthly release schedule
        whaleCapPercentage: 10, // 10% Anti-Whale Ceiling
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
        isLive: false, // Critical toggle for the 4-week execution window
        version: "1.5.0-WhiteLabel",
        complianceAudit: "Daniel_Standard_v1",
        engineType: "A2UaaS_Standard"
    }
};

/**
 * Exporting as a constant object to ensure immutability 
 * across the application lifecycle.
 */
export default Object.freeze(brandingConfig);
