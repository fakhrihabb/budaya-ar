import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'API key not found'
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // List all available models
    const models = await genAI.listModels();

    return NextResponse.json({
      success: true,
      models: models.map(m => ({
        name: m.name,
        displayName: m.displayName,
        description: m.description,
        supportedGenerationMethods: m.supportedGenerationMethods
      }))
    });

  } catch (error) {
    console.error('List models error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
