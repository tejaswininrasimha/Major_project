"""Gemini client isolated from the prediction/XAI pipeline."""

import time

from django.conf import settings
from google import genai
from google.genai import errors

_client = None


def _get_client():
    global _client
    api_key = getattr(settings, "GEMINI_API_KEY", "")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not configured.")
    if _client is None:
        _client = genai.Client(api_key=api_key)
    return _client


def _is_temporary_provider_error(exc):
    """Recognize temporary Gemini capacity/rate-limit errors across SDK versions."""
    status_code = getattr(exc, "status_code", None)
    if status_code in {429, 503}:
        return True

    code = getattr(exc, "code", None)
    if code in {429, 503}:
        return True

    message = str(exc).upper()
    return (
        "429" in message
        or "503" in message
        or "RESOURCE_EXHAUSTED" in message
        or "UNAVAILABLE" in message
        or "HIGH DEMAND" in message
    )


def _generate_with_model(model, prompt):
    """Try a model twice only when Gemini reports temporary overload."""
    for attempt in range(2):
        try:
            response = _get_client().models.generate_content(
                model=model,
                contents=prompt,
            )
            answer = (getattr(response, "text", "") or "").strip()
            if not answer:
                raise RuntimeError("The assistant returned an empty response.")
            return answer
        except (errors.ServerError, errors.ClientError) as exc:
            if not _is_temporary_provider_error(exc) or attempt == 1:
                raise
            time.sleep(1.0)


def generate_chat_answer(prompt):
    primary_model = getattr(
        settings,
        "GEMINI_CHAT_MODEL",
        getattr(settings, "GEMINI_MODEL", "gemini-3.8-flash"),
    )
    fallback_model = getattr(
        settings,
        "GEMINI_CHAT_FALLBACK_MODEL",
        "gemini-3.7-flash",
    )

    try:
        return _generate_with_model(primary_model, prompt)
    except (errors.ServerError, errors.ClientError) as exc:
        # Fall back only for temporary capacity/rate-limit errors. Other
        # failures surface normally, and prediction/XAI remain unaffected.
        if not _is_temporary_provider_error(exc) or fallback_model == primary_model:
            raise
        return _generate_with_model(fallback_model, prompt)
