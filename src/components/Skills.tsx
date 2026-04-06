import { useState } from "react";
import { Puzzle, Search, X, Info, Trash2, Edit2 } from "lucide-react";
import { MOCK_SKILLS } from "../constants/data";
import { Skill } from "../types";
import "./Skills.css";

const ALL_AGENTS = ["Antigravity", "Claude Code", "Codex", "Cursor", "Gemini CLI", "Trae", "Windsurf"];

interface SkillsProps {
  onEditSkill?: (skill: Skill) => void;
}

export const Skills = ({ onEditSkill }: SkillsProps = {}) => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(MOCK_SKILLS[0]);
  const [filter, setFilter] = useState<string>("All");

  const filteredSkills = MOCK_SKILLS.filter(skill => {
    if (filter === "All") return true;
    return skill.agents?.includes(filter);
  });

  return (
    <div className="skills-container">
      {/* Left Pane - Skills List */}
      <div className="skills-list-pane">
        <div className="skills-header">
          <div className="skills-title">
            <Puzzle size={24} />
            <h2>Skills <span>({MOCK_SKILLS.length})</span></h2>
          </div>
          
          <div className="filter-chips">
            <button 
              className={`filter-chip ${filter === "All" ? "active" : ""}`}
              onClick={() => setFilter("All")}
            >
              All
            </button>
            {ALL_AGENTS.map(agent => (
              <button 
                key={agent} 
                className={`filter-chip ${filter === agent ? "active" : ""}`}
                onClick={() => setFilter(agent)}
              >
                {agent}
              </button>
            ))}
          </div>

          <div className="search-container full-width">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Filter skills..." />
            <div className="search-shortcut">⌘K</div>
          </div>
        </div>

        <div className="skills-list">
          {filteredSkills.map(skill => (
            <div 
              key={skill.name} 
              className={`skill-list-item ${selectedSkill?.name === skill.name ? "active" : ""}`}
              onClick={() => setSelectedSkill(skill)}
            >
              <h3 className="skill-name">{skill.name}</h3>
              <p className="skill-description-snippet">{skill.description}</p>
              <div className="skill-agents-chips">
                {skill.agents?.map(agent => (
                  <span key={agent} className="agent-chip">{agent}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Pane - Skill Detail */}
      {selectedSkill ? (
        <div className="skill-detail-pane">
          <div className="detail-header">
            <div className="detail-title">
              <Info size={16} />
              <span>Detail</span>
            </div>
            <div className="detail-actions">
              <button className="icon-btn detail-edit-btn" onClick={() => onEditSkill?.(selectedSkill)}>
                <Edit2 size={16} />
              </button>
              <button className="icon-btn detail-close-btn" onClick={() => setSelectedSkill(null)}>
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="detail-content">
            <h2 className="detail-skill-name">{selectedSkill.name}</h2>
            <p className="detail-description">{selectedSkill.description}</p>
            <div className="code-path">{selectedSkill.path}</div>

            <div className="detail-section">
              <h4 className="section-label">PACKAGE INFO</h4>
              <div className="info-grid">
                <div className="info-row">
                  <span className="info-key">Source</span>
                  <span className="info-value badge-light">{selectedSkill.source || "Local"}</span>
                </div>
                <div className="info-row">
                  <span className="info-key">Scope</span>
                  <span className="info-value badge-light">{selectedSkill.scope || "Global"}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4 className="section-label">SKILL METADATA</h4>
              <div className="info-grid">
                <div className="info-row">
                  <span className="info-key">Category</span>
                  <span className="info-value">{selectedSkill.category || "-"}</span>
                </div>
                <div className="info-row">
                  <span className="info-key">Sources</span>
                  <span className="info-value">
                    {selectedSkill.sources ? `[${selectedSkill.sources.join(", ")}]` : "[]"}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-key">Version</span>
                  <span className="info-value">{selectedSkill.version || "1.0.0"}</span>
                </div>
              </div>
            </div>

            <div className="detail-section flex-grow">
              <h4 className="section-label">AGENTS ({selectedSkill.agents?.length || 0}/{ALL_AGENTS.length})</h4>
              <div className="agents-install-list">
                {ALL_AGENTS.map(agent => {
                  const isInstalled = selectedSkill.agents?.includes(agent);
                  return (
                    <div key={agent} className={`agent-install-item ${isInstalled ? "installed" : ""}`}>
                      <div className="agent-install-info">
                        <div className="agent-install-name">
                          {isInstalled ? <div className="status-dot online" /> : <div className="status-dot offline" />}
                          <span>{agent}</span>
                        </div>
                        {isInstalled && (
                          <div className="agent-install-path">{selectedSkill.path.replace("charles", "charles").replace("antigravity", agent.toLowerCase().replace(" ", "-"))}</div>
                        )}
                      </div>
                      <div className="agent-install-action">
                        {isInstalled ? (
                          <button className="btn-icon-danger">
                            <Trash2 size={16} />
                          </button>
                        ) : (
                          <button className="btn-install">Install</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="skill-detail-pane empty">
          <p>Select a skill to view details</p>
        </div>
      )}
    </div>
  );
};
