export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum CertificateType {
  SICK_LEAVE = 'SICK_LEAVE',
  HEALTH_CHECK = 'HEALTH_CHECK',
  REFERRAL = 'REFERRAL',
}

export interface PatientRequest {
  id: string;
  nik: string;
  fullName: string;
  dob: string;
  address: string;
  type: CertificateType;
  symptoms: string;
  requestDate: string;
  status: RequestStatus;
  doctorNotes?: string;
  validFrom?: string;
  validUntil?: string;
  certificateId?: string; // Generated upon approval
}

export interface User {
  id: string;
  username: string;
  role: 'OFFICER' | 'ADMIN';
  name: string;
}
