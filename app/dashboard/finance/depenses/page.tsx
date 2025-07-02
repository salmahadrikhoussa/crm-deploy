// File: app/dashboard/finance/depenses/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Frais } from '../../../types/frais';
import AddFraisModal from '@/app/components/AddFraisModal';
import FraisDetailsModal from '@/app/components/FraisDetailsModal';

export default function DepensesPage() {
  const [fraisList, setFraisList] = useState<Frais[]>([]);
  const [selectedFrais, setSelectedFrais] = useState<Frais | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/frais')
      .then(res => res.json())
      .then(data => setFraisList(data));
  }, []);

  const filteredFrais = fraisList.filter((f) =>
    f.motif.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dépenses</h1>
          <p className="text-sm text-gray-500">Liste des dépenses</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          + Ajouter une dépense
        </button>
      </div>

      <input
        type="text"
        placeholder="Rechercher une dépense..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 p-2 border rounded-md"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFrais.map((frais) => (
          <div
            key={frais._id}
            onClick={() => setSelectedFrais(frais)}
            style={{
              backgroundColor:
                frais.status === 'approuve'
                  ? '#f5fff7'
                  : frais.status === 'refuse'
                  ? '#fff5f5'
                  : '#f5f7ff',
            }}
            className="cursor-pointer border rounded-lg p-4 hover:shadow transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">{frais.motif}</h2>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  frais.status === 'approuve'
                    ? 'bg-green-100 text-green-600'
                    : frais.status === 'refuse'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-blue-100 text-blue-600'
                }`}
              >
                {frais.status.charAt(0).toUpperCase() + frais.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-2">{frais.description}</p>
            <div className="text-sm text-gray-400">
              <p>📅 {new Date(frais.date).toLocaleDateString()}</p>
              <p>💶 {parseFloat(frais.montant.toString()).toFixed(2)} €</p>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddFraisModal
          onClose={() => setShowAddModal(false)}
          onAdded={(newFrais) => {
            setFraisList([newFrais, ...fraisList]);
            setShowAddModal(false);
          }}
        />
      )}

      {selectedFrais && (
        <FraisDetailsModal
          frais={selectedFrais}
          onClose={() => setSelectedFrais(null)}
          onStatusChange={(updated) => {
            setFraisList((prev) =>
              prev.map((f) => (f._id === updated._id ? updated : f))
            );
            setSelectedFrais(null);
          }}
        />
      )}
    </div>
  );
}  