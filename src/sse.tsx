import { useEffect } from "react";
import { toast } from "react-toastify";

export function useSSE() {
  useEffect(() => {

    const sse = new EventSource(`${window.__ENV__.GO_BASE_URL}${window.__ENV__.SSE_URL}`, { withCredentials: true });

    sse.onmessage = (event) => {
      // Display toast notification on each update
      toast.info(event.data, { position: "top-right", autoClose: 5000 });
    };

    sse.onerror = (err) => {
      console.error("SSE error:", err);
      sse.close(); // Optional: handle reconnection manually if needed
    };

    return () => {
      sse.close();
    };
  }, []);
}
