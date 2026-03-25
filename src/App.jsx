import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PlusCircle, Trash2, Wallet, TrendingUp, TrendingDown, Target, BrainCircuit, Trophy } from 'lucide-react';

const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other'];
// Adjusted colors for better dark mode visibility
const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#9ca3af'];

export default function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('expense_data');
    return saved ? JSON.parse(saved) : [];
  });
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [goal, setGoal] = useState(() => {
    return localStorage.getItem('savings_goal') || '10000';
  });

  useEffect(() => {
    localStorage.setItem('expense_data', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('savings_goal', goal);
  }, [goal]);

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    const newTransaction = {
      id: crypto.randomUUID(),
      title,
      amount: parseFloat(amount),
      type,
      category: type === 'expense' ? category : 'Income',
      date: new Date().toISOString()
    };

    setTransactions([newTransaction, ...transactions]);
    setTitle('');
    setAmount('');
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

  const chartData = Object.keys(expensesByCategory).map(key => ({
    name: key,
    value: expensesByCategory[key]
  }));

  const topExpense = transactions
    .filter(t => t.type === 'expense')
    .sort((a, b) => b.amount - a.amount)[0];

  let personality = "Saver 🌱";
  if (totalExpense > totalIncome && totalIncome > 0) personality = "Big Spender 💸";
  else if (totalExpense > 0 && totalExpense > totalIncome * 0.7) personality = "Risk Taker 🎢";
  else if (totalExpense > 0 && totalExpense <= totalIncome * 0.4) personality = "Minimalist 🧘‍♂️";
  else if (totalExpense > 0) personality = "Balanced ⚖️";

  const goalProgress = goal > 0 ? Math.min((balance / parseFloat(goal)) * 100, 100) : 0;

  // Custom Tooltip for Recharts to match dark theme
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-800 border border-neutral-700 p-3 rounded-xl shadow-lg">
          <p className="text-neutral-200 font-medium">{`${payload[0].name} : ₹${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-neutral-800 p-6 rounded-2xl border border-neutral-700 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-neutral-100 flex items-center gap-3">
              <Wallet className="w-8 h-8 text-indigo-400" />
              Expense Tracker
            </h1>
            <p className="text-neutral-400 mt-1">Manage your finances with ease natively in your browser.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-neutral-700/50 px-4 py-3 rounded-xl border border-neutral-600">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
            <div>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mb-0.5">Personality</p>
              <p className="text-sm font-bold text-neutral-200 leading-none">{personality}</p>
            </div>
          </div>
        </header>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 shadow-sm flex items-center gap-5 transition-transform hover:-translate-y-1 duration-300">
            <div className="p-4 bg-neutral-700/50 rounded-xl">
              <Wallet className="w-8 h-8 text-neutral-300" />
            </div>
            <div>
              <p className="text-sm text-neutral-400 font-medium">Total Balance</p>
              <h2 className="text-3xl font-bold text-neutral-100">₹{balance.toLocaleString()}</h2>
            </div>
          </div>
          <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 shadow-sm flex items-center gap-5 transition-transform hover:-translate-y-1 duration-300">
            <div className="p-4 bg-emerald-900/30 rounded-xl">
              <TrendingUp className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-400 font-medium">Total Income</p>
              <h2 className="text-3xl font-bold text-emerald-400">₹{totalIncome.toLocaleString()}</h2>
            </div>
          </div>
          <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 shadow-sm flex items-center gap-5 transition-transform hover:-translate-y-1 duration-300">
            <div className="p-4 bg-rose-900/30 rounded-xl">
              <TrendingDown className="w-8 h-8 text-rose-400" />
            </div>
            <div>
              <p className="text-sm text-neutral-400 font-medium">Total Expense</p>
              <h2 className="text-3xl font-bold text-rose-400">₹{totalExpense.toLocaleString()}</h2>
            </div>
          </div>
        </div>

        {/* Main Application Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            
            <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 shadow-sm">
              <h3 className="text-lg font-bold text-neutral-100 mb-5">Add Transaction</h3>
              <form onSubmit={handleAddTransaction} className="space-y-5">
                
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Type</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setType('expense')}
                      className={`flex-1 py-2.5 rounded-xl font-medium transition-all duration-200 ${type === 'expense' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50' : 'bg-neutral-700/50 text-neutral-400 border border-transparent hover:bg-neutral-700'}`}
                    >
                      Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('income')}
                      className={`flex-1 py-2.5 rounded-xl font-medium transition-all duration-200 ${type === 'income' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-neutral-700/50 text-neutral-400 border border-transparent hover:bg-neutral-700'}`}
                    >
                      Income
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Groceries"
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder-neutral-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g., 500"
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder-neutral-600"
                  />
                </div>

                {type === 'expense' && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all appearance-none"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors flex justify-center items-center gap-2 mt-4 shadow-lg shadow-indigo-600/20"
                >
                  <PlusCircle className="w-5 h-5" />
                  Add {type === 'expense' ? 'Expense' : 'Income'}
                </button>
              </form>
            </div>

            <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-400" />
                  Savings Tracker
                </h3>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-400 mb-2">Target Balance (₹)</label>
                <input
                  type="number"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span className="text-neutral-400">Progress</span>
                  <span className="text-indigo-400">{goalProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-neutral-900 rounded-full h-3 p-0.5 border border-neutral-700">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${goalProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-neutral-500 mt-3 text-right">
                  {balance >= parseFloat(goal) ? 'Goal Achieved! 🎉' : `₹${Math.max(0, parseFloat(goal) - balance).toLocaleString()} more to go`}
                </p>
              </div>
            </div>

            {topExpense && (
              <div className="bg-neutral-800 p-5 rounded-2xl border border-amber-500/30 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <h3 className="text-md font-bold text-amber-500 flex items-center gap-2 mb-4 relative z-10">
                  <Trophy className="w-5 h-5" />
                  Highest Expense
                </h3>
                <div className="flex justify-between items-center bg-neutral-900 p-4 rounded-xl border border-neutral-700 relative z-10">
                  <div className="truncate pr-3">
                    <p className="font-semibold text-neutral-100 truncate">{topExpense.title}</p>
                    <p className="text-xs text-neutral-500 mt-1">{new Date(topExpense.date).toLocaleDateString()}</p>
                  </div>
                  <p className="font-bold text-amber-500 whitespace-nowrap text-lg">₹{topExpense.amount.toLocaleString()}</p>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6 flex flex-col">
            
            <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 shadow-sm">
              <h3 className="text-lg font-bold text-neutral-100 mb-6">Expenses by Category</h3>
              {chartData.length > 0 ? (
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={85}
                        outerRadius={120}
                        paddingAngle={6}
                        dataKey="value"
                        stroke="none"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        iconType="circle" 
                        wrapperStyle={{ color: '#d4d4d8' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[320px] flex flex-col items-center justify-center text-neutral-500 bg-neutral-900/50 rounded-xl border border-dashed border-neutral-700">
                  <PieChart className="w-16 h-16 text-neutral-700 mb-3" />
                  <p>No expenses yet. Add one to see the chart.</p>
                </div>
              )}
            </div>

            <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 shadow-sm flex-1 flex flex-col min-h-[400px]">
              <h3 className="text-lg font-bold text-neutral-100 mb-6">Recent Transactions</h3>
              
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {transactions.length === 0 ? (
                  <div className="text-center py-16 text-neutral-500">
                    <Wallet className="w-12 h-12 mx-auto text-neutral-700 mb-4" />
                    <p className="font-medium text-neutral-400">No transactions found</p>
                    <p className="text-sm mt-1">Start by adding your first income or expense</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.map(t => (
                      <div key={t.id} className="flex justify-between items-center p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:border-neutral-600 transition-colors group">
                        
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={`p-3 rounded-full shrink-0 ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {t.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                          </div>
                          <div className="truncate">
                            <p className="font-semibold text-neutral-200 truncate">{t.title}</p>
                            <p className="text-xs text-neutral-500 flex items-center gap-2 mt-1">
                              <span className="bg-neutral-800 px-2 py-0.5 rounded text-[10px] font-medium tracking-wider uppercase">{t.category}</span>
                              <span className="w-1 h-1 bg-neutral-600 rounded-full"></span>
                              <span>{new Date(t.date).toLocaleDateString()}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0 pl-4">
                          <p className={`font-bold text-lg ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                          </p>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-2 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                            aria-label="Delete transaction"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
