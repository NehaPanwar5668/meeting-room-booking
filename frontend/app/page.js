"use client";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Trash2 } from "lucide-react";

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [date, setDate] = useState("");
  const [roomId, setRoomId] = useState("");
  const [filterRoom, setFilterRoom] = useState(""); 
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const API = "https://meeting-room-booking-e539.onrender.com/api";

  useEffect(() => { fetch(`${API}/rooms`)
  .then(r=>r.json())
  .then(setRooms); }, []);

  useEffect(() => {
    if(date) fetch(`${API}/bookings?date=${date}`)
      .then(r=>r.json())
    .then(setBookings);
  }, [date]);

 
  const getNextAvailable = () => {
    const dayBookings = bookings.filter(b => !filterRoom || b.room_id == filterRoom)
      .sort((a,b) => a.start_time.localeCompare(b.start_time));
    let next = "09:00";
    for(let b of dayBookings){
      if(next < b.start_time) return next;
      if(next < b.end_time) next = b.end_time;
    }
    return next <= "18:00" ? next : "No slots today";
  };

  
  const filtered = bookings.filter(b => !filterRoom || b.room_id == filterRoom);

  const handleBook = async () => {
    if(!roomId ||!date ||!title ||!start ||!end) return toast.error("Please fill all fields");
    try {
      const res = await fetch(`${API}/bookings`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_id: Number(roomId), title, date, start_time: start, end_time: end }),
      });
      const data = await res.json();
      if(!res.ok) toast.error(data.detail || "Failed");
      else {
        toast.success(data.message || `Booked ${title}!`);
        setBookings([...bookings, data]);
      }
    } catch { toast.error("Server error"); }
  };

  const handleCancel = async (id) => {
    const res = await fetch(`${API}/bookings/${id}`, { method: "DELETE" });
    const data = await res.json();
    if(!res.ok) toast.error(data.detail);
    else {
      toast.success(data.message || "Cancelled");
      setBookings(bookings.filter(b => b.id !== id));
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <Toaster position="top-center" toastOptions={{ style: { textAlign: "center" } }} />
      <h1 className="text-5xl text-center text-gray-500 font-bold">Meeting Room Booking</h1>
      
      <div className="flex mt-6 mx-auto max-w-5xl gap-4">
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="text-gray-500 rounded-lg border p-3" />
        
        <select value={filterRoom} onChange={e=>setFilterRoom(e.target.value)} className="rounded-lg text-gray-500 border p-3">
          <option value="">All Rooms (Filter)</option>
          {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        
        {date && <span className="bg-white p-3 rounded-lg border text-gray-600">Next free: {getNextAvailable()} ⏰</span>}
      </div>

      <div className="mt-6 max-w-5xl mx-auto rounded-xl bg-white p-6 shadow">
        <select value={roomId} onChange={e=>setRoomId(e.target.value)} className="w-full rounded-lg text-gray-500 border p-3">
          <option value="">Choose a room</option>
          {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <input type="text" placeholder="Meeting title" value={title} onChange={e=>setTitle(e.target.value)} className="mt-4 w-full text-gray-500 rounded-lg border p-3" />
        <div className="mt-4 grid grid-cols-2 gap-4">
          <input type="time" value={start} onChange={e=>setStart(e.target.value)} className="rounded-lg text-gray-500 border p-3" />
          <input type="time" value={end} onChange={e=>setEnd(e.target.value)} className="rounded-lg text-gray-500 border p-3" />
        </div>
        <button onClick={handleBook} className="mt-5 hover:scale-95 w-full rounded-lg bg-black py-3 text-white">Book Room</button>
      </div>

      <div className="mt-8 max-w-5xl mx-auto">
        {filtered.map(b => (
          <div key={b.id} className="mt-2 flex justify-between rounded text-gray-500 bg-white p-3 shadow-sm">
            <span><b>{b.title}</b> - Room {b.room_id} | {b.start_time}-{b.end_time}</span>
            <button onClick={()=>handleCancel(b.id)} className="text-red-600"><Trash2 size={18}/></button>
          </div>
        ))}
      </div>
    </main>
  );
}