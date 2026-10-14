#!/usr/bin/env node
// Reminds Claude, and each subagent it starts, to check TypeScript against these practices.
// The practices themselves load only when needed, through the typescript-practices skill.

const REMINDER = [
  "Loopfive's TypeScript practices apply.",
  'Before you finish a change that adds or edits TypeScript or TSX, and whenever you review such code,',
  'load the `loopfive-practices:typescript-practices` skill and check the code against every rule it lists.',
  'Fix what breaks a rule.',
  "Comments: write one only for a non-obvious why the code can't say; no JSDoc or comments that restate names or steps, even where the surrounding code is heavily commented.",
  "Where another guide disagrees (pstack's typescript-best-practices, Ponytail), these practices win.",
].join(' ');

const event = process.argv[2];

// SessionStart takes raw text; SubagentStart drops anything not wrapped in hookSpecificOutput.
process.stdout.write(
  event === 'SubagentStart'
    ? JSON.stringify({ hookSpecificOutput: { hookEventName: event, additionalContext: REMINDER } })
    : REMINDER,
);
