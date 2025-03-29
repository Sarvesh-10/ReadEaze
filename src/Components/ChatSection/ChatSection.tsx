import React, { useState, useRef, useEffect, useContext } from "react";
import { FaPaperPlane, FaStopCircle } from "react-icons/fa";
import "./ChatSection.css"; // Ensure styles are properly applied
import { MessageContext } from "../../Contexts/MessageContext";

import ReactMarkdown from 'react-markdown';

interface ChatSectionProps {
  id: string;
}

const ChatSection = ({ id }: ChatSectionProps) => {
  const { messages, sendMessage, isStreaming, stopResponse,getMessages } = useContext(MessageContext) || {};
  const [input, setInput] = useState("");
  //werite a selection for user 
  // const {user} = useSelector((state: any) => state.user);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // console.log("HERE IN CHAT SECTION",user.id,id)
    
    getMessages && getMessages(id);
  },[])





  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      event?.preventDefault()
      if (isStreaming && stopResponse) stopResponse();
      else if (sendMessage) {
        setInput("");
        sendMessage(input,id);
      }
    }
  };
  
  
  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <h2 className="chat-header">Chapter Chatter</h2>
      <div className="messages-container">
        {(messages || []).map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.sender}`}>
            <ReactMarkdown>
              {msg.text}
            </ReactMarkdown>
            </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <input
          type="text"
          className="chat-input"
          value={input}
          onKeyDown={handleKeyDown}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          
        />
        <button className="send-button" onClick={isStreaming ? stopResponse : () => {sendMessage && sendMessage(input,id) && setInput("")}}>
        {isStreaming? <FaStopCircle/> : <FaPaperPlane/>}
        </button>
      </div>
    </div>
  );
};

export default ChatSection;
