def build_signature_stub(ticker: str) -> dict:
    """
    Structural stub matching the locked Signature Analysis schema.
    Values are placeholders — production must fill via live tools.
    """
    return {
        "ticker": ticker.upper(),
        "companyName": "UNKNOWN — resolve via market data",
        "asOf": None,
        "isIllustrative": True,
        "price": None,
        "change": None,
        "changePercent": None,
        "technical": {
            "summary": "Awaiting live technical context.",
            "trend": "UNRESOLVED",
            "structure": [],
        },
        "fundamental": {
            "summary": "Awaiting live fundamental context.",
            "metrics": [],
            "catalysts": [],
            "themes": [],
        },
        "liquidity": {
            "current": None,
            "support": [],
            "resistance": [],
        },
        "longTermTarget": {
            "price": None,
            "horizon": None,
            "thesis": "No target without verified data.",
        },
        "swing": {
            "bias": "NEUTRAL",
            "entryZone": {"low": None, "high": None},
            "targets": {"tp1": None, "tp2": None, "tp3": None},
            "stop": None,
            "invalidation": None,
            "optionsGuidance": None,
            "confidence": 0,
        },
        "signal": None,
        "keyInsight": "Aetheron refuses to invent market data.",
        "format": [
            "1. Technical Analysis",
            "2. Fundamental Analysis",
            "3. Liquidity Levels",
            "4. Long-Term Price Target",
            "5. Swing Trade Setup",
            "6. Signal",
        ],
    }
