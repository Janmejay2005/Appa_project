/**
 * Evaluates an arithmetic expression string like "10+30" or "2.5 + 3" or "2.5 + 03 = 5.5"
 * to extract the total numeric value. Handles spaces, leading zeros, and returns 0 on error.
 */
export const evaluateExpression = (input) => {
  if (input === undefined || input === null) return 0;
  
  // Convert to string and clean up
  let cleaned = String(input).trim();
  
  // If user entered something like "2.5+3 = 5.5", take the part before "=" or the raw expression
  if (cleaned.includes("=")) {
    cleaned = cleaned.split("=")[0].trim();
  }
  
  // Remove non-math characters except numbers, decimals, and '+'
  cleaned = cleaned.replace(/[^0-9.+\s]/g, "");

  if (!cleaned) return 0;

  try {
    // Split by '+' and sum components
    const parts = cleaned.split("+");
    const sum = parts.reduce((acc, part) => {
      const num = parseFloat(part.trim());
      return acc + (isNaN(num) ? 0 : num);
    }, 0);
    
    // Round to 3 decimal places to avoid floating point issues (e.g. 0.1 + 0.2)
    return Math.round(sum * 1000) / 1000;
  } catch (e) {
    console.error("Failed to evaluate expression:", cleaned, e);
    return 0;
  }
};

/**
 * Calculates the total cost of consumption for a single day's indent.
 * Formula: Sum of (quantity * itemPrice) for all items in the indent.
 */
export const calculateDailyCost = (indentData, inventoryList) => {
  if (!indentData) return 0;
  
  return Object.entries(indentData).reduce((total, [itemIdStr, quantityStr]) => {
    const itemId = parseInt(itemIdStr);
    const quantity = evaluateExpression(quantityStr);
    const item = inventoryList.find((i) => i.id === itemId);
    
    if (item && quantity > 0) {
      return total + quantity * item.price;
    }
    return total;
  }, 0);
};

/**
 * Calculates daily budget totals.
 * Returns: { dailyBudgetPerHead, realizedBudget, consumptionCost, savingOrExcess }
 */
export const calculateDailyBudgetDetails = (dateLog, inventoryList) => {
  const diningStrength = dateLog?.diningStrength || 0;
  const budgetPerHeadMonthly = dateLog?.budgetPerHeadMonthly || 2352;
  
  const dailyBudgetPerHead = Math.round((budgetPerHeadMonthly / 30) * 100) / 100;
  const realizedBudget = Math.round(diningStrength * dailyBudgetPerHead * 100) / 100;
  const consumptionCost = Math.round(calculateDailyCost(dateLog?.indents, inventoryList) * 100) / 100;
  const savingOrExcess = Math.round((realizedBudget - consumptionCost) * 100) / 100;
  
  return {
    diningStrength,
    budgetPerHeadMonthly,
    dailyBudgetPerHead,
    realizedBudget,
    consumptionCost,
    savingOrExcess
  };
};

/**
 * Summarizes consumption and budgets for a specific month (format "YYYY-MM")
 */
export const calculateMonthlySummary = (monthStr, dailyLogs, inventoryList) => {
  const daysInMonth = Object.entries(dailyLogs).filter(([date]) => date.startsWith(monthStr));
  
  let totalDiningStrength = 0;
  let totalRealizedBudget = 0;
  let totalCost = 0;
  
  // Aggregate itemized quantities and costs: { itemId: { item, qty: 0, cost: 0 } }
  const itemSummary = {};
  
  daysInMonth.forEach(([date, dayLog]) => {
    const details = calculateDailyBudgetDetails(dayLog, inventoryList);
    totalDiningStrength += details.diningStrength;
    totalRealizedBudget += details.realizedBudget;
    totalCost += details.consumptionCost;
    
    // Add itemized consumption
    if (dayLog.indents) {
      Object.entries(dayLog.indents).forEach(([itemIdStr, qtyStr]) => {
        const itemId = parseInt(itemIdStr);
        const qty = evaluateExpression(qtyStr);
        const item = inventoryList.find((i) => i.id === itemId);
        
        if (item && qty > 0) {
          if (!itemSummary[itemId]) {
            itemSummary[itemId] = {
              item,
              totalQty: 0,
              totalCost: 0
            };
          }
          itemSummary[itemId].totalQty += qty;
          itemSummary[itemId].totalCost += qty * item.price;
        }
      });
    }
  });

  const totalSavingOrExcess = Math.round((totalRealizedBudget - totalCost) * 100) / 100;
  const averageCostPerHead = totalDiningStrength > 0 
    ? Math.round((totalCost / totalDiningStrength) * 100) / 100 
    : 0;

  return {
    daysCount: daysInMonth.length,
    totalDiningStrength,
    totalRealizedBudget: Math.round(totalRealizedBudget * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    totalSavingOrExcess,
    averageCostPerHead,
    itemized: Object.values(itemSummary).sort((a, b) => b.totalCost - a.totalCost)
  };
};

/**
 * Summarizes consumption and budgets for a specific year (format "YYYY")
 */
export const calculateYearlySummary = (yearStr, dailyLogs, inventoryList) => {
  const daysInYear = Object.entries(dailyLogs).filter(([date]) => date.startsWith(yearStr));
  
  let totalDiningStrength = 0;
  let totalRealizedBudget = 0;
  let totalCost = 0;
  
  const itemSummary = {};
  
  daysInYear.forEach(([date, dayLog]) => {
    const details = calculateDailyBudgetDetails(dayLog, inventoryList);
    totalDiningStrength += details.diningStrength;
    totalRealizedBudget += details.realizedBudget;
    totalCost += details.consumptionCost;
    
    if (dayLog.indents) {
      Object.entries(dayLog.indents).forEach(([itemIdStr, qtyStr]) => {
        const itemId = parseInt(itemIdStr);
        const qty = evaluateExpression(qtyStr);
        const item = inventoryList.find((i) => i.id === itemId);
        
        if (item && qty > 0) {
          if (!itemSummary[itemId]) {
            itemSummary[itemId] = {
              item,
              totalQty: 0,
              totalCost: 0
            };
          }
          itemSummary[itemId].totalQty += qty;
          itemSummary[itemId].totalCost += qty * item.price;
        }
      });
    }
  });

  const totalSavingOrExcess = Math.round((totalRealizedBudget - totalCost) * 100) / 100;
  const averageCostPerHead = totalDiningStrength > 0 
    ? Math.round((totalCost / totalDiningStrength) * 100) / 100 
    : 0;

  return {
    daysCount: daysInYear.length,
    totalDiningStrength,
    totalRealizedBudget: Math.round(totalRealizedBudget * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    totalSavingOrExcess,
    averageCostPerHead,
    itemized: Object.values(itemSummary).sort((a, b) => b.totalCost - a.totalCost)
  };
};
