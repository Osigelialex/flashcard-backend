import { Router } from "express";
import authRoutes from "./auth/auth.routes";
import flashcardRoutes from "./flashcard/flashcard.routes";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/flashcards", flashcardRoutes);

export default router;
