# Meeting Room Booking System

A simple web application for booking meeting rooms for a selected date and time.

## Tech Stack

### Frontend
- Next.js
- JavaScript
- Tailwind CSS
- Framer Motion
- Lucide React

### Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL

## Features

- View available meeting rooms
- Select a date and view bookings
- Book a meeting room
- Cancel a booking
- Filter bookings by room
- Prevent overlapping bookings
- Allow back-to-back bookings
- Validate working hours from 09:00 to 18:00
- Find the next available time slot
- Display booking and server errors using toast messages

## Booking Logic
Booking Logic: The booking conflict detection logic was inspired by the interval-overlap approach I practiced while solving the Meeting Rooms problems on LeetCode.
I applied the same concept to check whether a new booking overlaps with an existing booking while allowing back-to-back bookings.
Each booking is treated as a time interval.
A new booking conflicts with an existing booking when:
end1>start2 // overlapping
end1<satrt2 //no overlapping

**For Backend**
python -m venv venv
venv\Scripts\activate // activate it
uvicorn main:app //reload 

**For Frontend**
cd frontend
npm run dev
