import os
import requests

from dotenv import load_dotenv
from fastapi import APIRouter
from openai import OpenAI
from pydantic import BaseModel
from datetime import date, timedelta

load_dotenv()

router = APIRouter(
    prefix="/api/assistant",
    tags=["AI Assistant"]
)

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

BACKEND_URL = "http://localhost:5000"


class AssistantInput(BaseModel):
    message: str
    history: list = []

@router.post("/chat")
def assistant_chat(data: AssistantInput):

    try:
        # Get doctors from Medicare database
        doctors_response = requests.get(
            f"{BACKEND_URL}/api/doctors"
        )

        doctors_data = doctors_response.json()

        doctors = doctors_data.get("doctors", [])

        doctor_context = []

        for doctor in doctors:

            user = doctor.get("user", {})

            doctor_context.append({
                "id": str(doctor.get("_id")),
                "name": user.get("name"),
                "specialization": doctor.get("specialization"),
                "department": doctor.get("department"),
                "qualification": doctor.get("qualification"),
                "experience": doctor.get("experience"),
                "consultationFee": doctor.get("consultationFee"),
                "isAvailable": doctor.get("isAvailable")
            })
        today = date.today()
        tomorrow = today + timedelta(days=1)

        prompt = f"""
You are the Medicare AI Assistant for ONE specific hospital.

You must use ONLY the doctors provided below.

Do NOT ask the user for:
- location
- hospital
- insurance
- another hospital

The user is already using Medicare hospital.

Your job is to help the user find doctors and manage appointment requests.

Available doctors:

{doctor_context}

Conversation history is provided separately to you.

Rules for finding doctors:
- If the user asks for a specific specialization, find matching doctors.
- Match specialization or department intelligently.
- Only recommend doctors that exist in the provided data.
- Do not invent doctors.
- Mention whether the doctor is available.
- If no matching doctor exists, clearly say that Medicare currently has no doctor matching the request.

Rules for appointments:
- If the user wants to book an appointment, identify the doctor, date, and time from the conversation history and current message.
- If the doctor is already identified from previous messages, do not ask for the doctor again.
- doctorId MUST be copied exactly from the available doctors data.
- Never invent a doctorId.
- If the user provides a date and time, create a booking request.
- 12 AM means 00:00 (midnight).
- 12 PM means 12:00 (noon).
- "tomorrow" means the calculated tomorrow date.
- "today" means the current date.
- Never invent or assume a historical date.
- If the user has not provided enough booking information, ask only for the missing information.

Current date:
{today}

Tomorrow's date:
{tomorrow}

When a booking is requested, return ONLY valid JSON.
Do not add explanations, markdown, code fences, or extra text.

Use exactly this format:

{{
    "action": "book_appointment",
    "doctorId": "DOCTOR_ID_FROM_AVAILABLE_DOCTORS",
    "doctor_name": "DOCTOR_NAME",
    "date": "YYYY-MM-DD",
    "time": "HH:MM",
    "needs_confirmation": true
}}

If the user confirms a previously requested booking, return ONLY:

{{
    "action": "confirm_booking"
}}

For normal doctor searches or general questions, respond normally and concisely.

Do not diagnose diseases.
Do not prescribe medicines.

User message:

{data.message}
"""

        messages = [
            {
                "role": "system",
                "content": prompt
            }
        ]

        for item in data.history:
            role = item.get("role")

            if role == "ai":
                role = "assistant"

            messages.append({
                "role": role,
                "content": item.get("content")
            })

        messages.append({
            "role": "user",
            "content": data.message
        })

        response = client.chat.completions.create(
            model="openai/gpt-4o-mini",
            messages=messages,
            temperature=0.2
        )

        answer = response.choices[0].message.content

        return {
            "success": True,
            "answer": answer
        }

    except Exception as error:

        print("OpenRouter Assistant Error:", error)

        return {
            "success": False,
            "message": "AI Assistant failed"
        }