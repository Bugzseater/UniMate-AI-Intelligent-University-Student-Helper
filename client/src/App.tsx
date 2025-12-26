import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function App() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", text: input };
    setChat(prev => [...prev, userMsg]);

    const message = input;
    setInput("");

    const res = await axios.post<{ reply: string }>(
      "http://localhost:5000/chat",
      { message }
    );

    const botMsg: Message = { role: "bot", text: res.data.reply };
    setChat(prev => [...prev, botMsg]);
  }

  return (
    <div className="app">
      <div className="chat-container">
        {/* Header */}
        <header className="chat-header">
          <div className="header-content">
            <div className="logo">
              <div className="logo-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M12 14L21 9L12 4L3 9L12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 14V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 9V17L12 22L21 17V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="logo-text">
                <h1>UniMate AI</h1>
                <p>Your Academic Assistant</p>
              </div>
            </div>
            <div className="status">
              <div className="status-indicator"></div>
              <span>Online</span>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="messages-container">
          {chat.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 10H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M8 14H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h2>Start a Conversation</h2>
              <p>Ask about courses, deadlines, campus services, or any university-related questions.</p>
            </div>
          ) : (
            <div className="messages">
              {chat.map((m, i) => (
                <div key={i} className={`message-wrapper ${m.role}`}>
                  <div className="message-avatar">
                    {m.role === "user" ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M19 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div className="message-bubble">
                    <div className="message-text">{m.text}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="input-container">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Ask UniMate anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <button 
              onClick={sendMessage}
              disabled={!input.trim()}
              className="send-button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="input-hint">
            Press Enter to send • Shift + Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}