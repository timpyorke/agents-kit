import { useState, useMemo } from "react";
import { FolderOpen, ArrowLeft, Loader2 } from "lucide-react";
import "./ProjectManager.css";
import "./ProjectSkillCard.css";
import { ProjectSkillCard, AvailableSkillCard } from "./ProjectSkillCard";
import { useProjectSkills } from "../hooks/useProjectSkills";
import { useGlobalSkills } from "../hooks/useGlobalSkills";
import { Skill } from "../types";

interface ProjectManagerProps {
  onBack: () => void;
}

export const ProjectManager = ({ onBack }: ProjectManagerProps) => {
  const [projectPath, setProjectPath] = useState("");
  const [confirmedPath, setConfirmedPath] = useState<string | null>(null);
  const [linkingSkill, setLinkingSkill] = useState<string | null>(null);
  const [unlinkingSkill, setUnlinkingSkill] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);

  const { projectSkills, loading, refetch } = useProjectSkills(confirmedPath);
  const { globalSkills } = useGlobalSkills();

  const linkedNames = useMemo(
    () => new Set(projectSkills.map((s) => s.name)),
    [projectSkills]
  );

  const availableSkills = useMemo(
    () => globalSkills.filter((s) => !linkedNames.has(s.name)),
    [globalSkills, linkedNames]
  );

  const handleOpenProject = async () => {
    if (!projectPath.trim()) return;
    setConfirmedPath(projectPath.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleOpenProject();
  };

  const handleLink = async (skill: Skill) => {
    if (!confirmedPath) return;
    setLinkingSkill(skill.name);
    setLinkError(null);
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      await invoke("link_skill_to_project", { skillName: skill.name, projectPath: confirmedPath });
      refetch();
    } catch (e: unknown) {
      setLinkError(String(e));
    } finally {
      setLinkingSkill(null);
    }
  };

  const handleUnlink = async (skillName: string) => {
    if (!confirmedPath) return;
    setUnlinkingSkill(skillName);
    setLinkError(null);
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      await invoke("unlink_skill_from_project", { skillName, projectPath: confirmedPath });
      refetch();
    } catch (e: unknown) {
      setLinkError(String(e));
    } finally {
      setUnlinkingSkill(null);
    }
  };

  return (
    <div className="project-manager">
      <div className="pm-header">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2>Projects</h2>
          <p className="pm-subtitle">Link global skills to your projects</p>
        </div>
      </div>

      <div className="pm-path-input">
        <FolderOpen size={18} className="pm-folder-icon" />
        <input
          type="text"
          placeholder="Enter project folder path..."
          value={projectPath}
          onChange={(e) => setProjectPath(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn-open-project" onClick={handleOpenProject}>
          Open
        </button>
      </div>

      {linkError && <div className="pm-error">{linkError}</div>}

      {confirmedPath && (
        <div className="pm-content">
          <div className="pm-section">
            <h3>Linked Skills</h3>
            <p className="pm-section-path">{confirmedPath}/.agents/skills/</p>
            {loading ? (
              <div className="pm-loading"><Loader2 size={20} className="spin" /></div>
            ) : projectSkills.length === 0 ? (
              <div className="pm-empty">No skills linked yet</div>
            ) : (
              <div className="pm-skills-list">
                {projectSkills.map((skill) => (
                  <ProjectSkillCard
                    key={skill.name}
                    skill={skill}
                    onUnlink={() => handleUnlink(skill.name)}
                    unlinking={unlinkingSkill === skill.name}
                  />
                ))}
              </div>
            )}
          </div>

          {availableSkills.length > 0 && (
            <div className="pm-section">
              <h3>Available to Link</h3>
              <div className="pm-skills-list">
                {availableSkills.map((skill) => (
                  <AvailableSkillCard
                    key={skill.name}
                    name={skill.name}
                    description={skill.description}
                    onLink={() => handleLink(skill)}
                    linking={linkingSkill === skill.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
