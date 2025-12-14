import { PatientRequest, RequestStatus, CertificateType } from '../types/index';
import { supabase } from './supabase';

// Helper to simulate DB delay for mock mode
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
  getRequests: async (): Promise<PatientRequest[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('requests').select('*').order('requestDate', { ascending: false });
      if (error) {
        console.error("Supabase Error:", error);
        return [];
      }
      return data as PatientRequest[];
    }
    return []; // Return empty if no Supabase and no local logic desired for clean audit
  },

  getRequestById: async (id: string): Promise<PatientRequest | undefined> => {
    if (supabase) {
      const { data, error } = await supabase.from('requests').select('*').eq('id', id).single();
      if (error) return undefined;
      return data as PatientRequest;
    }
    return undefined;
  },

  createRequest: async (data: Omit<PatientRequest, 'id' | 'requestDate' | 'status'>): Promise<PatientRequest> => {
    // Generate a temporary ID for the object structure, 
    // but usually Postgres generates the ID (uuid) or we send one.
    // Here we generate a string ID for simplicity.
    const newId = `req_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const payload = { 
      id: newId,
      ...data, 
      status: RequestStatus.PENDING 
    };

    if (supabase) {
      const { data: newReq, error } = await supabase.from('requests').insert([payload]).select().single();
      if (error) throw error;
      return newReq as PatientRequest;
    }
    
    throw new Error("Database connection missing");
  },

  updateRequest: async (id: string, updates: Partial<PatientRequest>): Promise<PatientRequest> => {
    if (supabase) {
      const { data, error } = await supabase.from('requests').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as PatientRequest;
    }
    throw new Error("Database connection missing");
  },

  /**
   * Uploads PDF to Supabase Storage and updates the request record with the public URL.
   */
  uploadCertificate: async (id: string, pdfBytes: Uint8Array): Promise<string | null> => {
    if (!supabase) return null;

    const fileName = `${id}.pdf`;
    
    // 1. Upload file
    const { error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(fileName, pdfBytes, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      console.error("Storage Upload Error:", uploadError);
      return null;
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('certificates')
      .getPublicUrl(fileName);

    // 3. Update Request Record with the URL (Auditable action)
    if (publicUrl) {
       await db.updateRequest(id, { 
         certificateUrl: publicUrl,
         certificateId: id // Ensure consistency
       });
    }
      
    return publicUrl;
  },

  verifyCertificate: async (certId: string): Promise<PatientRequest | undefined> => {
    if (supabase) {
      // Check by certificateId OR id (since we use id as certId sometimes)
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .or(`certificateId.eq.${certId},id.eq.${certId}`)
        .eq('status', RequestStatus.APPROVED)
        .single();
        
      if (error) return undefined;
      return data as PatientRequest;
    }
    return undefined;
  }
};