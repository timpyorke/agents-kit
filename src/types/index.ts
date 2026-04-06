export interface Skill {
  name: string;
  description?: string | null;
  path: string;
  created_at?: string;
  source?: string;
  scope?: string;
  category?: string;
  sources?: string[];
  version?: string;
  agents?: string[];
}

export interface SkillDetail {
  name: string;
  description?: string | null;
  content: string;
  created_at?: string;
  path: string;
}

export interface ProjectSkill {
  name: string;
  source_path: string;
  is_global: boolean;
}

export interface Agent {
  name: string;
  skills: number;
  status: "ONLINE" | "PENDING";
  icon: any;
}

export interface Craft {
  name: string;
  description: string;
  icon: any;
}

export interface MarketplaceSkill {
  name: string;
  description: string;
  icon: any;
  category: string;
  agent: string;
  downloads: number;
  rating: number;
}
