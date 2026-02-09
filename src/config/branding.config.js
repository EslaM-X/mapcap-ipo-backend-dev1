/**
 * White-Label Configuration File
 * ---------------------------------------------------------
 * This central configuration governs the application's identity, 
 * branding, and core IPO parameters. 
 * * DESIGNED FOR SCALABILITY: 
 * To re-brand the service for other developers (White-Label), 
 * simply update these values.
 */

const brandingConfig = {
    // Project Identity
    projectName: "MapCap IPO",
    dashboardTitle: "IPO Pulse Dashboard", // Engaging title for the 4-week cycle
    
    // Visual Branding
    primaryColor: "#d4af37", // MapCap Signature Gold
    secondaryColor: "#1a1a1a", // Deep Onyx for high-contrast UI
    currencySymbol: "π",
    
    // IPO Core Parameters (The "Water-Level" Mechanics)
    // These values are used by PriceService for spot-price calculations.
    ipoDurationWeeks: 4, 
    totalIpoAmount: 2181818, // Fixed MapCap Supply
    
    // External Resources & Support
    // Dynamic links to ensure easy re-branding for different app ecosystems.
    supportChat: "M.A.C AI Bot", 
    termsLink: "https://mapofpi.com/terms",
    
    // Deployment Metadata
    isLive: false, // Toggle for the 4-week execution window
    version: "1.0.0-WhiteLabel"
};

module.exports = brandingConfig;
