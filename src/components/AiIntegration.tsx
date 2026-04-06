import { useState, useEffect, useRef, useCallback } from "react";
import {
  Bot,
  Terminal as TermIcon,
  Play,
  Square,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { loadSettings } from "./Settings";
import "./AiIntegration.css";

interface AgentInfo {
  name: string;
  cli: string;
  description: string;
  available: boolean | null;
  version: string | null;
  checking: boolean;
}

const AGENT_DEFINITIONS: Omit<AgentInfo, "available" | "version" | "checking">[] = [
  { name: "Claude Code", cli: "claude", description: "Anthropic's coding agent" },
  { name: "Codex", cli: "codex", description: "OpenAI's coding agent" },
  { name: "Gemini CLI", cli: "gemini", description: "Google's AI assistant" },
  { name: "OpenCode", cli: "opencode", description: "Open-source AI coding agent" },
];

interface TerminalLine {
  id: number;
  type: "input" | "stdout" | "stderr" | "done" | "system";
  content: string;
}

export const AiIntegration = () => {
  const [agents, setAgents] = useState<AgentInfo[]>(
    AGENT_DEFINITIONS.map((a) => ({ ...a, available: null, version: null, checking: false }))
  );
  const [activeAgent, setActiveAgent] = useState<AgentInfo | null>(null);
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);
  const [commandPrompt, setCommandPrompt] = useState("$");
  const lineIdRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addLine = useCallback((type: TerminalLine["type"], content: string) => {
    lineIdRef.current += 1;
    setLines((prev) => [...prev, { id: lineIdRef.current, type, content }]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // Check agent availability on mount
  useEffect(() => {
    const checkAll = async () => {
      const settings = loadSettings();
      const enabledNames = new Set(settings.agents.filter((a) => a.enabled).map((a) => a.name));

      const results = await Promise.all(
        AGENT_DEFINITIONS.map(async (def) => {
          const enabled = enabledNames.has(def.name);
          if (!enabled) return { ...def, available: null, version: null, checking: false };

          try {
            const available = await invoke<boolean>("check_agent_available", { agent: def.cli });
            let version: string | null = null;
            if (available) {
              try {
                version = await invoke<string>("get_agent_version", { agent: def.cli });
              } catch {}
            }
            return { ...def, available, version, checking: false };
          } catch {
            return { ...def, available: false, version: null, checking: false };
          }
        })
      );
      setAgents(results);
    };
    checkAll();
  }, []);

  // Listen for streaming output
  useEffect(() => {
    let unlisten: UnlistenFn | undefined;
    listen<{ type: string; data: string }>("terminal-output", (event) => {
      const { type, data } = event.payload;
      if (type === "done") {
        setRunning(false);
        addLine("system", "Process finished.");
      } else {
        addLine(type as "stdout" | "stderr", data);
      }
    }).then((fn) => {
      unlisten = fn;
    });
    return () => { unlisten?.(); };
  }, [addLine]);

  const handleSelectAgent = (agent: AgentInfo) => {
    setActiveAgent(agent);
    setLines([
      { id: ++lineIdRef.current, type: "system", content: `Switched to ${agent.name}` },
    ]);
    setCommandPrompt(agent.cli === "claude" || agent.cli === "gemini" ? `>${agent.cli}` : `$`);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleRun = async () => {
    if (!input.trim()) return;
    const cmd = input.trim();
    addLine("input", cmd);
    setInput("");
    setRunning(true);

    try {
      await invoke("run_streaming_command", { command: cmd });
    } catch (e) {
      addLine("stderr", String(e));
      setRunning(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !running) {
      handleRun();
    }
  };

  const handleClear = () => {
    setLines([]);
    lineIdRef.current = 0;
  };

  const handleStop = () => {
    // Can't easily kill subprocess from Tauri command, but mark as stopped
    setRunning(false);
    addLine("system", "Stopped.");
  };

  return (
    <div className="ai-container">
      <div className="ai-header">
        <div className="ai-title-row">
          <Bot size={28} />
          <div>
            <h2>AI Integration</h2>
            <p>Run AI agents directly from your workspace</p>
          </div>
        </div>
      </div>

      <div className="ai-body">
        {/* Agent Sidebar */}
        <div className="ai-agent-list">
          <h3 className="aal-title">Agents</h3>
          {agents.map((agent) => (
            <button
              key={agent.cli}
              className={`aal-item ${activeAgent?.cli === agent.cli ? "active" : ""} ${!agent.available ? "unavailable" : ""}`}
              onClick={() => agent.available && handleSelectAgent(agent)}
              disabled={agent.checking || agent.available === false}
            >
              <div className="aal-info">
                <span className="aal-name">{agent.name}</span>
                <span className="aal-desc">{agent.description}</span>
              </div>
              <div className="aal-status">
                {agent.checking ? (
                  <Loader2 size={14} className="spin" />
                ) : agent.available ? (
                  <CheckCircle size={14} className="aal-available" />
                ) : agent.available === false ? (
                  <AlertCircle size={14} className="aal-missing" />
                ) : (
                  <span className="aal-disabled">Off</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Terminal */}
        <div className="ai-terminal-wrapper">
          {activeAgent ? (
            <>
              <div className="ai-term-bar">
                <div className="atb-left">
                  <TermIcon size={14} />
                  <span>{activeAgent.name}</span>
                  {activeAgent.version && (
                    <span className="atb-version">{activeAgent.version}</span>
                  )}
                </div>
                <div className="atb-right">
                  {running ? (
                    <button className="atb-btn stop" onClick={handleStop}>
                      <Square size={12} />
                      Stop
                    </button>
                  ) : (
                    <button className="atb-btn" disabled={!input.trim()} onClick={handleRun}>
                      <Play size={12} />
                      Run
                    </button>
                  )}
                  <button className="atb-btn" onClick={handleClear}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              <div className="ai-terminal" onClick={() => inputRef.current?.focus()}>
                <div className="ai-term-scroll" ref={scrollRef}>
                  {lines.map((line) => (
                    <div key={line.id} className={`at-line at-${line.type}`}>
                      {line.type === "input" && (
                        <span className="at-prompt">{commandPrompt} </span>
                      )}
                      <span>{line.content}</span>
                    </div>
                  ))}
                  {!running && (
                    <div className="at-line at-input-row">
                      <span className="at-prompt">{commandPrompt} </span>
                      <input
                        ref={inputRef}
                        type="text"
                        className="at-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        autoComplete="off"
                        spellCheck={false}
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="ai-term-placeholder">
              <Bot size={48} className="ai-ph-icon" />
              <h3>Select an Agent</h3>
              <p>Choose an agent from the left to start a session</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
