import { GoogleGenAI } from "@google/genai";
import { CertificateType } from "../types/index";

// Initialize the client with the API key from Vite environment variables.
// Use VITE_GEMINI_API_KEY defined in your .env file
const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn("VITE_GEMINI_API_KEY is missing. AI features will not work.");
}

export const GeminiService = {
  draftMedicalNote: async (
    symptoms: string,
    type: CertificateType,
    patientName: string
  ): Promise<string> => {
    if (!ai) {
      return "Error: API Key Gemini belum dikonfigurasi. Mohon cek file .env Anda.";
    }

    const modelId = "gemini-2.5-flash";
    
    let prompt = "";
    
    if (type === CertificateType.SICK_LEAVE) {
      prompt = `
        Role: Professional Medical Doctor.
        Task: Write a concise medical observation and recommendation for a Sick Leave Certificate (Surat Sakit).
        Language: Bahasa Indonesia (Formal).
        Patient Name: ${patientName}
        Patient Complaint/Symptoms: "${symptoms}"
        
        Output format:
        1. Observation (Hasil Pemeriksaan)
        2. Recommendation (Saran Medis - e.g., rest for X days)
        
        Keep it professional, empathetic, but objective.
      `;
    } else if (type === CertificateType.HEALTH_CHECK) {
      prompt = `
        Role: Professional Medical Doctor.
        Task: Write a standard statement for a Health Certificate (Surat Keterangan Sehat).
        Language: Bahasa Indonesia (Formal).
        Patient Name: ${patientName}
        Context: Patient says "${symptoms}" (usually purpose of checkup).
        
        Output format:
        Standard statement confirming the patient has been examined and found healthy physically and mentally. Mention they are fit for the stated purpose.
      `;
    } else {
      prompt = `
        Role: Medical Doctor.
        Task: Write a medical referral note.
        Language: Bahasa Indonesia.
        Patient: ${patientName}.
        Symptoms: ${symptoms}.
      `;
    }

    try {
      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
      });
      return response.text || "Could not generate text.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Error generating medical draft. Please check your API quota or connection.";
    }
  }
};