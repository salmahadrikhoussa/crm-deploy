/* eslint-disable react/no-unescaped-entities */

'use client';

import { useEffect, useState } from 'react';
import { Entree } from '../../../types/entree';
import AddEntreeModal from '@/app/components/AddEntreeModal';
import EntreeDetailsModal from '@/app/components/EntreeDetailsModal';

export default function EntreePage() {
  const [entrees, setEntrees] = useState<Entree[]>([]);
  const [selected, setSelected] = useState<Entree | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/entrees')
      .then(res => res.json())
      .then(data => setEntrees(data));
  }, []);

  const filtered = entrees.filter((e) =>
    e.source.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Entrées d'argent</h1>
          <p className="text-sm text-gray-500">Liste des revenus reçus</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          + Ajouter une entrée
        </button>
      </div>

      <input
        type="text"
        placeholder="Rechercher une entrée..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 p-2 border rounded-md"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((entry) => (
          <div
            key={entry._id}
            onClick={() => setSelected(entry)}
            className="cursor-pointer border rounded-lg p-4 hover:shadow transition bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">{entry.source}</h2>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Reçu</span>
            </div>
            <p className="text-sm text-gray-500 mb-2">{entry.description}</p>
            <div className="text-sm text-gray-400">
              <p>📅 {new Date(entry.date).toLocaleDateString()}</p>
              <p>💶 {parseFloat(entry.montant.toString()).toFixed(2)} €</p>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddEntreeModal
          onClose={() => setShowAddModal(false)}
          onAdded={(newEntry) => {
            setEntrees([newEntry, ...entrees]);
            setShowAddModal(false);
          }}
        />
      )}

      {selected && (
        <EntreeDetailsModal
          entree={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
