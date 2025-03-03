"use client";

import { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { motion } from "framer-motion";
import "./chatbox.css";

export default function ChatboxWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const toggleChatbox = () => setIsOpen((prev) => !prev);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/get_advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from AI.");
      }

      const data = await response.json();
      const botMessage = { text: data.response || "AI service is unavailable.", sender: "bot" };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { text: "Error reaching AI service.", sender: "bot" }]);
    }

    setIsTyping(false);
  };

  return (
    <div className="chatbox-container">
      <motion.div
        className="chat-icon"
        whileHover={{ scale: 1.1 }}
        onClick={toggleChatbox}
        aria-label="Open chat"
      >
        <MessageCircle size={28} />
      </motion.div>

      {isOpen && (
        <motion.div
          className="chatbox"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{ position: "absolute", bottom: "60px", right: "0" }}
        >
          <div className="chatbox-header">
            <h4>AI Chat Assistant</h4>
            <button className="close-btn" onClick={toggleChatbox} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>

          <div className="chatbox-body">
            {messages.map((msg, index) => (
              <motion.div key={index} className={`message ${msg.sender}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {msg.text}
              </motion.div>
            ))}
            {isTyping && <div className="typing-indicator">AI is typing...</div>}
          </div>

          <div className="chatbox-footer">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="chat-input"
              aria-label="Chat input"
            />
            <button className="send-button" onClick={sendMessage} aria-label="Send message">
              <Send size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
  