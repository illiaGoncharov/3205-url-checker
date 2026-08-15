// Роуты заданий
import { Router } from "express";

const router = Router();

// Создать задание
router.post("/", (req, res) => {});

// Список
router.get("/", (req, res) => {});

// Одно задание
router.get("/:id", (req, res) => {});

// Отменить
router.delete("/:id", (req, res) => {});

export default router;
