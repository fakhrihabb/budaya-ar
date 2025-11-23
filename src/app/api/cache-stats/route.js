import { NextResponse } from 'next/server';
import { getCacheStats, clearOldCache } from '@/lib/modelCache';

/**
 * GET - Get cache statistics
 */
export async function GET(request) {
  try {
    const stats = getCacheStats();

    return NextResponse.json({
      success: true,
      totalModels: stats.totalModels,
      totalCreditsSaved: stats.totalCreditsSaved,
      models: stats.models
    });
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return NextResponse.json(
      { error: 'Failed to get cache stats' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Clear old cache entries
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const daysOld = parseInt(searchParams.get('daysOld') || '30');

    const result = clearOldCache(daysOld);

    return NextResponse.json({
      success: true,
      message: `Cleared ${result.removedCount} old cache entries`,
      removedCount: result.removedCount,
      remainingCount: result.remainingCount
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}
