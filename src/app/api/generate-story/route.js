import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { image, mimeType } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Gambar tidak ditemukan' },
        { status: 400 }
      );
    }

    // Check API key
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Gemini API key not found');
      return NextResponse.json(
        { error: 'API key tidak ditemukan' },
        { status: 500 }
      );
    }

    console.log('Initializing Gemini AI...');
    const genAI = new GoogleGenerativeAI(apiKey);

    // Get the Gemini model with vision support
    // Try gemini-pro-vision for image support
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    console.log('Model initialized');

    // Prepare the prompt for story generation
    const prompt = `Analisis gambar ini yang menunjukkan budaya Indonesia. Buatlah cerita edukatif yang menarik tentang budaya yang terlihat dalam gambar.

PENTING: Cerita harus dibagi menjadi TEPAT 5 babak. Setiap babak akan divisualisasikan dengan model 3D AR, jadi fokus pada OBJEK/ELEMEN KONKRET yang mudah dibuat menjadi model 3D.

PANDUAN VISUALISASI 3D:
- Babak 1: Fokus pada OBJEK UTAMA (contoh: bangunan, alat musik, pakaian adat)
- Babak 2: Fokus pada ELEMEN/BAGIAN SPESIFIK dari objek (contoh: atap, ukiran, motif)
- Babak 3: Fokus pada ELEMEN LAIN yang menonjol (contoh: ornamen, aksesori, detail)
- Babak 4: Fokus pada FUNGSI/PENGGUNAAN objek (jelaskan konteks penggunaannya)
- Babak 5: Fokus pada MAKNA/NILAI budaya (warisan dan pesan moral)

Format response dalam JSON dengan struktur berikut:
{
  "title": "Judul cerita yang menarik",
  "chapters": [
    {
      "title": "Judul Babak 1",
      "content": "Isi cerita babak 1 (2-3 kalimat yang menjelaskan pembukaan atau latar belakang budaya)"
    },
    {
      "title": "Judul Babak 2",
      "content": "Isi cerita babak 2 (2-3 kalimat yang menjelaskan perkembangan atau detail penting)"
    },
    {
      "title": "Judul Babak 3",
      "content": "Isi cerita babak 3 (2-3 kalimat yang menjelaskan klimaks atau momen penting)"
    },
    {
      "title": "Judul Babak 4",
      "content": "Isi cerita babak 4 (2-3 kalimat yang menjelaskan penyelesaian atau makna)"
    },
    {
      "title": "Judul Babak 5",
      "content": "Isi cerita babak 5 (2-3 kalimat yang menjelaskan kesimpulan atau pesan moral)"
    }
  ]
}

Pastikan:
1. Cerita berbahasa Indonesia yang baik dan benar
2. Setiap babak memiliki fokus yang jelas dan dapat divisualisasikan dengan model 3D
3. Total HARUS 5 babak, tidak lebih dan tidak kurang
4. Setiap babak berisi 2-3 kalimat yang informatif dan edukatif
5. Cerita harus akurat dan menghormati budaya Indonesia
6. Response HARUS dalam format JSON yang valid

Berikan HANYA JSON, tanpa teks tambahan apapun.`;

    // Generate content with image
    console.log('Generating content...');
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: image,
          mimeType: mimeType
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    console.log('Gemini response received:', text.substring(0, 200));

    // Parse the JSON response
    let storyData;
    try {
      // Remove markdown code blocks if present
      let cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      // Try to extract JSON from the response
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        storyData = JSON.parse(jsonMatch[0]);
        console.log('Successfully parsed JSON');
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError.message);
      console.error('Response text:', text);

      // Fallback: create a structured response from the text
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);

      if (sentences.length >= 10) {
        const chapterSize = Math.floor(sentences.length / 5);
        storyData = {
          title: 'Cerita Budaya Indonesia',
          chapters: [
            {
              title: 'Babak 1: Pembukaan',
              content: sentences.slice(0, chapterSize).join('. ') + '.'
            },
            {
              title: 'Babak 2: Perkembangan',
              content: sentences.slice(chapterSize, chapterSize * 2).join('. ') + '.'
            },
            {
              title: 'Babak 3: Klimaks',
              content: sentences.slice(chapterSize * 2, chapterSize * 3).join('. ') + '.'
            },
            {
              title: 'Babak 4: Penyelesaian',
              content: sentences.slice(chapterSize * 3, chapterSize * 4).join('. ') + '.'
            },
            {
              title: 'Babak 5: Kesimpulan',
              content: sentences.slice(chapterSize * 4).join('. ') + '.'
            }
          ]
        };
      } else {
        // If we don't have enough content, return error
        return NextResponse.json(
          { error: 'Konten tidak cukup untuk membuat 5 babak cerita' },
          { status: 500 }
        );
      }
    }

    // Ensure we have exactly 5 chapters
    if (!storyData.chapters || storyData.chapters.length !== 5) {
      console.error('Invalid chapter count:', storyData.chapters?.length);
      return NextResponse.json(
        { error: 'Gagal menghasilkan cerita dengan format yang benar' },
        { status: 500 }
      );
    }

    console.log('Story generated successfully with', storyData.chapters.length, 'chapters');
    return NextResponse.json({ story: storyData });

  } catch (error) {
    console.error('Error generating story:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: `Gagal menghasilkan cerita: ${error.message}` },
      { status: 500 }
    );
  }
}
