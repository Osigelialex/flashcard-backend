import { Router } from "express";
import FlashcardController from "./flashcard.controller";
import dtoValidationMiddleware from "@middlewares/validator.middleware";
import {
  GenerateFlashcardDto,
  QueryFlashCardDTO,
  UpdateFlashCardDTO,
  UpdateFlashcardSetDTO,
} from "./flashcard.dto";
import { authMiddleware } from "@middlewares/auth.middlewares";
import { PaginationDTO } from "@lib/core/dto";

const router: Router = Router();

router.post(
  "/",
  authMiddleware,
  dtoValidationMiddleware(GenerateFlashcardDto),
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

export default router;
