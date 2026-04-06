import { useState } from "react";
import { Terminal, Shapes } from "lucide-react";
import "./App.css";

import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { AgentCard } from "./components/AgentCard";
import { CraftCard } from "./components/CraftCard";
import { Skills } from "./components/Skills";
import { Marketplace } from "./components/Marketplace";
import { CreateSkill } from "./components/CreateSkill";
import { SkillDetailView } from "./components/SkillDetail";
import { ProjectManager } from "./components/ProjectManager";

import { useGlobalSkills } from "./hooks/useGlobalSkills";
import { ACTIVE_AGENTS, CRAFTABLE_SKILLS } from "./constants/data";
import { Skill } from "./types";

function App() {
  const { globalSkills, refetch: refetchSkills } = useGlobalSkills();
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const handleSkillCreated = () => {
    refetchSkills();
    setActiveView("skills");
  };

  const handleCancelCreateSkill = () => {
    setActiveView("skills");
  };

  const handleSelectSkill = (skill: Skill) => {
    setSelectedSkill(skill);
    setActiveView("skill-detail");
  };

  const handleBackToSkills = () => {
    setSelectedSkill(null);
    setActiveView("skills");
  };

  const handleSkillDeleted = () => {
    setSelectedSkill(null);
    refetchSkills();
    setActiveView("skills");
  };

  return (
    <div className="app-layout">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      {activeView === "dashboard" ? (
        <main className="main-container">
          <Header />

          <section className="hero-cards">
            <div className="overview-card">
              <div className="label">Overview</div>
              <div className="overview-content">
                <h2>Your Digital<br />Crafting Space</h2>
                <div className="stats-grid">
                  <div className="stat-item">
                    <h3>7 <span>/ 13</span></h3>
                    <div className="label">Detected Agents</div>
                  </div>
                  <div className="stat-item">
                    <h3>{globalSkills.length}</h3>
                    <div className="label">Installed Skills</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pro-card">
              <div className="label">Pro Status</div>
              <div className="pro-content">
                <h3>Premium Atelier</h3>
                <p>Unlimited concurrent agents and private skill repository.</p>
              </div>
            </div>
          </section>

          <section className="active-agents">
            <div className="section-header">
              <div className="section-title">
                <h2>Active Agents</h2>
                <p>Manage and monitor your connected AI environments.</p>
              </div>
              <div className="section-controls">
                <button className="btn-control">
                  <Shapes size={16} />
                  <span>Filter</span>
                </button>
                <button className="btn-control">
                  <Shapes size={16} />
                  <span>Sort</span>
                </button>
              </div>
            </div>
            <div className="agents-grid">
              {ACTIVE_AGENTS.map((agent) => (
                <AgentCard 
                  key={agent.name}
                  icon={agent.icon}
                  name={agent.name}
                  skills={agent.skills}
                  status={agent.status}
                />
              ))}
            </div>
          </section>

          <section className="available-craft">
            <div className="section-header">
              <div className="section-title">
                <h2>Available to Craft</h2>
              </div>
            </div>
            <div className="craft-grid">
              {CRAFTABLE_SKILLS.map((craft) => (
                <CraftCard 
                  key={craft.name}
                  icon={craft.icon}
                  name={craft.name}
                  description={craft.description}
                />
              ))}
              
              {globalSkills.map((skill) => (
                <CraftCard
                  key={skill.path}
                  icon={Terminal}
                  name={skill.name}
                  description={skill.description || "Local Skill"}
                />
              ))}
            </div>
          </section>
        </main>
      ) : activeView === "skills" ? (
        <main className="main-container no-padding">
          <Skills onSelectSkill={handleSelectSkill} onSkillDeleted={refetchSkills} />
        </main>
      ) : activeView === "skill-detail" && selectedSkill ? (
        <main className="main-container">
          <SkillDetailView
            skill={selectedSkill}
            onBack={handleBackToSkills}
            onDeleted={handleSkillDeleted}
          />
        </main>
      ) : activeView === "projects" ? (
        <main className="main-container">
          <ProjectManager onBack={() => setActiveView("dashboard")} />
        </main>
      ) : activeView === "marketplace" ? (
        <main className="main-container">
          <Marketplace />
        </main>
      ) : activeView === "create-skill" ? (
        <main className="main-container">
          <CreateSkill 
            onSkillCreated={handleSkillCreated} 
            onCancel={handleCancelCreateSkill} 
          />
        </main>
      ) : (
        <main className="main-container">
          <Header />
          <div className="empty-state">
            <h2>{activeView} coming soon...</h2>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
