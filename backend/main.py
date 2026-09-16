from fastapi import FastAPI
from database import engine, Base, SessionLocal
import models

from routes.rooms import router as rooms_router
from routes.bookings import router as bookings_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
     "https://meeting-room-booking-mauve.vercel.app"
    ],
     allow_origin_regex=r"https://meeting-room-booking-.*\.vercel\.app",
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(rooms_router, prefix="/api")
app.include_router(bookings_router, prefix="/api")

Base.metadata.create_all(bind=engine)


def add_rooms():
    db = SessionLocal()

    if db.query(models.Room).count() == 0:
        rooms = [
            models.Room(name="Conference Room"),
            models.Room(name="Meeting Room A"),
            models.Room(name="Meeting Room B"),
            models.Room(name="Board Room")
        ]

        db.add_all(rooms)
        db.commit()

    db.close()


add_rooms()


@app.get("/")
def home():
    return {"message": "Meeting Room Booking API is running"}