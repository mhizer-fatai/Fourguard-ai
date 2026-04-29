import axios from 'axios';

const address = '0xe14655ef9abd291f84b9a0e24f6291a6df982d6b';
const baseUrl = 'http://localhost:3001';

async function performDeepScan() {
    console.log(`🚀 Starting Deep Scan for ${address}...`);
    
    try {
        // 1. Trigger Scan
        console.log(`📡 Triggering scan...`);
        const scanRes = await axios.post(`${baseUrl}/api/scan-token`, { address });
        console.log(`✅ Scan triggered:`, scanRes.data);
        
        const txHash = scanRes.data.txHash;
        console.log(`📝 Transaction Hash: ${txHash}`);
        
        // 2. Poll for Status
        console.log(`⏳ Waiting for GenLayer audit and AI enrichment...`);
        let completed = false;
        let attempts = 0;
        const maxAttempts = 30; // 5 minutes at 10s intervals
        
        while (!completed && attempts < maxAttempts) {
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10s
            
            try {
                const statusRes = await axios.get(`${baseUrl}/api/scan-status/${address}`);
                console.log(`🔄 Attempt ${attempts}: Status is "${statusRes.data.status}"`);
                
                if (statusRes.data.status === 'completed') {
                    console.log(`\n✨ DEEP SCAN COMPLETE! ✨`);
                    console.log(`==================================================`);
                    console.log(`REPORT SUMMARY:`);
                    console.log(`Guard Score: ${statusRes.data.report.guardScore}`);
                    console.log(`Risk Level: ${statusRes.data.report.riskLevel}`);
                    console.log(`\nAI FEEDBACK:`);
                    console.log(statusRes.data.report.insight?.findings || "No findings found.");
                    console.log(`\nPROS:`);
                    console.log(statusRes.data.report.insight?.pros || "No pros found.");
                    console.log(`\nCONS:`);
                    console.log(statusRes.data.report.insight?.cons || "No cons found.");
                    console.log(`\nSUGGESTIONS:`);
                    console.log(statusRes.data.report.insight?.suggestions || "No suggestions found.");
                    console.log(`==================================================`);
                    completed = true;
                }
            } catch (err) {
                console.warn(`⚠️ Polling error: ${err.message}`);
            }
        }
        
        if (!completed) {
            console.error(`❌ Scan timed out after ${attempts} attempts.`);
        }
        
    } catch (err) {
        console.error(`❌ Deep Scan Failed:`, err.response?.data || err.message);
    }
}

performDeepScan();
