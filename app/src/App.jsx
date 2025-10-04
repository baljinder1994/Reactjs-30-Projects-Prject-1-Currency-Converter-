import React, { useEffect, useState } from 'react';

const App = () => {
  const [rates, setRates] = useState({});
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response not ok');
        return res.json();
      })
      .then((data) => {
        setRates(data.rates);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
      });
  }, [fromCurrency]);

  useEffect(() => {
    if (!rates || !rates[toCurrency]) {
      setResult(null); // ✅ Corrected this line
      return;
    }

    const rate = rates[toCurrency];
    setResult((amount * rate).toFixed(2));
  }, [rates, toCurrency, amount]);

  return (
    <div className="bg-gray-100 p-4 flex justify-center items-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Currency Converter</h1>

        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          className="w-full p-3 border rounded mb-2"
        />

        <div className="flex space-x-2 mb-4">
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="flex-1 p-3 border rounded"
          >
            {rates &&
              Object.keys(rates).map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
          </select>

          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="flex-1 p-3 border rounded"
          >
            {rates &&
              Object.keys(rates).map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
          </select>
        </div>

        {result !== null && (
          <div className="mt-4 text-center text-xl font-bold">
            {amount} {fromCurrency} = {result} {toCurrency}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
