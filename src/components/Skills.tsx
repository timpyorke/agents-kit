import { useState } from "react";
import { Puzzle, Search, Trash2, Loader2 } from "lucide-react";
import { useGlobalSkills, useDeleteSkill, useSkillsWatcher } from "../hooks/useGlobalSkills";
import { Skill } from "../types";
import { SkillDetailView } from "./SkillDetail";
import "./Skills.css";

interface SkillsProps {
  onSkillDeleted?: () => void;
}

export const Skills = ({ onSkillDeleted }: SkillsProps) => {
  const { globalSkills, loading, error, refetch } = useGlobalSkills();
  const { deleteSkill, loading: deleting } = useDeleteSkill();
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [detailRefresh, setDetailRefresh] = useState(0);

  useSkillsWatcher((event) => {
    refetch();
    if (selectedSkill && event.name === selectedSkill.name) {
      if (event.kind === "deleted") {
        setSelectedSkill(null);
      } else {
        setDetailRefresh((n) => n + 1);
      }
    }
  });

  const filteredSkills = globalSkills.filter((skill) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      skill.name.toLowerCase().includes(q) ||
      (skill.description?.toLowerCase().includes(q) ?? false)
    );
  });

  const handleDelete = async (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDelete === name) {
      const ok = await deleteSkill(name);
      if (ok) {
        setConfirmDelete(null);
        refetch();
        onSkillDeleted?.();
      }
    } else {
      setConfirmDelete(name);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const formatDate = (ts?: string) => {
    if (!ts) return null;
    const d = new Date(Number(ts) * 1000);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="skills-container">
      <div className="skills-list-pane">
        <div className="skills-header">
          <div className="skills-title">
            <Puzzle size={24} />
            <h2>
              Skills <span>({globalSkills.length})</span>
            </h2>
          </div>

          <div className="search-container full-width">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Filter skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="skills-list">
          {loading && (
            <div className="skills-loading">
              <Loader2 size={24} className="spin" />
              <span>Loading skills...</span>
            </div>
          )}

          {error && <div className="skills-error">{error}</div>}

          {!loading && !error && filteredSkills.length === 0 && (
            <div className="skills-empty">
              {search ? "No skills match your search." : "No skills found. Create one!"}
            </div>
          )}

          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              className={`skill-list-item ${selectedSkill?.name === skill.name ? "active" : ""}`}
              onClick={() => setSelectedSkill(skill)}
            >
              <div className="skill-item-top">
                <h3 className="skill-name">{skill.name}</h3>
                <button
                  className={`skill-delete-btn ${confirmDelete === skill.name ? "confirm" : ""}`}
                  onClick={(e) => handleDelete(skill.name, e)}
                  disabled={deleting}
                >
                  {deleting && confirmDelete === skill.name ? (
                    <Loader2 size={14} className="spin" />
                  ) : confirmDelete === skill.name ? (
                    "Confirm?"
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
              <p className="skill-description-snippet">
                {skill.description || "No description"}
              </p>
              {skill.created_at && (
                <span className="skill-date">{formatDate(skill.created_at)}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={`skill-detail-pane ${selectedSkill ? "has-skill" : "empty"}`}>
        {selectedSkill ? (
          <SkillDetailView
            skill={selectedSkill}
            onBack={() => setSelectedSkill(null)}
            onDeleted={() => {
              setSelectedSkill(null);
              refetch();
              onSkillDeleted?.();
            }}
            embedded
            refreshTrigger={detailRefresh}
          />
        ) : (
          <p>Select a skill to view details</p>
        )}
      </div>
    </div>
  );
};
