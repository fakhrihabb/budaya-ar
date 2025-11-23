import { NextResponse } from 'next/server';

export async function GET(request) {
  const results = [];

  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'API key not found'
      });
    }

    // Try multiple API versions and endpoints
    const testsToRun = [
      {
        name: 'v1beta gemini-pro',
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`
      },
      {
        name: 'v1 gemini-pro',
        url: `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`
      },
      {
        name: 'v1alpha gemini-pro',
        url: `https://generativelanguage.googleapis.com/v1alpha/models/gemini-pro:generateContent?key=${apiKey}`
      }
    ];

    for (const test of testsToRun) {
      try {
        const response = await fetch(test.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: 'Say hello in Indonesian'
              }]
            }]
          })
        });

        const data = await response.json();

        results.push({
          test: test.name,
          status: response.status,
          success: response.ok,
          data: response.ok ? data.candidates?.[0]?.content?.parts?.[0]?.text : data
        });
      } catch (error) {
        results.push({
          test: test.name,
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
    console.error('Direct fetch error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      results: results
    }, { status: 500 });
  }
}
