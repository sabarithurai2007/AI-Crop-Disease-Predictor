import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def generate_pdf_report(prediction, output_path):
    """
    Generates a professional PDF report for a crop disease diagnosis.
    
    prediction: dictionary containing prediction details (crop_name, disease_name, 
                confidence, status, symptoms, causes, treatment, prevention, image_path, created_at)
    output_path: path to save the generated PDF file.
    """
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    
    story = []
    styles = getSampleStyleSheet()
    
    # Custom Palette
    PRIMARY_GREEN = colors.HexColor("#1b4332")   # Deep forest green
    ACCENT_GREEN = colors.HexColor("#2d6a4f")    # Soft emerald green
    LIGHT_BG = colors.HexColor("#f4f9f4")        # Off-white green tint
    TEXT_DARK = colors.HexColor("#222222")       # Charcoal for body text
    BORDER_GRAY = colors.HexColor("#dcdcdc")
    
    # Custom Paragraph Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        textColor=PRIMARY_GREEN,
        spaceAfter=15,
        alignment=0 # Left-aligned
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=10,
        textColor=colors.HexColor("#555555"),
        spaceAfter=20
    )
    
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        textColor=ACCENT_GREEN,
        spaceBefore=15,
        spaceAfter=6,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=10,
        textColor=TEXT_DARK,
        leading=14,
        spaceAfter=10
    )
    
    meta_label = ParagraphStyle(
        'MetaLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        textColor=PRIMARY_GREEN
    )
    
    meta_val = ParagraphStyle(
        'MetaValue',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=TEXT_DARK
    )
    
    # Header Banner (A solid green banner or bar)
    banner_data = [
        [Paragraph("<font color='white'><b>AGRIGUARD AI - DIAGNOSIS REPORT</b></font>", ParagraphStyle('Banner', parent=title_style, fontSize=14, textColor=colors.white))]
    ]
    banner_table = Table(banner_data, colWidths=[doc.width])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), PRIMARY_GREEN),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 15))
    
    # Title Section
    story.append(Paragraph("Leaf Pathology Assessment", title_style))
    story.append(Paragraph(f"Generated on {prediction.get('created_at', 'N/A')} | System: {prediction.get('prediction_method', 'AI Classifier')}", subtitle_style))
    
    # Create Layout Split: Left (Metadata Table) and Right (Image)
    # Metadata Table details
    status_color = "#15803d" if prediction.get("status") == "Healthy" else "#b91c1c"
    status_html = f"<font color='{status_color}'><b>{prediction.get('status', 'Unknown').upper()}</b></font>"
    
    table_data = [
        [Paragraph("Crop Category:", meta_label), Paragraph(prediction.get("crop_name", "N/A"), meta_val)],
        [Paragraph("Condition / Diagnosis:", meta_label), Paragraph(prediction.get("disease_name", "N/A"), meta_val)],
        [Paragraph("Status:", meta_label), Paragraph(status_html, meta_val)],
        [Paragraph("Confidence Score:", meta_label), Paragraph(f"{prediction.get('confidence', 0.0)}%", meta_val)],
        [Paragraph("Date of Upload:", meta_label), Paragraph(prediction.get("created_at", "N/A"), meta_val)],
    ]
    
    meta_table = Table(table_data, colWidths=[1.5*inch, 2.5*inch])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 8),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_GRAY),
    ]))
    
    # Image Section
    # Check if image path exists
    img_element = Paragraph("<b>No leaf image provided.</b>", body_style)
    img_path = prediction.get("image_path")
    
    if img_path and os.path.exists(img_path):
        try:
            # Resize image to fit nicely (width 140, height 140)
            img_element = Image(img_path, width=1.8*inch, height=1.8*inch)
        except Exception as e:
            print(f"Error drawing image in PDF: {e}")
            
    # Combine metadata table and image in a 2-column parent table
    layout_data = [
        [meta_table, img_element]
    ]
    layout_table = Table(layout_data, colWidths=[4.2*inch, 2.8*inch])
    layout_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ALIGN', (1,0), (1,0), 'CENTER'),
        ('LEFTPADDING', (1,0), (1,0), 20),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    
    story.append(layout_table)
    story.append(Spacer(1, 10))
    story.append(Paragraph("<hr color='#dcdcdc' width='100%'/>", body_style))
    
    # Pathology Findings Sections
    # 1. Symptoms
    story.append(Paragraph("Clinical Symptoms", section_heading))
    story.append(Paragraph(prediction.get("symptoms", "No symptoms documented."), body_style))
    
    # 2. Causes
    story.append(Paragraph("Primary Causes & Pathogen Info", section_heading))
    story.append(Paragraph(prediction.get("causes", "No etiology details documented."), body_style))
    
    # 3. Treatment
    story.append(Paragraph("Recommended Treatment Actions", section_heading))
    story.append(Paragraph(prediction.get("treatment", "No treatment steps documented."), body_style))
    
    # 4. Prevention
    story.append(Paragraph("Long-term Prevention Tips", section_heading))
    story.append(Paragraph(prediction.get("prevention", "No preventive measures documented."), body_style))
    
    # Footer elements
    story.append(Spacer(1, 20))
    story.append(Paragraph("<hr color='#1b4332' width='100%'/>", body_style))
    
    footer_style = ParagraphStyle(
        'FooterStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        textColor=colors.HexColor("#777777"),
        alignment=1 # Center aligned
    )
    story.append(Paragraph("This is an AI-generated crop health assessment. Use as a reference. For large-scale outbreaks, consult local agricultural extension services.", footer_style))
    
    # Build Document
    doc.build(story)
    print(f"PDF generated successfully at {output_path}")
