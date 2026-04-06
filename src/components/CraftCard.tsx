import { LucideIcon } from "lucide-react";

interface CraftCardProps {
  icon: LucideIcon;
  name: string;
  description: string;
}

export const CraftCard = ({ icon: Icon, name, description }: CraftCardProps) => (
  <div className="craft-card">
    <div className="craft-icon">
      <Icon size={20} />
    </div>
    <div className="craft-info">
      <h4>{name}</h4>
      <p>{description}</p>
    </div>
    <span className="guide-badge">GUIDE</span>
  </div>
);
