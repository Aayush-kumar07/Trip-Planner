from fastapi import FASTAPI
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from os import environ
from langchain.schema import SystemMessage
from langchain_openai import AzureChatOpenAI

environ["AZURE_OPENAI_ENDPOINT"]="aPI_ENDPOINT"
environ["AZURE_OPENAI_API_KEY"]="API_KEY"

app=FASTAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origin="*",
    allow_credentials=True,
    allow_methods=["GET","POST","PUT","DELETE"],
    allow_headers=["*"],
)

class Destination(BaseModel):
    city: str
    destinationType: str

def get_city(data):
    city=data["city"]
    return city
def get_info(data):
    info=data["destinationType"]
    return info

@app.post("api/destination")
async def create_destination(destination: Destination):
    chat_model = AzureChatOpenAI(
        model="gpt-35-turbo-0613",
        azure_deployment="aiml-interns",
        api_version="2023-05-15",
        temperature=0.7
    )
    city=get_city(destination.model.dumps())
    info=get_info(destination.model.dumps())

    SYSTEM_PROMPT = f"I would like to know about {info} around {city}. Please provide a list of all the {info} in and around {city} along with the description of the place, address and should also contain the timing to visit the location and the speciality of the location like for what reason it is famous for.If you dont know even one answer say 'No Data Found', dont give any random data, and strictly return everything as array, so that i can use map function and display the response in frontend using react"

    messages = [
    SystemMessage(content=SYSTEM_PROMPT),
    ]
    response=(chat_model.invoke(messages))
    return JSONResponse(response.content)




