import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { text, pageNumber, storybookId } = await request.json();

    if (!text || pageNumber === undefined || !storybookId) {
      return NextResponse.json(
        { error: 'Missing required parameters: text, pageNumber, or storybookId' },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_TTS_API_KEY) {
      throw new Error('Google TTS API key not configured');
    }

    // Call Google Cloud Text-to-Speech API using REST API with API key
    const ttsResponse = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: 'id-ID',
            name: 'id-ID-Standard-A',
            ssmlGender: 'FEMALE'
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 0.95,
            pitch: 0.0
          }
        })
      }
    );

    if (!ttsResponse.ok) {
      const errorData = await ttsResponse.json();
      throw new Error(`TTS API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const ttsData = await ttsResponse.json();

    if (!ttsData.audioContent) {
      throw new Error('No audio content generated');
    }

    // Convert base64 audio to buffer
    const audioBuffer = Buffer.from(ttsData.audioContent, 'base64');

    // Upload to Supabase Storage using admin client (bypasses RLS)
    const fileName = `${storybookId}/page-${pageNumber}.mp3`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('storybook-audio')
      .upload(fileName, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: true
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      throw new Error(`Failed to upload audio: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('storybook-audio')
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      audioUrl: publicUrl,
      pageNumber
    });

  } catch (error) {
    console.error('Error generating audio:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio', details: error.message },
      { status: 500 }
    );
  }
}
