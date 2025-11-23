import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const { topic, mood, style } = await request.json();

    if (!topic || !mood || !style) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const storybookId = uuidv4();

    // Return immediately with the storybook ID for the client to poll
    return NextResponse.json({
      success: true,
      storybookId,
      message: 'Storybook generation started'
    });

  } catch (error) {
    console.error('Error starting storybook creation:', error);
    return NextResponse.json(
      { error: 'Failed to start storybook creation', details: error.message },
      { status: 500 }
    );
  }
}

// This will be called by a separate background process or webhook
export async function PUT(request) {
  try {
    const { storybookId, topic, mood, style } = await request.json();

    // Step 1: Generate script
    const scriptResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/storybook/generate-script`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, mood, style })
    });

    if (!scriptResponse.ok) {
      throw new Error('Failed to generate script');
    }

    const { data: scriptData } = await scriptResponse.json();

    // Step 2: Save storybook to database
    const { data: storybook, error: storybookError } = await supabase
      .from('storybooks')
      .insert({
        id: storybookId,
        title: scriptData.title,
        subtitle: scriptData.subtitle,
        description: scriptData.description,
        topic,
        mood,
        style,
        total_pages: scriptData.pages.length
      })
      .select()
      .single();

    if (storybookError) {
      throw new Error(`Failed to save storybook: ${storybookError.message}`);
    }

    // Step 3: Save characters
    if (scriptData.characters && scriptData.characters.length > 0) {
      const charactersToInsert = scriptData.characters.map(char => ({
        storybook_id: storybookId,
        name: char.name,
        description: char.description,
        appearance: char.appearance,
        role: char.role
      }));

      const { error: charactersError } = await supabase
        .from('storybook_characters')
        .insert(charactersToInsert);

      if (charactersError) {
        console.error('Failed to save characters:', charactersError);
      }
    }

    // Step 4: Save pages (without images and audio initially)
    const pagesToInsert = scriptData.pages.map(page => ({
      storybook_id: storybookId,
      page_number: page.pageNumber,
      text: page.text,
      scene_description: page.sceneDescription,
      image_prompt: page.imagePrompt
    }));

    const { error: pagesError } = await supabase
      .from('storybook_pages')
      .insert(pagesToInsert);

    if (pagesError) {
      throw new Error(`Failed to save pages: ${pagesError.message}`);
    }

    // Step 5: Generate images and audio concurrently for all pages
    const imagePromises = scriptData.pages.map(page =>
      fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/storybook/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: page.imagePrompt,
          pageNumber: page.pageNumber,
          storybookId,
          characters: scriptData.characters,
          charactersInScene: page.charactersInScene || [],
          styleGuide: scriptData.styleGuide
        })
      }).then(res => res.json())
    );

    const audioPromises = scriptData.pages.map(page =>
      fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/storybook/generate-audio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: page.text,
          pageNumber: page.pageNumber,
          storybookId
        })
      }).then(res => res.json())
    );

    // Wait for all images and audio to be generated
    const [imageResults, audioResults] = await Promise.all([
      Promise.all(imagePromises),
      Promise.all(audioPromises)
    ]);

    // Step 6: Update pages with image and audio URLs
    for (let i = 0; i < scriptData.pages.length; i++) {
      const imageResult = imageResults[i];
      const audioResult = audioResults[i];

      if (imageResult.success && audioResult.success) {
        await supabase
          .from('storybook_pages')
          .update({
            image_url: imageResult.imageUrl,
            audio_url: audioResult.audioUrl
          })
          .eq('storybook_id', storybookId)
          .eq('page_number', scriptData.pages[i].pageNumber);
      }
    }

    return NextResponse.json({
      success: true,
      storybookId,
      message: 'Storybook created successfully'
    });

  } catch (error) {
    console.error('Error creating storybook:', error);
    return NextResponse.json(
      { error: 'Failed to create storybook', details: error.message },
      { status: 500 }
    );
  }
}
