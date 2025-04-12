import {NextRequest, NextResponse} from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


export async function POST(request: NextRequest) {
    const {metadata, ideas} = await request.json();

    const params = {
        title: metadata.title,
        description: metadata.description,
        image: metadata.image,
        ideas
    }

    const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: "You are a IP Goods product planning assistant.",
            },
            {
                role: "user",
                content: `Please provide 3 merchandise recommendations for the IP titled "${params.title}".
                Here is the IP more information:
                - Description: ${params.description},
                - IP Image URL: ${params.image},
                - More Ideas(Optional): ${params.ideas}.
                
                 For each recommendation, return the product details in the following JSON structure:
                 {
                    "productType": "type of the item", 
                    "productName": "name of the product",
                    "productSpec": "detailed specifications as JSON",
                    "productIdea": "creative ideas for the product",
                    "recommendationReason": "why this product is suitable for the IP",
                    "imageRequestPrompt": "A vivid product showcase image for DALL·E generation, describing the product's design, key features, colors, and background based on the IP context"
                 }
                 Ensure the response is in the format of an array like this 
                 (Please respond with raw JSON only, without any Markdown formatting like \`\`\`json.): 
                 [{...}, {...}, {...}, {...}, {...}]`,
            },
        ],
    });
    return NextResponse.json(response.choices[0].message.content, {status: 200})
}