import { NextResponse } from 'next/server';

/**
 * Proxy endpoint to serve 3D models from Tripo
 * This is needed to bypass CORS issues when loading .glb files
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const modelUrl = searchParams.get('url');

    if (!modelUrl) {
      return NextResponse.json(
        { error: 'Model URL is required' },
        { status: 400 }
      );
    }

    console.log('Proxying model from:', modelUrl);

    // Fetch the model file from Tripo
    const response = await fetch(modelUrl, {
      method: 'GET',
      headers: {
        'Accept': 'model/gltf-binary,application/octet-stream,*/*'
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch model:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Failed to fetch model: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Get the model data as array buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Return the model with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'model/gltf-binary',
        'Content-Length': buffer.length.toString(),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=31536000, immutable' // Cache for 1 year
      }
    });

  } catch (error) {
    console.error('Error proxying model:', error);
    return NextResponse.json(
      { error: `Error proxying model: ${error.message}` },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
