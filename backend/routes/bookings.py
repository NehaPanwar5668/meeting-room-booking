from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Room, Booking
from schemas import BookingCreate
from services.booking_service import check_conflict, validate_time
from datetime import date

router = APIRouter()

@router.post("/bookings", status_code=201)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):

    error = validate_time(booking.start_time, booking.end_time)
    if error:
        raise HTTPException(status_code=400, detail=error)
        
    room = db.query(Room).filter(Room.id == booking.room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    existing_bookings = db.query(Booking).filter(
        Booking.room_id == booking.room_id,
        Booking.date == booking.date
    ).all()

    conflict = check_conflict(existing_bookings, booking.start_time, booking.end_time)

    if conflict:
        raise HTTPException(
            status_code=409,
            detail=f'Booking conflict: "{conflict.title}" is already booked from {conflict.start_time} to {conflict.end_time}.'
        )

    new_booking = Booking(
        room_id=booking.room_id,
        title=booking.title,
        date=booking.date,
        start_time=booking.start_time,
        end_time=booking.end_time
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
 
    return {
        **new_booking.__dict__,
        "message": f"Room {booking.room_id} booked successfully for {booking.start_time}-{booking.end_time}"
    }

@router.get("/bookings")
def get_bookings(date: date, room_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(Booking).filter(Booking.date == date)
    if room_id:
        query = query.filter(Booking.room_id == room_id)
    return query.all()


@router.delete("/bookings/{booking_id}")
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail=f"Booking {booking_id} not found")
    
    db.delete(booking)
    db.commit()
    
    return {"message": f"Booking {booking_id} cancelled successfully", "id": booking_id}