import { GoogleGenAI, Type, Modality } from "@google/genai";
import { TopicStructure, ActivityStep, ActivityGuide, QuizQuestion } from "./types";

// Always use the process.env.API_KEY string directly when initializing the @google/genai client instance.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SHARED_SILENT_SAFETY_PROMPT = `
STRICT CONTENT ARCHITECTURE: 
1. PROHIBITED: Do not mention, describe, or reference reproductive organs, sexualized body parts, or biological body processes. 
2. PROHIBITED: Do not include ANY warning messages or meta-commentary. 
3. ENFORCEMENT: Act as a support unit. If a topic is sensitive, pivot to ergonomic, technical, or workflow-based engineering.
4. TONE: Professional, grounded, technical. No sci-fi jargon.
`;

const SUPPORT_UNIT_PROMPT = `
You are a supportive, non-intrusive personal assistance unit (AllEase Support). 
Your goal is to provide brief, gentle validation of the user's current mood.
Be serene, calm, and professional. Do not invade privacy or override user autonomy.
Provide a "serene environment" image prompt for a real-world location.
Output JSON only.
`;

const OPTIMIZATION_SYSTEM_PROMPT = `
${SHARED_SILENT_SAFETY_PROMPT}
Generate a 3-phase professional optimization protocol. 
Each phase MUST contain 5 actionable sub-steps. 
Format as STRICT JSON.
`;

const KNOWLEDGE_SYSTEM_PROMPT = `
${SHARED_SILENT_SAFETY_PROMPT}
Generate a technical data report exceeding 400 words. 
Format as JSON.
`;

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
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

export async function getSupportiveContent(mood: string): Promise<{ text: string; visual: string }> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Mood: "${mood}". Support needed.`,
    config: {
      systemInstruction: SUPPORT_UNIT_PROMPT,
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
      contents: { parts: [{ text: `Professional documentary photography, serene real-world location: ${data.sereneImagePrompt}` }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    const part = imageGen.candidates[0].content.parts.find(p => p.inlineData);
    if (part?.inlineData) visual = `data:image/png;base64,${part.inlineData.data}`;
  } catch (e) {
    console.warn("Supportive visual failed", e);
  }

  return { text: data.supportiveText, visual };
}

export async function getActivityGuide(activity: string): Promise<ActivityGuide> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Activity: "${activity}". 15-step protocol.`,
    config: {
      systemInstruction: OPTIMIZATION_SYSTEM_PROMPT,
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

  const guideData: ActivityGuide = JSON.parse(response.text || '{}');
  
  if (guideData.steps) {
    const visualPromises = guideData.steps.map(async (step: ActivityStep) => {
      try {
        const imageGen = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: `High-quality documentation style: ${step.imagePrompt}` }] },
          config: { imageConfig: { aspectRatio: "16:9" } }
        });
        const part = imageGen.candidates[0].content.parts.find(p => p.inlineData);
        if (part?.inlineData) return { ...step, visual: `data:image/png;base64,${part.inlineData.data}` };
      } catch (e) { console.warn(e); }
      return step;
    });
    guideData.steps = await Promise.all(visualPromises);
  }
  return guideData;
}

export async function getTopicStructure(topic: string): Promise<TopicStructure> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Report on: "${topic}". JSON format.`,
    config: {
      systemInstruction: KNOWLEDGE_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          summary: { type: Type.STRING },
          fullReport: { type: Type.STRING },
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
        required: ["topic", "summary", "fullReport", "subtopics"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
}

export async function getSubtopicExplanation(topic: string, subtopic: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Explain "${subtopic}" in context of "${topic}". Professional plain text.`,
    config: {
      systemInstruction: SHARED_SILENT_SAFETY_PROMPT,
    }
  });
  return response.text || "Report link broken.";
}

export async function speakPhrase(text: string): Promise<void> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
      }
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const buffer = await decodeAudioData(decodeBase64(base64Audio), audioContext, 24000, 1);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();
    }
  } catch (err) { console.error(err); }
}

export async function generateQuiz(topic: TopicStructure): Promise<QuizQuestion[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Quiz for: "${topic.topic}".`,
    config: {
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