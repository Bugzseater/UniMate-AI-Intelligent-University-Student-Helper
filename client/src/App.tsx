import { useState, useRef, useEffect } from "react";
import "./App.css";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function App() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", text: input };
    setChat(prev => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch(
        "https://meticulous-benevolence-production-1209.up.railway.app/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input })
        }
      );
      const data = await res.json();
      setChat(prev => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      setChat(prev => [
        ...prev,
        { role: "bot", text: "⚠️ Server error. Please try again." }
      ]);
    }
  }

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo">🧠 UniMate AI</div>
        <div className="nav-links">
          <span>Home</span>
          <span>Features</span>
          <span>Contact</span>
        </div>
      </nav>

      {/* CHAT CARD */}
      <div className="chat-container">

        <header className="chat-header">
          <div>
            <h1>UniMate AI</h1>
            <p>Your Academic Assistant</p>
          </div>
          <span className="online">● Online</span>
        </header>

        <div className="messages-container">
          {chat.length === 0 ? (
            <div className="empty-state">
              <h2>Start chatting 🚀</h2>
              <p>Ask about studies, expenses, life, or career.</p>
            </div>
          ) : (
            <div className="messages">
              {chat.map((m, i) => (
                <div key={i} className={`message ${m.role}`}>
                  <div className="bubble">
                    <pre>{m.text}</pre>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="input-container">
          <input
            placeholder="Ask UniMate anything..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>➤</button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        © 2025 UniMate AI • Built for Students
      </footer>

    </div>
  );
}
