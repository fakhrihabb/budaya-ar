import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Test if service role key is loaded
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Try a simple upload test
    const testBuffer = Buffer.from('test file content');
    const fileName = `test-${Date.now()}.txt`;

    const { data, error } = await supabaseAdmin.storage
      .from('storybook-images')
      .upload(fileName, testBuffer, {
        contentType: 'text/plain',
        upsert: true
      });

    if (error) {
      return NextResponse.json({
        success: false,
        hasServiceKey,
        error: error.message,
        errorDetails: error
      });
    }

    // Clean up test file
    await supabaseAdmin.storage
      .from('storybook-images')
      .remove([fileName]);

    return NextResponse.json({
      success: true,
      hasServiceKey,
      message: 'Upload test successful! Service Role Key is working.'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }, { status: 500 });
  }
}
