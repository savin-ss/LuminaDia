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

class AdvancedReportGenerator:
    def __init__(self):
        self.report_dir = "reports"
        os.makedirs(self.report_dir, exist_ok=True)
    
    def generate_scan_id(self):
        """Generate unique scan ID"""
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        return f"SCAN_{timestamp}_{random_str}"
    
    def create_professional_pdf_report(self, scan_data, image_path=None):
        """Create a professional PDF security report"""
        pdf = FPDF()
        pdf.add_page()
        
        # Colors for the report
        primary_green = (0, 100, 0)
        light_green = (0, 150, 0)
        alert_red = (220, 0, 0)
        warning_orange = (255, 165, 0)
        dark_gray = (40, 40, 40)
        
        # Header with logo
        pdf.set_fill_color(*primary_green)
        pdf.set_text_color(255, 255, 255)
        pdf.set_font('Arial', 'B', 20)
        pdf.cell(0, 15, '🛡️ MADATION SECURITY REPORT', 0, 1, 'C', 1)
        pdf.ln(5)
        
        # Scan Information Table
        pdf.set_text_color(0, 0, 0)
        pdf.set_font('Arial', 'B', 14)
        pdf.cell(0, 10, 'SCAN INFORMATION', 0, 1)
        pdf.set_font('Arial', '', 10)
        
        # Create a table for scan info
        info_data = [
            ['Scan ID:', scan_data["scan_id"]],
            ['Timestamp:', scan_data["timestamp"]],
            ['File Analyzed:', scan_data["filename"]],
            ['Model Version:', 'MADATION Neural Network v2.1'],
            ['Validation Accuracy:', '95.71%']
        ]
        
        for label, value in info_data:
            pdf.set_font('Arial', 'B', 10)
            pdf.cell(40, 6, label, 0, 0)
            pdf.set_font('Arial', '', 10)
            pdf.cell(0, 6, value, 0, 1)
        
        pdf.ln(10)
        
        # Results Section - Highlighted
        pdf.set_fill_color(*light_green)
        pdf.set_text_color(255, 255, 255)
        pdf.set_font('Arial', 'B', 16)
        pdf.cell(0, 12, 'SECURITY ANALYSIS RESULTS', 0, 1, 'C', 1)
        pdf.ln(8)
        
        # Classification Result with color coding
        if scan_data["prediction"] == "authentic":
            result_color = light_green
            status = "AUTHENTIC - GENUINE HUMAN FACE"
            icon = "✅"
        elif scan_data["prediction"] == "morphed":
            result_color = warning_orange
            status = "MORPHED - DIGITALLY MANIPULATED"
            icon = "⚠️"
        else:
            result_color = alert_red
            status = "AI-GENERATED - SYNTHETIC FACE"
            icon = "🚨"
        
        pdf.set_text_color(*result_color)
        pdf.set_font('Arial', 'B', 18)
        pdf.cell(0, 10, f'{icon} {status}', 0, 1, 'C')
        pdf.ln(5)
        
        # Confidence Meter
        pdf.set_text_color(0, 0, 0)
        pdf.set_font('Arial', 'B', 14)
        pdf.cell(0, 8, 'CONFIDENCE LEVEL', 0, 1)
        
        # Confidence bar (visual representation)
        confidence = scan_data["confidence"] * 100
        bar_width = 190
        filled_width = (confidence / 100) * bar_width
        
        pdf.set_fill_color(200, 200, 200)  # Gray background
        pdf.cell(bar_width, 8, '', 0, 0, 'L', 1)
        pdf.ln(8)
        
        pdf.set_fill_color(*result_color)  # Filled part
        pdf.cell(filled_width, 8, '', 0, 0, 'L', 1)
        pdf.ln(8)
        
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 8, f'{confidence:.2f}%', 0, 1, 'C')
        pdf.ln(10)
        
        # Probability Distribution Table
        pdf.set_fill_color(*dark_gray)
        pdf.set_text_color(255, 255, 255)
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 8, 'PROBABILITY DISTRIBUTION', 0, 1, 'C', 1)
        pdf.ln(5)
        
        probs = scan_data["probabilities"]
        probability_data = [
            ['CATEGORY', 'PROBABILITY', 'STATUS'],
            ['Authentic', f'{probs["authentic"]*100:.2f}%', '✅' if scan_data["prediction"] == "authentic" else ''],
            ['Morphed', f'{probs["morphed"]*100:.2f}%', '⚠️' if scan_data["prediction"] == "morphed" else ''],
            ['AI-Generated', f'{probs["ai_generated"]*100:.2f}%', '🚨' if scan_data["prediction"] == "ai_generated" else '']
        ]
        
        pdf.set_text_color(0, 0, 0)
        for row in probability_data:
            pdf.set_font('Arial', 'B', 10) if row[0] == 'CATEGORY' else pdf.set_font('Arial', '', 10)
            pdf.cell(60, 8, row[0], 1, 0, 'C')
            pdf.cell(60, 8, row[1], 1, 0, 'C')
            pdf.cell(60, 8, row[2], 1, 1, 'C')
        
        pdf.ln(10)
        
        # Detailed Security Assessment
        pdf.set_fill_color(*dark_gray)
        pdf.set_text_color(255, 255, 255)
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 8, 'DETAILED SECURITY ASSESSMENT', 0, 1, 'C', 1)
        pdf.ln(5)
        
        pdf.set_text_color(0, 0, 0)
        pdf.set_font('Arial', '', 10)
        
        if scan_data["prediction"] == "authentic":
            assessment = [
                "✅ SECURITY STATUS: EXCELLENT",
                "This facial image has been verified as AUTHENTIC by our advanced neural network.",
                "No signs of digital manipulation or AI generation were detected.",
                "The analyzed face exhibits natural human characteristics consistent with genuine photography.",
                "",
                "RECOMMENDATION: No further action required. This image can be trusted for identity verification."
            ]
        elif scan_data["prediction"] == "morphed":
            assessment = [
                "⚠️ SECURITY STATUS: SUSPICIOUS", 
                "Potential digital manipulation detected. This image shows characteristics",
                "consistent with face morphing or digital alteration techniques.",
                "The neural network identified patterns that deviate from natural human features.",
                "",
                "RECOMMENDATION: Further verification recommended. Do not use for sensitive identity checks."
            ]
        else:
            assessment = [
                "🚨 SECURITY STATUS: CRITICAL ALERT",
                "AI-GENERATED face detected. This image exhibits clear patterns of synthetic generation.",
                "The analyzed face shows characteristics typical of GAN (Generative Adversarial Network) output.",
                "Multiple artificial patterns and inconsistencies were identified.",
                "",
                "RECOMMENDATION: Exercise extreme caution. Do not use for any identity verification purposes."
            ]
        
        for line in assessment:
            pdf.multi_cell(0, 6, line)
            pdf.ln(2)
        
        pdf.ln(10)
        
        # Technical Analysis Section
        pdf.set_fill_color(240, 240, 240)
        pdf.set_text_color(0, 0, 0)
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 8, 'TECHNICAL ANALYSIS', 0, 1, 'C', 1)
        pdf.ln(5)
        
        technical_info = [
            ['Analysis Algorithm:', 'Deep Convolutional Neural Network'],
            ['Feature Extraction:', 'Multi-layer Visual Transformer'],
            ['Detection Method:', 'Pattern Recognition & Anomaly Detection'],
            ['Processing Time:', 'Real-time Analysis'],
            ['Model Training:', '5,182 facial images'],
            ['Validation Dataset:', '1,165 independent samples']
        ]
        
        pdf.set_font('Arial', '', 9)
        for label, value in technical_info:
            pdf.set_font('Arial', 'B', 9)
            pdf.cell(50, 5, label, 0, 0)
            pdf.set_font('Arial', '', 9)
            pdf.cell(0, 5, value, 0, 1)
        
        # Footer
        pdf.set_y(-40)
        pdf.set_font('Arial', 'I', 8)
        pdf.set_text_color(128, 128, 128)
        pdf.cell(0, 4, 'Generated by MADATION Advanced Security Systems', 0, 1, 'C')
        pdf.cell(0, 4, 'Confidential Report - For authorized personnel only', 0, 1, 'C')
        pdf.cell(0, 4, f'Report generated: {datetime.now().strftime("%Y-%m-%d at %H:%M:%S")}', 0, 1, 'C')
        pdf.cell(0, 4, '© 2024 MADATION Security. All rights reserved.', 0, 1, 'C')
        
        # Save PDF
        filename = f"security_report_{scan_data['scan_id']}.pdf"
        filepath = os.path.join(self.report_dir, filename)
        pdf.output(filepath)
        
        return filepath
    
    def send_email_with_pdf(self, scan_data, recipient_email, pdf_path, smtp_config=None):
        """Send the PDF report via email with professional formatting"""
        
        # Default SMTP configuration - REPLACE WITH YOUR ACTUAL EMAIL CREDENTIALS
        if smtp_config is None:
            smtp_config = {
                'smtp_server': 'smtp.gmail.com',
                'smtp_port': 587,
                'sender_email': 'your-email@gmail.com',  # Change this
                'sender_password': 'your-app-password'   # Change this
            }
        
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = smtp_config['sender_email']
            msg['To'] = recipient_email
            msg['Subject'] = f'🔒 MADATION Security Report - {scan_data["scan_id"]}'
            
            # Email body with HTML formatting
            body = f"""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="background: linear-gradient(135deg, #006400, #008000); color: white; padding: 20px; text-align: center;">
                    <h1>🛡️ MADATION SECURITY REPORT</h1>
                    <p>Advanced Face Morphing Detection System</p>
                </div>
                
                <div style="padding: 20px;">
                    <h2>Scan Summary</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Scan ID:</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">{scan_data['scan_id']}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">File Analyzed:</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">{scan_data['filename']}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Classification:</td>
                            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; color: {'#008000' if scan_data['prediction'] == 'authentic' else '#FF8C00' if scan_data['prediction'] == 'morphed' else '#FF0000'}">
                                {scan_data['prediction'].upper()}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Confidence:</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">{scan_data['confidence']*100:.2f}%</td>
                        </tr>
                    </table>
                    
                    <h2>Security Status</h2>
                    <div style="padding: 15px; background-color: {'#90EE90' if scan_data['prediction'] == 'authentic' else '#FFE4B5' if scan_data['prediction'] == 'morphed' else '#FFB6C1'}; border-radius: 5px;">
                        <h3 style="margin: 0; color: {'#006400' if scan_data['prediction'] == 'authentic' else '#8B4513' if scan_data['prediction'] == 'morphed' else '#8B0000'};">
                            {'✅ SECURE - Genuine Human Face' if scan_data['prediction'] == 'authentic' else '⚠️ SUSPICIOUS - Potential Manipulation' if scan_data['prediction'] == 'morphed' else '🚨 ALERT - AI-Generated Face'}
                        </h3>
                    </div>
                    
                    <p>A detailed PDF security report is attached to this email.</p>
                    
                    <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
                        <p style="margin: 0; font-size: 12px; color: #666;">
                            This is an automated security report generated by MADATION Advanced Security Systems.<br>
                            If you did not request this report, please disregard this email.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            msg.attach(MIMEText(body, 'html'))
            
            # Attach PDF
            with open(pdf_path, "rb") as attachment:
                part = MIMEBase('application', 'pdf')
                part.set_payload(attachment.read())
            
            encoders.encode_base64(part)
            part.add_header(
                'Content-Disposition',
                f'attachment; filename="MADATION_Report_{scan_data["scan_id"]}.pdf"'
            )
            msg.attach(part)
            
            # Send email
            server = smtplib.SMTP(smtp_config['smtp_server'], smtp_config['smtp_port'])
            server.starttls()
            server.login(smtp_config['sender_email'], smtp_config['sender_password'])
            text = msg.as_string()
            server.sendmail(smtp_config['sender_email'], recipient_email, text)
            server.quit()
            
            return True, "Email sent successfully!"
            
        except Exception as e:
            return False, f"Failed to send email: {str(e)}"

# Test the report generator
if __name__ == "__main__":
    generator = AdvancedReportGenerator()
    
    # Test with sample data
    sample_scan_data = {
        "scan_id": generator.generate_scan_id(),
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "filename": "facial_image.jpg",
        "prediction": "authentic",  # Try "morphed" or "ai_generated" to see different outputs
        "confidence": 0.9571,
        "probabilities": {
            "authentic": 0.95,
            "morphed": 0.03,
            "ai_generated": 0.02
        }
    }
    
    # Generate PDF report
    pdf_path = generator.create_professional_pdf_report(sample_scan_data)
    print(f"✅ Professional PDF report generated: {pdf_path}")
    
    # Uncomment and configure with your email settings to test email
    '''
    # Configure your email settings here
    email_config = {
        'smtp_server': 'smtp.gmail.com',
        'smtp_port': 587,
        'sender_email': 'your-email@gmail.com',  # Your Gmail
        'sender_password': 'your-app-password'   # Gmail App Password
    }
    
    success, message = generator.send_email_with_pdf(
        sample_scan_data, 
        "recipient@example.com",  # Recipient email
        pdf_path,
        email_config
    )
    print(f"Email Status: {message}")
    '''
