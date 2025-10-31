import React, { useState } from "react";

export default function App() {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

  // Format card number: 1234 5678 9123 4567
  const formatCardNumber = (num) =>
    num.replace(/\s?/g, "").replace(/(\d{4})/g, "$1 ").trim();

  // Format expiry: only MM/YY allowed
  const handleExpiryChange = (value) => {
    // Remove non-digits
    value = value.replace(/[^\d]/g, "");

    if (value.length > 4) return; // block long input

    // Auto add slash after 2 digits
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }

    setExpiry(value);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-6">
      <h1 className="text-3xl font-bold text-blue-400 mb-8">💳 Animated Debit Card</h1>

      {/* Card Preview */}
      <div
        className={`relative w-80 h-48 [perspective:1000px] transition-all duration-700 ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        <div
          className={`absolute inset-0 w-full h-full rounded-xl shadow-2xl transition-transform duration-700 [transform-style:preserve-3d] ${
            isFlipped ? "transform rotate-y-180" : ""
          }`}
        >
          {/* FRONT SIDE */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-5 flex flex-col justify-between [backface-visibility:hidden]">
            <div className="flex justify-between items-center">
              <p className="font-semibold tracking-widest text-sm">DEBIT CARD</p>
              <div className="w-10 h-8 bg-yellow-300 rounded-md"></div>
            </div>

            <div>
              <p className="text-lg tracking-widest mb-1">
                {cardNumber || "#### #### #### ####"}
              </p>
              <div className="flex justify-between text-sm">
                <p>{cardName || "CARDHOLDER NAME"}</p>
                <p>{expiry || "MM/YY"}</p>
              </div>
            </div>
          </div>

          {/* BACK SIDE */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl p-5 transform rotate-y-180 [backface-visibility:hidden]">
            <div className="bg-black h-8 mb-4"></div>
            <div className="bg-gray-300 h-6 rounded flex items-center justify-end px-3 text-black text-sm font-semibold tracking-widest">
              {cvv || "***"}
            </div>
            <p className="text-xs text-gray-200 mt-4 text-right italic">Bank Secure Card</p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-gray-800 p-6 rounded-xl mt-8 w-full max-w-md shadow-lg space-y-4">
        <input
          type="text"
          maxLength={19}
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          onFocus={() => setIsFlipped(false)}
          className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <input
          type="text"
          placeholder="Cardholder Name"
          value={cardName}
          onChange={(e) => setCardName(e.target.value.toUpperCase())}
          onFocus={() => setIsFlipped(false)}
          className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => handleExpiryChange(e.target.value)}
            onFocus={() => setIsFlipped(false)}
            className="w-1/2 p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="password"
            placeholder="CVV"
            value={cvv}
            maxLength={3}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
            onFocus={() => setIsFlipped(true)}
            onBlur={() => setIsFlipped(false)}
            className="w-1/2 p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
