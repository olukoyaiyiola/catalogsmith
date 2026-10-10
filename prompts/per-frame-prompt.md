# CatalogSmith: Fallback Per-Frame Extraction Prompt & Deduplication

Use this fallback workflow if a fast-scrolling screen recording or chaotic video misses products during the whole-video pass.

---

## 1. Per-Frame Extraction Prompt

Attach an extracted frame (JPEG) in Google AI Studio or pass it to the Gemini API with this prompt:

```text
You are analyzing a single frame from a vendor product video.
The frame may be:
- A WhatsApp chat screenshot (with product photo, description text, or price caption),
- A vendor holding up a physical item,
- Or a shelf / display shelf of physical goods.

TASK:
Identify any distinct vendor product clearly visible in this frame.

EXTRACTION RULES:
1. If visible, extract the product name or clear description, price if stated as text or visible on a tag/label, and a short description.
2. If this frame shows a chat interface, extract only the product-related message content (e.g., photo caption, item title, quoted price in message). Do not extract timestamps, battery levels, or sender names.
3. If this frame shows multiple products at once (such as a shelf or display case), return an array of separate product objects, one per distinct visible item.
4. If no clear product is identifiable in this frame (e.g. motion blur, transition, blank screen, keyboard open, or person's face only), return null.
5. NEVER invent a price: if none is visible in text or tag, return null for amount and currency, with source "none".

RETURN JSON FORMAT:
Return either `null` (if no product is visible) or an object matching this structure:
{
  "products": [
    {
      "name": "string",
      "price": { "amount": number or null, "currency": "string" or null, "source": "on_screen" | "price_tag" | "none" },
      "description": "string",
      "category": "string or null",
      "confidence": number
    }
  ]
}
```

---

## 2. Deduplication & Merge Algorithm

When frames are extracted at 1.0–2.0 second intervals, the same item will likely appear across 2 to 4 consecutive frames.

CatalogSmith Studio includes a built-in Deduplication Merger tool that applies the following rules:
1. **Timestamp Proximity**: Products appearing within 3 seconds of each other.
2. **Text / Name Jaccard & Levenshtein Similarity**: If normalized product names share >70% token overlap or edit distance ratio > 0.8.
3. **Merge Strategy**:
   - Retain the entry with the highest `confidence` score.
   - If one entry has an explicit `price` and another has `null`, preserve the valid price.
   - Pick the `best_timestamp_sec` from the frame with the sharpest focus / highest confidence.
