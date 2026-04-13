# TASK_003 — Quiz Agent API Integration

**Phase:** Feature — Quiz
**Estimated time:** 30 min
**Depends on:** TASK_002 ✅

---

## Objective
The quiz is fully functional end-to-end: questions adapt based on previous answers, input is sent to Mistral via the API route, and on completion the UserProfile JSON is stored in quizStore.

---

## Files to Create/Modify

| Action | File Path | Description |
|--------|-----------|-------------|
| CREATE | src/app/api/quiz/route.ts | POST handler — Mistral small proxy |
| CREATE | src/lib/quizPrompts.ts | Quiz Agent system prompt |
| CREATE | src/hooks/useQuizAgent.ts | Conversation state + API call logic |
| MODIFY | src/store/quizStore.ts | Populate with full actions |
| MODIFY | src/app/page.tsx | Wire useQuizAgent, remove mock data |
| MODIFY | src/components/quiz/QuizShell.tsx | Connect to hook |

## Files NOT to Touch
All viewer components, all cinematic components, /api/architect.

---

## Prompt for AI Agent

```
Integrate the Quiz Agent for AI Architect Studio.

/src/lib/quizPrompts.ts:
Export QUIZ_SYSTEM_PROMPT as a const string:
"You are an expert architectural consultant conducting an intake interview to understand a client's ideal home.
Rules:
- Ask ONE question per turn. Never ask multiple questions in one message.
- Start broad (lifestyle, household) then narrow (room specifics, aesthetic preferences).
- Adapt each question based on all previous answers.
- Support both free-text and multiple-choice. Output inputType: 'free_text' or 'multiple_choice'.
- When using multiple_choice, provide 3–4 concise options in an options array.
- After 5–7 questions (hard max: 8), if you have enough data, output the structured profile JSON.
- ALWAYS respond with valid JSON only. No prose, no markdown.
  Question format: { type: 'question', content: '...', inputType: 'free_text|multiple_choice', options: [] }
  Complete format: { type: 'complete', profile: { UserProfile object } }"

/src/app/api/quiz/route.ts:
- POST handler
- Accepts: { messages: MistralMessage[], questionCount: number }
- Validates input with Zod
- Calls Mistral (mistral-small-latest) with QUIZ_SYSTEM_PROMPT + messages
- Parses response content as JSON
- Returns typed QuizAgentResponse
- Returns 500 with error message on Mistral failure
- Never exposes MISTRAL_API_KEY to client

/src/hooks/useQuizAgent.ts:
- State: messages[], currentQuestion, inputType, options, questionCount, isLoading, isComplete, profile
- sendMessage(userInput: string): appends to messages, increments questionCount, calls /api/quiz, updates state
- On type === 'complete': set isComplete=true, store profile in quizStore, stop asking
- Initializes by calling sendMessage('') to get the first question on mount

/src/store/quizStore.ts:
- Actions: setProfile(profile), setComplete(), reset()

Wire app/page.tsx:
- Use useQuizAgent hook
- Show QuizShell with real questions
- On isComplete: show a "Designing your space..." transition state (Framer Motion fade out quiz, fade in message)
- Then navigate to /viewer (use Next.js router.push('/viewer'))

MUST: All API errors displayed to user with a retry button. Never swallow errors silently.
NEVER: Never call Mistral directly from client. Always via /api/quiz route.

Done when:
- [ ] Opening / triggers first question from Mistral
- [ ] User can answer 5–8 questions adaptively
- [ ] On completion, UserProfile is in quizStore
- [ ] Router navigates to /viewer on completion
- [ ] Error state shows if Mistral call fails
```

---

## Done Criteria
- [ ] Full quiz flow works end-to-end with real Mistral API
- [ ] Adaptive questions demonstrably change based on answers
- [ ] UserProfile JSON is valid and Zod-parseable on completion
- [ ] Navigation to /viewer happens after completion
- [ ] Error state visible if API fails
- [ ] MISTRAL_API_KEY never in client bundle (verify with browser devtools)
