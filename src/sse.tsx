import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./Contexts/AuthContext";

export function useSSE() {
const {isLoggedIn} = useAuth()!;
const sseRef = useRef<EventSource | null>(null);
const retryTimeoutRef = useRef<number | null>(null);
  useEffect(() => {
    if(!isLoggedIn){
      if(sseRef.current){
        (sseRef.current as EventSource).close();
        sseRef.current = null;
      }
      return;
    }
        let retryDelay = 3000; // start with 3s

    const startSSE = () => {
    const sse = new EventSource(
      `${window.__ENV__.GO_BASE_URL}${window.__ENV__.SSE_URL}`,
      { withCredentials: true }
    );
    sseRef.current = sse; 

    sse.onmessage = (event) => {
      toast.info(event.data, { position: "top-right", autoClose: 5000 });
    };

    sse.onerror = (err) => {
      console.error("SSE error:", err);
      sse.close();
      sseRef.current = null;

      if(!retryTimeoutRef.current){
        retryTimeoutRef.current = setTimeout(() => {
          console.log("Attempting to reconnect to SSE...");
          retryTimeoutRef.current = null;
          retryDelay = Math.min(retryDelay * 2, 60000);
          startSSE();

      },retryDelay);
      }
    };
  };
  startSSE();

    return () => {
      if (sseRef.current) {
        sseRef.current.close();
        sseRef.current = null;
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, [isLoggedIn]);
}
