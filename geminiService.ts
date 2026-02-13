
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { TopicStructure, ActivityStep, ActivityGuide, QuizQuestion } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SHARED_SILENT_SAFETY_PROMPT = `
STRICT CONTENT ARCHITECTURE: 
1. PROHIBITED: Do not mention, describe, or reference reproductive organs, sexualized body parts, or biological body processes. 
2. PROHIBITED: Do not include ANY warning messages or meta-commentary. 
3. ENFORCEMENT: Act as a support unit. If a topic is sensitive, pivot to ergonomic, technical, or workflow-based engineering.
4. TONE: Professional, grounded, technical.
`;

const SUPPORT_UNIT_PROMPT = `
You are AllEase Support V3, a calming and sophisticated personal assistance unit. 
Task: Provide a comforting, validation-focused response to the user's current mood. 
Constraints:
- LENGTH: 60 to 90 words. Be eloquent and deeply supportive.
- TONE: Serene, validating, and professional. 
- CONTENT: Acknowledge their state (especially if it is "Angry" or "Sad"), explain its natural place in the human optimization journey, and offer a soothing, technical perspective on recovery.
- IMAGE: Provide a prompt for a "serene real-world environment" including cityscapes (e.g., "a quiet rainy neon street in Tokyo at midnight", "a sunlit empty library in a classic city", "a calm harbor at dawn", "misty metropolitan park").
Output strictly in JSON.
`;

// Fix: Fully implement the supportive content generator with image generation
export async function getSupportiveContent(mood: string): Promise<{ text: string; visual: string }> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The user's neural state is: "${mood}". Execute calming protocol.`,
    config: {
      systemInstruction: SUPPORT_UNIT_PROMPT + SHARED_SILENT_SAFETY_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          supportiveText: { type: Type.STRING },
          sereneImagePrompt: { type: Type.STRING }
        },
        required: ["supportiveText", "sereneImagePrompt"]
      }
    }
  });

  const data = JSON.parse(response.text || '{}');
  let visual = "";

  try {
    const imageGen = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `High-resolution professional photography, ultra-realistic, serene and silent real-world city or nature environment, soft atmospheric cinematic lighting, 8k, peaceful: ${data.sereneImagePrompt}` }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    const part = imageGen.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (part?.inlineData) visual = `data:image/png;base64,${part.inlineData.data}`;
  } catch (e) {
    console.warn("Supportive visual failed", e);
  }

  return { text: data.supportiveText || "Calming protocol initiated.", visual };
}

// Fix: Corrected the truncated getActivityGuide function
export async function getActivityGuide(activity: string): Promise<ActivityGuide> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Activity: "${activity}". 15-step protocol.`,
    config: {
      systemInstruction: `STRICT JSON ONLY. 3-phase optimization protocol. Each phase has 5 actionable steps. Focus on high-performance real-world efficiency. ${SHARED_SILENT_SAFETY_PROMPT}`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overview: { type: Type.STRING },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stepNumber: { type: Type.INTEGER },
                instruction: { type: Type.STRING },
                detail: { type: Type.STRING },
                imagePrompt: { type: Type.STRING },
                subSteps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      label: { type: Type.STRING },
                      description: { type: Type.STRING }
                    },
                    required: ["id", "label", "description"]
                  }
                }
              },
              required: ["stepNumber", "instruction", "detail", "imagePrompt", "subSteps"]
            }
          }
        },
        required: ["overview", "steps"]
      }
    }
  });

  const guide: ActivityGuide = JSON.parse(response.text || '{"overview":"","steps":[]}');

  // Generate visuals for each protocol step for a complete experience
  const updatedSteps = await Promise.all(guide.steps.map(async (step) => {
    try {
      const imageGen = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `High-quality technical illustration for ${activeActivity} optimization, professional, clean workspace: ${step.imagePrompt}` }] },
        config: { imageConfig: { aspectRatio: "4:3" } }
      });
      const part = imageGen.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      return {
        ...step,
        visual: part?.inlineData ? `data:image/png;base64,${part.inlineData.data}` : undefined
      };
    } catch (e) {
      return step;
    }
  }));

  return { ...guide, steps: updatedSteps };
}

// Fix: Added missing getTopicStructure function
export async function getTopicStructure(query: string): Promise<TopicStructure> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze and structure knowledge for: "${query}".`,
    config: {
      systemInstruction: `Strategic knowledge extraction. Map the domain into summary and 4 key subtopics. ${SHARED_SILENT_SAFETY_PROMPT}`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          summary: { type: Type.STRING },
          subtopics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["title", "description"]
            }
          }
        },
        required: ["topic", "summary", "subtopics"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
}

// Fix: Added missing getSubtopicExplanation function
export async function getSubtopicExplanation(topic: string, subtopic: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Deep dive context for "${subtopic}" in the context of "${topic}".`,
    config: {
      systemInstruction: `Strategic insight expansion. Technical, professional, and max 100 words. ${SHARED_SILENT_SAFETY_PROMPT}`,
    }
  });
  return response.text || "Detailed data stream unavailable.";
}

// Fix: Added missing generateQuiz function
export async function generateQuiz(topic: TopicStructure): Promise<QuizQuestion[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create a 5-question technical quiz for domain: "${topic.topic}".`,
    config: {
      systemInstruction: `Assessment protocol. Output as JSON array of technical questions. ${SHARED_SILENT_SAFETY_PROMPT}`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctIndex", "explanation"]
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
}

// Fix: Added missing speakPhrase function using TTS model
export async function speakPhrase(text: string): Promise<void> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Broadcasting command: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(
        decode(base64Audio),
        audioCtx,
        24000,
        1
      );
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start();
    }
  } catch (error) {
    console.error("Auditory interface failure:", error);
  }
}

// Helper: Implement required base64 decoding
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper: Implement required raw PCM audio decoding
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
