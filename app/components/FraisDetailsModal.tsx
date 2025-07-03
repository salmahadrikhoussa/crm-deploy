/* eslint-disable react/no-unescaped-entities */

'use client';

import { useEffect, useState } from 'react';
import { Frais } from '../types/frais';

interface Props {
  frais: Frais;
  onClose: () => void;
  onStatusChange: (updated: Frais) => void;
}

export default function FraisDetailsModal({ frais, onClose, onStatusChange }: Props) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    setRole(userRole);
  }, []);

  const updateStatus = async (status: "approuve" | "refuse") => {
    setLoading(true);

    const res = await fetch(`/api/frais/${frais._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      const updated = await res.json();
      onStatusChange(updated);
    } else {
      alert("Erreur de mise à jour");
    }

    setLoading(false);
  };

  return (
    <>
      {/* Right Slide Panel */}
      <div className="fixed inset-y-0 right-0 z-[9999] w-full max-w-md bg-white shadow-xl p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Détail de la dépense</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">&times;</button>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <p className="text-gray-500">Montant</p>
            <p className="text-lg font-bold">{parseFloat(frais.montant.toString()).toFixed(2)} €</p>
          </div>

          <div>
            <p className="text-gray-500">Date</p>
            <p>{new Date(frais.date).toLocaleDateString()}</p>
          </div>

          <div>
            <p className="text-gray-500">Motif</p>
            <p>{frais.motif}</p>
          </div>

          <div>
            <p className="text-gray-500">Description</p>
            <p>{frais.description || '—'}</p>
          </div>

          <div>
            <p className="text-gray-500">Justificatif</p>
            {frais.justificatifUrl ? (
              <a
                href={frais.justificatifUrl}
                target="_blank"
                className="text-blue-600 underline"
              >
                Voir / Télécharger
              </a>
            ) : (
              <p>Aucun fichier</p>
            )}
          </div>

          <div>
            <p className="text-gray-500">Statut</p>
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

          <div>
            <p className="text-gray-500">Soumis par</p>
            <p>{frais.submittedBy?.name || '—'}</p>
          </div>

          <div>
            <p className="text-gray-500">Date de soumission</p>
            <p>{new Date(frais.createdAt).toLocaleString()}</p>
          </div>
        </div>

        {role === 'admin' && frais.status === 'en_attente' && (
          <div className="mt-6 flex justify-between">
            <button
              disabled={loading}
              onClick={() => updateStatus('refuse')}
              className="bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200"
            >
              Refuser
            </button>
            <button
              disabled={loading}
              onClick={() => updateStatus('approuve')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Approuver
            </button>
          </div>
        )}
      </div>

      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]" />
    </>
  );
}
