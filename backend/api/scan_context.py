"""Build trusted scan context without sending MRI/XAI image bytes to the LLM."""


def build_scan_context(scan):
    return {
        "scan_id": str(scan.id),
        "model": "DenseNet121",
        "predicted_class": scan.predicted_class,
        "confidence_percent": float(scan.confidence),
        "processing_time_seconds": scan.processing_time,
        "existing_summary": scan.summary or "",
        "xai": {
            "gradcam_available": bool(scan.gradcam_b64),
            "integrated_gradients_available": bool(scan.integrated_gradients_b64),
            "shap_available": bool(scan.shap_b64),
        },
        "created_at": scan.created_at.isoformat(),
    }
