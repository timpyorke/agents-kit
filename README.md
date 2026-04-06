# 🤖 Agent Skill Manager

**The Control Plane for your AI Agents.** Organize, install, and orchestrate "Skills" (Prompts/Scripts) for AI tools like Gemini CLI, Claude Code, and more—at both Global and Project levels.

## ✨ Features

- **Skill Orchestration:** A centralized hub to manage capabilities for multiple AI agents.
- **Global & Project Scoping:**
  - **Global Skills:** A personal "arsenal" of skills stored in your home directory (`~/.agents/skills`).
  - **Project-Specific Skills:** Link specific skills to your local coding projects via Symlinks for easy updates and zero redundancy.
- **Multi-Agent Compatibility:** Designed to interface seamlessly with Gemini CLI, Claude Code, and custom AI wrappers.
- **Native Performance:** Built with Rust (Tauri) for secure, lightning-fast file system operations and React for a modern, responsive UI.

## 🏗️ Architecture

This project utilizes a Hybrid Desktop Architecture:

- **Frontend:** React 18 + TypeScript + Tailwind CSS (UI/UX)
- **Backend (Native):** Rust (Tauri) for File System management (Symlinks, File Watchers, and CLI execution)
- **Bridge:** Tauri IPC (Inter-Process Communication) for seamless communication between Rust and TypeScript.

## 🚀 Getting Started

### Prerequisites

- Rust (Latest Stable)
- Node.js (v18+)
- Tauri Dependencies (Based on your Operating System)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/agent-skill-manager.git
    cd agent-skill-manager
    ```

2.  **Install dependencies:**

    ```bash
    bun install
    ```

3.  **Run in development mode:**
    ```bash
    bun run tauri dev
    ```

## 📂 Project Structure

```text
.
├── src/                # React Frontend
│   ├── components/     # UI Components (Skill Cards, Project Dashboard)
│   ├── hooks/          # Custom Hooks for Tauri IPC Invocation
│   └── App.tsx         # Main UI Entry Point
├── src-tauri/          # Rust Backend (Core Logic)
│   ├── src/
│   │   ├── main.rs     # Tauri Commands (Symlink Logic, FS Scanner)
│   │   └── skills.rs   # Skill Data Models & Persistence
│   └── Cargo.toml      # Rust Dependencies (Serde, Dirs, etc.)
└── .agents/skills/      # Local skill directory example
```

## 🛠️ How It Works

1.  **Define a Skill:** Create a script or prompt configuration within the GUI.
2.  **Save to Global:** Store it in your machine's global directory to reuse across any project.
3.  **Install to Project:** Select a project folder; the app creates a `.agents/skills/` directory and generates a Symlink to the global store.
4.  **Agent Discovery:** Point your Gemini/Claude CLI to the project's skill folder to instantly "level up" your agent.

## 🤝 Contributing

Contributions are welcome! Feel free to open an Issue or submit a Pull Request, especially for new Skill Templates or Agent Adapters.

## 📄 License

MIT License - Copyright (c) 2026 Timp (Codenour.com)
