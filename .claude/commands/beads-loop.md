Run the beads work loop. Uses `bd ready` as the driver to pick up and complete tasks in dependency order.

## Environment Setup

Ensure `bd` is available and the Dolt server is running before any `bd` commands:

```bash
export PATH=$HOME/.local/bin:$PATH
```

---

## READY MODE — tasks exist in `bd ready`

1. Run `bd ready` and display the list.
2. For the first task, check if it has a linked GitLab issue and whether someone else already owns it:

   ```bash
   GL_REF=$(bd show <id> --json 2>/dev/null | grep -o '"external_ref":"gl-[0-9]*"' | grep -o 'gl-[0-9]*')

   if [ -n "$GL_REF" ]; then
     GL_NUM="${GL_REF#gl-}"
     ME=$(glab api "user" --method GET 2>/dev/null | grep -o '"username":"[^"]*"' | grep -o '[^"]*$')
     ASSIGNEE=$(glab api "projects/:id/issues/$GL_NUM" --method GET 2>/dev/null \
       | grep -o '"assignees":\[{"[^]]*' | grep -o '"username":"[^"]*"' | grep -o '[^"]*$' | head -1)

     if [ -n "$ASSIGNEE" ] && [ "$ASSIGNEE" != "$ME" ]; then
       echo "⏭ Skipping bead <id> — GitLab #$GL_NUM is assigned to @$ASSIGNEE"
       # skip to next task in bd ready
     fi
   fi
   ```

   - If the issue is unassigned **or** assigned to the current user → proceed.
   - If assigned to a different user → skip this bead and try the next one from `bd ready`.

   After confirming no conflict, mark in_progress locally AND claim the GitLab issue:

   ```bash
   # Mark in progress locally
   bd update <id> --status in_progress

   # Claim the GitLab issue (if linked)
   if [ -n "$GL_REF" ]; then
     glab issue update "$GL_NUM" --assignee @me 2>/dev/null \
       && echo "✓ Claimed GitLab #$GL_NUM" \
       || echo "⚠ Could not assign GitLab #$GL_NUM (continuing anyway)"
   fi
   ```

   The `glab` call is best-effort — failure logs a warning but does not block work.

3. Read the full task: `bd show <id>`.
4. Implement the task. Follow all project conventions in `CLAUDE.md`.
5. Run `bun run check` to verify all quality gates pass.
6. Ask the user: **"Done — mark as closed? (yes / skip)"**
   - **yes** → close the bead AND mirror to GitLab (see Closing a Task below), then loop back to step 1.
   - **skip** → pick the next ready task. If none remain, enter TRIAGE MODE.

---

## Closing a Task

When the user confirms a task is done:

```bash
# 1. Close the bead
bd close <id>

# 2. Check if this bead has a GitLab issue linked
GL_REF=$(bd show <id> --json 2>/dev/null | grep -o '"external_ref":"gl-[0-9]*"' | grep -o 'gl-[0-9]*')

# 3. If linked, close the GitLab issue too
if [ -n "$GL_REF" ]; then
  GL_NUM="${GL_REF#gl-}"
  glab issue close "$GL_NUM" && echo "Closed GitLab #$GL_NUM"
fi
```

Report to the user: `✓ Closed bead <id>` and `✓ Closed GitLab #<N>` (if applicable).

---

## TRIAGE MODE — `bd ready` returns no results

1. Run `bd list` to show all open tasks with their status and dependencies.
2. For each blocked task (one at a time), ask one of these questions:
   - *"Is [blocker] actually done? Should I close it?"*
   - *"Does [task] really need to wait on [dep], or can we remove that dependency?"*
   - *"Can we break [task] into smaller pieces so part of it becomes ready now?"*
   - *"Skip this task for now?"*
3. Act on the answer:
   - Blocker done → close with the Closing a Task procedure → re-run `bd ready`; if results exist, switch back to READY MODE.
   - Remove dep → `bd update <id> --remove-dep <dep-id>` → re-run `bd ready`.
   - Break down → `bd create "<subtask>" --dep <original-id>` → re-run `bd ready`.
   - Skip → move to next blocked task.
4. When `bd ready` returns results → switch back to READY MODE immediately.
5. All tasks exhausted → report final status and pause:
   - How many tasks are open vs closed
   - Any tasks that remain blocked and why
   - Suggest `/beads-add` to add new work if the queue is empty.

---

## Notes

- Always run `bun run check` before closing a task — quality gates are non-negotiable.
- Never close a task with failing tests or lint errors.
- `bd ready` respects dependency order. Trust it — don't skip ahead.
- Use `bd show <id>` to read full task descriptions before implementing.
- GitLab sync is best-effort — if `glab` fails, close the bead anyway and note the failure.
- To bulk-sync all linked beads at once, run `/sync-beads-to-gitlab`.
