import { Router } from "express";
import FlashcardController from "./flashcard.controller";
import dtoValidationMiddleware from "@middlewares/validator.middleware";
import { GenerateFlashcardDto } from "./flashcard.dto";
import { authMiddleware } from "@middlewares/auth.middlewares";
import { PaginationDTO } from "@lib/core/dto";

const router: Router = Router();

router.post(
  "/",
  authMiddleware,
  dtoValidationMiddleware(GenerateFlashcardDto),
  FlashcardController.generate,
);

router.get(
  "/sets",
  authMiddleware,
  dtoValidationMiddleware(PaginationDTO, "query"),
  FlashcardController.getFlashCardSets,
);

router.get(
  "/sets/:id",
  authMiddleware,
  FlashcardController.getFlashCardSetById,
);

export default router;
