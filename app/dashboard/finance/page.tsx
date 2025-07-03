'use client';

import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import AddFraisModal from '@/app/components/AddFraisModal';
import AddEntreeModal from '@/app/components/AddEntreeModal';
import { Frais } from '@/app/types/frais';
import { Entree } from '@/app/types/entree';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

interface FinanceItem {
  label: string;
  amount: number;
}

export default function FinanceDashboard() {
  const [expenses, setExpenses] = useState<FinanceItem[]>([]);
  const [entries, setEntries] = useState<FinanceItem[]>([]);
  const [openFrais, setOpenFrais] = useState(false);
  const [openEntree, setOpenEntree] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');

  const [filter, setFilter] = useState<'30days' | 'all'>('30days');
  const [loading, setLoading] = useState(true);

  // PIN check only once per session
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('finance_pin')) {
      setShowPinModal(true);
    }
  }, []);

  const handlePinSubmit = () => {
    if (enteredPin === '1008') {
      localStorage.setItem('finance_pin', 'true');
      setShowPinModal(false);
    } else {
      alert('Code PIN incorrect');
    }
  };

  // Fetch finance data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const now = new Date();
      const past30Days = new Date();
      past30Days.setDate(now.getDate() - 30);

      try {
        const fraisRes = await fetch('/api/frais');
        const fraisData: Frais[] = await fraisRes.json();
        const entreesRes = await fetch('/api/entrees');
        const entreesData: Entree[] = await entreesRes.json();

        const filteredFrais = filter === '30days'
          ? fraisData.filter(f => new Date(f.date) > past30Days)
          : fraisData;
        const filteredEntrees = filter === '30days'
          ? entreesData.filter(e => new Date(e.date) > past30Days)
          : entreesData;

        setExpenses(filteredFrais.map(f => ({ label: f.motif, amount: f.montant })));
        setEntries(filteredEntrees.map(e => ({ label: e.source, amount: e.montant })));
      } catch (err) {
        console.error('Erreur lors du chargement des données :', err);
      }

      setLoading(false);
    };

    fetchData();
  }, [filter]);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalEntries = entries.reduce((sum, e) => sum + e.amount, 0);
  const profit = totalEntries - totalExpenses;

  const pieData = {
    labels: expenses.map(e => e.label),
    datasets: [{
      data: expenses.map(e => e.amount),
      backgroundColor: ['#f87171', '#60a5fa', '#34d399'],
    }]
  };

  const barData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
    datasets: [
      {
        label: 'Revenus',
        data: [3200, 2800, 3500, 4000, 3000],
        backgroundColor: '#34d399',
      },
      {
        label: 'Dépenses',
        data: [1800, 2000, 2200, 2100, 1900],
        backgroundColor: '#f87171',
      },
    ]
  };

  if (showPinModal) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[99999]">
        <h1 className="text-xl mb-4">Entrez le code PIN pour accéder à la finance</h1>
        <input
          type="password"
          maxLength={4}
          value={enteredPin}
          onChange={(e) => setEnteredPin(e.target.value)}
          className="border p-2 text-center text-lg tracking-widest"
        />
        <button
          onClick={handlePinSubmit}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
        >
          Valider
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <button
            onClick={() => setOpenFrais(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            + Ajouter une dépense
          </button>
          <button
            onClick={() => setOpenEntree(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            + Ajouter une entrée
          </button>
        </div>
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as '30days' | 'all')}
            className="border rounded p-2"
          >
            <option value="30days">30 derniers jours</option>
            <option value="all">Tout afficher</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Chargement...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="text-gray-500 text-sm">Revenus totaux</h3>
              <p className="text-2xl font-bold text-green-600">{totalEntries} DA</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="text-gray-500 text-sm">Dépenses totales</h3>
              <p className="text-2xl font-bold text-red-500">{totalExpenses} DA</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="text-gray-500 text-sm">Résultat net</h3>
              <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {profit} DA
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-4 rounded-xl shadow">
              <h4 className="text-gray-700 font-semibold mb-2">Revenus & Dépenses (mensuel)</h4>
              <Bar data={barData} />
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              <h4 className="text-gray-700 font-semibold mb-2">Répartition des dépenses</h4>
              <Pie data={pieData} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-4 rounded-xl shadow">
              <h4 className="font-semibold mb-3">Dernières dépenses</h4>
              <ul className="space-y-1">
                {expenses.map((e, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{e.label}</span>
                    <span className="text-red-500 font-medium">{e.amount} DA</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              <h4 className="font-semibold mb-3">Dernières entrées</h4>
              <ul className="space-y-1">
                {entries.map((e, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{e.label}</span>
                    <span className="text-green-500 font-medium">{e.amount} DA</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {openFrais && (
        <AddFraisModal
          isOpen={openFrais}
          onClose={() => setOpenFrais(false)}
          onAdded={(newFrais: Frais) => {
            const mapped: FinanceItem = {
              label: newFrais.motif,
              amount: newFrais.montant,
            };
            setExpenses(prev => [...prev, mapped]);
          }}
        />
      )}

      {openEntree && (
        <AddEntreeModal
          isOpen={openEntree}
          onClose={() => setOpenEntree(false)}
          onAdded={(newEntree: Entree) => {
            const mapped: FinanceItem = {
              label: newEntree.source,
              amount: newEntree.montant,
            };
            setEntries(prev => [...prev, mapped]);
          }}
        />
      )}
    </div>
  );
}
