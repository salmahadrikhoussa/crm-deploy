'use client';

import { useState, useEffect } from 'react';

export default function PinGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => {
    const hasAccess = localStorage.getItem('finance_access_granted');
    if (hasAccess === 'true') setUnlocked(true);
  }, []);

  const handleSubmit = () => {
    if (input === '1008') {
      localStorage.setItem('finance_access_granted', 'true');
      setUnlocked(true);
    } else {
      alert('Code PIN incorrect');
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 shadow-xl text-center w-80">
        <h2 className="text-xl font-bold mb-4">Accès sécurisé</h2>
        <input
          type="password"
          maxLength={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border rounded px-4 py-2 text-center text-lg"
          placeholder="Code PIN"
        />
        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
        >
          Valider
        </button>
      </div>
    </div>
  );
}
