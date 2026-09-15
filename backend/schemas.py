from pydantic import BaseModel
from datetime import date, time


class BookingCreate(BaseModel):
    room_id: int
    title: str
    date: date
    start_time: time
    end_time: time