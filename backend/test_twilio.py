from app.services.twilio_whatsapp import TwilioWhatsApp

whatsapp = TwilioWhatsApp()

result = whatsapp.send_session_message(
    recipient="+918292993851",
    message="Hello! This is a test message from OrderGuard AI."
)

print(result)