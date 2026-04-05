# Milli's Project — Step 1: Application Form

## What We Have

- Next.js app with shadcn/ui integrated
- n8n instance at: https://n8n.veltraai.net/
- Brand: Effervescent Agency (light pink branding)

## What We Want (Step 1)

Build a **multi-slide application form** at `/apply` route.

One slide visible at a time. Next/Back navigation between slides. Progress indicator showing current slide. On final submit, POST all data as JSON to the n8n webhook which is https://n8n.veltraai.net/webhook/web-form-milli

---

## Form Slides & Fields

### Slide 1 — Personal Info

- **Full Name** (text, required)
- **Date of Birth** (date picker, required) — must be 18+, validate on client
- **Email** (email, required)
- **Mobile Phone Number / WhatsApp** (text, required)
- **Instagram Username** (text, required) — placeholder: `@username`

### Slide 2 — Location & Availability

- **Primary Location** (dropdown, required) — list of 56 UK cities below
- **Second Choice Location** (dropdown, optional) — same list
- **If location not listed, enter manually** (text input, optional)
- **Are you a student?** (Yes / No toggle, required)
  - If YES → show: **Home City** (text input, required)
- **Do you drive?** (Yes / No toggle, required)
- **Interested in:** (radio, required)
  - Hostessing
  - Shot Sales
  - Both

**Location dropdown list (56 cities):**
Aberdeen, Bedford, Billericay (Essex), Birmingham, Bristol, Cardiff, Chelmsford, Cheltenham, Chester, Chichester, Colchester, Coventry, Derby, Dundee, Evesham, Exeter, Glasgow, Guildford, Herne Bay, Hinckley, Hull, Inverness, Leicester, Leeds, Liverpool, London - Aldgate, London - Camden, London - Edgware, London - Greenwich, London - Harlesden, London - Hounslow, Loughborough, Manchester, Mansfield, Margate, Milton Keynes, Newcastle, Newport, Northampton, Nottingham, Peterborough, Plymouth, Portsmouth/Southsea, Sheffield, Southend, Solihull, Southampton, St Albans, Walsall, Wolverhampton, Worthing, Thanet, Swansea, Wrexham, Winchester, Worcester

### Slide 3 — Photos & ID

- **Photos of yourself** (file upload, required) — minimum 2, maximum 5, **images only** (jpg, jpeg, png, webp), max 10MB each. No videos.
- **Upload Photo ID** (file upload, required) — passport only (NOT driving licence), 1 image only (jpg, jpeg, png), max 10MB
  - Show a note: _"We require a passport copy for Right to Work in UK check. If you have a non-UK passport, you will also need to provide your Share Code."_
- **Share Code** (text input, conditional) — show only if ID uploaded appears to be non-UK (for now just show a checkbox: "I have a non-UK passport" → if checked, show Share Code field)

### Slide 4 — Experience & Motivation

- **Have you ever been a shot seller before?** (Yes / No toggle, required)
  - If YES → show:
    - **Previous Company / Venue** (text, required)
    - **Years of Experience** (number input, required)
- **What do you understand about being a shot-seller?** (textarea, required)
- **Why do you think you'll be a good fit for the role?** (textarea, required)
- **What sales & customer service experience do you have? How will this help in a shot-sales role?** (textarea, required)
- **How soon are you available to start?** (date picker, required)

### Slide 5 — Final Declarations

- **I understand this is self-employed work, NOT employment** (checkbox, required — must tick to proceed)
- **I understand this is predominantly weekend / night time work** (checkbox, required — must tick to proceed)
- **How did you hear about us?** (dropdown, required):
  - Instagram
  - TikTok
  - Facebook
  - Twitter/X
  - Direct Message from your page
  - Friends / Word of mouth
  - Adverts
  - Met a shot-girl!
  - Headhunter
  - Trade shows / Exhibitions

---

## On Submit

- Collect ALL fields from all slides into one JSON object
- POST to: `YOUR_N8N_WEBHOOK_URL` (replace with real webhook URL when ready)
- Show a success screen after submission: _"Thank you! We'll be in touch soon."_
- Show a user-friendly error if the POST fails

---

## Design Requirements

- Branding: **Light Pink** theme, clean and modern
- Use **shadcn/ui** components throughout (Input, Select, Button, Checkbox, RadioGroup, etc.)
- Slide transition animation (fade or slide)
- Progress bar or step indicator at top
- Mobile responsive
- Form route: `/apply`
- Do NOT use `<form>` HTML tag — use onClick handlers and React state

---

## File Uploads — Important Note

- Convert all uploaded images to **base64** strings in the browser
- Include the base64 strings in the JSON payload sent to n8n
- **Next.js does NOT call Cloudinary directly**
- n8n will receive the base64 → upload to Cloudinary → get back the public URL → save the URL into Supabase
- Accept **images only**: jpg, jpeg, png, webp. Reject any other file type with a clear error message.

---

## What NOT to build yet

- No database calls from Next.js
- No AI scan logic
- No admin dashboard / candidate listing pages
- No authentication
  Those come in later steps.
