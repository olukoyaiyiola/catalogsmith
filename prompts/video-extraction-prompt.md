# CatalogSmith: Whole-Video Extraction Prompt & Schema

This prompt is designed for **Google AI Studio** (free tier) running directly in a mobile or desktop browser. It leverages Gemini's multimodal audio and video ingestion to extract a structured catalog in a single pass without needing FFmpeg or a backend server.

---

## 1. System & User Prompt

Copy and paste the prompt below into Google AI Studio (under the **Prompt** box) after attaching your video file:

```text
You are analyzing a vendor's product video. It may be:
1. A WhatsApp chat screen recording (displaying product photos, catalog cards, and chat messages),
2. A handheld walkthrough (a person holding up or narrating products one by one), or
3. Shelf/display footage (a static shot or panning view of multiple physical goods).

TASK:
Analyze both the visual frames and the audio soundtrack. Identify and list every distinct product the vendor is offering. List each distinct product exactly once, even if it appears multiple times during the recording.

FOR EACH PRODUCT, EXTRACT:
- id: A sequential ID (e.g., "p1", "p2", "p3").
- name: A clean, concise, human-readable product name.
- price: An object with { "amount": number or null, "currency": "string" or null, "source": "on_screen" | "price_tag" | "spoken" | "none" }.
  * CRITICAL PRICING RULE: NEVER invent, extrapolate, or hallucinate a price. If no explicit price is shown on screen, written in a chat message/tag, or spoken aloud by the vendor, set amount to null, currency to null, and source to "none".
  * For shorthand numbers (e.g., "15k" or "25k"), convert to the full numerical value (15000, 25000).
- description: A short 1-2 sentence description detailing material, color, size, cut, or variants mentioned in the video or audio.
- category: A short general category (e.g., "Dresses", "Bags", "Footwear", "Accessories", "Hair", "Electronics") or null.
- best_timestamp_sec: The exact timestamp in seconds (e.g. 14.5) where the product is most clearly visible, unobstructed, in-focus, and centered, optimal for capturing a still product photo.
- confidence: A score from 0.0 to 1.0 reflecting your certainty in the product identity, boundaries, and pricing.

SPECIAL INSTRUCTIONS BY INPUT TYPE:
- WhatsApp Chat Recordings: Use only product-related message content (captions, photos, prices quoted in chat bubbles). Ignore non-product UI elements, timestamps, network bars, battery percentage, sender names, and casual banter.
- Handheld Walkthroughs: Correlate what the speaker is saying with what is being held up. Capture the timestamp when the item is held steadily towards the camera, not while swinging into frame.
- Shelf & Display Footage: Distinguish individual items even if displayed closely together. Extract visible price tags where legible; otherwise set price to null. Avoid grouping distinct items into a generic bundle unless explicitly sold as a set.

VENDOR DETAILS (if identifiable):
Extract the vendor or store name (from chat header, watermark, signage, or speech) into "vendor_name", vendor WhatsApp/phone into "vendor_phone", and primary currency (e.g., "NGN", "USD", "KES", "GBP") into "currency_default".

OUTPUT FORMAT:
Return ONLY a valid JSON object strictly matching the JSON schema below. Do not wrap in markdown quotes if possible, or return pure JSON.
```

---

## 2. Target JSON Schema

In Google AI Studio, under **Model Settings -> Advanced Settings -> Structured Output**, enable **JSON Schema** and provide:

```json
{
  "type": "object",
  "properties": {
    "vendor_name": { "type": ["string", "null"] },
    "vendor_phone": { "type": ["string", "null"] },
    "currency_default": { "type": ["string", "null"] },
    "products": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "price": {
            "type": ["object", "null"],
            "properties": {
              "amount": { "type": ["number", "null"] },
              "currency": { "type": ["string", "null"] },
              "source": {
                "type": "string",
                "enum": ["on_screen", "price_tag", "spoken", "none"]
              }
            },
            "required": ["amount", "currency", "source"]
          },
          "description": { "type": "string" },
          "category": { "type": ["string", "null"] },
          "best_timestamp_sec": { "type": "number" },
          "confidence": { "type": "number" }
        },
        "required": ["id", "name", "price", "description", "best_timestamp_sec", "confidence"]
      }
    }
  },
  "required": ["products"]
}
```

---

## 3. Step-by-Step AI Studio Mobile Guide

1. Open **[aistudio.google.com](https://aistudio.google.com)** on your phone browser (Chrome/Safari).
2. Tap **Create New Prompt**.
3. Select **Gemini 1.5 Flash** or **Gemini 2.5 Flash** (fastest and free tier supported).
4. Tap the **+** (Attach) button and choose **Upload File** -> select your vendor video from your phone's gallery.
5. Paste the **Video Extraction Prompt** above into the prompt box.
6. (Optional) Set Structured Output to JSON or paste the schema.
7. Tap **Run** (Cmd/Ctrl+Enter or the Run button).
8. Once finished, tap the **Copy** icon on the generated response.
9. Open **CatalogSmith Studio** in your browser and paste the JSON directly into Step 1!
