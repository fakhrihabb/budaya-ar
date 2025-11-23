import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export async function POST(request) {
  try {
    const { topic, mood, style } = await request.json();

    if (!topic || !mood || !style) {
      return NextResponse.json(
        { error: 'Missing required parameters: topic, mood, or style' },
        { status: 400 }
      );
    }

    // Use Gemini 2.0 Flash for script generation
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Define detailed style prompts for better consistency and accuracy
    // IMPORTANT: Avoid brand names (Pixar, Disney, etc.) - they trigger content filters
    const stylePrompts = {
      'pixar-3d': '3D animated style with soft rounded shapes, large expressive cartoon eyes, smooth plastic-like textures, vibrant saturated colors, dramatic cinematic lighting with soft shadows, highly polished CG rendering, exaggerated proportions, emotional expressiveness, family-friendly aesthetic, similar to modern animated films, NOT photorealistic',
      'color-paint': 'Vibrant colorful painting with bold visible brushstrokes, thick impasto texture, rich saturated colors, painterly style like children\'s book illustration, warm inviting palette, artistic hand-painted feel, gouache or acrylic style, NOT photographic',
      'watercolor': 'Soft watercolor painting with delicate translucent washes, gentle color bleeding, subtle paper texture, pastel colors, light airy feel, fluid brushwork, dreamy atmospheric quality, traditional watercolor medium, NOT digital art',
      'anime': 'Japanese anime illustration style with large expressive eyes, clean cel-shaded coloring, sharp linework, stylized proportions, vibrant hair colors, manga-inspired character design, flat colors with minimal shading, NOT realistic or 3D'
    };

    const stylePrompt = stylePrompts[style] || stylePrompts['pixar-3d'];

    const prompt = `You are an expert Indonesian educational content creator specializing in cultural storytelling.

Create an educational storybook about: ${topic}

**STORYTELLING REQUIREMENTS:**
- Tone/Mood: ${mood}
- Visual Style: ${style}
- Number of pages: 6 (pages 1-5 tell the story, page 6 is the closure with lesson/takeaway)
- Maximum 4 characters per story
- Each page text: maximum 400 characters
- Characters must reflect the specific cultural origin (traditional clothing, physical features, etc.)
- Story must be educational and engaging for all ages

**CRITICAL: NARRATIVE STRUCTURE**
This is a STORYBOOK, not scene descriptions. You must create a coherent, flowing narrative with:
1. **Clear plot arc**: Beginning (setup) → Conflict/Challenge → Rising action → Climax → Resolution → Lesson
2. **Narrative continuity**: Each page continues directly from the previous one
3. **Story narration**: Write like a narrator telling a story to children. Use past tense, engaging language, and smooth transitions.
4. **Educational integration**: Weave cultural knowledge naturally into the story (don't just list facts)
5. **Character development**: Show characters learning, growing, or changing through the story
6. **Emotional engagement**: Create moments of wonder, challenge, triumph, reflection

**TEXT WRITING STYLE:**
- Write NARRATIVE TEXT, not scene descriptions
- Use storytelling language: "Once upon a time...", "Meanwhile...", "Suddenly...", "Finally..."
- Create emotional connection: show characters' feelings and reactions
- Include dialogue when appropriate to bring characters to life
- Each page should end in a way that flows naturally to the next page
- Page 6 should reflect on the journey and share the cultural/moral lesson learned

**EXAMPLE OF GOOD vs BAD:**
❌ BAD (scene description): "A girl stands in a rice field looking at the mountain"
✅ GOOD (story narration): "Little Sari gazed at the mighty Gunung Merapi, remembering her grandmother's tales. Today, she would finally learn the secret of the sacred rice harvest that had fed their village for generations."

**CRITICAL FOR CHARACTER CONSISTENCY:**
- Each character MUST have a VERY detailed, specific appearance description using SIMPLE, CONSISTENT descriptors
- Include: exact age (e.g., "8-year-old"), exact skin tone (e.g., "warm brown skin"), specific hairstyle (e.g., "straight black hair in two braids"), distinctive facial features (e.g., "round face with dimples"), exact clothing (e.g., "bright red traditional kebaya with yellow batik patterns and gold buttons")
- Use the EXACT SAME WORDS for each character appearance across all image prompts
- Keep character descriptions under 50 words but very specific
- Include one unique identifying feature (e.g., "always wears a golden flower hair clip", "has a small mole above left eyebrow")
- Avoid generic terms - be precise and detailed
- These EXACT descriptions will be reused word-for-word across all pages to maintain consistency

Research the topic thoroughly and provide accurate cultural information.

Output ONLY a valid JSON object with this exact structure (no markdown formatting, no code blocks):
{
  "title": "Story title in Indonesian",
  "subtitle": "Short subtitle describing the story",
  "description": "Brief description of what this storybook teaches",
  "styleGuide": "${stylePrompt}",
  "characters": [
    {
      "name": "Character name",
      "description": "Character role and personality",
      "appearance": "EXTREMELY detailed physical description: exact skin tone, precise hair style/color/length, specific facial features (face shape, eyes, nose), exact clothing items with colors and patterns, distinctive accessories. Be very specific - this will be reused for consistency across all images.",
      "role": "main/supporting"
    }
  ],
  "pages": [
    {
      "pageNumber": 1,
      "text": "NARRATIVE TEXT that tells the story (max 400 chars). Write like a narrator. Include character emotions and story setup. This is page 1, so introduce the setting and main character(s) in an engaging way.",
      "sceneDescription": "What is visually happening in this moment of the story",
      "charactersInScene": ["Character1 name", "Character2 name"],
      "imagePrompt": "Visual description of this story moment for illustration"
    },
    {
      "pageNumber": 2,
      "text": "NARRATIVE TEXT that continues the story from page 1 (max 400 chars). Introduce the challenge or conflict. Show what happens next in the plot.",
      "sceneDescription": "...",
      "charactersInScene": ["..."],
      "imagePrompt": "..."
    },
    {
      "pageNumber": 3,
      "text": "NARRATIVE TEXT that shows rising action (max 400 chars). The character attempts to solve the problem or learns something important.",
      "sceneDescription": "...",
      "charactersInScene": ["..."],
      "imagePrompt": "..."
    },
    {
      "pageNumber": 4,
      "text": "NARRATIVE TEXT at the story climax (max 400 chars). The most exciting or tense moment. Cultural knowledge is revealed or applied.",
      "sceneDescription": "...",
      "charactersInScene": ["..."],
      "imagePrompt": "..."
    },
    {
      "pageNumber": 5,
      "text": "NARRATIVE TEXT showing resolution (max 400 chars). How the challenge was overcome. Show the character's growth or success.",
      "sceneDescription": "...",
      "charactersInScene": ["..."],
      "imagePrompt": "..."
    },
    {
      "pageNumber": 6,
      "text": "NARRATIVE CLOSURE TEXT (max 400 chars). Reflect on the journey. Share the moral/lesson learned and key cultural wisdom. End with hope or inspiration.",
      "sceneDescription": "Final reflective scene",
      "charactersInScene": ["..."],
      "imagePrompt": "Uplifting closing image representing the lesson learned"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Clean the response to extract JSON
    let cleanedText = text.trim();

    // Remove markdown code blocks if present
    cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

    // Try to parse the JSON
    let storyData;
    try {
      storyData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse JSON:', cleanedText);
      return NextResponse.json(
        { error: 'Failed to parse AI response', details: parseError.message },
        { status: 500 }
      );
    }

    // Validate the structure
    if (!storyData.title || !storyData.characters || !storyData.pages) {
      return NextResponse.json(
        { error: 'Invalid story structure from AI' },
        { status: 500 }
      );
    }

    // Ensure exactly 6 pages
    if (storyData.pages.length !== 6) {
      return NextResponse.json(
        { error: `Expected 6 pages, got ${storyData.pages.length}` },
        { status: 500 }
      );
    }

    // Ensure max 4 characters
    if (storyData.characters.length > 4) {
      storyData.characters = storyData.characters.slice(0, 4);
    }

    return NextResponse.json({
      success: true,
      data: storyData
    });

  } catch (error) {
    console.error('Error generating script:', error);
    return NextResponse.json(
      { error: 'Failed to generate storybook script', details: error.message },
      { status: 500 }
    );
  }
}
