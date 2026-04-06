import { Link2, Unlink, Loader2 } from "lucide-react";
import { ProjectSkill } from "../types";

interface ProjectSkillCardProps {
  skill: ProjectSkill;
  onUnlink: () => void;
  unlinking: boolean;
}

export const ProjectSkillCard = ({ skill, onUnlink, unlinking }: ProjectSkillCardProps) => (
  <div className="project-skill-card">
    <div className="project-skill-info">
      <h4>{skill.name}</h4>
      <p className="project-skill-path">{skill.source_path}</p>
      {skill.is_global && <span className="badge-global">Global</span>}
    </div>
    <button
      className="btn-unlink-skill"
      onClick={onUnlink}
      disabled={unlinking}
      title="Unlink from project"
    >
      {unlinking ? <Loader2 size={16} className="spin" /> : <Unlink size={16} />}
    </button>
  </div>
);

interface AvailableSkillProps {
  name: string;
  description?: string | null;
  onLink: () => void;
  linking: boolean;
  draggable?: boolean;
  skillName?: string;
}

export const AvailableSkillCard = ({ name, description, onLink, linking, draggable, skillName }: AvailableSkillProps) => (
  <div
    className="available-skill-card"
    draggable={draggable}
    onDragStart={(e) => {
      if (skillName) e.dataTransfer.setData("text/plain", skillName);
    }}
  >
    <div className="available-skill-info">
      <h4>{name}</h4>
      {description && <p>{description}</p>}
    </div>
    <button
      className="btn-link-skill"
      onClick={onLink}
      disabled={linking}
      title="Link to project"
    >
      {linking ? <Loader2 size={16} className="spin" /> : <Link2 size={16} />}
    </button>
  </div>
);
