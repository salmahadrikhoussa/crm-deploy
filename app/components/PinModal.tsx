
'use client';

import { useState } from 'react';

interface Props {
  onSuccess: () => void;
}

export default function PinModal({ onSuccess }: Props) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (pin === '1008') {
      localStorage.setItem('finance_pin_verified', 'true');
      onSuccess();
    } else {
      setError('Code incorrect.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80 shadow-md space-y-4">
        <h2 className="text-lg font-bold text-center">Accès Sécurisé</h2>
        <p className="text-sm text-gray-600 text-center">Veuillez entrer le code PIN pour accéder.</p>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength={4}
          className="w-full border p-2 rounded text-center tracking-widest text-xl"
          placeholder="••••"
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded"
        >
          Valider
        </button>
      </div>
    </div>
  );
}