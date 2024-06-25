from motor.motor_asyncio import AsyncIOMotorClient

CONNECTION_STRING="mongodb://localhost:27017/"

client=AsyncIOMotorClient(CONNECTION_STRING)

async def database_connection(cb,city,info,current_datetime):
    db=client['AI-Trip-Planner']
    collection=db['Audit']
    data={
        'date':current_datetime,
        'city':city,
        'info':info,
        'prompt_tokens':cb.prompt_tokens,
        'output_tokens':cb.completion_tokens,
        'openai_cost':cb.total_cost,
    }
    await collection.insert_one(data)
    