import React, {useState, useEffect} from 'react';
import axios from 'axios';
import API_URL from '../api';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const fetchTransactions = async () => {
    const response = await axios.get(`${API_URL}/transactions`);
    setTransactions(response.data);
  };

  const fetchCategories = async () => {
    const response = await axios.get(`${API_URL}/categories`);
    setCategories(response.data);
  };
  const filteredTransactions = transactions.filter(t => {
    const [year, month] = t.date.split('-').map(Number);
    const matchesMonth = selectedMonth === 0 || (month === selectedMonth && year === selectedYear);
    const matchesSearch =
      t.note?.toLowerCase().includes(search.toLowerCase()) ||
      categories.find(c => c.id === t.category_id)?.name.toLowerCase().includes(search.toLowerCase());
    return matchesMonth && matchesSearch;
  });

  const addTransaction = async () => {
    if (!amount) {
      setError('Please enter an amount');
      return;
    }
    if (isNaN(parseFloat(amount))) {
    setError('Amount must be a valid number');
    return;
    }
    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than zero');
      return;
    }
    
    if (!categoryId) {
      setError('Please select a category');
      return;
    }
    if (!date) {
      setError('Please select a date');
      return;
    }
    const selectedDate = new Date(date);
    const today = new Date();
    if (selectedDate > today) {
      setError('Date cannot be in the future');
      return;
    }
    setError('');
    await axios.post(`${API_URL}/transactions`, {
      amount: parseFloat(amount),
      category_id: parseInt(categoryId),
      date,
      note
    });
    setAmount('');
    setCategoryId('');
    setDate('');
    setNote('');
    fetchTransactions();
  };

  const deleteTransaction = async (id) => {
    await axios.delete(`${API_URL}/transactions/${id}`);
    fetchTransactions();
  };

  return (
    <div>
      <h1 className ="text-2xl font-semibold text-gray-800 mb-6">Transactions</h1>
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
        >
          <option value={0}>Full Year</option>
          <option value={1}>January</option>
          <option value={2}>February</option>
          <option value={3}>March</option>
          <option value={4}>April</option>
          <option value={5}>May</option>
          <option value={6}>June</option>
          <option value={7}>July</option>
          <option value={8}>August</option>
          <option value={9}>September</option>
          <option value={10}>October</option>
          <option value={11}>November</option>
          <option value={12}>December</option>
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
        >
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
          <option value={2027}>2027</option>
        </select>
        <input
          type="text"
          placeholder="Search by category or note..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
        />
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Transaction</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
      />

      <select 
        value={categoryId} 
        onChange={(e) => setCategoryId(e.target.value)}
        className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300">
        <option 
        value="">Select category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className ="border border-gray-200 rounded-xl px-4  py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
      />

      <input
        type="text"
        placeholder="Note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
      />
      </div>
      {error && (
      <p className="text-sm text-red-400 mt-2">{error}</p>
        )}
      <button onClick={addTransaction}
              className="mt-4 bg-[#C4B5FD] text-violet-900 text-sm font-medium px-5 py-2 rounded-xl hover:bg-violet-300 transition-colors">Add Transaction</button>
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">All Transactions</h2>
        <ul className="divide-y divide-gray-100">
           {filteredTransactions.map((t) => {
            const cat = categories.find(c => c.id === t.category_id);
            return (
              <li key={t.id} className="py-3 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${cat && cat.type === 'income' ? 'bg-[#A7F3D0] text-emerald-800' : 'bg-[#FDBA74] text-orange-800'}`}>
                  {cat ? cat.name : 'Unknown'}
                </span>
                <p className="text-xs text-gray-400">{t.date} {t.note && `— ${t.note}`}</p>
              </div>
              <div className="flex items-center justify-end w-full gap-4">
                <p className="text-sm font-semibold text-gray-800">
                  {cat && cat.type === 'income' ? '+' : '-'}${t.amount}
                </p>
                <button
                  onClick={() => deleteTransaction(t.id)}
                  className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Transactions;