'use client';

import { useEffect, useState } from 'react';
import { Entree } from '@/app/types/entree';

export default function EntreesPage() {
  const [entrees, setEntrees] = useState<Entree[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState('');

  useEffect(() => {
    const hasEnteredPin = localStorage.getItem('financePinVerified');
    if (hasEnteredPin === 'true') {
      setAuthenticated(true);
    }
  }, []);

  const handlePinSubmit = () => {
    if (pin === '1008') {
      localStorage.setItem('financePinVerified', 'true');
      setAuthenticated(true);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetch('/api/entrees')
        .then(res => res.json())
        .then(data => setEntrees(data));
    }
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-8 rounded shadow-lg text-center">
          <h2 className="text-lg font-bold mb-4">Code PIN requis</h2>
          <input
            type="password"
            className="border p-2 rounded w-full mb-4 text-center"
            maxLength={4}
            value={pin}
            onChange={e => setPin(e.target.value)}
          />
          <button
            onClick={handlePinSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            Valider
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-bold">Liste des entrées d'argent</h1>
      <ul className="space-y-2">
        {entrees.map((entree, i) => (
          <li key={i} className="flex justify-between border-b pb-2">
            <span>{entree.source}</span>
            <span className="text-green-600 font-semibold">{entree.montant} DA</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
