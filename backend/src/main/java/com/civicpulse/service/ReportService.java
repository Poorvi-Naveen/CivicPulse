// backend/src/main/java/com/civicpulse/service/ReportService.java
package com.civicpulse.service;

import com.civicpulse.model.Grievance;
import com.civicpulse.model.OfficerAssignment;
import com.civicpulse.repository.GrievanceRepository;
import com.civicpulse.repository.OfficerAssignmentRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;

@Service
public class ReportService {

    private final GrievanceRepository grievanceRepository;
    private final OfficerAssignmentRepository assignmentRepository;

    private static final Color BRAND_BLUE = new Color(0, 80, 158);
    private static final Color BRAND_ORANGE = new Color(255, 153, 51);
    private static final Color BRAND_GREEN = new Color(19, 136, 8);
    private static final Color LIGHT_GRAY_BG = new Color(245, 245, 245);

    public ReportService(GrievanceRepository grievanceRepository, OfficerAssignmentRepository assignmentRepository) {
        this.grievanceRepository = grievanceRepository;
        this.assignmentRepository = assignmentRepository;
    }

    public Map<String, Object> getGrievanceReportData(Long grievanceId) {
        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new RuntimeException("Grievance not found"));

        List<OfficerAssignment> assignments = assignmentRepository.findByGrievanceId(grievanceId);
        
        List<Map<String, String>> timeline = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        timeline.add(Map.of(
            "date", grievance.getCreatedAt().format(formatter),
            "event", "Grievance Submitted",
            "actor", grievance.getUser().getName(),
            "details", "Priority: " + grievance.getPriority()
        ));

        for (OfficerAssignment oa : assignments) {
            timeline.add(Map.of(
                "date", oa.getAssignedAt().format(formatter),
                "event", "Assigned to Officer",
                "actor", oa.getOfficer().getName() + " (" + oa.getDepartment() + ")",
                "details", "Deadline: " + oa.getDeadline().format(formatter)
            ));

            if (oa.getResolvedAt() != null) {
                timeline.add(Map.of(
                    "date", oa.getResolvedAt().format(formatter),
                    "event", "Resolution Submitted",
                    "actor", oa.getOfficer().getName(),
                    "details", "Remarks: " + (oa.getRemarks() != null ? oa.getRemarks() : "N/A")
                ));
            }
        }

        if (grievance.getStatus() == Grievance.Status.RESOLVED) {
             timeline.add(Map.of(
                "date", grievance.getUpdatedAt().format(formatter),
                "event", "Case Closed",
                "actor", "System/Admin",
                "details", "Grievance marked as RESOLVED"
            ));
        }

        timeline.sort(Comparator.comparing(m -> m.get("date")));

        Map<String, Object> response = new HashMap<>();
        response.put("grievance", grievance);
        response.put("timeline", timeline);
        return response;
    }

    public byte[] generatePdfReport(Long grievanceId) {
        Map<String, Object> data = getGrievanceReportData(grievanceId);
        Grievance g = (Grievance) data.get("grievance");
        List<Map<String, String>> timeline = (List<Map<String, String>>) data.get("timeline");

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 40, 40, 100, 50);
            PdfWriter writer = PdfWriter.getInstance(document, out);
            writer.setPageEvent(new CivicPulseHeaderFooter());

            document.open();

            PdfPTable metaTable = new PdfPTable(2);
            metaTable.setWidthPercentage(100);
            metaTable.setSpacingBefore(10f);
            metaTable.setSpacingAfter(20f);
            
            metaTable.addCell(createMetaCell("TICKET ID", "#" + g.getId()));
            metaTable.addCell(createMetaCell("DATE FILED", g.getCreatedAt().toString().substring(0, 10)));
            
            metaTable.addCell(createMetaCell("CATEGORY", g.getCategory().getCategoryName()));
            metaTable.addCell(createMetaCell("CURRENT STATUS", g.getStatus().toString()));

            metaTable.addCell(createMetaCell("CITIZEN", g.getUser().getName()));
            metaTable.addCell(createMetaCell("DEPARTMENT", g.getCategory() != null ? g.getCategory().getCategoryName() : "General"));

            document.add(metaTable);

            Paragraph descTitle = new Paragraph("Grievance Description", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BRAND_BLUE));
            descTitle.setSpacingAfter(5f);
            document.add(descTitle);

            PdfPTable descBox = new PdfPTable(1);
            descBox.setWidthPercentage(100);
            
            PdfPCell descCell = new PdfPCell(new Paragraph(g.getDescription(), FontFactory.getFont(FontFactory.HELVETICA, 10)));
            descCell.setPadding(12f);
            descCell.setBackgroundColor(LIGHT_GRAY_BG);
            descCell.setBorderColor(Color.LIGHT_GRAY);
            descCell.setBorderWidth(1f);
            
            descBox.addCell(descCell);
            document.add(descBox);

            document.add(new Paragraph("\n")); 

            Paragraph timeTitle = new Paragraph("Audit Trail & History", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BRAND_BLUE));
            timeTitle.setSpacingAfter(10f);
            document.add(timeTitle);

            PdfPTable table = new PdfPTable(3); 
            table.setWidthPercentage(100);
            table.setWidths(new float[]{3, 4, 5});

            table.addCell(createHeaderCell("Date & Time"));
            table.addCell(createHeaderCell("Event / Actor"));
            table.addCell(createHeaderCell("Details"));

            for (Map<String, String> event : timeline) {
                table.addCell(createBodyCell(event.get("date")));
                
                String eventActor = event.get("event") + "\n(" + event.get("actor") + ")";
                table.addCell(createBodyCell(eventActor));
                
                table.addCell(createBodyCell(event.get("details")));
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }

    private PdfPCell createMetaCell(String label, String value) {
        Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, Color.GRAY);
        Font valueFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);
        
        Paragraph p = new Paragraph();
        p.add(new Chunk(label + "\n", labelFont));
        p.add(new Chunk(value, valueFont));
        
        PdfPCell cell = new PdfPCell(p);
        cell.setBorder(Rectangle.BOTTOM);
        cell.setBorderColor(new Color(230, 230, 230));
        cell.setPaddingBottom(8f);
        cell.setPaddingTop(8f);
        return cell;
    }

    private PdfPCell createHeaderCell(String text) {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);
        PdfPCell cell = new PdfPCell(new Paragraph(text, font));
        cell.setBackgroundColor(BRAND_BLUE);
        cell.setPadding(8f);
        cell.setBorderColor(Color.WHITE);
        return cell;
    }
    
    private PdfPCell createBodyCell(String text) {
        Font font = FontFactory.getFont(FontFactory.HELVETICA, 9);
        PdfPCell cell = new PdfPCell(new Paragraph(text, font));
        cell.setPadding(8f);
        cell.setBorderColor(new Color(230, 230, 230));
        return cell;
    }

    class CivicPulseHeaderFooter extends PdfPageEventHelper {
        
        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            PdfContentByte cb = writer.getDirectContent();
            
            float headerY = document.top() + 60;
            
            ColumnText.showTextAligned(cb, Element.ALIGN_LEFT, 
                new Phrase("CivicPulse", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, BRAND_BLUE)), 
                document.left(), headerY, 0);
            
            ColumnText.showTextAligned(cb, Element.ALIGN_RIGHT, 
                new Phrase("OFFICIAL GRIEVANCE REPORT", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.GRAY)), 
                document.right(), headerY + 8, 0);

            float stripeY = headerY - 10;
            float totalWidth = document.right() - document.left();
            float segmentWidth = totalWidth / 3;

            cb.saveState();
            cb.setColorFill(BRAND_ORANGE);
            cb.rectangle(document.left(), stripeY, segmentWidth, 3);
            cb.fill();
            cb.setColorFill(BRAND_BLUE);
            cb.rectangle(document.left() + segmentWidth, stripeY, segmentWidth, 3);
            cb.fill();
            cb.setColorFill(BRAND_GREEN);
            cb.rectangle(document.left() + (segmentWidth * 2), stripeY, segmentWidth, 3);
            cb.fill();
            cb.restoreState();

            PdfContentByte canvas = writer.getDirectContentUnder();
            canvas.saveState();
            canvas.setColorFill(new Color(240, 240, 240));
            canvas.beginText();
            try {
                BaseFont bf = BaseFont.createFont(BaseFont.HELVETICA_BOLD, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
                canvas.setFontAndSize(bf, 55);
                canvas.showTextAligned(Element.ALIGN_CENTER, "CIVIC PULSE OFFICIAL", 
                    (document.right() + document.left()) / 2, 
                    (document.top() + document.bottom()) / 2, 
                    45); 
            } catch (Exception e) {
            }
            canvas.endText();
            canvas.restoreState();
            float footerY = document.bottom() - 20;
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            
            ColumnText.showTextAligned(cb, Element.ALIGN_CENTER, 
                new Phrase("Generated on " + timestamp + " • Page " + writer.getPageNumber(), 
                FontFactory.getFont(FontFactory.HELVETICA, 8, Color.GRAY)), 
                (document.right() + document.left()) / 2, footerY, 0);
        }
    }
}