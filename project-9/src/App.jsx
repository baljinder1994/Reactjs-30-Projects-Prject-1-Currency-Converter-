import React, { useEffect, useMemo, useState } from 'react'
import { Doughnut, Bar } from 'react-chartjs-2'
import Chart from 'chart.js/auto'

const STORAGE_KEY = 'pf_dashboard_data'

const App = () => {

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  }

  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })

  const [desc, setDesc] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState('expense')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      console.error('localstorage set error', e)
    }
  }, [items])

  const addItem = (e) => {
    e.preventDefault();
    const num = parseFloat(amount)
    if (!desc.trim() || Number.isNaN(num) || num <= 0) return
    const newItem = {
      id: uid(),
      desc: desc.trim(),
      amount: Math.round(num * 100) / 100,
      type,
      date: new Date().toISOString(),
    }
    setItems((s) => [newItem, ...s]);
    setDesc('')
    setAmount('')
  }

  const totalIncome = useMemo(
    () => items.filter(i => i.type === 'income').reduce((a, b) => a + b.amount, 0),
    [items]
  )

  const totalExpense = useMemo(
    () => items.filter(i => i.type === 'expense').reduce((a, b) => a + b.amount, 0),
    [items]
  )

  const balance = useMemo(() => totalIncome - totalExpense, [totalIncome, totalExpense])

  const clearAll = () => {
    if (confirm('Are you sure you want to delete all transactions?')) setItems([])
  }

  const deleteItem = (id) => {
    setItems((s) => s.filter(it => it.id !== id))
  }

  const barData = useMemo(() => {
    const months = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({ key: `${d.getFullYear()}-${d.getMonth() + 1}`, label: d.toLocaleString('default', { month: 'short' }) })
    }

    const incomeArr = Array(6).fill(0)
    const expenseArr = Array(6).fill(0)

    items.forEach((it) => {
      const dt = new Date(it.date)
      const key = `${dt.getFullYear()}-${dt.getMonth() + 1}`
      const idx = months.findIndex((m) => m.key === key)
      if (idx !== -1) {
        if (it.type === 'income') incomeArr[idx] += it.amount
        else expenseArr[idx] += it.amount
      }
    })

    return {
      labels: months.map(m => m.label),
      datasets: [
        { label: 'Income', data: incomeArr, stack: 'a', borderRadius: 6, backgroundColor: '#16a34a' },
        { label: 'Expense', data: expenseArr, stack: 'a', borderRadius: 6, backgroundColor: '#dc2626' }
      ]
    }
  }, [items])

  const doughnutData = useMemo(() => ({
    labels: ['Income', 'Expense'],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ['#16a34a', '#dc2626'],
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 8
      }
    ]
  }), [totalIncome, totalExpense])


  return (
    <div className='min-h-screen bg-white text-gray-800 p-6'>
      <div className='max-w-6xl mx-auto'>
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-red-600">Personal Finance Dashboard</h1>
          <div className='text-sm text-gray-600'>All data stored locally in your browser</div>
        </header>

        <main className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <section className='lg:col-span-1 bg-red-50 rounded-2xl p-5 shadow-sm border border-red-100'>
            <form onSubmit={addItem}>
              <div>
                <label className='block text-sm font-medium text-red-700 mb-1'>Description</label>
                <input
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className='w-full px-3 py-2 rounded-md border border-red-200'
                  placeholder='e.g. Salary or Grocery'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-red-700 mb-1'>Amount</label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  className='w-full px-3 py-2 rounded-md border border-red-200'
                  placeholder='e.g. 2500'
                />
              </div>

              <div className='flex items-center gap-3'>
                <label className='inline-flex items-center gap-2'>
                  <input
                    checked={type === 'expense'}
                    onChange={() => setType('expense')}
                    type="radio" className='accent-red-600' />
                  <span className='text-sm font-medium text-red-700'>Expense</span>
                </label>

                <label className='flex items-center gap-3'>
                  <input
                    checked={type === 'income'}
                    onChange={() => setType('income')}
                    type="radio" className='accent-red-600' />
                  <span className='text-sm font-medium text-red-700'>Income</span>
                </label>
              </div>

              <div className='flex gap-2'>
                <button
                  type="submit"
                  className='flex-1 bg-red-600 text-white py-2 rounded-md font-medium'>Add</button>
                <button
                  type="button"
                  onClick={() => { setDesc(''); setAmount('') }}
                  className='px-4 py-2 rounded-md border border-red-200 text-red-700'>Reset</button>
              </div>
            </form>

            <div className='mt-6 bg-white rounded-lg p-4 shadow-inner border border-red-100'>
              <div className='flex justify-between items-center'>
                <div>
                  <div className='text-xs text-gray-500'>Total Income</div>
                  <div className='text-lg font-semibold'>{totalIncome.toFixed(2)}</div>
                </div>
                <div>
                  <div className='text-xs text-gray-500'>Total Expense</div>
                  <div className='text-lg font-semibold'>{totalExpense.toFixed(2)}</div>
                </div>
                <div>
                  <div className='text-xs text-gray-500'>Balance</div>
                  <div className={`text-lg font-semibold ${balance < 0 ? 'text-red-600' : 'text-green-600'}`}>{balance.toFixed(2)}</div>
                </div>
              </div>

              <div className='mt-4 flex gap-2'>
                <button
                  onClick={() => navigator.clipboard?.writeText(JSON.stringify(items))}
                  className='flex-1 py-2 rounded-md border border-red-200 text-red-700 text-sm '>Copy JSON</button>
                <button
                  onClick={clearAll}
                  className='flex-1 py-2 rounded-md  bg-red-600 text-white text-sm '>Clear All</button>
              </div>
            </div>
          </section>

          <section className='lg:col-span-2 grid grid-cols-1 gap-6'>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-red-100">
              <h2 className='text-lg font-bold mb-2'>Income vs Expense</h2>
              <div className='flex flex-col lg:flex-row gap-4'>
                <div className='flex-1 flex items-center justify-center'>
                  <Doughnut
                    data={doughnutData}
                    options={{
                      plugins: { legend: { position: 'bottom' } },
                      cutout: '70%',
                    }}
                    height={200}
                  />
                </div>

                <div className='flex-1'>
                  <Bar
                    data={barData}
                    options={{
                      plugins: { legend: { position: 'top' } },
                      maintainAspectRatio: false,
                      scales: { x: { stacked: true }, y: { stacked: true } },
                    }}
                    height={220}
                  />
                </div>
              </div>
            </div>

            <div className='bg-white rounded-2xl shadow-sm border border-red-100'>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-lg font-bold text-red-600'>Transactions</h3>
                <div className='text-sm text-gray-500'>{items.length} items</div>
              </div>

              <div className='space-y-3 max-h-72 overflow-auto pr-2'>
                {items.length === 0 && <div>No Transaction yet. Add Income or Expense</div>}
                {items.map((it) => (
                  <div key={it.id} className='flex items-center justify-between bg-red-50 rounded-md p-3 border border-red-100'>
                    <div>
                      <div className='text-sm font-medium'>{it.desc}</div>
                      <div className='text-xs text-gray-500'>{new Date(it.date).toLocaleString()}</div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <div className={`text-sm font-semibold ${it.type === 'expense' ? 'text-red-600' : "text-green-600"}`}>{it.amount.toFixed(2)}</div>
                      <button
                        onClick={() => deleteItem(it.id)}
                        className='text-xs px-2 py-1 rounded bg-white border border-red-200 text-red-600'>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
