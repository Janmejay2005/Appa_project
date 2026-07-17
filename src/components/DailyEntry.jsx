import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { evaluateExpression, calculateDailyCost } from "../utils/calculations";
import { 
  Save, 
  Trash2, 
  Search, 
  Grid, 
  DollarSign, 
  UtensilsCrossed,
  Layers,
  ChevronDown
} from "lucide-react";
import "../styles/DailyEntry.css";

const DailyEntry = ({ initialDate }) => {
  const { 
    inventory, 
    dailyLogs, 
    saveDailyLog, 
    deleteDailyLog,
    triggerSync
  } = useApp();

  // 1. Date Selector state
  const [selectedDate, setSelectedDate] = useState(() => {
    if (initialDate) return initialDate;
    return new Date().toISOString().split("T")[0];
  });

  // Form States
  const [diningStrength, setDiningStrength] = useState("");
  const [budgetPerHeadMonthly, setBudgetPerHeadMonthly] = useState("2352");
  const [menu, setMenu] = useState({
    breakfast: "",
    recess: "",
    lunch: "",
    snacks: "",
    dinner: ""
  });
  
  // Quantities input state: { itemId: "expression" }
  const [indents, setIndents] = useState({});

  // Search & Category Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Load existing log for the selected date
  useEffect(() => {
    const existingLog = dailyLogs[selectedDate];
    if (existingLog) {
      setDiningStrength(existingLog.diningStrength.toString());
      setBudgetPerHeadMonthly(existingLog.budgetPerHeadMonthly.toString());
      setMenu({
        breakfast: existingLog.menu.breakfast || "",
        recess: existingLog.menu.recess || "",
        lunch: existingLog.menu.lunch || "",
        snacks: existingLog.menu.snacks || "",
        dinner: existingLog.menu.dinner || ""
      });
      // Convert all quantites back to their string values
      const loadedIndents = {};
      Object.entries(existingLog.indents).forEach(([itemId, val]) => {
        loadedIndents[itemId] = val !== undefined ? val.toString() : "";
      });
      setIndents(loadedIndents);
    } else {
      // Clear form for new entry
      setDiningStrength("");
      setBudgetPerHeadMonthly("2352");
      setMenu({
        breakfast: "",
        recess: "",
        lunch: "",
        snacks: "",
        dinner: ""
      });
      setIndents({});
    }
  }, [selectedDate, dailyLogs]);

  // Categories extraction
  const categories = ["All", ...new Set(inventory.map((item) => item.category))];

  // Handle ingredient quantity changes
  const handleIndentChange = (itemId, val) => {
    setIndents((prev) => ({
      ...prev,
      [itemId]: val
    }));
  };

  // Safe expression evaluator for row rendering
  const getEvaluatedVal = (itemId) => {
    const expr = indents[itemId];
    if (!expr) return 0;
    return evaluateExpression(expr);
  };

  // Check if string is a complex formula (contains '+')
  const isFormula = (str) => {
    return str && String(str).includes("+");
  };

  // Calculate current daily cost dynamically
  const getLiveDailyCost = () => {
    return Object.entries(indents).reduce((total, [itemIdStr, quantityExpr]) => {
      const itemId = parseInt(itemIdStr);
      const qty = evaluateExpression(quantityExpr);
      const item = inventory.find((i) => i.id === itemId);
      
      if (item && qty > 0) {
        return total + qty * item.price;
      }
      return total;
    }, 0);
  };

  // Filtered inventory list
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = 
      item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameHi.includes(searchQuery);
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSave = (e) => {
    e.preventDefault();
    
    // Evaluate expressions to numeric values for database saving
    const finalIndents = {};
    Object.entries(indents).forEach(([itemId, expr]) => {
      const numericVal = evaluateExpression(expr);
      if (numericVal > 0) {
        finalIndents[itemId] = numericVal;
      }
    });

    const logPayload = {
      diningStrength: parseInt(diningStrength) || 0,
      budgetPerHeadMonthly: parseInt(budgetPerHeadMonthly) || 2352,
      menu,
      indents: finalIndents
    };

    saveDailyLog(selectedDate, logPayload);
    // Push sync automatically
    triggerSync();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the entry for ${selectedDate}?`)) {
      deleteDailyLog(selectedDate);
      triggerSync();
    }
  };

  // Helper values for current day calculations
  const parsedStrength = parseInt(diningStrength) || 0;
  const parsedMonthlyBudget = parseInt(budgetPerHeadMonthly) || 2352;
  const dailyBudgetPerHead = Math.round((parsedMonthlyBudget / 30) * 100) / 100;
  const realizedBudget = Math.round(parsedStrength * dailyBudgetPerHead * 100) / 100;
  const currentCost = Math.round(getLiveDailyCost() * 100) / 100;
  const savings = Math.round((realizedBudget - currentCost) * 100) / 100;

  return (
    <div className="daily-entry-view">
      <div className="view-header">
        <div>
          <h1>Daily Entry</h1>
          <p className="subtitle">Log daily meal details, student counts, and mess indents</p>
        </div>
        
        {/* Date Selector */}
        <div className="date-picker-header">
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field header-date-input"
          />
        </div>
      </div>

      <form onSubmit={handleSave} className="entry-form-container">
        {/* Row 1: Quick Settings & Numbers */}
        <div className="glass-panel metrics-entry-panel">
          <h3>Daily Settings & Budget</h3>
          
          <div className="grid-2 entry-fields-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="diningStrength">Dining Strength (Students)</label>
              <input 
                id="diningStrength"
                type="number" 
                placeholder="Number of students" 
                value={diningStrength} 
                onChange={(e) => setDiningStrength(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="monthlyBudget">Monthly Budget per Head (₹)</label>
              <input 
                id="monthlyBudget"
                type="number" 
                placeholder="e.g. 2352" 
                value={budgetPerHeadMonthly} 
                onChange={(e) => setBudgetPerHeadMonthly(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Quick budget summary for the day */}
          <div className="live-day-summary">
            <div className="summary-item">
              <span className="summary-lbl">Realized Budget</span>
              <span className="summary-val">₹{realizedBudget}</span>
            </div>
            <div className="summary-item">
              <span className="summary-lbl">Live Consumption Cost</span>
              <span className="summary-val">₹{currentCost}</span>
            </div>
            <div className="summary-item">
              <span className="summary-lbl">Net Savings</span>
              <span className={`summary-val ${savings >= 0 ? "text-success" : "text-danger"}`}>
                ₹{savings}
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Menu Planner Panel */}
        <div className="glass-panel menu-entry-panel">
          <h3><UtensilsCrossed size={18} /> Menu Planner</h3>
          <p className="subtitle">Enter the meals prepared for the students</p>
          
          <div className="menu-inputs-grid">
            <div className="form-group">
              <label className="form-label">Breakfast</label>
              <input 
                type="text" 
                placeholder="e.g. Veg Biryani - Tea" 
                value={menu.breakfast}
                onChange={(e) => setMenu({ ...menu, breakfast: e.target.value })}
                className="input-field"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Recess</label>
              <input 
                type="text" 
                placeholder="e.g. Biscuits - 01 Pkt" 
                value={menu.recess}
                onChange={(e) => setMenu({ ...menu, recess: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Lunch</label>
              <input 
                type="text" 
                placeholder="e.g. Aloo Chole, Poori, Salad" 
                value={menu.lunch}
                onChange={(e) => setMenu({ ...menu, lunch: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Snacks</label>
              <input 
                type="text" 
                placeholder="e.g. Namkeen" 
                value={menu.snacks}
                onChange={(e) => setMenu({ ...menu, snacks: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dinner</label>
              <input 
                type="text" 
                placeholder="e.g. Dal, Chawal, Papad, Pickle" 
                value={menu.dinner}
                onChange={(e) => setMenu({ ...menu, dinner: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Indent Items Selector Grid */}
        <div className="glass-panel indents-entry-panel">
          <div className="indent-panel-header">
            <div>
              <h3>Mess Indent Ingredients</h3>
              <p className="subtitle">Enter the daily quantity of items consumed (supports formulas like 10+30)</p>
            </div>

            {/* Filters row */}
            <div className="indent-filters">
              <div className="search-box">
                <Search size={18} />
                <input 
                  type="text" 
                  placeholder="Search item..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field search-input"
                />
              </div>

              <div className="category-select-wrapper">
                <Layers size={16} />
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field category-select"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table list of ingredients */}
          <div className="table-container list-table-container">
            <table className="custom-table indent-items-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Item Name (English / Hindi)</th>
                  <th>Category</th>
                  <th>Price (₹)</th>
                  <th style={{ width: "200px" }}>Quantity consumed</th>
                  <th>Unit</th>
                  <th>Total Cost (₹)</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((item, idx) => {
                    const currentExpr = indents[item.id] || "";
                    const evaluatedNum = getEvaluatedVal(item.id);
                    const itemCost = evaluatedNum * item.price;
                    
                    return (
                      <tr key={item.id} className={evaluatedNum > 0 ? "active-row" : ""}>
                        <td>{idx + 1}</td>
                        <td>
                          <div className="item-name-cell">
                            <span className="item-en">{item.nameEn}</span>
                            <span className="item-hi">{item.nameHi}</span>
                          </div>
                        </td>
                        <td>
                          <span className="category-pill">{item.category}</span>
                        </td>
                        <td>₹{item.price}</td>
                        <td>
                          <div className="qty-input-wrapper">
                            <input 
                              type="text"
                              placeholder="e.g. 10+30"
                              value={currentExpr}
                              onChange={(e) => handleIndentChange(item.id, e.target.value)}
                              className="input-field quantity-input-box"
                            />
                            {isFormula(currentExpr) && evaluatedNum > 0 && (
                              <span className="eval-pill">= {evaluatedNum}</span>
                            )}
                          </div>
                        </td>
                        <td><span className="unit-label">{item.unit}</span></td>
                        <td className="total-cost-col">
                          {evaluatedNum > 0 ? `₹${Math.round(itemCost * 100) / 100}` : "—"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "40px 0" }}>
                      No items matching filters found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Action Row */}
          <div className="form-action-row">
            {dailyLogs[selectedDate] && (
              <button 
                type="button" 
                onClick={handleDelete} 
                className="btn btn-danger delete-entry-btn"
              >
                <Trash2 size={18} />
                <span>Delete Log</span>
              </button>
            )}

            <button type="submit" className="btn btn-primary save-entry-btn">
              <Save size={18} />
              <span>Save Entry & Sync</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DailyEntry;
