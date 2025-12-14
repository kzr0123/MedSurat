import { jsPDF } from "jspdf";
import { PatientRequest, CertificateType } from "../types";

export const generatePDF = (request: PatientRequest) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(14, 165, 233); // Primary Color
  doc.text("MedSurat Health Center", 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Jl. Digital No. 123, Jakarta Selatan, Indonesia", 105, 26, { align: "center" });
  doc.text("Tel: (021) 555-0199 | Email: info@medsurat.com", 105, 31, { align: "center" });
  
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);

  // Title
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  
  let title = "MEDICAL CERTIFICATE";
  if (request.type === CertificateType.SICK_LEAVE) title = "SURAT KETERANGAN SAKIT";
  else if (request.type === CertificateType.HEALTH_CHECK) title = "SURAT KETERANGAN SEHAT";
  else if (request.type === CertificateType.REFERRAL) title = "SURAT RUJUKAN";

  doc.text(title, 105, 50, { align: "center" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`No: ${request.certificateId}`, 105, 56, { align: "center" });

  // Body
  const startY = 70;
  const lineHeight = 8;
  
  doc.text("Yang bertanda tangan di bawah ini, dokter pada MedSurat Health Center, menerangkan bahwa:", 20, startY);

  doc.text(`Nama`, 30, startY + lineHeight * 2);
  doc.text(`: ${request.fullName}`, 80, startY + lineHeight * 2);

  doc.text(`NIK`, 30, startY + lineHeight * 3);
  doc.text(`: ${request.nik}`, 80, startY + lineHeight * 3);

  doc.text(`Tanggal Lahir`, 30, startY + lineHeight * 4);
  doc.text(`: ${request.dob}`, 80, startY + lineHeight * 4);

  doc.text(`Alamat`, 30, startY + lineHeight * 5);
  doc.text(`: ${request.address}`, 80, startY + lineHeight * 5);

  // Diagnosis / Notes
  const notesY = startY + lineHeight * 7;
  doc.text("Berdasarkan pemeriksaan medis, dinyatakan:", 20, notesY);
  
  const splitNotes = doc.splitTextToSize(request.doctorNotes || "-", 170);
  doc.text(splitNotes, 20, notesY + lineHeight);

  // Date validity for Sick Leave
  let currentY = notesY + lineHeight + (splitNotes.length * 7);
  
  if (request.validFrom && request.validUntil) {
    currentY += 10;
    doc.text(`Diberikan istirahat sakit selama periode:`, 20, currentY);
    doc.text(`${new Date(request.validFrom).toLocaleDateString()} s/d ${new Date(request.validUntil).toLocaleDateString()}`, 20, currentY + 7);
    currentY += 10;
  }

  // Footer / Signature
  const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  
  doc.text(`Jakarta, ${dateStr}`, 140, currentY + 30);
  doc.text("Dokter Pemeriksa,", 140, currentY + 36);
  
  // Simulated Signature
  doc.setFont("times", "italic");
  doc.text("( Signed Digitally )", 140, currentY + 55);
  doc.setFont("helvetica", "bold");
  doc.text("dr. MedSurat AI", 140, currentY + 65);

  // QR Code Placeholder
  doc.setDrawColor(0);
  doc.rect(20, currentY + 30, 30, 30);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Scan to Verify", 23, currentY + 65);
  doc.text(request.certificateId || "PENDING", 20, currentY + 69);

  // Save
  doc.save(`${request.certificateId || 'certificate'}.pdf`);
};
