'use client';

import { useState } from 'react';
import { Frais } from '../types/frais';

interface AddFraisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: (frais: Frais) => void;
}

export default function AddFraisModal({ isOpen, onClose, onAdded }: AddFraisModalProps) {
  const [montant, setMontant] = useState('');
  const [date, setDate] = useState('');
  const [motif, setMotif] = useState('');
  const [description, setDescription] = useState('');
  const [justificatif, setJustificatif] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!montant || !motif || !date) return alert("Champs obligatoires manquants");

    setSubmitting(true);

    const fakeUploadUrl = justificatif ? `/uploads/${justificatif.name}` : undefined;

    const frais: Frais = {
      montant: parseFloat(montant),
      motif,
      description,
      justificatifUrl: fakeUploadUrl,
      status: 'en_attente',
      date,
      submittedBy: {
        id: 'demo-user-id',
        name: 'Demo User',
      },
      createdAt: new Date().toISOString(),
    };

    const res = await fetch('/api/frais', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(frais),
    });

    if (res.ok) {
      const { insertedId } = await res.json();
      onAdded({ ...frais, _id: insertedId });
      onClose();
    } else {
      alert('Erreur lors de l\u2019envoi.');
    }

    setSubmitting(false);
  };

  return (
    <>
      <div className="fixed inset-y-0 right-0 z-[9999] w-full max-w-md bg-white shadow-xl p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Ajouter une dépense</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">&times;</button>
        </div>

        <div className="space-y-4 text-sm">
          <label className="block font-medium">Montant (€) *</label>
          <input type="number" value={montant} onChange={e => setMontant(e.target.value)} className="w-full p-2 border rounded" />

          <label className="block font-medium">Date *</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded" />

          <label className="block font-medium">Motif *</label>
          <input type="text" value={motif} onChange={e => setMotif(e.target.value)} className="w-full p-2 border rounded" />

          <label className="block font-medium">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded" />

          <label className="block font-medium mb-1">Justificatif</label>
          <input type="file" onChange={e => setJustificatif(e.target.files?.[0] || null)} />
          {justificatif && <p className="mt-2 text-sm">{justificatif.name}</p>}
        </div>

        <div className="mt-6 flex justify-between">
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Annuler</button>
          <button onClick={handleSubmit} disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {submitting ? "Envoi..." : "Ajouter"}
          </button>
        </div>
      </div>
      <div onClick={onClose} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]" />
    </>
  );
}
