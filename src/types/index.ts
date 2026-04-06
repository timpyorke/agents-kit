export interface Skill {
  name: string;
  description: string | null;
  path: string;
  source?: string;
  scope?: string;
  category?: string;
  sources?: string[];
  version?: string;
  agents?: string[];
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