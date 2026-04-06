import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { ProjectSkill } from "../types";

export function useProjectSkills(projectPath: string | null) {
  const [skills, setSkills] = useState<ProjectSkill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    if (!projectPath) {
      setSkills([]);
      return;
    }
    setLoading(true);
    invoke<ProjectSkill[]>("get_project_skills", { projectPath })
      .then((s) => {
        setSkills(s);
        setError(null);
      })
      .catch((e: unknown) => {
        console.error("Failed to fetch project skills:", e);
        setError(String(e));
      })
      .finally(() => setLoading(false));
  }, [projectPath]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { projectSkills: skills, loading, error, refetch: fetch };
}

export function useLinkSkill() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const link = useCallback(async (skillName: string, projectPath: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await invoke("link_skill_to_project", { skillName, projectPath });
      return true;
    } catch (e: unknown) {
      setError(String(e));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { linkSkill: link, loading, error };
}

export function useUnlinkSkill() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unlink = useCallback(async (skillName: string, projectPath: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await invoke("unlink_skill_from_project", { skillName, projectPath });
      return true;
    } catch (e: unknown) {
      setError(String(e));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { unlinkSkill: unlink, loading, error };
}
