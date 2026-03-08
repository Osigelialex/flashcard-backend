import { GoogleGenAI, createUserContent } from "@google/genai";
import { logger } from "@lib/core/logger";
import { SYSTEM_PROMPT } from "./prompt";
import { HttpException } from "./error";
import { StatusCodes } from "http-status-codes";

export interface FlashcardResponse {
  topic: string;
  summary: string;
  cardCount: number;
  flashcards: {
    question: string;
    answer: string;
    type: "term" | "qa";
    bloomLevel: "recall" | "comprehension" | "application" | "analysis";
  }[];
}

export default class GeminiService {
  private client: any;

  constructor(geminiApiKey: string) {
    this.client = new GoogleGenAI({ apiKey: geminiApiKey });
  }

  public async generateFlashCards(
    input: string | { path: string; mimeType: string; displayName: string },
  ): Promise<FlashcardResponse> {
    try {
      let contents: any;

      if (typeof input === "string") {
        contents = input;
      } else {
        const uploadedFile = await this.client.files.upload({
          file: input.path,
          config: {
            mimeType: input.mimeType,
            displayName: input.displayName,
          },
        });

        contents = [
          {
            fileData: {
              fileUri: uploadedFile.uri,
              mimeType: uploadedFile.mimeType,
            },
          },
          {
            text: SYSTEM_PROMPT,
          },
        ];
      }

      const response = await this.client.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
        },
      });

      const text = response.text;
      return this.parseGeminiResponse(text);
    } catch (error) {
      logger.error(`Error generating flashcards: ${error}`);
      throw error;
    }
  }

  public parseGeminiResponse(response: string): FlashcardResponse {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : response;
      return JSON.parse(jsonString);
    } catch (error) {
      logger.error(`Error parsing Gemini response: ${response}`);
      throw new HttpException(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to parse flashcards response from Gemini",
      );
    }
  }
}
