import React from 'react';
import { useState, useEffect } from 'react';
export default function Hero({ items }: { items: any[] }) {
  const [movie, setMovie] = useState<any>(null);
  useEffect(() => {
    if (items?.length) {
      setMovie(items[Math.floor(Math.random() * items.length)]);
    }
  }, [items]);
  if (!movie) return null;
  return (
    <div className="w-full h-[60vh] relative bg-cover bg-center mb-8 rounded-lg"
      style={{ backgroundImage: `url(${movie.poster})` }}>
      <div className="absolute bottom-8 left-8 text-white max-w-xl">
        <h2 className="text-5xl font-bold">{movie.title}</h2>
        <p className="mt-4 text-lg leading-relaxed opacity-90">{movie.overview || movie.title}</p>
      </div>
    </div>
  );
}
