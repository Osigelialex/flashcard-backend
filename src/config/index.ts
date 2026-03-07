interface AppConfig {
  app: {
    port: number;
    isProduction: boolean;
    secretKey: string;
    geminiApiKey: string;
  };
}

export const appConfig: AppConfig = {
  app: {
    port: +process.env.PORT!,
    isProduction: process.env.NODE_ENV === "production",
    secretKey: process.env.SECRET_KEY!,
    geminiApiKey: process.env.GEMINI_API_KEY!,
  },
};
