from django.core.mail import send_mail
from django.conf import settings

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


def send_order_html_email(subject, template, context, to_email):
    html = render_to_string(template, context)

    email = EmailMultiAlternatives(
        subject=subject,
        body="Foodie Express Notification",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[to_email],
    )
    email.attach_alternative(html, "text/html")
    email.send()
    print(f"Sent email to {to_email} with subject '{subject}'")
