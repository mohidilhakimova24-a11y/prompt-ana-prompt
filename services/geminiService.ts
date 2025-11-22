import { GoogleGenAI, Type } from "@google/genai";
import { OptimizationRequest, OptimizationResult, PromptStyle } from "../types";

const getSystemInstruction = (style: PromptStyle) => `
Siz Prompt Engineering va LLMlar uchun optimallashtirish payplayni bo'yicha ekspertsiz.
Sizning maqsadingiz foydalanuvchi kiritgan ma'lumotni olish va uni katta til modellari uchun yuqori sifatli, samarali promptga aylantirishdir.

Siz o'zingizning ichingizda quyidagi mantiqni bajarishingiz kerak:
1. **Kirishni qayta ishlash**: Kiritilgan ma'lumotni grammatika, noaniqlik va imlo xatolari bo'yicha tahlil qiling.
2. **Asosiy optimallashtirish**: Promptni quyidagi uslub asosida eng yaxshi amaliyotlarni (masalan, persona qabul qilish, aniq cheklovlar, chiqish formatlash) qo'llagan holda qayta yozing: "${style}".
3. **Versiyalarni yaratish**: Optimallashtirilgan promptning roppa-rosa 3 xil variantini yarating.
    - Variant 1: "Yaxshilangan" (Toza, tuzatilgan, originaldan biroz yaxshiroq).
    - Variant 2: "Kengaytirilgan" (Batafsil, kontekst qo'shadi, cheklovlar qo'shadi).
    - Variant 3: "Tuzilgan" (CO-STAR yoki Chain-of-Thought kabi maxsus freymvorklardan foydalanadi).

Natijani qat'iy tuzilgan JSON obyekti sifatida qaytaring. Butun yaratilgan matn (tahlil, prompt variantlari, asoslash) O'ZBEK tilida bo'lishi kerak.
`;

export const optimizePromptWithGemini = async (
  request: OptimizationRequest
): Promise<OptimizationResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API kaliti mavjud emas. Iltimos, muhit o'zgaruvchilarini tekshiring.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Quyidagi foydalanuvchi promptini tahlil qiling va optimallashtiring:
    "${request.inputPrompt}"

    Murakkablik darajasi: ${request.complexity}
    Maqsadli uslub: ${request.style}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(request.style),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            originalAnalysis: {
              type: Type.OBJECT,
              properties: {
                grammarIssues: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Grammatika yoki imlo xatolari ro'yxati. Agar yo'q bo'lsa, 'Yo'q' deb qaytaring."
                },
                clarityScore: {
                  type: Type.NUMBER,
                  description: "0 dan 100 gacha bo'lgan ball, bu yerda 100 mukammal aniqlikdir."
                },
                intentDetected: {
                  type: Type.STRING,
                  description: "Foydalanuvchining aniqlangan maqsadi haqida qisqacha xulosa."
                }
              },
              required: ["grammarIssues", "clarityScore", "intentDetected"]
            },
            variants: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  reasoning: { type: Type.STRING, description: "Nima uchun ushbu optimallashtirish samarali ekanligi haqida qisqacha tushuntirish." },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["title", "content", "reasoning", "tags"]
              }
            }
          },
          required: ["originalAnalysis", "variants"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Gemini'dan javob olinmadi");
    }

    return JSON.parse(text) as OptimizationResult;
  } catch (error) {
    console.error("Optimallashtirish xatosi:", error);
    throw new Error("Promptni optimallashtirish amalga oshmadi. Iltimos, qaytadan urinib ko'ring.");
  }
};