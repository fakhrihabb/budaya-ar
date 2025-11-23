import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const results = [];

  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    console.log('API Key exists:', !!apiKey);
    console.log('API Key length:', apiKey?.length);

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'API key not found',
        env: Object.keys(process.env).filter(k => k.includes('GEMINI'))
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Try different models
    const modelsToTry = [
      'gemini-pro',
      'gemini-pro-vision',
      'models/gemini-pro',
      'models/gemini-pro-vision'
    ];

    for (const modelName of modelsToTry) {
      try {
        console.log(`Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say hello in Indonesian');
        const response = await result.response;
        const text = response.text();

        results.push({
          model: modelName,
          success: true,
          response: text
        });
      } catch (error) {
        results.push({
          model: modelName,
          success: false,
          error: error.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      results: results
    });

  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      results: results
    }, { status: 500 });
  }
}
