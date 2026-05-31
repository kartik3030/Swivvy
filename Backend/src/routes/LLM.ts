import express from "express";
import handleLLMResponse from "../controller/LLM";
const router = express.Router()

router.post("/LLM", handleLLMResponse)

export default router;