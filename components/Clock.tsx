import React, { useState, useEffect } from 'react';

// Helper untuk menambahkan nol di depan angka tunggal
const padZero = (num: number) => num.toString().padStart(2, '0');

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Perbarui waktu setiap detik
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Hapus interval saat komponen dibongkar untuk mencegah kebocoran memori
    return () => clearInterval(timerId);
  }, []);

  // Format waktu ke dalam format HH:MM AM/PM
  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = padZero(date.getMinutes());
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours || 12; // Jam '0' harus menjadi '12'
    const displayHours = padZero(hours);

    return `${displayHours}:${minutes} ${ampm}`;
  };

  // Gunakan beberapa text-shadow untuk mensimulasikan garis tepi yang konsisten
  // Disesuaikan untuk font yang lebih kecil
  const textStrokeStyle = {
    textShadow: `
      -1.5px -1.5px 0 #ff4800,  
       1.5px -1.5px 0 #ff4800,
      -1.5px  1.5px 0 #ff4800,
       1.5px  1.5px 0 #ff4800,
      -1.5px -1.5px 3px rgba(0,0,0,0.5)
    `,
  };

  return (
    <div 
        className="absolute bottom-20 left-20 font-poppins font-bold text-3xl pointer-events-none select-none"
        aria-live="polite"
        aria-atomic="true"
        aria-label={`Waktu saat ini adalah ${formatTime(time)}`}
    >
        <span
          className="bg-white px-3 py-1 text-[#ff4283]"
          style={textStrokeStyle}
        >
            WIB {formatTime(time)}, ID
        </span>
    </div>
  );
};

export default Clock;
