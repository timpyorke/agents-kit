import { Star, Download } from "lucide-react";
import { MARKETPLACE_SKILLS } from "../constants/data";
import "./Marketplace.css";

export const Marketplace = () => {
  return (
    <div className="marketplace-container">
      <div className="marketplace-header">
        <h2>Marketplace</h2>
        <p>Discover and install new skills for your agents.</p>
      </div>

      <div className="marketplace-grid">
        {MARKETPLACE_SKILLS.map((skill) => (
          <div key={skill.name} className="marketplace-card">
            <div className="card-icon">
              <skill.icon size={32} />
            </div>
            <h3 className="card-name">{skill.name}</h3>
            <p className="card-description">{skill.description}</p>
            <div className="card-meta">
              <span className="meta-category">{skill.category}</span>
              <span className="meta-agent">Agent: {skill.agent}</span>
            </div>
            <div className="card-stats">
              <div className="stat-item">
                <Star size={16} />
                <span>{skill.rating}</span>
              </div>
              <div className="stat-item">
                <Download size={16} />
                <span>{skill.downloads.toLocaleString()}</span>
              </div>
            </div>
            <button className="btn-install-marketplace">Install</button>
          </div>
        ))}
      </div>
    </div>
  );
};
