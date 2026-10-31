
import os
import json
from dotenv import load_dotenv
from fastapi import APIRouter
from openai import OpenAI
from pydantic import BaseModel


load_dotenv()

router = APIRouter(
    prefix="/api/report",
    tags=["Health Report Analysis"]
)


class ReportInput(BaseModel):
    report_text: str


client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)


@router.post("/analyze")
def analyze_report(data: ReportInput):

    prompt = f"""
You are a medical report explanation assistant.

Analyze the following health report and return a clear, structured explanation.

IMPORTANT:
- Do not diagnose the patient.
- Do not prescribe medicines or treatments.
- Compare values with the reference ranges provided in the report.
- Clearly separate normal and abnormal findings.
- Use simple language that a patient can understand.
- Mention when a value is outside the provided reference range.
- If something is unclear or missing, say so.

Return ONLY valid JSON in this format:

{{
    "summary": "Short overall summary",
    "key_findings": [
        "Important finding 1",
        "Important finding 2"
    ],
    "normal_values": [
        "Test: value — normal"
    ],
    "abnormal_values": [
        "Test: value — outside reference range"
    ],
    "questions_to_discuss": [
        "Question the patient may discuss with a healthcare professional"
    ]
}}

Health Report:

{data.report_text}
"""

    try:
        response = client.chat.completions.create(
            model="openai/gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2
        )

        ai_response = response.choices[0].message.content

        ai_response = ai_response.replace("```json", "").replace("```", "").strip()

        analysis = json.loads(ai_response)

        return {
            "success": True,
            "data": {
                "summary": analysis["summary"],
                "key_findings": analysis["key_findings"],
                "normal_values": analysis["normal_values"],
                "abnormal_values": analysis["abnormal_values"],
                "questions_to_discuss": analysis["questions_to_discuss"]
            }
        }

    except Exception as error:
        print("OpenRouter Error:", error)

        return {
            "success": False,
            "message": "AI report analysis failed"
        }
class ReportChatInput(BaseModel):
    report_text: str
    question: str


@router.post("/chat")
def report_chat(data: ReportChatInput):

    prompt = f"""
You are a medical report explanation assistant.

Answer the user's question using ONLY the health report provided below.

IMPORTANT:
- Do not diagnose the patient.
- Do not prescribe medicines or treatments.
- Explain medical terms in simple language.
- If the report does not contain enough information to answer, clearly say so.
- Do not invent values or findings.
- Encourage the user to discuss concerning findings with a qualified healthcare professional.

Health Report:
{data.report_text}

User Question:
{data.question}

Give a clear, concise answer.
"""

    try:
        response = client.chat.completions.create(
            model="openai/gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2
        )

        answer = response.choices[0].message.content

        return {
            "success": True,
            "answer": answer
        }

    except Exception as error:
        print("OpenRouter Chat Error:", error)

        return {
            "success": False,
            "message": "AI chat failed"
        }   