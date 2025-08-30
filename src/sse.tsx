import { useEffect } from "react";
import { toast } from "react-toastify";
import { useUserSelector } from "./store/selector";

export function useSSE() {
  const user = useUserSelector((state) => state.user.user);

  useEffect(() => {
    if (!user) return; // Only start SSE if user exists

    const sse = new EventSource(
      `${window.__ENV__.GO_BASE_URL}${window.__ENV__.SSE_URL}`,
      { withCredentials: true }
    );

    sse.onmessage = (event) => {
      toast.info(event.data, { position: "top-right", autoClose: 5000 });
    };

    sse.onerror = (err) => {
      console.error("SSE error:", err);
      sse.close();
    };

    return () => {
      sse.close();
    };
  }, [user]);
}
