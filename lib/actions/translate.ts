"use server";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0
});

const systemTemplate = "You are a helpful and friendly translator, assisting language learners. Translate the following from {sourceLanguage} into natural, spoken {targetLanguage}.";

const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["user", "{text}"],
]);


export async function translateText({
    sourceLanguage,
    targetLanguage,
    text
}: {
    sourceLanguage: string;
    targetLanguage: string;
    text: string;
}): Promise<string> {

    if (!sourceLanguage || !targetLanguage || !text.trim()) {
        throw new Error('Missing required fields');
    }
    try {
        const prompt = await promptTemplate.invoke({
            sourceLanguage,
            targetLanguage,
            text
        });

        const response = await model.invoke(prompt);
        console.log(response.content)
        return JSON.parse(JSON.stringify(response.content));
    } catch (error: any) {
        console.error(error);
        throw new Error(error?.messages || 'Failed to generate prompt');
    }
}