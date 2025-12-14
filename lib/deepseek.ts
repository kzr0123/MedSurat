import { CertificateType } from "../types/index";

const API_KEY = (import.meta as any).env.VITE_DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/chat/completions';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const DeepSeekService = {
  /**
   * Generic chat completion method for DeepSeek
   */
  chat: async (messages: ChatMessage[]): Promise<string> => {
    if (!API_KEY) {
      console.error("DeepSeek API Key is missing. Please set VITE_DEEPSEEK_API_KEY in .env");
      return "Error: Konfigurasi AI belum lengkap (API Key Missing).";
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DeepSeek API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "No response from AI.";
    } catch (error) {
      console.error("DeepSeek Request Failed:", error);
      throw error; // Re-throw to be handled by caller
    }
  },

  /**
   * Specialized method to draft medical notes
   */
  draftMedicalNote: async (
    symptoms: string,
    type: CertificateType,
    patientName: string
  ): Promise<string> => {
    let systemPrompt = "";
    
    if (type === CertificateType.SICK_LEAVE) {
      systemPrompt = `Role: Professional Medical Doctor.
        Task: Write a concise medical observation and recommendation for a Sick Leave Certificate (Surat Sakit).
        Language: Bahasa Indonesia (Formal).
        Output format:
        1. Observation (Hasil Pemeriksaan)
        2. Recommendation (Saran Medis - e.g., rest for X days)
        Keep it professional, empathetic, but objective.`;
    } else if (type === CertificateType.HEALTH_CHECK) {
      systemPrompt = `Role: Professional Medical Doctor.
        Task: Write a standard statement for a Health Certificate (Surat Keterangan Sehat).
        Language: Bahasa Indonesia (Formal).
        Output format:
        Standard statement confirming the patient has been examined and found healthy physically and mentally. Mention they are fit for the stated purpose.`;
    } else {
      systemPrompt = `Role: Medical Doctor. Task: Write a medical referral note. Language: Bahasa Indonesia.`;
    }

    const userPrompt = `Patient Name: ${patientName}. Context/Symptoms: "${symptoms}"`;

    try {
      const content = await DeepSeekService.chat([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]);
      return content;
    } catch (error) {
      console.error(error);
      return "Gagal menghasilkan draft medis. Mohon periksa koneksi atau kuota API DeepSeek Anda.";
    }
  }
};