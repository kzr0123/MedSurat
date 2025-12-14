export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum CertificateType {
  SICK_LEAVE = 'SICK_LEAVE', // Surat Sakit
  HEALTH_CHECK = 'HEALTH_CHECK', // SKD / Surat Sehat
  REFERRAL = 'REFERRAL', // Rujukan
  NARCOTICS_FREE = 'NARCOTICS_FREE', // SKBN
  COMBINED = 'COMBINED', // SKD + SKBN
}

export interface PatientRequest {
  id: string;
  nik: string;
  fullName: string;
  email: string;
  dob: string;
  address: string;
  type: CertificateType;
  symptoms: string; // Used for complaints or purpose
  requestDate: string;
  status: RequestStatus;
  doctorNotes?: string;
  validFrom?: string;
  validUntil?: string;
  certificateId?: string;
  emailSent?: boolean;
}

export interface User {
  id: string;
  username: string;
  role: 'OFFICER' | 'ADMIN';
  name: string;
}