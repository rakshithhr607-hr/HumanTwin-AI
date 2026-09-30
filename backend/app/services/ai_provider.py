import os
import json
import logging
from typing import Optional, Dict, Any, List
import httpx
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("humantwin.ai_provider")

AI_PROVIDER = os.getenv("AI_PROVIDER", "gemini").lower() # "gemini", "openai", "none"
AI_API_KEY = os.getenv("AI_API_KEY") or os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY") or ""
AI_MODEL = os.getenv("AI_MODEL", "gemini-2.5-flash")

class AIProviderService:
    def __init__(self):
        self.provider = AI_PROVIDER
        self.api_key = AI_API_KEY
        self.model = AI_MODEL

    def is_configured(self) -> bool:
        return bool(self.api_key and self.provider != "none")

    async def generate_response(self, system_instruction: str, user_prompt: str) -> Optional[str]:
        """
        Calls external LLM if configured. Returns None on failure or if not configured,
        triggering the local TwinEngine fallback.
        """
        if not self.is_configured():
            logger.info("AI provider not configured with valid API key; using local TwinEngine.")
            return None

        try:
            if self.provider == "gemini":
                return await self._call_gemini(system_instruction, user_prompt)
            elif self.provider == "openai":
                return await self._call_openai(system_instruction, user_prompt)
            else:
                return None
        except Exception as e:
            logger.warning(f"External AI Provider call failed: {e}. Falling back to TwinEngine rule-based simulation.")
            return None

    async def _call_gemini(self, system_instruction: str, user_prompt: str) -> Optional[str]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": f"{system_instruction}\n\nTask: {user_prompt}"}]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 1024,
            }
        }
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                candidates = data.get("candidates", [])
                if candidates and "content" in candidates[0]:
                    parts = candidates[0]["content"].get("parts", [])
                    if parts and "text" in parts[0]:
                        return parts[0]["text"]
            else:
                logger.warning(f"Gemini API returned status {resp.status_code}: {resp.text}")
                return None
        return None

    async def _call_openai(self, system_instruction: str, user_prompt: str) -> Optional[str]:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        payload = {
            "model": self.model if "gpt" in self.model else "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.2
        }
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                choices = data.get("choices", [])
                if choices:
                    return choices[0]["message"]["content"]
            else:
                logger.warning(f"OpenAI API returned status {resp.status_code}: {resp.text}")
                return None
        return None

ai_service = AIProviderService()
