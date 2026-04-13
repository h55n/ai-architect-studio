# TASK_002 — Quiz Phase UI Components

**Phase:** Feature — Quiz
**Estimated time:** 30 min
**Depends on:** TASK_001 ✅

---

## Objective
A fully styled, animated quiz shell renders on `/` with a progress bar, question card, and both free-text and multiple-choice input modes — no API calls yet, just UI.

---

## Files to Create/Modify

| Action | File Path | Description |
|--------|-----------|-------------|
| CREATE | src/components/quiz/QuizShell.tsx | Full-viewport wrapper, gradient bg |
| CREATE | src/components/quiz/ProgressBar.tsx | Smooth-fill top progress bar |
| CREATE | src/components/quiz/QuestionCard.tsx | Animated question display |
| CREATE | src/components/quiz/FreeTextInput.tsx | Text area with char count |
| CREATE | src/components/quiz/MultiChoiceInput.tsx | Option card grid |
| MODIFY | src/app/page.tsx | Render QuizShell with mock data |

## Files NOT to Touch
All store files, schema files, API routes.

---

## Prompt for AI Agent

```
Build the Quiz Phase UI for AI Architect Studio. No API calls — UI only.

QuizShell.tsx:
- Full viewport height, centered content
- Background: var(--color-beige) in light mode, #0E0D14 in dark mode
- Fade-in on mount using Framer Motion

ProgressBar.tsx:
- Fixed top bar, height 3px
- Filled width = (questionIndex / totalQuestions) * 100%
- Smooth CSS transition on fill: background var(--color-accent)
- Animate in from width 0 on mount

QuestionCard.tsx:
- Question text in Cormorant Garamond, 2.5rem, centered
- Subtitle/step indicator "Question 2 of 7" in Space Mono, var(--color-violet-dark) at 60% opacity
- Enter animation: slide up 20px + fade in (Framer Motion, 400ms)
- Exit animation: slide up + fade out

FreeTextInput.tsx:
- Minimal textarea, no border — only bottom border in var(--color-violet-light)
- Focus state: border changes to var(--color-accent)
- Submit button: minimal, Space Grotesk, var(--color-accent) background
- Keyboard shortcut: Cmd/Ctrl + Enter to submit

MultiChoiceInput.tsx:
- Grid of option cards (2 per row on mobile, up to 4 on desktop)
- Each card: rounded-xl, border var(--color-violet-light), bg transparent
- Hover: bg var(--color-violet-light) at 20%
- Selected: bg var(--color-violet-dark), text white
- Stagger entrance animation (Framer Motion, each card 80ms apart)

Wire into app/page.tsx with a mock question for visual testing.

MUST: All colors via CSS custom properties. Cormorant Garamond for question text, Space Grotesk for all UI text.
NEVER: No hardcoded colors. No inline styles.

Done when:
- [ ] QuizShell renders full-viewport on /
- [ ] ProgressBar fills smoothly on prop change
- [ ] QuestionCard animates in/out
- [ ] Both input modes render and accept interaction
- [ ] No TypeScript errors
```

---

## Done Criteria
- [ ] All 5 quiz components render without errors
- [ ] Progress bar animates correctly
- [ ] Both input modes are interactive
- [ ] Fonts load correctly (Cormorant Garamond visible on question text)
- [ ] Dark mode works visually
