'use client';

import { Entree } from '../types/entree';

interface Props {
  entree: Entree;
  onClose: () => void;
}

export default function EntreeDetailsModal({ entree, onClose }: Props) {
  return (
    <>
      <div className="fixed inset-y-0 right-0 z-[9999] w-full max-w-md bg-white shadow-xl p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Détail de l'entrée</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">&times;</button>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <p className="text-gray-500">Montant</p>
            <p className="text-lg font-bold">{parseFloat(entree.montant.toString()).toFixed(2)} €</p>
          </div>

          <div>
            <p className="text-gray-500">Date</p>
            <p>{new Date(entree.date).toLocaleDateString()}</p>
          </div>

          <div>
            <p className="text-gray-500">Source</p>
            <p>{entree.source}</p>
          </div>

          <div>
            <p className="text-gray-500">Description</p>
            <p>{entree.description || '—'}</p>
          </div>

          <div>
            <p className="text-gray-500">Date d'enregistrement</p>
            <p>{new Date(entree.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]" />
    </>
  );
}
