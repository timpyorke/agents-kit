import { useState, useMemo } from "react";
import { Search, Download, Check, Loader2, AlertCircle } from "lucide-react";
import { SKILL_TEMPLATES, type SkillTemplate } from "../constants/skill-templates";
import { useGlobalSkills, useCreateSkill } from "../hooks/useGlobalSkills";
import "./Marketplace.css";

const CATEGORIES = ["All", "Development", "Design", "Documentation", "DevOps", "Security", "Utilities"];

export const Marketplace = () => {
  const { globalSkills } = useGlobalSkills();
  const { createSkill, error: installError } = useCreateSkill();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [installingId, setInstallingId] = useState<string | null>(null);

  const installedNames = useMemo(
    () => new Set(globalSkills.map((s) => s.name)),
    [globalSkills]
  );

  const filtered = useMemo(() => {
    return SKILL_TEMPLATES.filter((t) => {
      if (activeCategory !== "All" && t.category !== activeCategory) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    });
  }, [search, activeCategory]);

  const handleInstall = async (template: SkillTemplate) => {
    setInstallingId(template.id);
    const skill = await createSkill(template.name, template.description, template.content);
    if (skill) {
      setInstallingId(null);
    } else {
      setInstallingId(null);
    }
  };

  return (
    <div className="marketplace-container">
      <div className="marketplace-header">
        <div className="marketplace-title-row">
          <h2>Marketplace</h2>
          <span className="marketplace-count">{SKILL_TEMPLATES.length} skills</span>
        </div>
        <p>Install pre-built skill templates to get started quickly.</p>
      </div>

      <div className="marketplace-toolbar">
        <div className="search-container full-width">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="marketplace-categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`cat-chip ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {installError && (
        <div className="marketplace-error">
          <AlertCircle size={14} />
          {installError}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="marketplace-empty">
          No templates match your search.
        </div>
      ) : (
        <div className="marketplace-grid">
          {filtered.map((template) => {
            const isInstalled = installedNames.has(template.name);
            const isInstalling = installingId === template.id;
            const Icon = template.icon;

            return (
              <div key={template.id} className={`marketplace-card ${isInstalled ? "installed" : ""}`}>
                <div className="mc-top">
                  <div className="mc-icon">
                    <Icon size={24} />
                  </div>
                  <span className="mc-category">{template.category}</span>
                </div>

                <h3 className="mc-name">{template.name}</h3>
                <p className="mc-description">{template.description}</p>

                <div className="mc-agents">
                  {template.agents.map((a) => (
                    <span key={a} className="mc-agent-chip">{a}</span>
                  ))}
                </div>

                <button
                  className={`mc-install-btn ${isInstalled ? "done" : ""}`}
                  onClick={() => !isInstalled && handleInstall(template)}
                  disabled={isInstalled || isInstalling}
                >
                  {isInstalled ? (
                    <>
                      <Check size={14} />
                      Installed
                    </>
                  ) : isInstalling ? (
                    <>
                      <Loader2 size={14} className="spin" />
                      Installing...
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      Install
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
