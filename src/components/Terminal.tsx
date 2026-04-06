import React, { useState, useRef, useEffect } from "react";
import "./Terminal.css";

interface TerminalProps {
  onCommand: (command: string) => Promise<string>;
  promptString?: string;
}

export const Terminal = ({ onCommand, promptString = "$" }: TerminalProps) => {
  const [history, setHistory] = useState<Array<{ type: "input" | "output"; content: string; prompt?: string }>>([
    { type: "output", content: "Welcome to Agents Kit Terminal v0.1.0" },
    { type: "output", content: "Type 'help' for available commands." },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isProcessing) {
      const command = input.trim();
      if (!command) return;

      setIsProcessing(true);
      setHistory((prev) => [...prev, { type: "input", content: command, prompt: promptString }]);
      setInput("");

      const output = await onCommand(command);
      setHistory((prev) => [...prev, { type: "output", content: output }]);
      setIsProcessing(false);
    }
  };

  return (
    <div className="terminal-container" onClick={() => document.getElementById("terminal-input")?.focus()}>
      <div className="terminal-scroll" ref={scrollRef}>
        {history.map((line, i) => (
          <div key={i} className={`terminal-line ${line.type}`}>
            {line.type === "input" && <span className="terminal-prompt">{line.prompt || "$"} </span>}
            <span className="terminal-content">{line.content}</span>
          </div>
        ))}
        {!isProcessing && (
          <div className="terminal-line input">
            <span className="terminal-prompt">{promptString} </span>
            <input
              id="terminal-input"
              type="text"
              className="terminal-input-field"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              autoComplete="off"
            />
          </div>
        )}
      </div>
    </div>
  );
};
