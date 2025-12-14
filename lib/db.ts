import { PatientRequest, RequestStatus, CertificateType } from '../types/index';
import { supabase } from './supabase';

// Mock Data for Fallback
const MOCK_REQUESTS: PatientRequest[] = [
  {
    id: 'req_123',
    nik: '3201123456780001',
    fullName: 'Budi Santoso',
    email: 'budi@example.com',
    dob: '1990-05-15',
    address: 'Jl. Merdeka No. 10, Jakarta',
    type: CertificateType.SICK_LEAVE,
    symptoms: 'High fever, dizziness, nausea since yesterday.',
    requestDate: new Date().toISOString(),
    status: RequestStatus.PENDING,
    emailSent: false
  },
  {
    id: 'req_124',
    nik: '3201987654320002',
    fullName: 'Siti Aminah',
    email: 'siti@example.com',
    dob: '1995-08-20',
    address: 'Jl. Sudirman Kav 50, Jakarta',
    type: CertificateType.HEALTH_CHECK,
    symptoms: 'Routine checkup for job application.',
    requestDate: new Date(Date.now() - 86400000).toISOString(),
    status: RequestStatus.APPROVED,
    certificateId: 'MC-2024-001',
    doctorNotes: 'Patient is in good health. Blood pressure 120/80. Fit for work.',
    validFrom: new Date().toISOString(),
    emailSent: true
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
  getRequests: async (): Promise<PatientRequest[]> => {
    if (supabase) {
      const { data, error } = await supabase.from('requests').select('*').order('requestDate', { ascending: false });
      if (error) throw error;
      return data as PatientRequest[];
    }
    
    // Fallback
    await delay(300);
    const stored = localStorage.getItem('medsurat_requests');
    if (!stored) {
      localStorage.setItem('medsurat_requests', JSON.stringify(MOCK_REQUESTS));
      return MOCK_REQUESTS;
    }
    return JSON.parse(stored);
  },

  getRequestById: async (id: string): Promise<PatientRequest | undefined> => {
    if (supabase) {
      const { data } = await supabase.from('requests').select('*').eq('id', id).single();
      return data as PatientRequest;
    }

    await delay(200);
    const requests = await db.getRequests();
    return requests.find(r => r.id === id);
  },

  createRequest: async (data: Omit<PatientRequest, 'id' | 'requestDate' | 'status'>): Promise<PatientRequest> => {
    if (supabase) {
      const { data: newReq, error } = await supabase.from('requests').insert([{ ...data, status: RequestStatus.PENDING }]).select().single();
      if (error) throw error;
      return newReq as PatientRequest;
    }

    await delay(500);
    const requests = await db.getRequests();
    const newRequest: PatientRequest = {
      ...data,
      id: `req_${Date.now()}`,
      requestDate: new Date().toISOString(),
      status: RequestStatus.PENDING,
      emailSent: false
    };
    requests.unshift(newRequest);
    localStorage.setItem('medsurat_requests', JSON.stringify(requests));
    return newRequest;
  },

  updateRequest: async (id: string, updates: Partial<PatientRequest>): Promise<PatientRequest> => {
    if (supabase) {
      const { data, error } = await supabase.from('requests').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as PatientRequest;
    }

    await delay(400);
    const requests = await db.getRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Request not found');

    const updated = { ...requests[index], ...updates };
    requests[index] = updated;
    localStorage.setItem('medsurat_requests', JSON.stringify(requests));
    return updated;
  },

  verifyCertificate: async (certId: string): Promise<PatientRequest | undefined> => {
    if (supabase) {
      const { data } = await supabase.from('requests').select('*').eq('certificateId', certId).single();
      return data || undefined;
    }

    await delay(300);
    const requests = await db.getRequests();
    return requests.find(r => r.certificateId === certId);
  }
};
