import { useState, useRef } from "react";
import {
  Settings,
  FolderOpen,
  Download,
  Upload,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { useGlobalSkills } from "../hooks/useGlobalSkills";
import "./Settings.css";

interface AgentConfig {
  name: string;
  enabled: boolean;
  path: string;
}

export interface AppSettings {
  agents: AgentConfig[];
  defaultEditor: string;
  skillsDir: string;
}

const STORAGE_KEY = "agents-kit-settings";

export function loadSettings(): AppSettings {
  const DEFAULT_AGENTS: AgentConfig[] = [
    { name: "Claude Code", enabled: true, path: "claude" },
    { name: "Codex", enabled: true, path: "codex" },
    { name: "Cursor", enabled: false, path: "cursor" },
    { name: "Gemini CLI", enabled: true, path: "gemini" },
    { name: "Antigravity", enabled: false, path: "" },
    { name: "Trae", enabled: false, path: "" },
    { name: "Windsurf", enabled: false, path: "" },
  ];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    agents: DEFAULT_AGENTS,
    defaultEditor: "",
    skillsDir: "~/.agents/skills",
  };
}

function saveSettings(settings: AppSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export const SettingsPage = () => {
  const { globalSkills, refetch } = useGlobalSkills();
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const flash = (type: "ok" | "err", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  };

  const updateAgent = (name: string, patch: Partial<AgentConfig>) => {
    setSettings((s) => ({
      ...s,
      agents: s.agents.map((a) => (a.name === name ? { ...a, ...patch } : a)),
    }));
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    flash("ok", "Settings saved.");
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await invoke<Array<{ name: string; description: string | null; path: string; content: string }>>("export_all_skills");
      const exportObj: Record<string, { description?: string; content: string }> = {};
      for (const s of data) {
        exportObj[s.name] = {
          description: s.description || undefined,
          content: s.content,
        };
      }
      const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `agents-skills-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      flash("ok", `Exported ${data.length} skills.`);
    } catch {
      flash("err", "Export failed. Try checking skills directory.");
    }
    setExporting(false);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      let count = 0;
      for (const [name, val] of Object.entries(data)) {
        const { description, content } = val as { description?: string; content?: string };
        if (!content) continue;
        try {
          await invoke("create_skill", { name, description: description || null, content });
          count++;
        } catch {
          // skip duplicates
        }
      }
      refetch();
      flash("ok", `Imported ${count} skills.`);
    } catch {
      flash("err", "Import failed. Invalid file format.");
    }
    setImporting(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const enabledCount = settings.agents.filter((a) => a.enabled).length;

  return (
    <div className="settings-container">
      <div className="settings-header">
        <div className="settings-title-row">
          <Settings size={28} />
          <h2>Settings</h2>
        </div>
        <p>Configure your workspace, agents, and manage skill data.</p>
      </div>

      {msg && (
        <div className={`settings-toast ${msg.type}`}>
          {msg.type === "ok" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          {msg.text}
        </div>
      )}

      {/* Agents Section */}
      <section className="settings-section">
        <div className="section-head">
          <div>
            <h3>AI Agents</h3>
            <p className="section-desc">{enabledCount} of {settings.agents.length} agents enabled</p>
          </div>
        </div>
        <div className="settings-card-list">
          {settings.agents.map((agent) => (
            <div key={agent.name} className={`settings-agent-row ${agent.enabled ? "on" : ""}`}>
              <div className="sar-info">
                <h4>{agent.name}</h4>
                <div className="sar-path-row">
                  <FolderOpen size={13} className="sar-path-icon" />
                  <input
                    type="text"
                    className="sar-path-input"
                    value={agent.path}
                    onChange={(e) => updateAgent(agent.name, { path: e.target.value })}
                    placeholder="Path or command..."
                    disabled={!agent.enabled}
                  />
                </div>
              </div>
              <label className="sar-toggle">
                <input
                  type="checkbox"
                  checked={agent.enabled}
                  onChange={(e) => updateAgent(agent.name, { enabled: e.target.checked })}
                />
                <span className="sar-toggle-track" />
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* Workspace Section */}
      <section className="settings-section">
        <div className="section-head">
          <div>
            <h3>Workspace</h3>
            <p className="section-desc">Default paths and preferences</p>
          </div>
        </div>
        <div className="settings-card-list">
          <div className="settings-field">
            <label>Default Editor</label>
            <input
              type="text"
              className="settings-input"
              value={settings.defaultEditor}
              onChange={(e) => setSettings((s) => ({ ...s, defaultEditor: e.target.value }))}
              placeholder="e.g. code, vim, nvim..."
            />
          </div>
          <div className="settings-field">
            <label>Skills Directory</label>
            <input
              type="text"
              className="settings-input"
              value={settings.skillsDir}
              onChange={(e) => setSettings((s) => ({ ...s, skillsDir: e.target.value }))}
              placeholder="~/.agents/skills"
            />
          </div>
          <div className="settings-stats">
            <div className="ss-item">
              <span className="ss-value">{globalSkills.length}</span>
              <span className="ss-label">Installed Skills</span>
            </div>
          </div>
        </div>
      </section>

      {/* Data Section */}
      <section className="settings-section">
        <div className="section-head">
          <div>
            <h3>Data</h3>
            <p className="section-desc">Export and import your skills</p>
          </div>
        </div>
        <div className="settings-card-list">
          <div className="settings-data-row">
            <div>
              <h4>Export Skills</h4>
              <p>Download all {globalSkills.length} skills as a JSON file</p>
            </div>
            <button
              className="sd-btn"
              onClick={handleExport}
              disabled={exporting || globalSkills.length === 0}
            >
              {exporting ? <Loader2 size={14} className="spin" /> : <Download size={14} />}
              {exporting ? "Exporting..." : "Export"}
            </button>
          </div>
          <div className="settings-data-row">
            <div>
              <h4>Import Skills</h4>
              <p>Load skills from a JSON file</p>
            </div>
            <button
              className="sd-btn"
              onClick={() => fileRef.current?.click()}
              disabled={importing}
            >
              {importing ? <Loader2 size={14} className="spin" /> : <Upload size={14} />}
              {importing ? "Importing..." : "Import"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              style={{ display: "none" }}
              onChange={handleImport}
            />
          </div>
        </div>
      </section>

      {/* Save */}
      <div className="settings-save-bar">
        <button className="settings-save-btn" onClick={handleSave}>
          {saved ? <CheckCircle size={16} /> : <Save size={16} />}
          {saved ? "Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
};
