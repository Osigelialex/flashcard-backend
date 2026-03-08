import { prisma } from "@lib/core/prisma";
import GeminiService from "@lib/core/gemini";
import { appConfig } from "@config/index";
import { PaginationDTO } from "@lib/core/dto";
import { appConstants } from "@config/constants";
import { HttpException } from "@lib/core/error";
import { StatusCodes } from "http-status-codes";
import { UpdateFlashCardDTO } from "./flashcard.dto";

export class FlashcardService {
  private readonly geminiService: GeminiService = new GeminiService(
    appConfig.app.geminiApiKey,
  );

  public async getFlashCardSetById(id: string) {
    const flashCardSet = await prisma.flashCardSet.findUnique({
      where: { id },
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

  public async generateAndSaveFlashcards(userId: string, notes: string) {
    const flashcardResponse =
      await this.geminiService.generateFlashCards(notes);

    const flashcardSet = await prisma.flashCardSet.create({
      data: {
        topic: flashcardResponse.topic,
        summary: flashcardResponse.summary,
        userId: userId,
        flashCards: {
          create: flashcardResponse.flashcards.map((card) => ({
            question: card.question,
            answer: card.answer,
            type: card.type,
            bloomLevel: card.bloomLevel,
            userId: userId,
          })),
        },
      },
      include: {
        flashCards: true,
      },
    });

    return {
      ...flashcardResponse,
      id: flashcardSet.id,
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
}
