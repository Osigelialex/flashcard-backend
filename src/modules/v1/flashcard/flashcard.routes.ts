import { Router } from "express";
import FlashcardController from "./flashcard.controller";
import dtoValidationMiddleware from "@middlewares/validator.middleware";
import {
  QueryFlashCardDTO,
  UpdateFlashCardDTO,
  UpdateFlashcardSetDTO,
} from "./flashcard.dto";
import { authMiddleware } from "@middlewares/auth.middlewares";
import { PaginationDTO } from "@lib/core/dto";
import { upload } from "@lib/core/storage";
import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";
import { HttpException } from "@lib/core/error";
import { StatusCodes } from "http-status-codes";

const router: Router = Router();

router.post(
  "/",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    upload.single("note")(req, res, (err) => {
      if (err instanceof MulterError || err instanceof HttpException) {
        return next(new HttpException(StatusCodes.BAD_REQUEST, err.message));
      }
      if (err) {
        return next(new HttpException(StatusCodes.BAD_REQUEST, err.message));
      }
      next();
    });
  },
  FlashcardController.generate,
);

router.patch(
  "/:id",
  authMiddleware,
  dtoValidationMiddleware(UpdateFlashCardDTO),
  FlashcardController.updateFlashCard,
);

router.delete("/:id", authMiddleware, FlashcardController.deleteFlashCard);

router.get(
  "/sets",
  authMiddleware,
  dtoValidationMiddleware(PaginationDTO, "query"),
  FlashcardController.getFlashCardSets,
);

router.get(
  "/sets/:id",
  authMiddleware,
  dtoValidationMiddleware(QueryFlashCardDTO, "query"),
  FlashcardController.getFlashCardSetById,
);

router.patch(
  "/sets/:id",
  authMiddleware,
  dtoValidationMiddleware(UpdateFlashcardSetDTO),
  FlashcardController.updateFlashCardSet,
);

router.delete(
  "/sets/:id",
  authMiddleware,
  FlashcardController.deleteFlashCardSet,
);

router.get("/sets/:id/export", authMiddleware, FlashcardController.exportToCsv);

export default router;
