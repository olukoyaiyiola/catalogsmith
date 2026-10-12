# Phone-First Guide: Video Extraction via Google AI Studio

This guide shows how a vendor or operator can turn any product video into structured catalog JSON directly from a smartphone with **zero coding, zero GitHub, and 100% free tiers**.

---

## Why Google AI Studio?

Google AI Studio provides free access to Gemini Flash models (`gemini-1.5-flash` and `gemini-2.5-flash`).
- **Free tier file limits**: Accepts video files up to 2GB per file directly through Google's Files API. A typical 3-minute phone screen recording is only 30MB–80MB, fitting comfortably within the limit.
- **Multimodal Audio + Visuals**: Gemini processes both the video frames AND the audio track in a single pass.
  - In a **handheld walkthrough**, it listens to the vendor saying *"This gold necklace is 15,000 Naira"* while identifying the necklace on screen.
  - In a **WhatsApp chat recording**, it reads chat bubbles, captions, and text overlays while ignoring non-product clutter (battery icons, status bars, timestamps).
  - In **shelf/display footage**, it distinguishes separate items arranged side-by-side and reads physical price tags.

---

## 4-Step Walkthrough on Mobile (iOS / Android)

### Step 1: Open Google AI Studio on your phone browser
1. Open Chrome, Safari, or Brave on your phone.
2. Navigate to **[aistudio.google.com](https://aistudio.google.com)**.
3. Sign in with any free Google account.

### Step 2: Create a Prompt and Upload the Video
1. Tap **Create New Prompt** (or the **+** button).
2. Set the model to **Gemini 1.5 Flash** (recommended for speed and free tier).
3. Tap the **+ (Attach)** icon at the bottom of the prompt area.
4. Select **Upload File** -> tap **Photo Library / Gallery** or **Files**, and select your video:
   - WhatsApp chat screen recording (`.mp4`)
   - Camera video of you showing items (`.mp4` / `.mov`)
   - Panning clip of boutique shelves (`.mp4` / `.mov`)
5. Wait a few seconds for the upload progress bar to finish.

### Step 3: Paste the ContentSmith Extraction Prompt
In the prompt box, paste the following text:

```text
You are analyzing a vendor's product video. It may be a WhatsApp chat screen recording, a person holding up or describing items one by one, or footage of a shelf or display. Use both the visuals and the audio. List every distinct product the vendor is offering, once each, even if it appears several times. For each product give: name, price (amount, currency, and source: on_screen, price_tag, spoken, or none), a short description (material, size, color, variants if mentioned), the timestamp in seconds of the clearest view of the item, and a confidence score from 0 to 1. For chat recordings, use only product-related message content and ignore timestamps, sender names and unrelated chatter. For shelf footage, list each visibly distinct item separately and use null for unknown price or quantity. Never invent a price: if none is shown or said, return null. Return only valid JSON matching the schema.
```

*(Optional - For Guaranteed Strict JSON):*
Tap the **Settings (Sliders)** icon -> expand **Advanced Settings** -> enable **Structured Output** / **JSON Schema**, and paste the ContentSmith JSON schema from `prompts/schema.json`.

### Step 4: Run and Copy the JSON
1. Tap the **Run** button (blue play arrow).
2. Gemini will analyze the video (usually 15 to 45 seconds).
3. Tap the **Copy** icon at the top-right of Gemini's response.
4. Switch to your browser tab with **ContentSmith Studio** -> open Step 1 -> paste into the JSON box and tap **Load & Review Products**!

---

## Handling the 3 Video Types: Best Practices

| Video Type | Visual Focus | Audio Focus | How Gemini Handles It |
| :--- | :--- | :--- | :--- |
| **1. WhatsApp Chat Screen Recording** | Chat photo messages, catalog cards, captions | Usually silent or background music | Reads text inside message bubbles (e.g. "₦28,000", "Size 12-16"). Filters out message sender names, date stamps, and battery icons. |
| **2. Handheld Walkthrough** | Vendor holding items up to the phone camera | Vendor voice narration | Synchronizes spoken details (*"This is pure bone straight 24 inches for 135k"*) with the visual item. Captures timestamps when the item is held steady. |
| **3. Shelf / Display Footage** | Panning across boutique display racks or shelves | Ambient or commentary | Disaggregates multiple distinct items shown simultaneously. Reads visible price tags or sets price to `null` if the tag is obscured. |

---

## What If Items Are Missed? (Fallback Extraction)
If a screen recording was scrolled too quickly and AI Studio missed a card:
1. Open **ContentSmith Studio** -> tap **Fallback Frames** in the top bar.
2. Select your video and click **Extract Frame Strip** (samples frames every 1.5s in your browser).
3. Tap any candidate frame that was missed to seek the video player to that exact moment.
4. Add the product manually or copy the **Per-Frame Prompt** (`prompts/per-frame-prompt.md`) into AI Studio with the single screenshot.
