export {};

declare global {
  interface Window {
    __ENV__: {
      GO_BASE_URL: string;
      LOGIN_URL: string;
      SIGNUP_URL: string;
      GET_BOOKS: string;
      UPLOAD_BOOK: string;
      LOGOUT_URL: string;
      CHAT_URL: string;
      LLM_BASE_URL: string;
      LLM_CHAT_URL: string;
      LLM_CHAT_HISTORY_URL: string;
      LLM_GENERATE_IMAGE_URL: string;
      REFRESH_TOKEN_URL: string;
    };
  }
}
