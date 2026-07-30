import React, {useState, useEffect}from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts/umd/Recharts';
import API_URL from '../api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

function Dashboard() {

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const fetchTransactions = async () => {
    const response = await axios.get(`${API_URL}/transactions`);
    setTransactions(response.data)
  }
  const fetchCategories = async () => {
    const response = await axios.get(`${API_URL}/categories`);
    setCategories(response.data);
  };

  const filteredTransactions = transactions.filter(t => {
    const [year, month, day] = t.date.split('-').map(Number);
    if (selectedMonth === 0) {
        return year === selectedYear;
    }
    return month === selectedMonth && year === selectedYear;
});

  const totalIncome = filteredTransactions
    .filter(t => {
      const cat = categories.find(c => c.id === t.category_id);
      return cat && cat.type === 'income';
    })
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses =filteredTransactions
    .filter(t => {
        const cat = categories.find(c => c.id === t.category_id);
        return cat && cat.type === 'expense';
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const spendingByCategory = categories
    .filter(cat => cat.type === 'expense')
    .map(cat => {
        const total = filteredTransactions
            .filter(t => t.category_id === cat.id)
            .reduce((sum, t) => sum + t.amount, 0);
        return { name: cat.name, amount: total };
    })
    .filter(cat => cat.amount > 0);

  const incomeVsExpenses = [
      { name: 'Income', amount: totalIncome },
      { name: 'Expenses', amount: totalExpenses }
  ];
  const COLORS = [
    '#FDBA74', // peach
    '#C4B5FD', // lavender
    '#93C5FD', // sky blue
    '#FCA5A5', // coral
    '#A7F3D0', // mint
    '#FEF08A', // yellow
    '#F9A8D4', // pink
    '#6EE7B7', // emerald
    '#BAE6FD', // light blue
    '#DDD6FE', // light purple
    '#FCD34D', // amber
    '#86EFAC', // light green
    '#FBCFE8', // rose
    '#BBF7D0', // pale mint
    '#E9D5FF', // pale lavender
  ];
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const isIncome = payload[0].payload.name === 'Income';
      return (
        <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-md">
          <p className="text-xs text-gray-400 mb-1">{payload[0].payload.name}</p>
          <p className="text-sm font-semibold" style={{ color: isIncome ? '#6EE7B7' : '#FDBA74' }}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  
  return (
     <div>
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Dashboard</h1>
      <div className="flex items-center gap-3 mb-6">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-300"
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
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-300"
        >
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
          <option value={2027}>2027</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className={`rounded-2xl p-5 card border ${balance >= 0 ? 'balance-positive border-emerald-100' : 'balance-negative border-red-100'}`}>
          <p className={`text-sm mb-1 ${balance >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>Balance</p>
          <p className={`text-2xl font-semibold ${balance >= 0 ? 'text-emerald-900' : 'text-red-900'}`}>{formatCurrency(balance)}</p>
        </div>
        <div className="bg-[#D1FAE5] rounded-2xl p-5 card">
          <p className="text-sm text-emerald-600 mb-1">Total Income</p>
          <p className="text-2xl font-semibold text-emerald-800">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="bg-[#FDE8CC] rounded-2xl p-5 card">
          <p className="text-sm text-orange-600 mb-1">Total Expenses</p>
          <p className="text-2xl font-semibold text-orange-800">{formatCurrency(totalExpenses)}</p>
        </div>
      </div>
    <div className="mb-8" >
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          navigation={true}
          spaceBetween={20}
          slidesPerView={1}
          className="pb-8"
        >
          {/* Slide 1 - Spending by Category */}
          <SwiperSlide>
            <div className="bg-white rounded-2xl p-5 card border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Spending by Category</h2>
              {spendingByCategory.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={spendingByCategory}
                        dataKey="amount"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={50}
                        labelLine={false}
                      >
                        {spendingByCategory.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [
                          `${formatCurrency(value)} (${((value / spendingByCategory.reduce((sum, cat) => sum + cat.amount, 0)) * 100).toFixed(1)}%)`,
                          name
                        ]}
                      />
                      <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle">
                        <tspan x="50%" dy="0" fontSize="16" fontWeight="600" fill="#4B5563">
                          {formatCurrency(totalExpenses)}
                        </tspan>
                        <tspan x="50%" dy="20" fontSize="10" fill="#9CA3AF">
                          total spent
                        </tspan>
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center">
                    {(() => {
                      const total = spendingByCategory.reduce((sum, c) => sum + c.amount, 0);
                      return spendingByCategory.map((cat, index) => {
                        const percent = ((cat.amount / total) * 100).toFixed(1);
                        return (
                          <div key={cat.name} className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-xs text-gray-600">{cat.name} {percent}%</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-400 text-center py-8">No expenses this period</p>
              )}
            </div>
          </SwiperSlide>

          {/* Slide 2 - Income vs Expenses */}
          <SwiperSlide>
            <div className="bg-white rounded-2xl p-5 card border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Income vs Expenses</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={incomeVsExpenses} barSize={60}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    <Cell fill="#A7F3D0" />
                    <Cell fill="#FDBA74" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SwiperSlide>

          {/* Slide 3 - Budget Goals */}
          <SwiperSlide style={{ height: 'auto' }}>
            <div className="bg-white rounded-2xl p-5 card border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Budget Goals</h2>
              {categories
                .filter(cat => cat.type === 'expense' && cat.budget_limit)
                .map(cat => {
                  const spent = filteredTransactions
                    .filter(t => t.category_id === cat.id)
                    .reduce((sum, t) => sum + t.amount, 0);
                  const percent = Math.min((spent / cat.budget_limit) * 100, 100);
                  const isOver = spent > cat.budget_limit;
                  const isClose = percent >= 70 && !isOver;
                  return (
                    <div key={cat.id} className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium text-gray-700">{cat.name}</p>
                        <p className={`text-xs font-medium ${isOver ? 'text-red-500' : isClose ? 'text-orange-500' : 'text-emerald-600'}`}>
                          {formatCurrency(spent)} / {formatCurrency(cat.budget_limit)}
                        </p>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${isOver ? 'bg-red-400' : isClose ? 'bg-[#FDBA74]' : 'bg-[#A7F3D0]'}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      {isOver && (
                        <p className="text-xs text-red-400 mt-1">Over budget by {formatCurrency(spent - cat.budget_limit)}</p>
                      )}
                    </div>
                  );
                })}
              {categories.filter(cat => cat.type === 'expense' && cat.budget_limit).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No budget goals set — add limits in Categories!</p>
              )}
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="bg-white rounded-2xl p-5 card border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Transactions</h2>
        <ul className="divide-y divide-gray-100">
          {[...filteredTransactions]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map((t) => {
            const cat = categories.find(c => c.id === t.category_id);
            return (
              <li key={t.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">{cat ? cat.name : 'Unknown'}</p>
                  <p className="text-xs text-gray-400">{t.date} {t.note && `— ${t.note}`}</p>
                </div>
                <p className={`text-sm font-semibold px-3 py-1 rounded-full ${cat && cat.type === 'income' ? 'bg-[#A7F3D0] text-emerald-800' : 'bg-[#FDBA74] text-orange-800'}`}>
                  {cat && cat.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)} 
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
export default Dashboard;
