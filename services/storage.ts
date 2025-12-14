import { PatientRequest, RequestStatus, CertificateType } from '../types';

// Initial Mock Data
const MOCK_REQUESTS: PatientRequest[] = [
  {
    id: 'req_123',
    nik: '3201123456780001',
    fullName: 'Budi Santoso',
    dob: '1990-05-15',
    address: 'Jl. Merdeka No. 10, Jakarta',
    type: CertificateType.SICK_LEAVE,
    symptoms: 'High fever, dizziness, nausea since yesterday.',
    requestDate: new Date().toISOString(),
    status: RequestStatus.PENDING,
  },
  {
    id: 'req_124',
    nik: '3201987654320002',
    fullName: 'Siti Aminah',
    dob: '1995-08-20',
    address: 'Jl. Sudirman Kav 50, Jakarta',
    type: CertificateType.HEALTH_CHECK,
    symptoms: 'Routine checkup for job application.',
    requestDate: new Date(Date.now() - 86400000).toISOString(),
    status: RequestStatus.APPROVED,
    certificateId: 'MC-2024-001',
    doctorNotes: 'Patient is in good health. Blood pressure 120/80. Fit for work.',
    validFrom: new Date().toISOString(),
  }
];

// Helper to simulate DB delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const StorageService = {
  getRequests: async (): Promise<PatientRequest[]> => {
    await delay(300);
    const stored = localStorage.getItem('medsurat_requests');
    if (!stored) {
      localStorage.setItem('medsurat_requests', JSON.stringify(MOCK_REQUESTS));
      return MOCK_REQUESTS;
    }
    return JSON.parse(stored);
  },

  getRequestById: async (id: string): Promise<PatientRequest | undefined> => {
    await delay(200);
    const requests = await StorageService.getRequests();
    return requests.find(r => r.id === id);
  },

  createRequest: async (data: Omit<PatientRequest, 'id' | 'requestDate' | 'status'>): Promise<PatientRequest> => {
    await delay(500);
    const requests = await StorageService.getRequests();
    const newRequest: PatientRequest = {
      ...data,
      id: `req_${Date.now()}`,
      requestDate: new Date().toISOString(),
      status: RequestStatus.PENDING,
    };
    requests.unshift(newRequest);
    localStorage.setItem('medsurat_requests', JSON.stringify(requests));
    return newRequest;
  },

  updateRequest: async (id: string, updates: Partial<PatientRequest>): Promise<PatientRequest> => {
    await delay(400);
    const requests = await StorageService.getRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Request not found');

    const updated = { ...requests[index], ...updates };
    requests[index] = updated;
    localStorage.setItem('medsurat_requests', JSON.stringify(requests));
    return updated;
  },

  verifyCertificate: async (certId: string): Promise<PatientRequest | undefined> => {
    await delay(300);
    const requests = await StorageService.getRequests();
    return requests.find(r => r.certificateId === certId);
  }
};
