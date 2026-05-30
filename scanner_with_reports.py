from advanced_pdf_reporter import AdvancedReportGenerator
from datetime import datetime
import os

class ScannerWithReporting:
    def __init__(self):
        self.report_generator = AdvancedReportGenerator()
        self.scan_history = []
    
    def perform_scan(self, image_path, user_email=None):
        """Perform security scan and generate reports"""
        
        # Import your model (make sure test_model.py is in the same directory)
        try:
            from test_model import FaceClassifier
            classifier = FaceClassifier()
        except ImportError:
            print("❌ Model not found. Using demo data.")
            # Demo data for testing
            demo_result = {
                'prediction': 'authentic',
                'confidence': 0.95,
                'probabilities': {
                    'authentic': 0.95,
                    'morphed': 0.03,
                    'ai_generated': 0.02
                }
            }
            return self._process_scan_result(demo_result, image_path, user_email)
        
        try:
            # Perform actual scan
            print("🛡️ Performing security analysis...")
            result = classifier.predict(image_path)
            return self._process_scan_result(result, image_path, user_email)
            
        except Exception as e:
            print(f"❌ Scan failed: {e}")
            return None
    
    def _process_scan_result(self, result, image_path, user_email):
        """Process scan results and generate reports"""
        
        # Prepare scan data
        scan_data = {
            "scan_id": self.report_generator.generate_scan_id(),
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "filename": os.path.basename(image_path),
            "prediction": result['prediction'],
            "confidence": result['confidence'],
            "probabilities": result['probabilities']
        }
        
        # Generate PDF report
        print("📄 Generating professional report...")
        pdf_path = self.report_generator.create_professional_pdf_report(scan_data)
        
        # Save to history
        self.scan_history.append(scan_data)
        
        # Send email if requested
        email_status = None
        if user_email:
            print(f"📧 Sending report to {user_email}...")
            
            # Configure your email settings here
            email_config = {
                'smtp_server': 'smtp.gmail.com',
                'smtp_port': 587,
                'sender_email': 'your-email@gmail.com',  # CHANGE THIS
                'sender_password': 'your-app-password'   # CHANGE THIS
            }
            
            success, message = self.report_generator.send_email_with_pdf(
                scan_data, user_email, pdf_path, email_config
            )
            email_status = message
        
        return {
            'scan_data': scan_data,
            'pdf_path': pdf_path,
            'email_status': email_status
        }

# Example usage
if __name__ == "__main__":
    scanner = ScannerWithReporting()
    
    # Test with a sample image
    test_image = "data/authentic/aligned/aligned_0001.jpg"  # Use any existing image
    
    if os.path.exists(test_image):
        result = scanner.perform_scan(test_image)
        
        if result:
            print(f"✅ Scan completed!")
            print(f"📊 Classification: {result['scan_data']['prediction']}")
            print(f"🎯 Confidence: {result['scan_data']['confidence']*100:.2f}%")
            print(f"📄 PDF Report: {result['pdf_path']}")
            
            if result['email_status']:
                print(f"📧 Email Status: {result['email_status']}")
    else:
        print("⚠️ Test image not found. Please check the path.")
