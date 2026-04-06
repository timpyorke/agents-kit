import { useState, useEffect } from "react";
import { ArrowLeft, Save, Trash2, Loader2, Info } from "lucide-react";
import { useSkillDetail, useUpdateSkill, useDeleteSkill } from "../hooks/useGlobalSkills";
import { Skill } from "../types";
import "./SkillDetail.css";

interface SkillDetailProps {
  skill: Skill;
  onBack: () => void;
  onDeleted: () => void;
}

export const SkillDetailView = ({ skill, onBack, onDeleted }: SkillDetailProps) => {
  const { detail, loading, refetch } = useSkillDetail(skill.name);
  const { updateSkill, loading: saving } = useUpdateSkill();
  const { deleteSkill, loading: deleting } = useDeleteSkill();

  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [dirty, setDirty] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (detail) {
      setContent(detail.content);
      setDescription(detail.description || "");
      setDirty(false);
    }
  }, [detail]);

  const handleSave = async () => {
    setSaveError(null);
    const result = await updateSkill(skill.name, content, description || null);
    if (result) {
      setDirty(false);
      refetch();
    } else {
      setSaveError("Failed to save changes.");
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    const ok = await deleteSkill(skill.name);
    if (ok) {
      onDeleted();
    }
  };

  const formatDate = (ts?: string) => {
    if (!ts) return "Unknown";
    const d = new Date(Number(ts) * 1000);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="skill-detail-view">
        <div className="sdv-loading">
          <Loader2 size={28} className="spin" />
          <span>Loading skill detail...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="skill-detail-view">
      <div className="sdv-header">
        <button className="sdv-back-btn" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <div className="sdv-header-actions">
          {dirty && (
            <button className="sdv-save-btn" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 size={14} className="spin" /> : <Save size={14} />}
              {saving ? "Saving..." : "Save"}
            </button>
          )}
          <button
            className={`sdv-delete-btn ${confirmDelete ? "confirm" : ""}`}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <Loader2 size={14} className="spin" />
            ) : confirmDelete ? (
              "Confirm Delete"
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        </div>
      </div>

      <div className="sdv-content">
        <div className="sdv-title-section">
          <h1 className="sdv-title">{detail?.name || skill.name}</h1>
          {detail?.path && <div className="sdv-path">{detail.path}</div>}
        </div>

        <div className="sdv-meta">
          <div className="sdv-meta-item">
            <span className="sdv-meta-label">Created</span>
            <span className="sdv-meta-value">{formatDate(detail?.created_at)}</span>
          </div>
        </div>

        <div className="sdv-section">
          <label className="sdv-section-label">Description</label>
          <textarea
            className="sdv-description-input"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setDirty(true);
            }}
            placeholder="Add a description..."
            rows={3}
          />
        </div>

        <div className="sdv-section sdv-editor-section">
          <label className="sdv-section-label">
            <Info size={14} />
            SKILL.md
          </label>
          <textarea
            className="sdv-editor"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setDirty(true);
            }}
            placeholder="Write your SKILL.md content here..."
            spellCheck={false}
          />
        </div>

        {saveError && <div className="sdv-error">{saveError}</div>}
      </div>
    </div>
  );
};
