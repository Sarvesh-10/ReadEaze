import { createContext, ReactNode, useEffect, useRef, useState } from "react";


interface Message {
    text: string;
    sender: "user"| "AI"
}


interface MessageContextType{
    messages: Message[];
    sendMessage: (input: string,id:string) => void;
    isStreaming: boolean;
    stopResponse: () => void;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
    getMessages: (bookId: string) => void;
}

export const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({children}:{children: ReactNode}) => {
    const [messages, setMessages] = useState<Message[]>([
        {text: "Hello! Need help with anything?", sender: "AI"}
    ]);
    const [isStreaming, setIsStreaming] = useState(false);
    const abortController = useRef<AbortController | null>(null);


    useEffect(() => {
        return () => {
            if (abortController.current) {
                abortController.current.abort();
            }
        };
    }, []);
    const sendMessage = async (input:string,id:string) => {
        if (input.trim() === "") return;
    
        // Stop any ongoing response if the user sends a new message
        if (abortController.current) {
            abortController.current.abort();
        }
    
        const systemMessage = `You are an AI assistant whose mission is not just to explain text but to make the user genuinely enjoy talking to you. Your goal is to be insightful, entertaining, and memorable.  

- Use **Markdown** formatting in your responses for clear and visually appealing explanations.  
- Structure responses with:  
  - **Headings** for key sections (e.g., ## Explanation)  
  - **Bullet points** for clarity  
  - **Bold** and *italic* text for emphasis  
  - **Code blocks** for technical content or examples  
  - **Lists and sub-lists** for step-by-step breakdowns  
  - Add a touch of humor, wit, or personality where appropriate  
- Imagine you’re a charismatic, knowledgeable friend who explains things in a fun and relatable way.  
- Adapt your style based on the user's mood—be more playful if the user seems relaxed, and more serious if they seem focused.  
- Use analogies, metaphors, and pop culture references to make explanations vivid and interesting.  
- Be proactive—suggest interesting facts, related concepts, or connections to keep the conversation engaging.  
- Make the user feel heard—acknowledge questions and tailor responses to their curiosity.  
- Leave the user with a sense of curiosity and excitement to learn more.  
- At the end of each explanation, casually check if the user needs more clarification or has any follow-up questions.  
- Above all, make the user think: "Wow, this AI is awesome!"`;  


        const userMessage = input;
    
        setMessages((prevMessages) => [
            ...prevMessages,
            { text: input, sender: "user" },
            { text: "", sender: "AI" } // Placeholder for AI response
        ]);
    
        
        setIsStreaming(true);
    
        // Create a new AbortController instance for this request
        const controller = new AbortController();
        abortController.current = controller;
    
        try {
            
            const chatUrlById = window.__ENV__.LLM_BASE_URL + window.__ENV__.LLM_CHAT_URL + `/${id}`;
            const response = await fetch(chatUrlById, {
                method: "POST",
                // mode:"cors",
                credentials:"include",
                headers: { 
                    "Content-Type": "application/json",
                    // "X-Force-Preflight": "true"
                },
                body: JSON.stringify({ systemMessage, userMessage }),
                signal: controller.signal // Pass signal for aborting
            });
    
            if (!response.body) throw new Error("No response body received");
    
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let aiMessage = "";
    
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
    
                const chunk = decoder.decode(value, { stream: true });
    
                // Typing effect: add characters one by one
                for (let i = 0; i < chunk.length; i++) {
                    aiMessage += chunk[i];
                    setTimeout(() => {
                        setMessages((prevMessages) => {
                            const updatedMessages = [...prevMessages];
                            updatedMessages[updatedMessages.length - 1] = { text: aiMessage, sender: "AI" };
                            return updatedMessages;
                        });
                    }, i * 10); // ✅ Adjust for smoother typing
                }
            }
        } catch (error) {
            if ((error as Error).name === "AbortError") {
                console.log("Fetch request was aborted");
            } else {
                console.error("Error fetching AI response:", error);
            }
        } finally {
            setIsStreaming(false);
        }
    };
    const stopResponse = () => {
        if (abortController.current) {
          abortController.current.abort();
          abortController.current = null;
        }
        setIsStreaming(false);
      };
      const getMessages = async (bookId: string) => {
        try {
            const getChatHistoryUrl = window.__ENV__.LLM_BASE_URL + window.__ENV__.LLM_CHAT_HISTORY_URL + `/${bookId}`;
            const response = await fetch(getChatHistoryUrl, {
                method: "GET",
                credentials: "include", // ✅ Cookie will handle user identification
                headers: { "Content-Type": "application/json" }
            });
    
            if (!response.ok) {
                throw new Error(`Failed to fetch messages: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            const mappedMessages = data.history.map((msg: any) => ({
                text: msg.content,
                sender: msg.role === "user" ? "user" : "AI"
            }));
    
            setMessages(mappedMessages);
            // setMessages(data.history);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };
    

    return(
        <MessageContext.Provider value={{messages, sendMessage, isStreaming, stopResponse,setMessages,getMessages}}>
            {children}
        </MessageContext.Provider>
    );

}