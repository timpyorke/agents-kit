import { useState, useEffect } from "react";
import {
  LayoutGrid,
  Puzzle,
  Store,
  Plus,
  HelpCircle,
  PenTool,
  FolderOpen,
  Settings as SettingsIcon,
  Bot
} from "lucide-react";
import { ACTIVE_AGENTS } from "../constants/data";
import { loadSettings } from "../components/Settings";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  const [enabledAgents, setEnabledAgents] = useState<Set<string>>(new Set());

  useEffect(() => {
    const settings = loadSettings();
    setEnabledAgents(new Set(
      settings.agents.filter((a) => a.enabled).map((a) => a.name)
    ));
  }, []);

  const isAgentEnabled = (name: string) => enabledAgents.has(name);

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo-container">
          <div className="logo-icon">
            <PenTool size={24} />
          </div>
          <div className="logo-text">
            <h2>Agents Kit</h2>
            <p>Curating AI Crafts</p>
          </div>
        </div>

        <div className="sidebar-nav-container">
          <nav className="nav-links">
            <div 
              className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
              onClick={() => onViewChange('dashboard')}
            >
              <LayoutGrid size={20} />
              <span className="nav-text">Dashboard</span>
            </div>
            <div 
              className={`nav-item ${activeView === 'skills' || activeView === 'skill-detail' ? 'active' : ''}`}
              onClick={() => onViewChange('skills')}
            >
              <Puzzle size={20} />
              <span className="nav-text">All Skills</span>
            </div>
            <div 
              className={`nav-item ${activeView === 'projects' ? 'active' : ''}`}
              onClick={() => onViewChange('projects')}
            >
              <FolderOpen size={20} />
              <span className="nav-text">Projects</span>
            </div>
            <div 
              className={`nav-item ${activeView === 'ai' ? 'active' : ''}`}
              onClick={() => onViewChange('ai')}
            >
              <Bot size={20} />
              <span className="nav-text">AI Console</span>
            </div>
            <div 
              className={`nav-item ${activeView === 'marketplace' ? 'active' : ''}`}
              onClick={() => onViewChange('marketplace')}
            >
              <Store size={20} />
              <span className="nav-text">Marketplace</span>
            </div>
          </nav>

          <div className="nav-section">
            <h3 className="nav-section-title">AGENTS</h3>
            <div className="nav-links">
              {ACTIVE_AGENTS.map((agent) => {
                const enabled = isAgentEnabled(agent.name);
                return (
                  <div
                    key={agent.name}
                    className={`nav-item agent-nav-item ${!enabled ? "disabled" : ""}`}
                    onClick={() => enabled && onViewChange("dashboard")}
                  >
                    <agent.icon size={20} />
                    <span className="nav-text">{agent.name}</span>
                    <span className={`nav-count ${!enabled ? "disabled" : ""}`}>{agent.skills}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-bottom">
        <button className="btn-create-skill" onClick={() => onViewChange("create-skill")}>
          <Plus size={20} />
          <span>Create New Skill</span>
        </button>
        <div className="nav-item">
          <SettingsIcon size={20} />
          <span className="nav-text">Settings</span>
        </div>
        <div className="nav-item">
          <HelpCircle size={20} />
          <span>Help</span>
        </div>
      </div>
    </aside>
  );
};
