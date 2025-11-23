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

    const prompt = `Analisis gambar ini yang menunjukkan budaya Indonesia. Buatlah cerita edukatif yang menarik tentang budaya yang terlihat dalam gambar.

PENTING: Cerita harus dibagi menjadi TEPAT 5 babak. Setiap babak akan divisualisasikan dengan model 3D AR, jadi fokus pada OBJEK/ELEMEN KONKRET yang mudah dibuat menjadi model 3D.

PANDUAN VISUALISASI 3D:
- Babak 1: Fokus pada OBJEK UTAMA (contoh: bangunan, alat musik, pakaian adat)
- Babak 2: Fokus pada ELEMEN/BAGIAN SPESIFIK dari objek (contoh: atap, ukiran, motif)
- Babak 3: Fokus pada ELEMEN LAIN yang menonjol (contoh: ornamen, aksesori, detail)
- Babak 4: Fokus pada FUNGSI/PENGGUNAAN objek (jelaskan konteks penggunaannya)
- Babak 5: Fokus pada MAKNA/NILAI budaya (warisan dan pesan moral)

PENTING: Gunakan bahasa yang GENERIC dan DESKRIPTIF untuk objek fisik, hindari terlalu detail spesifik yang sulit divisualisasikan.

Format response dalam JSON:
{
  "title": "Judul cerita singkat (3-5 kata)",
  "chapters": [
    {
      "title": "Nama Objek/Elemen Utama",
      "content": "Deskripsi singkat objek (2-3 kalimat). Fokus pada bentuk, warna, ukuran yang bisa divisualisasikan 3D."
    },
    {
      "title": "Nama Elemen/Bagian Spesifik",
      "content": "Deskripsi elemen khusus (2-3 kalimat). Jelaskan detail yang unik dan mudah dibuat 3D."
    },
    {
      "title": "Nama Elemen/Detail Lain",
      "content": "Deskripsi detail tambahan (2-3 kalimat). Fokus pada ornamen atau aksesori yang terlihat."
    },
    {
      "title": "Fungsi dan Penggunaan",
      "content": "Jelaskan bagaimana objek digunakan (2-3 kalimat). Konteks sederhana yang mudah dipahami."
    },
    {
      "title": "Makna dan Warisan",
      "content": "Jelaskan nilai budaya (2-3 kalimat). Pesan moral yang ingin disampaikan."
    }
  ]
}

CONTOH BAIK (mudah divisualisasikan):
- "Bangunan beratap tanduk" ✓
- "Ukiran bermotif flora" ✓
- "Pakaian dengan aksesoris emas" ✓

CONTOH BURUK (sulit divisualisasikan):
- "Filosofi kehidupan yang mendalam" ✗
- "Semangat gotong royong masyarakat" ✗

Pastikan:
1. Bahasa Indonesia yang jelas dan mudah dipahami
2. Setiap babak mendeskripsikan OBJEK FISIK yang konkret
3. Total HARUS 5 babak, tidak lebih dan tidak kurang
4. Judul babak SINGKAT (3-5 kata) dan merujuk pada objek
5. Response HANYA JSON, tanpa markdown atau teks tambahan

Berikan HANYA JSON.`;

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
