import { Request, Response } from "express";
import { FlashcardService } from "./flashcard.service";
import { StatusCodes } from "http-status-codes";
import fs from "fs";

export default class FlashcardController {
  private static flashcardService = new FlashcardService();

  static getFlashCardSetById = async (req: Request, res: Response) => {
    const data = await this.flashcardService.getFlashCardSetById(
      req.params.id as any,
      req.validated?.query,
    );

    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Flashcard set retrieved",
      data,
    });
  };

  static getFlashCardSets = async (req: Request, res: Response) => {
    const dto = (req as any).validated?.query || req.query;
    const { data, meta } = await this.flashcardService.getFlashCardSets(
      req.user.id,
      dto as any,
    );

    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Flashcard sets retrieved",
      data,
      meta,
    });
  };

  static updateFlashCardSet = async (req: Request, res: Response) => {
    const result = await this.flashcardService.updateFlashCardSet(
      req.params.id as any,
      req.body,
    );
    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Flashcard sets retrieved",
      data: result,
    });
  };

  static deleteFlashCardSet = async (req: Request, res: Response) => {
    const result = await this.flashcardService.deleteFlashCardSet(
      req.params.id as any,
    );
    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Flashcard set deleted",
      data: null,
    });
  };

  static generate = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "Provide a file upload",
      });
    }

    try {
      const input = {
        path: file.path,
        mimeType: file.mimetype,
        displayName: file.originalname,
      };

      const data = await this.flashcardService.generateAndSaveFlashcards(
        userId,
        input,
      );

      return res.status(StatusCodes.CREATED).json({
        status: true,
        message: "Flashcards generated successfully",
        data,
      });
    } finally {
      if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    }
  };

  static updateFlashCard = async (req: Request, res: Response) => {
    const result = await this.flashcardService.updateFlashCard(
      req.params.id as any,
      req.body,
    );
    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Flashcard updated successfully",
      data: result,
    });
  };

  static deleteFlashCard = async (req: Request, res: Response) => {
    const result = await this.flashcardService.deleteFlashCard(
      req.params.id as any,
    );
    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Flashcard deleted",
      data: null,
    });
  };

  static exportToCsv = async (req: Request, res: Response) => {
    const { csvContent, filename } =
      await this.flashcardService.exportFlashCardSetToCsv(req.params.id as any);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    return res.status(StatusCodes.OK).send(csvContent);
  };
}
