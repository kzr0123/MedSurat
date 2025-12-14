import { GoogleGenAI } from "@google/genai";
import { CertificateType } from "../types";

// Note: In a real production app, ensure this key is not exposed to the client if not using user-provided keys.
// For this demo, we assume the environment variable is set or passed.
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const GeminiService = {
  /**
   * Drafts a professional medical note based on symptoms and certificate type.
   */
  draftMedicalNote: async (
    symptoms: string,
    type: CertificateType,
    patientName: string
  ): Promise<string> => {
    if (!apiKey) {
      console.warn("No API Key provided for Gemini.");
      return "Error: API Key missing. Please configure the environment.";
    }

    const modelId = "gemini-2.5-flash"; // Using Flash for speed as per guidelines for text tasks
    
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
        
        Keep it professional, empathetic, but objective. Do not invent severe conditions not implied by the symptoms.
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
      return "Error generating medical draft. Please try again manually.";
    }
  }
};
