import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from flask import current_app

def send_email(to_email, subject, content):
    if not current_app.config['SENDGRID_API_KEY']:
        print(f"[STUB] Sending email to {to_email}: {subject}")
        return

    message = Mail(
        from_email=current_app.config['FROM_EMAIL'],
        to_emails=to_email,
        subject=subject,
        plain_text_content=content
    )
    try:
        sg = SendGridAPIClient(current_app.config['SENDGRID_API_KEY'])
        sg.send(message)
    except Exception as e:
        print(f"Error sending email: {e}")

def send_welcome_email(user):
    subject = "Welcome to SYS.CORE"
    content = f"Hello {user.username},\n\nWelcome to the industrial digital void."
    send_email(user.email, subject, content)
