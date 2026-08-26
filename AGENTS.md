# TechFOMO AI Agent Operational Guidelines

This repository enforces a strict, multi-layer engineering and design workflow for all AI coding agents (Antigravity, Cursor, Codex, Claude Code).

---

## 🛠️ Mandatory Agent Workflow

Whenever you are assigned any task in this repository (feature addition, UI revamp, bug fixing, or performance optimization), you **MUST** strictly follow this workflow:

### 1. 🧠 Process & Architecture Discipline (Superpowers)
* **Brainstorming & Scope Definition**: Do NOT write code immediately. Ask clarifying questions, explore edge cases, and clarify the specification first (`brainstorming`).
* **Systematic Debugging**: For any bug, performance bottleneck, or unexpected empty state, identify the root cause across all component boundaries before making changes. Never guess (`systematic-debugging`).
* **Structured Planning**: Write an implementation plan specifying exact files, diffs, and verification steps before editing (`writing-plans`).
* **Test-Driven Development**: Write test cases or verification assertions before or alongside implementation code (`test-driven-development`).
* **Evidence Before Completion**: Always run `npm run build` or verification commands and verify output before declaring completion (`verification-before-completion`).

---

## 🎨 UI/UX & Design Standards (`ui-ux-pro-max`, `ui-styling`, `design-system`)

* **Aesthetic Excellence**: TechFOMO is a premier tech portal. Never build basic/plain UI. Use modern Cyber/Dark aesthetics, sleek Slate/Zinc surfaces, curated neon accents (Cyan, Emerald, Violet), and subtle glassmorphism borders.
* **Micro-interactions & Responsiveness**:
  * Implement smooth loading skeletons and graceful transitions.
  * Every card must have hover lift/glow states.
  * Mobile and desktop views must be strictly responsive and touch-friendly.
* **No Unhandled Empty States**: The user must **NEVER** see a blank screen or a sudden "No Repositories Found" message on page load or network hiccups. Always provide instant fallback data (seed data) and graceful error recovery.

---

## ⚡ Performance & Data Architecture Rules

1. **Instant First-Byte Response (< 20ms)**:
   * API endpoints (`/api/repos`, `/api/buzz`) must **NEVER** block on sequential, un-timeouted scraping requests.
   * Apply **Stale-While-Revalidate (SWR)**: Return in-memory/disk cached data or rich seeds immediately.
   * Background asynchronous revalidation must use strict `AbortSignal.timeout(3000)` and parallel execution (`Promise.allSettled`).
2. **Reliable Fallbacks**:
   * If GitHub API rate limits (403/429) or external sources fail, seamlessly fallback to `SEED_REPOSITORIES` without showing an error to end users.
