from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from database import get_db
from models import Room, Booking
from services.booking_service import find_next_available

router = APIRouter()

@router.get("/rooms")
def get_rooms(db: Session = Depends(get_db)):
    return db.query(Room).all()

@router.get("/rooms/{room_id}/next-available")
def next_available(
    room_id: int, 
    date: date, 
    duration: int,
    db: Session = Depends(get_db)
                   ):

    room = db.query(Room).filter(Room.id == room_id).first()

    if not room:
        raise HTTPException(404, "Room not found")

    bookings = db.query(Booking).filter(
        Booking.room_id == room_id,
        Booking.date == date
    ).order_by(Booking.start_time).all()

    time = find_next_available(bookings, duration)

    if time is None:
        return {"next_available": None}

    return {"next_available": f"{time // 60:02d}:{time % 60:02d}"}