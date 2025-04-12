import {NextRequest, NextResponse} from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


export async function POST(request: NextRequest) {
    const {prompt} = await request.json();


    const response = await client.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
    });


    return NextResponse.json(response.data[0], {status: 200})
}