"use client";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Trash2 } from "lucide-react";

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [date, setDate] = useState("");
  const [roomId, setRoomId] = useState("");
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/rooms")
    .then(r=>r.json())
    .then(setRooms);
  }, []);

  useEffect(() => {
    if(date) fetch(`http://127.0.0.1:8000/api/bookings?date=${date}`)
      .then(r=>r.json())
    .then(setBookings);
  }, [date]);

  const handleBook = async () => {
    if(!roomId ||!date ||!title ||!start ||!end) return toast.error("Please fill all fields");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_id: Number(roomId), title, date, start_time: start, end_time: end }),
      });
      const data = await res.json();

      if(!res.ok) {
       
        toast.error(data.detail || data.message || "Something went wrong");
      } else {
        toast.success(data.message || `Booked ${title} successfully!`);
        setBookings([...bookings, data]);
      }
    } catch (err) {
      toast.error("Server error - backend not running");
    }
  };

  const handleCancel = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/bookings/${id}`, { method: "DELETE" });
      const data = await res.json();
      if(!res.ok) toast.error(data.detail || "Cancel failed");
      else {
        toast.success(data.message || "Booking cancelled");
        setBookings(bookings.filter(b => b.id !== id));
      }
    } catch {
      toast.error("Server error while cancelling");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <Toaster position="top-right" />
      <h1 className="text-6xl text-center text-gray-500 font-bold">Meeting Room Booking</h1>
      
     <div className="flex mt-6 mx-auto block max-w-5xl">
     <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="mt-8 text-left w-80 text-gray-500 rounded-lg border p-3" />
    </div>

      <div className="mt-6 max-w-5xl mx-auto block rounded-xl bg-white p-6 shadow">
        <select value={roomId} onChange={e=>setRoomId(e.target.value)} className="w-full rounded-lg text-gray-500 border p-3">
          <option value="">Choose a room</option>
          {rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>

        <input type="text" placeholder="Meeting title" value={title} onChange={e=>setTitle(e.target.value)} className="mt-4 w-full  text-gray-500 rounded-lg border p-3" />
        <div className="mt-4 grid grid-cols-2 gap-4">
          <input type="time" value={start} onChange={e=>setStart(e.target.value)} className="rounded-lg  text-gray-500 border p-3" />
          <input type="time" value={end} onChange={e=>setEnd(e.target.value)} className="rounded-lg  text-gray-500 border p-3" />
        </div>
        <button onClick={handleBook} className="mt-5 hover:scale-95 w-full rounded-lg bg-black py-3 text-white">Book Room</button>
      </div>

      <div className="mt-8">
        {bookings.map((b) => (
          <div key={b.id} className="mt-2 max-w-5xl mx-auto block flex justify-between rounded  text-gray-500  bg-white p-3 shadow-sm">
            <span><b>{b.title}</b> - {b.start_time}-{b.end_time}</span>
            <button onClick={()=>handleCancel(b.id)} className="text-red-600 "><Trash2/></button>
          </div>
        ))}
      </div>
    </main>
  );
}