import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function App() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", text: input };
    setChat(prev => [...prev, userMsg]);

    const message = input;
    setInput("");

    try {
      const res = await fetch(
        "https://meticulous-benevolence-production-1209.up.railway.app/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

      const data = await res.json();
      const botMsg: Message = { role: "bot", text: data.reply };
      setChat(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = { 
        role: "bot", 
        text: "Sorry, I couldn't connect to the server. Please try again." 
      };
      setChat(prev => [...prev, errorMsg]);
    }
  }

  function handleContactSubmit() {
    console.log("Form submitted:", formData);
    alert("Message sent successfully! We'll get back to you soon.");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: ""
    });
  }

  return (
    <div className="app">
      {!showChat && !showContact && (
        <div className="hero-section">
          <div className="hero-background">
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>
            <div className="gradient-orb orb-3"></div>
          </div>
          
          <nav className="navbar">
            <div className="nav-content">
              <div className="logo">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 14L21 9L12 4L3 9L12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 14V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 9V17L12 22L21 17V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>UniMate AI</span>
              </div>
              <button className="nav-button" onClick={() => setShowContact(true)}>
                Contact Us
              </button>
            </div>
          </nav>

          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Powered by Advanced AI
            </div>
            <h1 className="hero-title">
              Your Personal Academic
              <br />
              <span className="gradient-text">Assistant</span>
            </h1>
            <p className="hero-description">
              Get instant answers to your university questions. From course details to campus services,
              UniMate AI is here to help you navigate your academic journey.
            </p>
            <div className="hero-buttons">
              <button className="primary-button" onClick={() => setShowChat(true)}>
                <span>Start Chatting</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Instant Answers</h3>
                <p>Get responses in seconds</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>24/7 Available</h3>
                <p>Always here to help</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Smart Learning</h3>
                <p>Personalized assistance</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showContact && (
        <div className="contact-section">
          <div className="hero-background">
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>
          </div>
          
          <button className="back-button" onClick={() => setShowContact(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Home
          </button>

          <div className="contact-container">
            <div className="contact-header">
              <h2>Get in Touch</h2>
              <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            </div>

            <div className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="john.doe@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input 
                  type="text" 
                  placeholder="What is this regarding?"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea 
                  rows={5} 
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="button" 
                className="submit-button"
                onClick={handleContactSubmit}
              >
                Send Message
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {showChat && (
        <div className="chat-view">
          <div className="hero-background">
            <div className="gradient-orb orb-1"></div>
            <div className="gradient-orb orb-2"></div>
          </div>

          <button className="back-button" onClick={() => setShowChat(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Home
          </button>

          <div className="chat-container">
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
      )}
    </div>
  );
}