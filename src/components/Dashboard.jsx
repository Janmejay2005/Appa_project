import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  calculateDailyBudgetDetails, 
  calculateMonthlySummary 
} from "../utils/calculations";
import { 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  Users, 
  Utensils, 
  ArrowRight,
  AlertCircle
} from "lucide-react";
import "../styles/Dashboard.css";

const Dashboard = ({ setActiveView, setSelectedEntryDate }) => {
  const { dailyLogs, inventory } = useApp();
  
  // State for selected month (defaults to current month)
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}`;
  });

  // Target date for daily quick view (defaults to today or last entered log)
  const [quickViewDate, setQuickViewDate] = useState(() => {
    const today = new Date().toISOString().split("T")[0];
    // If today has no log, find the most recent log date
    if (dailyLogs[today]) return today;
    const dates = Object.keys(dailyLogs).sort();
    return dates.length > 0 ? dates[dates.length - 1] : today;
  });

  // Calculate monthly details
  const monthlySummary = calculateMonthlySummary(selectedMonth, dailyLogs, inventory);
  const { totalRealizedBudget, totalCost, totalSavingOrExcess, averageCostPerHead } = monthlySummary;
  
  // Calculate daily details for quick view date
  const dayLog = dailyLogs[quickViewDate];
  const dayDetails = dayLog ? calculateDailyBudgetDetails(dayLog, inventory) : null;

  // Budget percentage used
  const budgetSpentPercent = totalRealizedBudget > 0 
    ? Math.min(Math.round((totalCost / totalRealizedBudget) * 100), 100) 
    : 0;

  // Format month name
  const formatMonthName = (yyyyMm) => {
    const [year, month] = yyyyMm.split("-");
    const date = new Date(year, parseInt(month) - 1, 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const handleEditQuickViewDate = () => {
    setSelectedEntryDate(quickViewDate);
    setActiveView("daily-entry");
  };

  const getProgressColor = (percent) => {
    if (percent >= 90) return "var(--danger)";
    if (percent >= 75) return "var(--accent)";
    return "var(--success)";
  };

  return (
    <div className="dashboard-view">
      {/* Header section */}
      <div className="view-header">
        <div>
          <h1>Mess Dashboard</h1>
          <p className="subtitle">Real-time budget analysis and menu schedules</p>
        </div>
        
        {/* Month Picker */}
        <div className="month-picker-container">
          <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="input-field month-input"
          />
        </div>
      </div>

      {/* Grid of Key Monthly Indicators */}
      <div className="grid-3 stats-grid">
        {/* Total Cost */}
        <div className="glass-panel stat-card">
          <div className="stat-icon-wrapper spent">
            <IndianRupee size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Spent in {formatMonthName(selectedMonth)}</span>
            <h2 className="stat-value">₹{totalCost.toLocaleString("en-IN")}</h2>
            <span className="stat-sub">Total consumption cost</span>
          </div>
        </div>

        {/* Realized Budget */}
        <div className="glass-panel stat-card">
          <div className="stat-icon-wrapper budget">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Realized Budget</span>
            <h2 className="stat-value">₹{totalRealizedBudget.toLocaleString("en-IN")}</h2>
            <span className="stat-sub">Based on dining strength</span>
          </div>
        </div>

        {/* Net Savings */}
        <div className="glass-panel stat-card">
          <div className={`stat-icon-wrapper ${totalSavingOrExcess >= 0 ? "savings" : "deficit"}`}>
            {totalSavingOrExcess >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
          </div>
          <div className="stat-content">
            <span className="stat-label">Net Saving / Excess</span>
            <h2 className={`stat-value ${totalSavingOrExcess >= 0 ? "text-success" : "text-danger"}`}>
              {totalSavingOrExcess >= 0 ? "+" : ""}₹{totalSavingOrExcess.toLocaleString("en-IN")}
            </h2>
            <span className="stat-sub">
              {totalSavingOrExcess >= 0 ? "Under budget limit" : "Exceeds realized budget"}
            </span>
          </div>
        </div>
      </div>

      {/* Budget Progress Bar Card */}
      <div className="glass-panel progress-card">
        <div className="progress-header">
          <div>
            <h3>Budget Utilization</h3>
            <p className="subtitle">Percentage of realized budget spent on ingredients</p>
          </div>
          <span className="progress-value" style={{ color: getProgressColor(budgetSpentPercent) }}>
            {budgetSpentPercent}% Spent
          </span>
        </div>
        
        <div className="progress-bar-track">
          <div 
            className="progress-bar-fill" 
            style={{ 
              width: `${budgetSpentPercent}%`,
              background: getProgressColor(budgetSpentPercent)
            }}
          />
        </div>
        
        <div className="progress-footer">
          <span>₹{totalCost.toLocaleString("en-IN")} spent</span>
          <span>Max realized: ₹{totalRealizedBudget.toLocaleString("en-IN")}</span>
        </div>

        {budgetSpentPercent >= 90 && (
          <div className="budget-alert">
            <AlertCircle size={18} />
            <span>Warning: You have utilized over 90% of the realized budget for this month!</span>
          </div>
        )}
      </div>

      {/* Main split sections: Today's Menu & Daily Summary */}
      <div className="grid-2 dashboard-details">
        {/* Daily Indents & Menu Quick View */}
        <div className="glass-panel quick-view-panel">
          <div className="panel-header">
            <h3>Daily Logs Checker</h3>
            <input 
              type="date" 
              value={quickViewDate}
              onChange={(e) => setQuickViewDate(e.target.value)}
              className="input-field date-picker-input"
            />
          </div>

          {dayLog ? (
            <div className="quick-view-content">
              {/* Daily Stats Grid */}
              <div className="day-stats-grid">
                <div className="day-stat">
                  <span className="day-stat-label">Dining Strength</span>
                  <span className="day-stat-value">{dayLog.diningStrength} Students</span>
                </div>
                <div className="day-stat">
                  <span className="day-stat-label">Daily Cost</span>
                  <span className="day-stat-value">₹{dayDetails?.consumptionCost}</span>
                </div>
                <div className="day-stat">
                  <span className="day-stat-label">Daily Saving</span>
                  <span className={`day-stat-value ${dayDetails?.savingOrExcess >= 0 ? "text-success" : "text-danger"}`}>
                    ₹{dayDetails?.savingOrExcess}
                  </span>
                </div>
              </div>

              {/* Menu items list */}
              <div className="menu-list">
                <h4 className="section-title"><Utensils size={16} /> Today's Menu</h4>
                <div className="menu-item-row">
                  <strong>Breakfast:</strong> <span>{dayLog.menu.breakfast || "Not recorded"}</span>
                </div>
                <div className="menu-item-row">
                  <strong>Recess:</strong> <span>{dayLog.menu.recess || "Not recorded"}</span>
                </div>
                <div className="menu-item-row">
                  <strong>Lunch:</strong> <span>{dayLog.menu.lunch || "Not recorded"}</span>
                </div>
                <div className="menu-item-row">
                  <strong>Snacks:</strong> <span>{dayLog.menu.snacks || "Not recorded"}</span>
                </div>
                <div className="menu-item-row">
                  <strong>Dinner:</strong> <span>{dayLog.menu.dinner || "Not recorded"}</span>
                </div>
              </div>

              <button onClick={handleEditQuickViewDate} className="btn btn-primary edit-day-btn">
                <span>Edit Daily Indents</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="empty-quick-view">
              <Utensils size={40} className="empty-icon" />
              <p>No indents or menu details recorded for {quickViewDate}.</p>
              <button onClick={handleEditQuickViewDate} className="btn btn-primary">
                Add Entry for {quickViewDate}
              </button>
            </div>
          )}
        </div>

        {/* Cost Per Head Insights */}
        <div className="glass-panel insights-panel">
          <h3>Consumption Insights</h3>
          <p className="subtitle">Key efficiency metrics for {formatMonthName(selectedMonth)}</p>

          <div className="insights-list">
            <div className="insight-row">
              <div className="insight-meta">
                <span className="insight-title">Average Cost Per Student (Daily)</span>
                <span className="insight-desc">Cost of feeding one student per day</span>
              </div>
              <span className="insight-stat">₹{averageCostPerHead}</span>
            </div>

            <div className="insight-row">
              <div className="insight-meta">
                <span className="insight-title">Total Student Meals Served</span>
                <span className="insight-desc">Sum of dining strength over all days</span>
              </div>
              <span className="insight-stat">{totalDiningStrength.toLocaleString()}</span>
            </div>

            <div className="insight-row">
              <div className="insight-meta">
                <span className="insight-title">Recorded Days</span>
                <span className="insight-desc">Number of days logged this month</span>
              </div>
              <span className="insight-stat">{monthlySummary.daysCount} Days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
