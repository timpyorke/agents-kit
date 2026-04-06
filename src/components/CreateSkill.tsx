import React, { useState, useEffect } from "react";
import { Plus, Terminal as TerminalIcon, Layout, ExternalLink, Folder, Edit2 } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { Terminal } from "./Terminal";
import { Skill } from "../types";
import "./CreateSkill.css";

interface CreateSkillProps {
  onSkillCreated: () => void;
  onCancel: () => void;
  initialSkill?: Skill | null;
  isEditing?: boolean;
}

export const CreateSkill = ({ onSkillCreated, onCancel, initialSkill, isEditing }: CreateSkillProps) => {
  const [mode, setMode] = useState<"form" | "terminal">("form");
  const [workspaceDir, setWorkspaceDir] = useState<string>("Loading workspace...");
  
  const [skillName, setSkillName] = useState(initialSkill?.name || "");
  const [skillDescription, setSkillDescription] = useState(initialSkill?.description || "");
  const [skillCategory, setSkillCategory] = useState(initialSkill?.category || "");
  const [skillAgent, setSkillAgent] = useState(initialSkill?.agents?.[0] || "");
  
  // Terminal session state
  const [activeSession, setActiveSession] = useState<string | null>(null);

  useEffect(() => {
    invoke<string>("run_command", { command: "pwd" })
      .then(dir => setWorkspaceDir(dir.trim()))
      .catch(() => setWorkspaceDir("Unknown Directory"));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isEditing ? "Updated Skill:" : "New Skill:", { skillName, skillDescription, skillCategory, skillAgent });
    alert(`Skill ${isEditing ? "updated" : "created"} (mock data)!`);
    onSkillCreated();
  };

  const handleCommand = async (command: string): Promise<string> => {
    if (activeSession) {
      if (command.toLowerCase() === "exit" || command.toLowerCase() === "quit") {
        setActiveSession(null);
        return `Exited ${activeSession} session.`;
      }
      
      try {
        let cmd = "";
        if (activeSession === "gemini") {
          cmd = `gemini --prompt "${command.replace(/"/g, '\\"')}"`;
        } else if (activeSession === "claude") {
          cmd = `claude -p "${command.replace(/"/g, '\\"')}"`;
        } else {
          return `Unknown session: ${activeSession}`;
        }
        
        const result = await invoke<string>("run_command", { command: cmd });
        return result;
      } catch (error) {
        return `Error: ${error}`;
      }
    }

    if (command === "help") {
      return "Available commands:\n  help - Show this help\n  gemini - Start Gemini CLI session\n  claude - Start Claude Code session\n  create <name> - Create a new skill boilerplate\n  list - List all global skills\n  clear - Clear the terminal";
    }

    if (command === "gemini") {
      setActiveSession("gemini");
      return "Started Gemini CLI session. Type 'exit' to quit.";
    }

    if (command === "claude") {
      setActiveSession("claude");
      return "Started Claude Code session. Type 'exit' to quit.";
    }

    try {
      const result = await invoke<string>("run_command", { command });
      return result;
    } catch (error) {
      return `Error: ${error}`;
    }
  };

  const launchCLI = async (cliName: string) => {
    try {
      const cmd = `osascript -e 'tell application "Terminal" to do script "cd \\"${workspaceDir}\\" && clear && echo \\"Starting ${cliName} in ${workspaceDir}\\" && ${cliName}"' -e 'tell application "Terminal" to activate'`;
      await invoke("run_command", { command: cmd });
    } catch (e) {
      console.error("Failed to launch CLI", e);
    }
  };

  return (
    <div className="create-skill-container">
      <div className="create-skill-header-section">
        <div className="title-row">
          <div className="title-group">
            {isEditing ? <Edit2 size={28} className="icon-primary" /> : <Plus size={28} className="icon-primary" />}
            <h2>{isEditing ? "Edit Skill" : "Create New Skill"}</h2>
          </div>
          
          <div className="mode-toggle">
            <button 
              className={`mode-btn ${mode === 'form' ? 'active' : ''}`}
              onClick={() => setMode('form')}
            >
              <Layout size={18} />
              <span>Guided Form</span>
            </button>
            <button 
              className={`mode-btn ${mode === 'terminal' ? 'active' : ''}`}
              onClick={() => setMode('terminal')}
            >
              <TerminalIcon size={18} />
              <span>Terminal (Advanced)</span>
            </button>
          </div>
        </div>
        <p className="create-skill-description">
          {mode === 'form' 
            ? `Define the characteristics and capabilities of your ${isEditing ? "existing" : "new"} agent skill using our guided interface.`
            : `Use the terminal to directly interact with your agent's CLI and ${isEditing ? "modify" : "create"} skills from the command line.`}
        </p>
      </div>

      {mode === "form" ? (
        <form onSubmit={handleSubmit} className="create-skill-form">
          <div className="form-sections-grid">
            <div className="form-section-main">
              <div className="form-group">
                <label htmlFor="skillName">Skill Name</label>
                <input
                  type="text"
                  id="skillName"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g., Image Generation, Code Refactor"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="skillDescription">Description</label>
                <textarea
                  id="skillDescription"
                  value={skillDescription}
                  onChange={(e) => setSkillDescription(e.target.value)}
                  placeholder="Provide a brief explanation of what this skill does."
                  rows={6}
                  required
                ></textarea>
              </div>
            </div>

            <div className="form-section-side">
              <div className="form-group">
                <label htmlFor="skillCategory">Category</label>
                <input
                  type="text"
                  id="skillCategory"
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value)}
                  placeholder="e.g., Design, Development"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="skillAgent">Primary Agent</label>
                <input
                  type="text"
                  id="skillAgent"
                  value={skillAgent}
                  onChange={(e) => setSkillAgent(e.target.value)}
                  placeholder="e.g., Gemini CLI"
                  required
                />
              </div>
              
              <div className="info-box">
                <h4>Pro Tip</h4>
                <p>You can also use the terminal mode to import existing skills from a Git repository.</p>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isEditing ? "Update Skill" : "Create Skill"}
            </button>
          </div>
        </form>
      ) : (
        <div className="terminal-wrapper">
          <div className="terminal-toolbar">
            <div className="workspace-indicator">
              <Folder size={16} />
              <span>{workspaceDir}</span>
            </div>
            <div className="cli-launchers">
              <button type="button" className="btn-launch" onClick={() => launchCLI('gemini')}>
                <ExternalLink size={14} /> Gemini CLI
              </button>
              <button type="button" className="btn-launch" onClick={() => launchCLI('claude')}>
                <ExternalLink size={14} /> Claude Code
              </button>
            </div>
          </div>
          <Terminal 
            onCommand={handleCommand} 
            promptString={activeSession ? `${activeSession}>` : "$"} 
          />
          <div className="terminal-info">
            <p>Tip: Try running <code>ls -la</code> to see your current directory or <code>echo "Hello"</code> to test the connection.</p>
          </div>
        </div>
      )}
    </div>
  );
};
