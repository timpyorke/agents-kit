import { ChevronRight, BarChart2, LucideIcon } from "lucide-react";

interface AgentCardProps {
  icon: LucideIcon;
  name: string;
  skills: number;
  status: "ONLINE" | "PENDING";
}

export const AgentCard = ({ icon: Icon, name, skills, status }: AgentCardProps) => (
  <div className="agent-card">
    <div className="agent-header">
      <div className="agent-icon">
        <Icon size={24} />
      </div>
      <span className={`status-badge ${status === 'ONLINE' ? 'status-online' : 'status-pending'}`}>
        {status}
      </span>
    </div>
    <div className="agent-info">
      <h3>{name}</h3>
      <p>{skills} Custom Skills Installed</p>
    </div>
    <div className="agent-footer">
      <div className="configure-link">
        <span>Configure</span>
        <ChevronRight size={16} />
      </div>
      <div className="icon-btn">
        <BarChart2 size={18} />
      </div>
    </div>
  </div>
);
