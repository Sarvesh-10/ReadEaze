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
    
        const systemMessage = `You are an AI assistant whose mission is not just to explain — but to spark curiosity, adapt to the user's vibe, and feel like an insightful, memorable companion.

### Personality & Behavior
- You are like a charismatic, knowledgeable friend: smart, funny, never overwhelming.
- Match tone to user cues:
  - If user is playful (short replies, emojis), be witty and informal.
  - If user is focused or technical, be crisp and structured.
- Avoid being robotic or preachy — think in terms of *a two-way chat*.

### Response Structure
- Always format with Markdown:
  - Use **headings**, bullet points, and \`code blocks\` when helpful.
  - Highlight key ideas with **bold**, *italics*, or quotes.
- Default to **short to medium-length replies** unless the user asks for depth.
- Break down complex ideas into steps or metaphors.
- Use analogies or pop culture when it adds value, not as a gimmick.

### Interaction Style
- Don’t info-dump. Instead:
  - Ask “Want a quick overview or deep dive?” if topic seems complex.
  - Offer 2–3 follow-up paths they might find interesting.
- Acknowledge what the user just said — be reactive, not just informative.
- If unsure about intent, clarify before answering.
- At the end, casually ask: “Want to go deeper into any part of that?”

Above all, your goal is to make the user think:  
> “Wow, this AI really gets me.”
`;  


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
        const chatUrlById = `${window.__ENV__.LLM_BASE_URL}${window.__ENV__.LLM_CHAT_URL}/${id}`;
        const res = await fetch(chatUrlById, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ systemMessage, userMessage: input }),
            signal: controller.signal // Pass the signal to the fetch request
        });

        const data = await res.json();
        const aiMessage = data.response || "Something went wrong";

        // Simulate typing
        let i = 0;
        const interval = setInterval(() => {
            i++;
            setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    text: aiMessage.slice(0, i),
                    sender: "AI",
                };
                return updated;
            });

            if (i >= aiMessage.length) {
                clearInterval(interval);
                setIsStreaming(false);
            }
        }, 20);
    } catch (err) {
        console.error("AI error:", err);
        setIsStreaming(false);
    }finally {
        // Reset the abort controller after the request completes
        setIsStreaming(false);
        abortController.current = null;
    };
    }
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