import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const keys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4
];

async function testKeys() {
  console.log("🔍 [Diagnostic] Testing Gemini API Keys...");
  
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!key) {
      console.log(`❌ Key #${i+1}: Missing from .env`);
      continue;
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${key}`;
      const res = await axios.post(url, {
        contents: [{ parts: [{ text: "Hello" }] }]
      }, { timeout: 10000 });
      
      console.log(`✅ Key #${i+1}: ONLINE (Response received)`);
    } catch (err) {
      if (err.response?.status === 429) {
        console.log(`⚠️ Key #${i+1}: QUOTA EXCEEDED (429 Too Many Requests)`);
      } else {
        console.log(`❌ Key #${i+1}: OFFLINE (${err.message})`);
      }
    }
  }
}

testKeys();
