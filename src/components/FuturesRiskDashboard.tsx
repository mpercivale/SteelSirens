"use client";

import React, { useState } from "react";

function calculateTrade(input) {
  const { accountBalance, riskPercent, entryPrice, stopLossPrice, takeProfitPrice, leverage } = input;
  const riskAmount = accountBalance * (riskPercent / 100);
  const positionSize = riskAmount / Math.abs(entryPrice - stopLossPrice);
  const marginRequired = positionSize / leverage;
  const potentialProfit = (takeProfitPrice - entryPrice) * positionSize;
  const potentialLoss = (entryPrice - stopLossPrice) * positionSize;

  return {
    positionSize,
    marginRequired,
    potentialProfit,
    potentialLoss,
  };
}

export default function FuturesRiskDashboard() {
  const [input, setInput] = useState({
    accountBalance: 0,
    riskPercent: 0,
    entryPrice: 0,
    stopLossPrice: 0,
    takeProfitPrice: 0,
    leverage: 1,
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleCalculate = () => {
    const tradeResult = calculateTrade(input);
    setResult(tradeResult);
  };

  return (
    <div>
      <h1>Futures Risk Dashboard</h1>
      <div>
        <label>
          Account Balance:
          <input
            type="number"
            name="accountBalance"
            value={input.accountBalance}
            onChange={handleChange}
          />
        </label>
        <label>
          Risk Percent:
          <input
            type="number"
            name="riskPercent"
            value={input.riskPercent}
            onChange={handleChange}
          />
        </label>
        <label>
          Entry Price:
          <input
            type="number"
            name="entryPrice"
            value={input.entryPrice}
            onChange={handleChange}
          />
        </label>
        <label>
          Stop Loss Price:
          <input
            type="number"
            name="stopLossPrice"
            value={input.stopLossPrice}
            onChange={handleChange}
          />
        </label>
        <label>
          Take Profit Price:
          <input
            type="number"
            name="takeProfitPrice"
            value={input.takeProfitPrice}
            onChange={handleChange}
          />
        </label>
        <label>
          Leverage:
          <input
            type="number"
            name="leverage"
            value={input.leverage}
            onChange={handleChange}
          />
        </label>
        <button onClick={handleCalculate}>Calculate</button>
      </div>
      {result && (
        <div>
          <h2>Results:</h2>
          <p>Position Size: {result.positionSize}</p>
          <p>Margin Required: {result.marginRequired}</p>
          <p>Potential Profit: {result.potentialProfit}</p>
          <p>Potential Loss: {result.potentialLoss}</p>
        </div>
      )}
    </div>
  );
}
