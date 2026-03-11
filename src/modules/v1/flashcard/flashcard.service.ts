import { prisma } from "@lib/core/prisma";
import GeminiService from "@lib/core/gemini";
import { appConfig } from "@config/index";
import { PaginationDTO } from "@lib/core/dto";
import { appConstants } from "@config/constants";
import { HttpException } from "@lib/core/error";
import { StatusCodes } from "http-status-codes";
import { escapeCsv } from "@lib/core/helpers";
import {
  QueryFlashCardDTO,
  UpdateFlashCardDTO,
  UpdateFlashcardSetDTO,
} from "./flashcard.dto";

export class FlashcardService {
  private readonly geminiService: GeminiService = new GeminiService(
    appConfig.app.geminiApiKey,
  );

  public async getFlashCardSetById(id: string, dto: QueryFlashCardDTO) {
    const where: any = {};
    if (dto.type) where.type = dto.type;
    if (dto.bloomLevel) where.bloomLevel = dto.bloomLevel;

    const flashCardSet = await prisma.flashCardSet.findUnique({
      where: { id },
      include: {
        flashCards: {
          where,
        },
      },
    });

    if (!flashCardSet) {
      throw new HttpException(
        StatusCodes.NOT_FOUND,
        "Flash card set not found",
      );
    }

    return flashCardSet;
  }

  public async getFlashCardSets(userId: string, dto: PaginationDTO) {
    const perPage = dto.perPage || appConstants.DEFAULT_PAGE_LIMIT;
    const skip = (dto.page - 1) * perPage;

    const [total, flashCardSet] = await Promise.all([
      prisma.flashCardSet.count(),
      prisma.flashCardSet.findMany({
        skip,
        take: perPage,
        where: { userId },
      }),
    ]);

    return {
      data: flashCardSet,
      meta: {
        total,
        perPage,
        page: dto.page,
        pageCount: Math.ceil(total / perPage),
        skipped: skip,
      },
    };
  }

  public async updateFlashCardSet(setId: string, dto: UpdateFlashcardSetDTO) {
    const flashCardSet = await prisma.flashCardSet.findUnique({
      where: { id: setId },
    });

    if (!flashCardSet) {
      throw new HttpException(
        StatusCodes.NOT_FOUND,
        "Flash card set not found",
      );
    }

    const updateFlashCardSet = await prisma.flashCardSet.update({
      where: { id: setId },
      data: dto,
    });

    return updateFlashCardSet;
  }

  public async deleteFlashCardSet(setId: string) {
    const flashCardSet = await prisma.flashCardSet.findUnique({
      where: { id: setId },
    });

    if (!flashCardSet) {
      throw new HttpException(
        StatusCodes.NOT_FOUND,
        "Flash card set not found",
      );
    }

    await prisma.flashCardSet.delete({
      where: { id: setId },
    });
  }

  public async generateAndSaveFlashcards(
    userId: string,
    input: string | { path: string; mimeType: string; displayName: string },
  ) {
    const flashcardResponse =
      await this.geminiService.generateFlashCards(input);

    const flashcardSet = await prisma.flashCardSet.create({
      data: {
        topic: flashcardResponse.topic,
        summary: flashcardResponse.summary,
        userId: userId,
        flashCards: {
          create: flashcardResponse.flashcards.map((card) => ({
            question: card.question,
            answer: card.answer,
            type: card.type === "term" ? "term" : "qa",
            bloomLevel: [
              "recall",
              "comprehension",
              "application",
              "analysis",
            ].includes(card.bloomLevel)
              ? card.bloomLevel
              : "recall",
            userId: userId,
          })),
        },
      },
      include: {
        flashCards: true,
      },
    });

    return {
      id: flashcardSet.id,
      ...flashcardResponse,
    };
  }

  public async updateFlashCard(flashcardId: string, dto: UpdateFlashCardDTO) {
    const flashcard = await prisma.flashCard.findUnique({
      where: { id: flashcardId },
    });

    if (!flashcard) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Flashcard not found");
    }

    const updatedFlashCard = await prisma.flashCard.update({
      where: { id: flashcardId },
      data: dto,
    });

    return updatedFlashCard;
  }

  public async deleteFlashCard(flashcardId: string) {
    const flashcard = await prisma.flashCard.findUnique({
      where: { id: flashcardId },
    });

    if (!flashcard) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Flashcard not found");
    }

    await prisma.flashCard.delete({
      where: { id: flashcardId },
    });
  }

  public async exportFlashCardSetToCsv(setId: string) {
    const flashCardSet = await prisma.flashCardSet.findUnique({
      where: { id: setId },
      include: {
        flashCards: true,
      },
    });

    if (!flashCardSet) {
      throw new HttpException(
        StatusCodes.NOT_FOUND,
        "Flash card set not found",
      );
    }

    let csvContent = "";

    flashCardSet.flashCards.forEach((card) => {
      const front = escapeCsv(card.question);
      const back = escapeCsv(card.answer);
      csvContent += `${front},${back}\n`;
    });

    const filename = `${flashCardSet.topic.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_flashcards.csv`;

    return {
      csvContent,
      filename,
    };
  }
}
