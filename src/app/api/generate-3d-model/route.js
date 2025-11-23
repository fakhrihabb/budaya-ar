import { NextResponse } from 'next/server';
import {
  getCachedModel,
  findSimilarModel,
  saveModelToCache,
  incrementUsageCount
} from '@/lib/modelCache';

/**
 * API endpoint untuk generate 3D model menggunakan Tripo AI
 * Dengan cache system untuk hemat credit
 * Docs: https://platform.tripo3d.ai/docs
 */
export async function POST(request) {
  try {
    const {
      prompt,
      title = '',
      content = '',
      artStyle = 'low-poly', // Changed to low-poly untuk hemat credit
      negativePrompt = 'high-poly, complex geometry, too many vertices',
      useCache = true
    } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt tidak ditemukan' },
        { status: 400 }
      );
    }

    // ===== CACHE CHECK =====
    if (useCache && title && content) {
      console.log('Checking cache for similar models...');

      // 1. Check exact match
      const exactMatch = getCachedModel(title, content);
      if (exactMatch) {
        console.log('✅ Exact match found in cache! Reusing model.');
        incrementUsageCount(exactMatch.cacheKey || '');

        return NextResponse.json({
          success: true,
          cached: true,
          exactMatch: true,
          taskId: exactMatch.taskId,
          modelUrl: exactMatch.modelUrl,
          thumbnailUrl: exactMatch.thumbnailUrl,
          message: 'Model ditemukan di cache (exact match). Credit saved! ✨'
        });
      }

      // 2. Check similarity match (70% threshold)
      const similarModel = findSimilarModel(title, content, 70);
      if (similarModel) {
        console.log(`✅ Similar model found (${similarModel.similarity}% match)! Reusing model.`);
        incrementUsageCount(similarModel.cacheKey);

        return NextResponse.json({
          success: true,
          cached: true,
          exactMatch: false,
          similarity: similarModel.similarity,
          taskId: similarModel.taskId,
          modelUrl: similarModel.modelUrl,
          thumbnailUrl: similarModel.thumbnailUrl,
          message: `Model serupa ditemukan (${similarModel.similarity}% match). Credit saved! ✨`
        });
      }

      console.log('No similar models found in cache. Generating new model...');
    }

    // ===== GENERATE NEW MODEL =====
    const apiKey = process.env.TRIPO_API_KEY;
    if (!apiKey || apiKey === 'your_tripo_api_key_here') {
      console.error('Tripo API key not configured');
      return NextResponse.json(
        { error: 'Tripo API key belum dikonfigurasi. Silakan tambahkan TRIPO_API_KEY di file .env' },
        { status: 500 }
      );
    }

    console.log('Creating NEW 3D model with Tripo AI...');
    console.log('Prompt:', prompt.substring(0, 100));
    console.log('Style:', artStyle);

    // Step 1: Create text-to-3D task
    const createResponse = await fetch('https://api.tripo3d.ai/v2/openapi/task', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'text_to_model',
        prompt: prompt,
        negative_prompt: negativePrompt,
        // Tripo doesn't use art_style in the same way, but we can add it to the prompt
      })
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      console.error('Tripo API Error:', errorData);
      return NextResponse.json(
        { error: `Tripo API Error: ${JSON.stringify(errorData)}` },
        { status: createResponse.status }
      );
    }

    const taskData = await createResponse.json();
    console.log('Task created:', taskData);

    return NextResponse.json({
      success: true,
      cached: false,
      taskId: taskData.data?.task_id || taskData.task_id,
      title: title,
      content: content,
      message: 'Model 3D baru sedang dibuat. Gunakan task ID untuk check status.'
    });

  } catch (error) {
    console.error('Error generating 3D model:', error);
    return NextResponse.json(
      { error: `Gagal membuat model 3D: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint untuk check status task
 * Auto-save ke cache saat model selesai
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    const title = searchParams.get('title') || '';
    const content = searchParams.get('content') || '';

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID tidak ditemukan' },
        { status: 400 }
      );
    }

    const apiKey = process.env.TRIPO_API_KEY;
    if (!apiKey || apiKey === 'your_tripo_api_key_here') {
      return NextResponse.json(
        { error: 'Tripo API key belum dikonfigurasi' },
        { status: 500 }
      );
    }

    // Check task status
    const statusResponse = await fetch(`https://api.tripo3d.ai/v2/openapi/task/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      }
    });

    if (!statusResponse.ok) {
      const errorData = await statusResponse.json();
      console.error('Tripo API Error:', errorData);
      return NextResponse.json(
        { error: `Tripo API Error: ${JSON.stringify(errorData)}` },
        { status: statusResponse.status }
      );
    }

    const statusData = await statusResponse.json();
    const taskInfo = statusData.data || statusData;
    console.log('Task status:', taskInfo.status);

    // ===== SAVE TO CACHE WHEN SUCCEEDED =====
    if (taskInfo.status === 'success' && title && content) {
      const modelUrl = taskInfo.output?.pbr_model || taskInfo.result?.pbr_model?.url;
      const thumbnailUrl = taskInfo.thumbnail || taskInfo.output?.rendered_image;

      if (modelUrl) {
        console.log('✅ Model generation succeeded! Saving to cache...');

        try {
          saveModelToCache(title, content, {
            modelUrl: modelUrl,
            thumbnailUrl: thumbnailUrl,
            taskId: taskId
          });
          console.log('Cache saved successfully!');
        } catch (cacheError) {
          console.error('Error saving to cache:', cacheError);
          // Don't fail the request if cache save fails
        }
      }
    }

    // Map Tripo status to Meshy-compatible format
    const statusMap = {
      'queued': 'PENDING',
      'running': 'IN_PROGRESS',
      'success': 'SUCCEEDED',
      'failed': 'FAILED',
      'cancelled': 'FAILED'
    };

    return NextResponse.json({
      success: true,
      status: statusMap[taskInfo.status] || taskInfo.status.toUpperCase(),
      progress: taskInfo.progress || (taskInfo.status === 'success' ? 100 : 0),
      modelUrl: taskInfo.output?.pbr_model || taskInfo.result?.pbr_model?.url || null,
      thumbnailUrl: taskInfo.thumbnail || taskInfo.output?.rendered_image || null,
      data: statusData
    });

  } catch (error) {
    console.error('Error checking task status:', error);
    return NextResponse.json(
      { error: `Gagal mengecek status: ${error.message}` },
      { status: 500 }
    );
  }
}
