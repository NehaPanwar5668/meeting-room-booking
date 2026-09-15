from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey, Index
from database import Base


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True)
    name = Column(String)


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True)
    room_id = Column(Integer, ForeignKey("rooms.id"))
    title = Column(String)
    date = Column(Date)
    start_time = Column(Time)
    end_time = Column(Time)

    __table_args__ = (
        Index("idx_room_date", "room_id", "date"),
    )