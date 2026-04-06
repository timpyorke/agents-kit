import { 
  Box, 
  Terminal, 
  Cpu, 
  Navigation, 
  Zap, 
  Smile, 
  Code,
  Sparkles,
  Gamepad2,
  Waves,
  Palette, // Added for Marketplace
  Lightbulb, // Added for Marketplace
  Cloud, // Added for Marketplace
  Settings // Added for Marketplace
} from "lucide-react";
import { Agent, Craft, Skill, MarketplaceSkill } from "../types"; // Updated import

export const ACTIVE_AGENTS: Agent[] = [
  { icon: Box, name: "Antigravity", skills: 4, status: "ONLINE" },
  { icon: Terminal, name: "Claude Code", skills: 6, status: "ONLINE" },
  { icon: Cpu, name: "Codex", skills: 7, status: "ONLINE" },
  { icon: Navigation, name: "Cursor", skills: 5, status: "PENDING" },
  { icon: Sparkles, name: "Gemini CLI", skills: 1, status: "ONLINE" },
  { icon: Gamepad2, name: "Trae", skills: 12, status: "ONLINE" },
  { icon: Waves, name: "Windsurf", skills: 6, status: "ONLINE" },
];

export const CRAFTABLE_SKILLS: Craft[] = [
  { icon: Zap, name: "Cline", description: "IDE Extension" },
  { icon: Smile, name: "CodeBuddy", description: "Pair Programmer" },
  { icon: Code, name: "Copilot CLI", description: "Command Line AI" },
];

export const MOCK_SKILLS: Skill[] = [
  {
    name: "android-native-dev",
    description: "Android native application development and UI design guide. Covers Material Design 3, Kotlin/Compose development, project configuration, accessibility, and build troubleshooting. Read this before Android native application development.",
    path: "/Users/charles/.antigravity/skills/android-native-dev",
    source: "Local",
    scope: "Antigravity Local",
    category: "mobile",
    sources: ["Material Design 3 Guidelines (material.io)", "Android Developer Documentation (developer.android.com)", "Google Play Quality Guidelines", "WCAG Accessibility Guidelines"],
    version: "1.0.0",
    agents: ["Antigravity"]
  },
  {
    name: "develop-web-game",
    description: "Use when Codex is building or iterating on a web...",
    path: "/Users/charles/.codex/skills/develop-web-game",
    agents: ["Codex"]
  },
  {
    name: "find-skills",
    description: "Helps users discover and install agent skills when...",
    path: "/Users/charles/.shared/skills/find-skills",
    agents: ["Codex", "Cursor", "Gemini CLI", "Trae", "Windsurf"]
  },
  {
    name: "frontend-design",
    description: "Create distinctive, production-grade frontend...",
    path: "/Users/charles/.cursor/skills/frontend-design",
    agents: ["Cursor"]
  },
  {
    name: "gif-sticker-maker",
    description: "Convert photos (people, pets, objects, logos) into 4...",
    path: "/Users/charles/.trae/skills/gif-sticker-maker",
    agents: ["Trae"]
  },
  {
    name: "ios-application-dev",
    description: "iOS application development guide covering UIKit,...",
    path: "/Users/charles/.codex/skills/ios-application-dev",
    agents: ["Codex"]
  },
  {
    name: "planning-with-files",
    description: "Implements Manus-style file-based planning to...",
    path: "/Users/charles/.shared/skills/planning-with-files",
    agents: ["Claude Code", "Trae", "Windsurf"]
  },
  {
    name: "ppt-editing-skill",
    description: "Edit existing PowerPoint files or templates with...",
    path: "/Users/charles/.trae/skills/ppt-editing-skill",
    agents: ["Trae"]
  },
  {
    name: "ppt-orchestra-skill",
    description: "Coordinate multiple slide decks...",
    path: "/Users/charles/.trae/skills/ppt-orchestra-skill",
    agents: []
  }
];

export const MARKETPLACE_SKILLS: MarketplaceSkill[] = [
  {
    name: "Color Palette Generator",
    description: "Generates harmonious color palettes based on user preferences.",
    icon: Palette,
    category: "Design",
    agent: "Antigravity",
    downloads: 12345,
    rating: 4.7,
  },
  {
    name: "Idea Brainstormer",
    description: "Helps generate creative ideas for various projects.",
    icon: Lightbulb,
    category: "Productivity",
    agent: "Gemini CLI",
    downloads: 8765,
    rating: 4.5,
  },
  {
    name: "Cloud Deployment Wizard",
    description: "Simplifies deploying applications to various cloud platforms.",
    icon: Cloud,
    category: "Development",
    agent: "Codex",
    downloads: 23456,
    rating: 4.9,
  },
  {
    name: "Advanced Settings Manager",
    description: "Provides a comprehensive interface for managing complex application settings.",
    icon: Settings,
    category: "Utilities",
    agent: "Trae",
    downloads: 5432,
    rating: 4.2,
  },
];