# Project Context & Skill Interoperability Guide for Gemini Agents

## 🎯 Purpose

This document provides instructions for Gemini 1.5 Pro/Flash on how to interact with the local environment managed by the **Agent Skill Manager**. It ensures that the agent understands how to discover, execute, and propose new skills within this architecture.

## 📂 Skill Infrastructure

This project utilizes a dual-layered skill system. You (the Agent) should prioritize skills found in the local project directory while being aware of the global capabilities.

| Scope       | Path               | Description                                        |
| :---------- | :----------------- | :------------------------------------------------- |
| **Project** | `./.agent/skills`  | Project-specific logic and symlinked global tools. |
| **Global**  | `~/.agents/skills` | Your core toolkit available across all projects.   |

## 🛠️ Agent Instructions

### 1. Skill Discovery

Before performing complex tasks (e.g., refactoring, test generation, or architecture planning), check the `./.agents/skills/` directory.

- **If a relevant script exists:** Execute it or follow its prompt instructions.
- **If no skill exists:** Perform the task using your base knowledge, but suggest creating a new "Skill" if the task seems repetitive.

### 2. Execution Protocol

When utilizing a skill from this manager:

- **Context Awareness:** Always check for a `skill.json` or metadata header within the skill file to understand the intended input/output.
- **Safety:** If a skill involves destructive file operations, summarize the planned changes before execution.

### 3. Proposing New Skills

If you identify a pattern in the user's requests that could be automated:

- **Draft** a System Prompt or Bash Script.
- **Propose** saving it to the Agent Skill Manager GUI.
- **Suggest** a name (e.g., `flutter-bloc-generator`) and a concise description.

## 🔗 Integration with Gemini CLI

To initialize a session with these skills, the user may use the following pattern:

```bash
# Example of injecting project skills into Gemini CLI
gemini-cli --system-prompt "$(cat .agents/skills/current-context.md)" --prompt "Your task here"
```

## ⚠️ Constraints

- **Symlink Integrity:** Do not attempt to move or delete files in `./.agents/skills/` directly via shell commands unless explicitly asked; these are often symlinks managed by the Tauri GUI.
- **Token Efficiency:** Only read the skills relevant to the current task to optimize the context window.

## 🗂️ Metadata for Manager

- **Agent-Type:** Gemini-Native
- **Capabilities:** Long-context processing (2M tokens), Multi-modal analysis, Tool-use.
- **Version:** 1.0.0
