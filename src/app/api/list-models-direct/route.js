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

    // Try to list models with different API versions
    const versions = ['v1beta', 'v1', 'v1alpha'];
    const results = [];

    for (const version of versions) {
      try {
        const url = `https://generativelanguage.googleapis.com/${version}/models?key=${apiKey}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();

        results.push({
          version: version,
          status: response.status,
          success: response.ok,
          data: data
        });

        // If successful, no need to try other versions
        if (response.ok) {
          break;
        }
      } catch (error) {
        results.push({
          version: version,
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
    console.error('List models error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
