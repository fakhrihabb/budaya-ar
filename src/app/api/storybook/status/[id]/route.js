import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Get storybook data
    const { data: storybook, error: storybookError } = await supabase
      .from('storybooks')
      .select('*')
      .eq('id', id)
      .single();

    if (storybookError || !storybook) {
      return NextResponse.json({
        status: 'not_found',
        progress: 0
      });
    }

    // Get pages to check progress
    const { data: pages, error: pagesError } = await supabase
      .from('storybook_pages')
      .select('page_number, image_url, audio_url')
      .eq('storybook_id', id)
      .order('page_number');

    if (pagesError) {
      throw new Error(`Failed to fetch pages: ${pagesError.message}`);
    }

    if (!pages || pages.length === 0) {
      return NextResponse.json({
        status: 'generating_script',
        progress: 10,
        message: 'Membuat cerita...'
      });
    }

    // Calculate progress
    const totalPages = pages.length;
    const pagesWithImages = pages.filter(p => p.image_url).length;
    const pagesWithAudio = pages.filter(p => p.audio_url).length;

    // Progress breakdown:
    // 0-10%: Creating storybook entry
    // 10-20%: Script generation
    // 20-70%: Image generation (50% weight)
    // 70-100%: Audio generation (30% weight)

    let status = 'completed';
    let progress = 100;
    let message = 'Storybook selesai!';

    if (pagesWithImages < totalPages || pagesWithAudio < totalPages) {
      const imageProgress = (pagesWithImages / totalPages) * 50;
      const audioProgress = (pagesWithAudio / totalPages) * 30;
      progress = 20 + imageProgress + audioProgress;

      if (pagesWithImages < totalPages) {
        status = 'generating_images';
        message = `Membuat gambar ${pagesWithImages}/${totalPages}...`;
      } else if (pagesWithAudio < totalPages) {
        status = 'generating_audio';
        message = `Membuat audio ${pagesWithAudio}/${totalPages}...`;
      }
    }

    return NextResponse.json({
      status,
      progress: Math.round(progress),
      message,
      pagesCompleted: Math.min(pagesWithImages, pagesWithAudio),
      totalPages
    });

  } catch (error) {
    console.error('Error checking storybook status:', error);
    return NextResponse.json(
      { error: 'Failed to check status', details: error.message },
      { status: 500 }
    );
  }
}
