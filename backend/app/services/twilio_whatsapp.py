import os
import json
from pathlib import Path
from dotenv import load_dotenv
from twilio.rest import Client

ENV_PATH = Path(__file__).resolve().parents[2] / ".env"

load_dotenv(dotenv_path=ENV_PATH, override=True)


class TwilioWhatsApp:

    def __init__(self):

        print("Environment file:", ENV_PATH)
        print("File exists:", ENV_PATH.exists())

        account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        auth_token = os.getenv("TWILIO_AUTH_TOKEN")

        self.whatsapp_number = os.getenv("TWILIO_WHATSAPP_NUMBER")

        print("Account SID loaded:", bool(account_sid))
        print("Auth Token loaded:", bool(auth_token))

        if not account_sid or not auth_token:
            raise ValueError("Twilio credentials are missing.")

        if not self.whatsapp_number:
            raise ValueError("Twilio WhatsApp number is missing.")

        self.client = Client(account_sid, auth_token)

   

    def send_template_message(self, recipient, content_sid, variables):
        if not recipient or not content_sid:
            raise ValueError("Recipient and template SID are required.")

        if not recipient.startswith("whatsapp:"):
            recipient = f"whatsapp:{recipient}"

        response = self.client.messages.create(
            from_=self.whatsapp_number,
            to=recipient,
            content_sid=content_sid,
            content_variables=json.dumps(variables)
        )

        return {
            "message_sid": response.sid,
            "status": response.status,
            "to": response.to
        }
    def send_session_message(self, recipient, message):
        if not recipient.startswith("whatsapp:"):
            recipient = f"whatsapp:{recipient}"

        response = self.client.messages.create(
            from_=self.whatsapp_number,
            to=recipient,
            body=message
        )

        return {
            "message_sid": response.sid,
            "status": response.status,
            "to": response.to
        }