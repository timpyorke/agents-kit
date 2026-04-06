import { Search, Bell } from "lucide-react";

export const Header = () => (
  <header className="header">
    <h1>Agents Marketplace</h1>
    <div className="search-container">
      <Search className="search-icon" size={18} />
      <input type="text" placeholder="Search skills or agents..." />
    </div>
    <div className="header-actions">
      <div className="icon-btn">
        <Bell size={20} />
      </div>
      <button className="btn-deploy">Deploy Agent</button>
    </div>
  </header>
);
