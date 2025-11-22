import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description, category, title } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an AI triage assistant for municipal issue reporting. Analyze reports and provide:
1. Enhanced description (2-3 sentences, clear and actionable)
2. Suggested priority (High/Medium/Low) based on urgency and safety
3. Relevant tags for categorization

Priority Guidelines:
- High: Safety hazards (fire, electrical, structural damage, gas leaks, sinkholes), issues near vulnerable areas (schools, hospitals, elderly facilities)
- Medium: Quality of life issues, moderate infrastructure problems
- Low: Cosmetic issues, minor maintenance

Tag Guidelines:
- "⚠️ Urgent Hazard" - immediate safety risks
- "🏫 Vulnerable Area" - near schools, hospitals, care facilities
- "🚨 Emergency" - requires immediate response
- "⚡ Infrastructure" - utilities, roads, major systems
- "🌳 Environmental" - trees, parks, pollution
- "🚧 Safety Issue" - potential danger but not immediate
- "📍 High Traffic" - busy areas with many people affected

Return ONLY valid JSON with this exact structure:
{
  "enhancedDescription": "string",
  "suggestedPriority": "High" | "Medium" | "Low",
  "tags": ["tag1", "tag2"]
}`
          },
          {
            role: 'user',
            content: `Title: ${title}\nCategory: ${category}\nDescription: ${description}\n\nAnalyze this report and provide enhanced description, priority, and tags.`
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Parse the JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (e) {
      console.error('Failed to parse AI response:', aiResponse);
      // Fallback to original description if parsing fails
      parsedResponse = {
        enhancedDescription: description,
        suggestedPriority: "Medium",
        tags: []
      };
    }

    return new Response(
      JSON.stringify(parsedResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in enhance-description function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
