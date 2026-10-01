"""Gemini client isolated from the prediction/XAI pipeline."""

from django.conf import settings
from google import genai

_client = None


def _get_client():
    global _client
    api_key = getattr(settings, "GEMINI_API_KEY", "")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not configured.")
    if _client is None:
        _client = genai.Client(api_key=api_key)
    return _client


def generate_chat_answer(prompt):
    model = getattr(
        settings,
        "GEMINI_CHAT_MODEL",
        getattr(settings, "GEMINI_MODEL", "gemini-3.8-flash"),
    )
    response = _get_client().models.generate_content(model=model, contents=prompt)
    answer = (getattr(response, "text", "") or "").strip()
    if not answer:
        raise RuntimeError("The assistant returned an empty response.")
    return answer
