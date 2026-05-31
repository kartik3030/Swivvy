import { Request, Response } from "express";
import googleAI from "../config/LLM";

const handleLLMResponse = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { skills } = req.body;

        const response = await googleAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
                Generate a short GENZ bio according to the Skills.
                Skills: ${skills}
                
                Keep it under 15 words.
            `,
        });

        res.status(200).json({
            bio: response.text,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to generate bio",
        });
    }
};

export default handleLLMResponse;