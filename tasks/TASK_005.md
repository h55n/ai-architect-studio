# TASK_005 — Architect Agent API Integration

**Phase:** Feature — Architect
**Estimated time:** 30 min
**Depends on:** TASK_004 ✅

---

## Objective
The Architect Agent API route is functional. A valid DesignSpec JSON is generated from the UserProfile, validated with Zod, and stored in designStore. The route handles both CREATE and UPDATE modes with retry logic.

---

## Files to Create/Modify

| Action | File Path | Description |
|--------|-----------|-------------|
| CREATE | src/app/api/architect/route.ts | POST handler — Mistral large proxy |
| CREATE | src/lib/architectPrompts.ts | CREATE and UPDATE system prompts |
| CREATE | src/hooks/useArchitectAgent.ts | CREATE/UPDATE orchestration hook |
| MODIFY | src/store/designStore.ts | Populate with full actions |

## Files NOT to Touch
All quiz components, cinematic components, all viewer components.

---

## Prompt for AI Agent

```
Build the Architect Agent API integration for AI Architect Studio.

/src/lib/architectPrompts.ts:
Export two const strings:

ARCHITECT_CREATE_PROMPT:
"You are a world-class architect with encyclopedic knowledge of all global and historical architectural styles.
Given a UserProfile JSON, generate a complete DesignSpec JSON for a house.
Rules:
- Generate structurally realistic room dimensions (bedroom: 4x4m, living: 6x5m, kitchen: 4x3m)
- Use position {x, y, z} where Y=0 is ground level. Rooms must NOT overlap.
- Stack floors: floor 1 at y=0, floor 2 at y = floor1.height, etc.
- Choose the best architectural style blend for user preferences and name it.
- Fill ALL required fields. No nulls.
- Assign each room a color from: #C4C3E3, #504E76, #FDF8E2, #A3B565, #FCDD9D, #F1642E
- Output ONLY valid JSON matching the DesignSpec schema. No prose, no markdown, no code blocks."

ARCHITECT_UPDATE_PROMPT:
"You are a surgical architectural editor.
Rules:
- Modify ONLY what the instruction specifies. Preserve all other fields exactly.
- Increment version by 1.
- New rooms: generate UUID, calculate non-overlapping position, assign palette color.
- New furniture: add to correct room furniture[] array.
- Output ONLY the complete updated DesignSpec JSON. No prose, no markdown."

/src/app/api/architect/route.ts:
- POST handler
- Accepts: { mode: 'CREATE' | 'UPDATE', profile?: UserProfile, existingDesign?: DesignSpec, instruction?: string }
- Zod validates input (different schema per mode)
- Calls Mistral (mistral-large-latest) with appropriate system prompt
- Parses response as JSON → validates with designSchema
- RETRY LOOP: if Zod fails, retry up to 3 times with this appended user message: "The previous response was invalid JSON. Try again. Output ONLY valid JSON."
- Returns { design: DesignSpec } on success
- Returns { error: string, details: ZodError } on failure after 3 retries

/src/hooks/useArchitectAgent.ts:
- generate(profile: UserProfile): calls /api/architect in CREATE mode, stores in designStore
- update(instruction: string): calls /api/architect in UPDATE mode with current design, updates designStore
- State: isGenerating, isUpdating, error

/src/store/designStore.ts:
- State: design (DesignSpec | null), history (DesignSpec[]), isGenerating, error
- Actions: setDesign(design), appendToHistory(design), clearDesign(), setGenerating(bool), setError(err)

MUST: Zod schema validation with 3x retry — this is critical for production reliability.
MUST: Parse Mistral response content safely (strip accidental markdown code fences if present).
NEVER: Never pass DesignSpec to the viewer without Zod validation.

Done when:
- [ ] POST /api/architect with a sample UserProfile returns a valid DesignSpec
- [ ] Zod validation passes on the returned design
- [ ] Retry logic fires on malformed JSON (test by temporarily breaking the prompt)
- [ ] designStore.design is populated after successful generation
- [ ] UPDATE mode preserves untouched rooms exactly
```

---

## Done Criteria
- [ ] CREATE mode generates valid DesignSpec with >= 2 floors and >= 4 rooms
- [ ] Zod validation passes on generated output
- [ ] 3x retry logic works (test with intentionally broken prompt)
- [ ] UPDATE mode correctly modifies only the specified element
- [ ] designStore populated after API success
- [ ] Error state handles all failure modes
