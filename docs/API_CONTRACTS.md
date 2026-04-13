# API Contracts — AI Architect Studio

## Base URL
- Development: `http://localhost:3000/api`
- Production: `https://[your-vercel-domain].vercel.app/api`

---

## Quiz Agent

### POST /api/quiz

**Purpose:** Send a user message to the Quiz Agent and receive the next adaptive question or final UserProfile JSON.
**Auth required:** No

**Request Body:**
```typescript
{
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  questionCount: number;   // current number of questions asked (0-indexed)
}
```

**Response — Next Question (200):**
```json
{
  "type": "question",
  "content": "What kind of spaces matter most to you — open communal areas, private retreats, or a mix?",
  "inputType": "multiple_choice",
  "options": ["Open communal", "Private retreats", "Mix of both", "Depends on the room"]
}
```

**Response — Free Text Question (200):**
```json
{
  "type": "question",
  "content": "Describe your ideal morning routine at home in a sentence or two.",
  "inputType": "free_text",
  "options": []
}
```

**Response — Complete (200):**
```json
{
  "type": "complete",
  "profile": {
    "lifestyle": "remote worker, minimalist aesthetic, yoga practice",
    "household": { "adults": 2, "children": 0, "pets": true },
    "budget": "medium",
    "style": ["japandi", "modernist"],
    "rooms": [
      { "type": "bedroom", "count": 2, "sizeTier": "medium", "notes": "one with en-suite" },
      { "type": "home_office", "count": 1, "sizeTier": "medium" },
      { "type": "living_room", "count": 1, "sizeTier": "large" },
      { "type": "kitchen", "count": 1, "sizeTier": "medium" }
    ],
    "priorities": ["natural light", "open plan kitchen-living", "storage"],
    "climate": "temperate",
    "specialNeeds": "yoga/meditation space needed"
  }
}
```

**Error Responses:**
```json
{ "error": "Invalid request body", "details": "ZodError: ..." }   // 400
{ "error": "Mistral API error", "details": "..." }                 // 500
{ "error": "Rate limit exceeded" }                                  // 429
```

---

## Architect Agent

### POST /api/architect

**Purpose:** Generate (CREATE) or surgically update (UPDATE) a DesignSpec from a UserProfile or natural language instruction.
**Auth required:** No

**Request Body — CREATE Mode:**
```typescript
{
  mode: 'CREATE';
  profile: UserProfile;
}
```

**Request Body — UPDATE Mode:**
```typescript
{
  mode: 'UPDATE';
  existingDesign: DesignSpec;
  instruction: string;      // natural language, e.g. "Add a rooftop terrace above the living room"
}
```

**Response — Success (200):**
```json
{
  "design": {
    "id": "a1b2c3d4-...",
    "version": 1,
    "style": "Japandi Modernist",
    "exteriorMaterial": "white render with timber accents",
    "roofType": "flat",
    "totalArea": 185,
    "generatedAt": "2025-04-12T09:30:00Z",
    "floors": [ "..." ]
  }
}
```

**Response — Validation Failure after 3 Retries (422):**
```json
{
  "error": "Architect Agent returned invalid JSON after 3 retries",
  "details": {
    "zodErrors": [ "..." ],
    "lastRawResponse": "..."
  }
}
```

**Error Responses:**
```json
{ "error": "Invalid mode. Must be CREATE or UPDATE" }              // 400
{ "error": "UPDATE requires existingDesign and instruction" }      // 400
{ "error": "Mistral API error", "details": "..." }                 // 500
```

---

## Retry Logic (Internal — /api/architect)

```
Attempt 1: Call Mistral with system prompt + user message
  → Parse JSON → Zod validate
  → If valid: return 200 with design
  → If invalid: log error, proceed to attempt 2

Attempt 2: Append to messages: "The previous response was not valid JSON matching the required schema.
  Output ONLY valid JSON with no prose, no markdown code fences, no explanation."
  → Call Mistral again → Zod validate
  → If valid: return 200
  → If invalid: proceed to attempt 3

Attempt 3: Same as attempt 2 + explicitly repeat the required top-level fields
  → Call Mistral again → Zod validate
  → If valid: return 200
  → If still invalid: return 422 with details
```

---

## Mistral Model Configuration

| Agent | Model | Max Tokens | Temperature |
|-------|-------|------------|-------------|
| Quiz Agent | mistral-small-latest | 1024 | 0.7 |
| Architect Agent (CREATE) | mistral-large-latest | 4096 | 0.3 |
| Architect Agent (UPDATE) | mistral-large-latest | 4096 | 0.1 |

Low temperature on Architect Agent is intentional — we want deterministic JSON, not creative variation.
