import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Fetch storybook data
    const { data: storybook, error: storybookError } = await supabase
      .from('storybooks')
      .select('*')
      .eq('id', id)
      .single();

    if (storybookError || !storybook) {
      return NextResponse.json(
        { error: 'Storybook not found' },
        { status: 404 }
      );
    }

    // Fetch characters
    const { data: characters, error: charactersError } = await supabase
      .from('storybook_characters')
      .select('*')
      .eq('storybook_id', id);

    if (charactersError) {
      console.error('Error fetching characters:', charactersError);
    }

    // Fetch pages
    const { data: pages, error: pagesError } = await supabase
      .from('storybook_pages')
      .select('*')
      .eq('storybook_id', id)
      .order('page_number');

    if (pagesError) {
      throw new Error(`Failed to fetch pages: ${pagesError.message}`);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...storybook,
        characters: characters || [],
        pages: pages || []
      }
    });

  } catch (error) {
    console.error('Error fetching storybook:', error);
    return NextResponse.json(
      { error: 'Failed to fetch storybook', details: error.message },
      { status: 500 }
    );
  }
}
