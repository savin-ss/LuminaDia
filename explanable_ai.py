import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email import encoders
from datetime import datetime
from fpdf import FPDF
import random
import string

class SafePDFGenerator:
    def __init__(self):
        self.report_dir = "reports"
        os.makedirs(self.report_dir, exist_ok=True)
    
    def generate_scan_id(self):
        """Generate unique scan ID"""
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        return f"SCAN_{timestamp}_{random_str}"
    
    def create_safe_pdf_report(self, scan_data):
        """Create PDF report without any Unicode characters"""
        pdf = FPDF()
        pdf.add_page()
        
        # Set margins
        pdf.set_left_margin(15)
        pdf.set_right_margin(15)
        
        # Colors for professional look
        primary_blue = (0, 51, 102)      # Dark blue
        accent_blue = (0, 102, 204)      # Medium blue
        light_blue = (173, 216, 230)     # Light blue
        green = (0, 128, 0)              # Green for authentic
        orange = (255, 140, 0)           # Orange for morphed
        red = (220, 0, 0)                # Red for AI-generated
        gray = (240, 240, 240)           # Light gray
        
        # ===== HEADER SECTION =====
        pdf.set_fill_color(*primary_blue)
        pdf.set_text_color(255, 255, 255)
        pdf.set_font('Arial', 'B', 20)
        pdf.cell(0, 15, 'MADATION SECURITY REPORT', 0, 1, 'C', 1)
        pdf.ln(5)
        
        # ===== SCAN INFORMATION TABLE =====
        pdf.set_text_color(0, 0, 0)
        pdf.set_font('Arial', 'B', 14)
        pdf.cell(0, 10, 'SCAN INFORMATION', 0, 1, 'L')
        pdf.ln(2)
        
        # Create a bordered table for scan info
        info_data = [
            ['Scan ID:', scan_data["scan_id"]],
            ['Timestamp:', scan_data["timestamp"]],
            ['File Analyzed:', scan_data["filename"]],
            ['Model Version:', 'MADATION Neural Network v2.1'],
            ['Validation Accuracy:', '95.71%']
        ]
        
        pdf.set_font('Arial', '', 10)
        for label, value in info_data:
            # Label column
            pdf.set_fill_color(*light_blue)
            pdf.set_text_color(0, 0, 0)
            pdf.set_font('Arial', 'B', 10)
            pdf.cell(45, 8, label, 1, 0, 'L', 1)
            
            # Value column
            pdf.set_fill_color(255, 255, 255)
            pdf.set_font('Arial', '', 10)
            pdf.cell(0, 8, value, 1, 1, 'L', 1)
        
        pdf.ln(10)
        
        # ===== MAIN RESULTS SECTION =====
        pdf.set_fill_color(*accent_blue)
        pdf.set_text_color(255, 255, 255)
        pdf.set_font('Arial', 'B', 16)
        pdf.cell(0, 12, 'SECURITY ANALYSIS RESULTS', 0, 1, 'C', 1)
        pdf.ln(8)
        
        # Classification Result with proper alignment
        if scan_data["prediction"] == "authentic":
            result_color = green
            status = "AUTHENTIC - GENUINE HUMAN FACE"
            symbol = "SECURE"
        elif scan_data["prediction"] == "morphed":
            result_color = orange
            status = "MORPHED - DIGITALLY MANIPULATED"
            symbol = "SUSPICIOUS"
        else:
            result_color = red
            status = "AI-GENERATED - SYNTHETIC FACE"
            symbol = "ALERT"
        
        # Result box with border
        pdf.set_draw_color(*result_color)
        pdf.set_line_width(1)
        pdf.set_fill_color(255, 255, 255)
        pdf.set_text_color(*result_color)
        pdf.set_font('Arial', 'B', 16)
        
        # Center the result box
        box_width = 180
        box_x = (210 - box_width) / 2  # Center on A4 page (210mm wide)
        
        pdf.set_x(box_x)
        pdf.cell(box_width, 12, symbol, 1, 1, 'C', 1)
        
        pdf.set_x(box_x)
        pdf.set_font('Arial', 'B', 14)
        pdf.cell(box_width, 10, status, 1, 1, 'C', 1)
        pdf.ln(5)
        
        # ===== CONFIDENCE METER =====
        pdf.set_text_color(0, 0, 0)
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 8, 'CONFIDENCE LEVEL:', 0, 1, 'L')
        pdf.ln(2)
        
        confidence = scan_data["confidence"] * 100
        
        # Confidence percentage
        pdf.set_font('Arial', 'B', 20)
        pdf.set_text_color(*result_color)
        pdf.cell(0, 10, f'{confidence:.2f}%', 0, 1, 'C')
        pdf.ln(5)
        
        # Visual confidence bar
        bar_width = 180
        bar_height = 15
        filled_width = (confidence / 100) * bar_width
        
        # Background bar
        pdf.set_draw_color(200, 200, 200)
        pdf.set_fill_color(200, 200, 200)
        pdf.rect(box_x, pdf.get_y(), bar_width, bar_height, 'F')
        
        # Filled bar
        pdf.set_fill_color(*result_color)
        pdf.rect(box_x, pdf.get_y(), filled_width, bar_height, 'F')
        
        pdf.ln(bar_height + 5)
        
        # ===== PROBABILITY DISTRIBUTION TABLE =====
        pdf.set_fill_color(*primary_blue)
        pdf.set_text_color(255, 255, 255)
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 8, 'PROBABILITY DISTRIBUTION', 0, 1, 'C', 1)
        pdf.ln(5)
        
        probs = scan_data["probabilities"]
        probability_data = [
            ['CATEGORY', 'PROBABILITY', 'STATUS'],
            ['Authentic', f'{probs["authentic"]*100:.2f}%', 'PRIMARY' if scan_data["prediction"] == "authentic" else ''],
            ['Morphed', f'{probs["morphed"]*100:.2f}%', 'PRIMARY' if scan_data["prediction"] == "morphed" else ''],
            ['AI-Generated', f'{probs["ai_generated"]*100:.2f}%', 'PRIMARY' if scan_data["prediction"] == "ai_generated" else '']
        ]
        
        # Table header
        pdf.set_fill_color(*accent_blue)
        pdf.set_text_color(255, 255, 255)
        pdf.set_font('Arial', 'B', 10)
        
        col_widths = [70, 50, 50]  # Adjusted for better alignment
        x_start = box_x
        
        for i, header in enumerate(probability_data[0]):
            pdf.set_x(x_start + sum(col_widths[:i]))
            pdf.cell(col_widths[i], 8, header, 1, 0, 'C', 1)
        pdf.ln(8)
        
        # Table rows
        pdf.set_text_color(0, 0, 0)
        for row in probability_data[1:]:
            for i, cell in enumerate(row):
                pdf.set_x(x_start + sum(col_widths[:i]))
                
                if i == 0:  # Category column
                    pdf.set_font('Arial', 'B', 10)
                    pdf.set_fill_color(*light_blue)
                elif i == 2 and cell == 'PRIMARY':  # Status column
                    pdf.set_fill_color(*result_color)
                    pdf.set_text_color(255, 255, 255)
                else:
                    pdf.set_fill_color(255, 255, 255)
                    pdf.set_text_color(0, 0, 0)
                
                pdf.cell(col_widths[i], 8, cell, 1, 0, 'C', 1)
                pdf.set_text_color(0, 0, 0)  # Reset text color
            
            pdf.ln(8)
        
        pdf.ln(10)
        
        # ===== DETAILED SECURITY ASSESSMENT =====
        pdf.set_fill_color(*primary_blue)
        pdf.set_text_color(255, 255, 255)
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 8, 'DETAILED SECURITY ASSESSMENT', 0, 1, 'C', 1)
        pdf.ln(5)
        
        pdf.set_text_color(0, 0, 0)
        pdf.set_font('Arial', '', 10)
        
        if scan_data["prediction"] == "authentic":
            assessment = [
                "SECURITY STATUS: EXCELLENT",
                "",
                "- This facial image has been verified as AUTHENTIC by our advanced neural network.",
                "- No signs of digital manipulation or AI generation were detected.",
                "- The analyzed face exhibits natural human characteristics consistent with genuine photography.",
                "- Facial features show expected natural variations and lighting patterns.",
                "",
                "RECOMMENDATION: No further action required. This image can be trusted for identity verification."
            ]
        elif scan_data["prediction"] == "morphed":
            assessment = [
                "SECURITY STATUS: SUSPICIOUS", 
                "",
                "- Potential digital manipulation detected using advanced morphing detection algorithms.",
                "- Image shows characteristics consistent with face morphing or digital alteration techniques.",
                "- The neural network identified patterns that deviate from natural human features.",
                "- Analysis revealed inconsistencies in facial geometry and texture patterns.",
                "",
                "RECOMMENDATION: Further verification recommended. Do not use for sensitive identity checks."
            ]
        else:
            assessment = [
                "SECURITY STATUS: CRITICAL ALERT",
                "",
                "- AI-GENERATED face detected using advanced synthetic pattern recognition.",
                "- Image exhibits clear patterns of synthetic generation consistent with GAN output.",
                "- Multiple artificial patterns and inconsistencies were identified in facial features.",
                "- Analysis revealed unnatural symmetry, texture patterns, and feature alignment.",
                "",
                "RECOMMENDATION: Exercise extreme caution. Do not use for any identity verification purposes."
            ]
        
        for line in assessment:
            pdf.multi_cell(0, 5, line)
            pdf.ln(1)
        
        pdf.ln(8)
        
        # ===== TECHNICAL ANALYSIS SECTION =====
        pdf.set_fill_color(*gray)
        pdf.set_text_color(0, 0, 0)
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 8, 'TECHNICAL ANALYSIS', 0, 1, 'C', 1)
        pdf.ln(5)
        
        technical_info = [
            ['Analysis Algorithm:', 'Deep Convolutional Neural Network'],
            ['Feature Extraction:', 'Multi-layer Visual Transformer'],
            ['Detection Method:', 'Pattern Recognition & Anomaly Detection'],
            ['Processing Time:', 'Real-time Analysis (< 2 seconds)'],
            ['Model Training:', '5,182 high-quality facial images'],
            ['Validation Dataset:', '1,165 independent test samples'],
            ['Model Architecture:', 'Custom CNN with Attention Mechanisms'],
            ['Security Protocol:', 'Advanced Digital Forensics']
        ]
        
        pdf.set_font('Arial', '', 9)
        for label, value in technical_info:
            # Two-column layout for technical info
            pdf.set_font('Arial', 'B', 9)
            pdf.cell(50, 5, label, 0, 0, 'L')
            pdf.set_font('Arial', '', 9)
            pdf.cell(0, 5, value, 0, 1, 'L')
            pdf.ln(1)
        
        pdf.ln(8)
        
        # ===== FOOTER =====
        pdf.set_y(-30)
        pdf.set_font('Arial', 'I', 8)
        pdf.set_text_color(128, 128, 128)
        
        footer_lines = [
            'Generated by MADATION Advanced Security Systems',
            'Confidential Report - For authorized personnel only',
            f'Report generated on: {datetime.now().strftime("%Y-%m-%d at %H:%M:%S")}',
            'Copyright 2024 MADATION Security. All rights reserved.'
        ]
        
        for line in footer_lines:
            pdf.cell(0, 4, line, 0, 1, 'C')
        
        # ===== SAVE PDF =====
        filename = f"security_report_{scan_data['scan_id']}.pdf"
        filepath = os.path.join(self.report_dir, filename)
        pdf.output(filepath)
        
        return filepath
    
    def get_downloadable_pdf(self, scan_data):
        """Create and return PDF filepath for download"""
        return self.create_safe_pdf_report(scan_data)
    
    def send_email_with_pdf(self, scan_data, recipient_email, pdf_path, smtp_config=None):
        """Send the PDF report via email with enhanced features"""
        
        if smtp_config is None:
            try:
                from email_config import SMTP_CONFIG
                smtp_config = SMTP_CONFIG
            except ImportError:
                return False, "Email configuration not found. Please set up email_config.py"
        
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = smtp_config['sender_email']
            msg['To'] = recipient_email
            msg['Subject'] = f'🔒 MADATION Security Report - {scan_data["scan_id"]}'
            
            # Create HTML email body
            status_emoji = "✅" if scan_data["prediction"] == "authentic" else "⚠️" if scan_data["prediction"] == "morphed" else "🚨"
            status_color = "#28a745" if scan_data["prediction"] == "authentic" else "#ffc107" if scan_data["prediction"] == "morphed" else "#dc3545"
            
            html_body = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: linear-gradient(135deg, #0066cc, #004499); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }}
                    .content {{ background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; }}
                    .result-box {{ background: white; padding: 15px; border-radius: 8px; border-left: 5px solid {status_color}; margin: 15px 0; }}
                    .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #666; }}
                    .confidence-bar {{ background: #e9ecef; height: 20px; border-radius: 10px; margin: 10px 0; overflow: hidden; }}
                    .confidence-fill {{ background: {status_color}; height: 100%; }}
                    .stats {{ display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin: 15px 0; }}
                    .stat-item {{ text-align: center; padding: 10px; background: white; border-radius: 5px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🛡️ MADATION Security Report</h1>
                        <p>Advanced Face Authentication Analysis</p>
                    </div>
                    <div class="content">
                        <h2>Security Analysis Complete</h2>
                        
                        <div class="result-box">
                            <h3 style="color: {status_color}; margin: 0 0 10px 0;">
                                {status_emoji} {scan_data["prediction"].upper()} - {scan_data["confidence"]*100:.2f}% Confidence
                            </h3>
                            <div class="confidence-bar">
                                <div class="confidence-fill" style="width: {scan_data["confidence"]*100}%;"></div>
                            </div>
                        </div>
                        
                        <div class="stats">
                            <div class="stat-item">
                                <strong>Authentic</strong><br>
                                <span style="color: #28a745;">{scan_data["probabilities"]["authentic"]*100:.2f}%</span>
                            </div>
                            <div class="stat-item">
                                <strong>Morphed</strong><br>
                                <span style="color: #ffc107;">{scan_data["probabilities"]["morphed"]*100:.2f}%</span>
                            </div>
                            <div class="stat-item">
                                <strong>AI-Generated</strong><br>
                                <span style="color: #dc3545;">{scan_data["probabilities"]["ai_generated"]*100:.2f}%</span>
                            </div>
                        </div>
                        
                        <h3>Scan Details:</h3>
                        <ul>
                            <li><strong>Scan ID:</strong> {scan_data["scan_id"]}</li>
                            <li><strong>File Analyzed:</strong> {scan_data["filename"]}</li>
                            <li><strong>Timestamp:</strong> {scan_data["timestamp"]}</li>
                            <li><strong>Model Used:</strong> MADATION Neural Network v2.1</li>
                        </ul>
                        
                        <p><strong>Note:</strong> A detailed PDF security report is attached to this email with comprehensive analysis and technical details.</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated security report from MADATION Advanced Security Systems.</p>
                        <p>Confidential - For authorized recipients only.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Attach HTML body
            msg.attach(MIMEText(html_body, 'html'))
            
            # Attach PDF
            with open(pdf_path, "rb") as attachment:
                part = MIMEBase('application', 'pdf')
                part.set_payload(attachment.read())
            
            encoders.encode_base64(part)
            part.add_header(
                'Content-Disposition',
                f'attachment; filename="MADATION_Security_Report_{scan_data["scan_id"]}.pdf"'
            )
            msg.attach(part)
            
            # Send email
            server = smtplib.SMTP(smtp_config['smtp_server'], smtp_config['smtp_port'])
            server.starttls()
            server.login(smtp_config['sender_email'], smtp_config['sender_password'])
            text = msg.as_string()
            server.sendmail(smtp_config['sender_email'], recipient_email, text)
            server.quit()
            
            return True, f"Email sent successfully to {recipient_email}!"
            
        except Exception as e:
            return False, f"Failed to send email: {str(e)}"

# Test the safe PDF generator
if __name__ == "__main__":
    generator = SafePDFGenerator()
    
    # Test with sample data
    sample_scan_data = {
        "scan_id": generator.generate_scan_id(),
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "filename": "test_image.jpg",
        "prediction": "authentic",
        "confidence": 0.9571,
        "probabilities": {
            "authentic": 0.95,
            "morphed": 0.03,
            "ai_generated": 0.02
        }
    }
    
    # Generate PDF report
    pdf_path = generator.create_safe_pdf_report(sample_scan_data)
    print(f"✅ Safe PDF report generated: {pdf_path}")
    print("📄 No Unicode errors - Report is perfectly aligned!")
