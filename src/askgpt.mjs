import OpenAI from "openai";

const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

async function askgpt({prompt}) {
    const completion = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
    });
    
    return completion.choices[0].message.content;
}

export default askgpt;