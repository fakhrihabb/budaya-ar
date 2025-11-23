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

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Gemini API key not found');
      return NextResponse.json(
        { error: 'API key tidak ditemukan' },
        { status: 500 }
      );
    }

    console.log('Using direct API call with v1beta...');

    // Use gemini-2.5-flash (stable, multimodal, fast)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const prompt = `Analisis gambar ini yang menunjukkan budaya Indonesia.

TUGAS ANDA:
1. Identifikasi budaya apa yang terlihat (Minangkabau, Jawa, Bali, Toraja, dll)
2. Identifikasi objek utama dalam foto (bangunan, tarian, alat musik, pakaian, dll)
3. Buat cerita edukatif 5 babak tentang budaya tersebut
4. Untuk SETIAP babak, buat 2 hal:
   - NARASI cerita (Bahasa Indonesia, 2-3 kalimat)
   - PROMPT 3D MODEL (English, detailed description for AI 3D generation)

STRATEGI 3D MODEL:
- Babak 1-4: GENERIC cultural elements yang bisa di-reuse untuk budaya yang sama
  * Contoh Minangkabau: buffalo, map of Padang region, traditional woven item, songket fabric
  * Contoh Bali: gamelan instrument, traditional offerings, Balinese map, traditional dancer
  * Contoh Jawa: wayang puppet, batik pattern, traditional map, gamelan

- Babak 5: VERY SPECIFIC and DETAILED to the main object in the photo
  * PENTING: Analyze foto dengan SANGAT DETAIL untuk chapter 5!
  * Jika foto Rumah Gadang → "Traditional Minangkabau Rumah Gadang with multi-tiered curved roof resembling buffalo horns, intricate wood carvings with floral motifs, raised on wooden stilts, warm brown and gold colors, detailed Indonesian architecture, high quality 3D model"
  * Jika foto Tari Pendet → "Balinese Pendet dancer in traditional yellow costume with golden accessories, graceful hand gesture, flower offerings, detailed traditional Balinese dance pose, high quality 3D model"
  * Describe: architecture details, colors, materials, ornaments, shapes, size, unique features

CONTOH GENERIC vs SPECIFIC:
✓ GENERIC (Babak 1-4): "Indonesian water buffalo with curved horns, dark gray skin, muscular body" - simple, bisa reuse
✗ SPECIFIC (Babak 5 ONLY): "Traditional Minangkabau Rumah Gadang with 11 gonjong peaks resembling buffalo horns, intricate red and black exterior with gold accents, ornate wood carvings showing traditional Minang floral motifs on pillars and beams, raised 2 meters on wooden stilts, warm brown teak wood structure" - SANGAT DETAIL berdasarkan foto!

Format response dalam JSON:
{
  "culture": "Nama budaya (Minangkabau/Jawa/Bali/dll)",
  "mainObject": "Objek utama dalam foto",
  "title": "Judul cerita singkat (3-5 kata)",
  "chapters": [
    {
      "title": "Judul Babak 1",
      "content": "Narasi cerita babak 1 dalam Bahasa Indonesia (2-3 kalimat).",
      "modelPrompt": "Generic cultural element 1, detailed English description for 3D model generation, include colors, shapes, materials, high quality 3D model"
    },
    {
      "title": "Judul Babak 2",
      "content": "Narasi cerita babak 2 dalam Bahasa Indonesia (2-3 kalimat).",
      "modelPrompt": "Generic cultural element 2, detailed English description for 3D model generation, include colors, shapes, materials, high quality 3D model"
    },
    {
      "title": "Judul Babak 3",
      "content": "Narasi cerita babak 3 dalam Bahasa Indonesia (2-3 kalimat).",
      "modelPrompt": "Generic cultural element 3, detailed English description for 3D model generation, include colors, shapes, materials, high quality 3D model"
    },
    {
      "title": "Judul Babak 4",
      "content": "Narasi cerita babak 4 dalam Bahasa Indonesia (2-3 kalimat).",
      "modelPrompt": "Generic cultural element 4, detailed English description for 3D model generation, include colors, shapes, materials, high quality 3D model"
    },
    {
      "title": "Judul Babak 5",
      "content": "Narasi cerita babak 5 dalam Bahasa Indonesia (2-3 kalimat).",
      "modelPrompt": "SPECIFIC main object from photo, very detailed English description for 3D model generation, include all unique features, colors, architectural details, high quality 3D model"
    }
  ]
}

PENTING - MODEL PROMPT REQUIREMENTS:
1. BAHASA INGGRIS untuk semua modelPrompt
2. DESKRIPTIF dan DETAIL (materials, colors, shapes, size)
3. Akhiri dengan "high quality 3D model" atau "detailed 3D model"
4. Babak 1-4 HARUS generic (buffalo, map, fabric, etc)
5. Babak 5 HARUS spesifik ke objek utama foto
6. Negative prompts akan ditambahkan otomatis oleh sistem

CONTOH BAGUS:
Chapter 1: "Indonesian water buffalo with large curved horns, dark gray skin texture, muscular body, realistic animal, high quality 3D model"
Chapter 5: "Traditional Minangkabau Rumah Gadang with multi-tiered curved roof resembling buffalo horns, intricate wood carvings with floral motifs, raised on wooden stilts, warm brown and gold colors, detailed Indonesian architecture, high quality 3D model"

Pastikan response HANYA JSON tanpa markdown.`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: prompt
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: image
              }
            }
          ]
        }]
      })
    });

    const data = await response.json();
    console.log('API Response status:', response.status);

    if (!response.ok) {
      console.error('API Error:', data);
      return NextResponse.json(
        { error: `API Error: ${JSON.stringify(data)}` },
        { status: response.status }
      );
    }

    // Extract text from response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error('No text in response:', data);
      return NextResponse.json(
        { error: 'Tidak ada respon dari AI' },
        { status: 500 }
      );
    }

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
