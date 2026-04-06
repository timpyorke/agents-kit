import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Skill } from "../types";

export function useGlobalSkills() {
  const [globalSkills, setGlobalSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

  return { globalSkills, loading, error };
}
