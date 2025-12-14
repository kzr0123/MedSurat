import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import QRCode from 'qrcode';
import { PatientRequest, CertificateType } from "../types/index";
import { format } from "date-fns";
import { id as localeId } from 'date-fns/locale';

interface PDFGeneratorOptions {
  returnBytes?: boolean;
}

export const generatePDF = async (request: PatientRequest, options: PDFGeneratorOptions = { returnBytes: false }): Promise<Uint8Array | void> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const { width, height } = page.getSize();
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  const drawTextCentered = (text: string, y: number, size: number, fontToUse: any, color = rgb(0, 0, 0)) => {
    const textWidth = fontToUse.widthOfTextAtSize(text, size);
    page.drawText(text, {
      x: (width - textWidth) / 2,
      y,
      size,
      font: fontToUse,
      color,
    });
  };

  // Header
  drawTextCentered("MedSurat Health Center", height - 50, 22, fontBold, rgb(0.05, 0.65, 0.91)); // Primary Color
  drawTextCentered("Jl. Digital No. 123, Jakarta Selatan, Indonesia", height - 70, 10, font);
  drawTextCentered("Tel: (021) 555-0199 | Email: info@medsurat.com", height - 85, 10, font);

  // Line
  page.drawLine({
    start: { x: 50, y: height - 100 },
    end: { x: width - 50, y: height - 100 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  // Title
  let title = "SURAT KETERANGAN DOKTER";
  if (request.type === CertificateType.SICK_LEAVE) title = "SURAT KETERANGAN SAKIT";
  else if (request.type === CertificateType.HEALTH_CHECK) title = "SURAT KETERANGAN SEHAT";
  else if (request.type === CertificateType.REFERRAL) title = "SURAT RUJUKAN";
  else if (request.type === CertificateType.NARCOTICS_FREE) title = "SURAT KETERANGAN BEBAS NARKOBA";
  else if (request.type === CertificateType.COMBINED) title = "SURAT KETERANGAN KESEHATAN & BEBAS NARKOBA";

  drawTextCentered(title, height - 140, 16, fontBold);
  drawTextCentered(`No: ${request.certificateId || 'PENDING'}`, height - 160, 12, font);

  // Patient Info
  let y = height - 200;
  const lineHeight = 20;
  const labelX = 50;
  const valueX = 180;

  page.drawText("Yang bertanda tangan di bawah ini, dokter pada MedSurat Health Center, menerangkan bahwa:", {
    x: 50,
    y,
    size: 11,
    font,
  });

  y -= 30;

  const fields = [
    { label: "Nama", value: request.fullName },
    { label: "NIK", value: request.nik },
    { label: "Tanggal Lahir", value: format(new Date(request.dob), 'd MMMM yyyy', { locale: localeId }) },
    { label: "Alamat", value: request.address },
  ];

  fields.forEach(field => {
    page.drawText(field.label, { x: labelX, y, size: 11, font });
    page.drawText(":", { x: valueX - 10, y, size: 11, font });
    page.drawText(field.value, { x: valueX, y, size: 11, font: fontBold });
    y -= lineHeight;
  });

  // Body / Notes
  y -= 20;
  page.drawText("Berdasarkan pemeriksaan medis, dinyatakan:", { x: 50, y, size: 11, font: fontBold });
  y -= 20;

  // Simple Word Wrap for Notes
  const notes = request.doctorNotes || "-";
  const words = notes.split(' ');
  let line = '';
  for (const word of words) {
    const testLine = line + word + ' ';
    const testWidth = font.widthOfTextAtSize(testLine, 11);
    if (testWidth > (width - 100)) {
      page.drawText(line, { x: 50, y, size: 11, font });
      line = word + ' ';
      y -= 15;
    } else {
      line = testLine;
    }
  }
  page.drawText(line, { x: 50, y, size: 11, font });
  y -= 20;

  // Validity Date (Specific to Sick Leave)
  if (request.validFrom && request.validUntil) {
    y -= 10;
    page.drawText("Diberikan istirahat sakit selama periode:", { x: 50, y, size: 11, font });
    y -= 15;
    const dateRange = `${format(new Date(request.validFrom), 'd MMMM yyyy', { locale: localeId })} s/d ${format(new Date(request.validUntil), 'd MMMM yyyy', { locale: localeId })}`;
    page.drawText(dateRange, { x: 50, y, size: 11, font: fontBold });
    y -= 20;
  }

  // Footer / Signature
  const footerY = y - 50;
  const dateStr = format(new Date(), 'd MMMM yyyy', { locale: localeId });
  
  page.drawText(`Jakarta, ${dateStr}`, { x: width - 200, y: footerY, size: 11, font });
  page.drawText("Dokter Pemeriksa,", { x: width - 200, y: footerY - 15, size: 11, font });
  
  page.drawText("( Digitally Signed )", { x: width - 200, y: footerY - 50, size: 10, font: fontItalic, color: rgb(0, 0.4, 0.8) });
  page.drawText("dr. MedSurat AI", { x: width - 200, y: footerY - 65, size: 11, font: fontBold });

  // QR Code
  try {
    const qrData = `${window.location.origin}/#/verify?id=${request.certificateId}`;
    const qrDataUrl = await QRCode.toDataURL(qrData);
    const qrImageBytes = await fetch(qrDataUrl).then(res => res.arrayBuffer());
    const qrImage = await pdfDoc.embedPng(qrImageBytes);
    
    page.drawImage(qrImage, {
      x: 50,
      y: footerY - 70,
      width: 80,
      height: 80,
    });
  } catch (err) {
    console.error("QR Error", err);
  }

  page.drawText("Scan untuk Verifikasi", { x: 55, y: footerY - 80, size: 9, font });
  page.drawText(request.certificateId || "PENDING", { x: 55, y: footerY - 92, size: 9, font: fontBold });

  const pdfBytes = await pdfDoc.save();

  if (options.returnBytes) {
    return pdfBytes;
  }
  
  // Trigger Download
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${request.certificateId || 'certificate'}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};