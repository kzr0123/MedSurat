export const EmailService = {
  sendApprovalEmail: async (to: string, patientName: string, certificateId: string) => {
    console.log(`[EmailService] Sending approval email to ${to}...`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, this would call an Edge Function or Email API (SendGrid, Resend, etc.)
    // and attach the generated PDF.
    console.log(`
      To: ${to}
      Subject: Surat Keterangan Medis Anda Siap!
      
      Halo ${patientName},
      
      Permohonan Anda telah disetujui. 
      ID Sertifikat: ${certificateId}
      
      Anda dapat memverifikasi dokumen melalui portal kami atau mengunduh PDF yang terlampir.
      
      Salam,
      Tim MedSurat
    `);
    
    return true;
  }
};