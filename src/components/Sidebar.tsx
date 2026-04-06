import {
  LayoutGrid,
  Puzzle,
  Store,
  Plus,
  HelpCircle,
  PenTool
} from "lucide-react";
import { ACTIVE_AGENTS } from "../constants/data";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar = ({ activeView, onViewChange }: SidebarProps) => (
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
            className={`nav-item ${activeView === 'skills' ? 'active' : ''}`}
            onClick={() => onViewChange('skills')}
          >
            <Puzzle size={20} />
            <span className="nav-text">All Skills</span>
            <span className="nav-count">18</span>
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
            {ACTIVE_AGENTS.map((agent) => (
              <div key={agent.name} className="nav-item">
                <agent.icon size={20} />
                <span className="nav-text">{agent.name}</span>
                <span className="nav-count">{agent.skills}</span>
              </div>
            ))}
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
        <HelpCircle size={20} />
        <span>Help</span>
      </div>
    </div>
  </aside>
);
