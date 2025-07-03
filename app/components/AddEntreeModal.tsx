'use client';

import { useState } from 'react';
import { Entree } from '../types/entree';

interface AddEntreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: (entree: Entree) => void;
}

export default function AddEntreeModal({ isOpen, onClose, onAdded }: AddEntreeModalProps) {
  const [montant, setMontant] = useState('');
  const [date, setDate] = useState('');
  const [source, setSource] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!montant || !source || !date) return alert("Champs obligatoires manquants");

    setSubmitting(true);

    const entree: Entree = {
      montant: parseFloat(montant),
      source,
      description,
      date,
      createdAt: new Date().toISOString(),
    };

    const res = await fetch('/api/entrees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entree),
    });

    if (res.ok) {
      const { insertedId } = await res.json();
      onAdded({ ...entree, _id: insertedId });
      onClose();
    } else {
      alert("Erreur lors de l'envoi.");
    }

    setSubmitting(false);
  };

  return (
    <>
      <div className="fixed inset-y-0 right-0 z-[9999] w-full max-w-md bg-white shadow-xl p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Ajouter une entrée d&apos;argent</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">&times;</button>
        </div>

        <div className="space-y-4 text-sm">
          <input type="number" placeholder="Montant (€)" value={montant} onChange={e => setMontant(e.target.value)} className="w-full p-2 border rounded" />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded" />
          <input type="text" placeholder="Source (ex: client, vente...)" value={source} onChange={e => setSource(e.target.value)} className="w-full p-2 border rounded" />
          <textarea placeholder="Description (facultatif)" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <div className="mt-6 flex justify-between">
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Annuler</button>
          <button onClick={handleSubmit} disabled={submitting} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            {submitting ? "Envoi..." : "Ajouter"}
          </button>
        </div>
      </div>
      <div onClick={onClose} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]" />
    </>
  );
}
