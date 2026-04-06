import { useState, useEffect, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Skill, SkillDetail } from "../types";

export function useGlobalSkills() {
  const [globalSkills, setGlobalSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(() => {
    setLoading(true);
    invoke<Skill[]>("get_global_skills")
      .then((skills) => {
        setGlobalSkills(skills);
        setError(null);
      })
      .catch((e: unknown) => {
        console.error("Failed to fetch global skills:", e);
        setError("Could not load global skills.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return { globalSkills, loading, error, refetch: fetchSkills };
}

export function useCreateSkill() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSkill = useCallback(
    async (name: string, description: string | null, content: string): Promise<Skill | null> => {
      setLoading(true);
      setError(null);
      try {
        const skill = await invoke<Skill>("create_skill", {
          name,
          description: description || null,
          content,
        });
        return skill;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createSkill, loading, error };
}

export function useDeleteSkill() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteSkill = useCallback(async (name: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await invoke("delete_skill", { name });
      return true;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteSkill, loading, error };
}

export function useSkillDetail(name: string | null) {
  const [detail, setDetail] = useState<SkillDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(() => {
    if (!name) {
      setDetail(null);
      return;
    }
    setLoading(true);
    invoke<SkillDetail>("get_skill_detail", { name })
      .then((d) => {
        setDetail(d);
        setError(null);
      })
      .catch((e: unknown) => {
        console.error("Failed to fetch skill detail:", e);
        setError("Could not load skill detail.");
      })
      .finally(() => setLoading(false));
  }, [name]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { detail, loading, error, refetch: fetchDetail };
}

export function useUpdateSkill() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSkill = useCallback(
    async (
      name: string,
      content: string,
      description?: string | null
    ): Promise<SkillDetail | null> => {
      setLoading(true);
      setError(null);
      try {
        const detail = await invoke<SkillDetail>("update_skill", {
          name,
          content,
          description: description ?? null,
        });
        return detail;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateSkill, loading, error };
}
