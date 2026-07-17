import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  calculateMonthlySummary, 
  calculateYearlySummary 
} from "../utils/calculations";
import { exportMonthlyReportToExcel } from "../utils/excelExport";
import { 
  Download, 
  Share2, 
  FileSpreadsheet, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  PieChart, 
  Layers,
  ArrowUpDown,
  BookOpen
} from "lucide-react";
import "../styles/Reports.css";

const Reports = ({ isSharedView = false, sharedParams = null }) => {
  const { dailyLogs, inventory, showToast } = useApp();

  // Report type state: 'monthly' | 'yearly'
  const [reportType, setReportType] = useState(() => {
    if (sharedParams?.year && !sharedParams?.month) return "yearly";
    return "monthly";
  });

  // Selected date ranges
  const [selectedMonth, setSelectedMonth] = useState(() => {
    if (sharedParams?.month) return sharedParams.month;
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}`;
  });

  const [selectedYear, setSelectedYear] = useState(() => {
    if (sharedParams?.year) return sharedParams.year;
    return new Date().getFullYear().toString();
  });

  // Sort state for table
  const [sortKey, setSortKey] = useState("totalCost"); // 'nameEn', 'totalQty', 'totalCost'
  const [sortAsc, setSortAsc] = useState(false); // Default descending

  // Compute summary based on selections
  const summary = reportType === "monthly" 
    ? calculateMonthlySummary(selectedMonth, dailyLogs, inventory)
    : calculateYearlySummary(selectedYear, dailyLogs, inventory);

  const {
    daysCount,
    totalDiningStrength,
    totalRealizedBudget,
    totalCost,
    totalSavingOrExcess,
    averageCostPerHead,
    itemized
  } = summary;

  // Sorting handler
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const getSortedItemized = () => {
    const data = [...itemized];
    data.sort((a, b) => {
      let valA, valB;
      if (sortKey === "nameEn") {
        valA = a.item.nameEn.toLowerCase();
        valB = b.item.nameEn.toLowerCase();
      } else if (sortKey === "totalQty") {
        valA = a.totalQty;
        valB = b.totalQty;
      } else {
        valA = a.totalCost;
        valB = b.totalCost;
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
    return data;
  };

  const handleExportExcel = () => {
    if (reportType !== "monthly") {
      showToast("Yearly report export is coming soon. Select Monthly.", "warning");
      return;
    }
    exportMonthlyReportToExcel(selectedMonth, summary);
    showToast("Report spreadsheet downloaded!", "success");
  };

  const handleCopyShareLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const queryParam = reportType === "monthly" 
      ? `?share=true&month=${selectedMonth}`
      : `?share=true&year=${selectedYear}`;
    
    const fullUrl = baseUrl + queryParam;
    
    navigator.clipboard.writeText(fullUrl)
      .then(() => {
        showToast("View-only shared link copied to clipboard!", "success");
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
        showToast("Failed to copy link. Copy from address bar.", "error");
      });
  };

  const formatPeriodName = () => {
    if (reportType === "monthly") {
      const [year, month] = selectedMonth.split("-");
      const date = new Date(year, parseInt(month) - 1, 1);
      return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    }
    return `Year ${selectedYear}`;
  };

  return (
    <div className="reports-view">
      {/* View Header */}
      <div className="view-header">
        <div>
          <h1>{isSharedView ? "Shared Mess Report" : "Financial & Consumption Reports"}</h1>
          <p className="subtitle">Detailed breakdown of logs for {formatPeriodName()}</p>
        </div>

        {!isSharedView && (
          <div className="report-actions-row">
            <button onClick={handleCopyShareLink} className="btn btn-secondary text-primary" title="Copy shareable read-only link">
              <Share2 size={18} />
              <span>Share Link</span>
            </button>

            <button onClick={handleExportExcel} className="btn btn-primary" title="Download Excel report">
              <Download size={18} />
              <span>Export to Excel</span>
            </button>
          </div>
        )}
      </div>

      {/* Control selectors - hide or show depending on share view */}
      {!isSharedView && (
        <div className="glass-panel selectors-panel">
          <div className="type-toggle-container">
            <button 
              onClick={() => setReportType("monthly")}
              className={`type-tab-btn ${reportType === "monthly" ? "active" : ""}`}
            >
              Monthly Summary
            </button>
            <button 
              onClick={() => setReportType("yearly")}
              className={`type-tab-btn ${reportType === "yearly" ? "active" : ""}`}
            >
              Yearly Summary
            </button>
          </div>

          <div className="picker-container">
            {reportType === "monthly" ? (
              <input 
                type="month" 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="input-field header-date-input"
              />
            ) : (
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="input-field year-select"
              >
                {/* Dynamically build years */}
                {Array.from(new Set(Object.keys(dailyLogs).map(d => d.split("-")[0]))).sort().map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
                {/* Fallback option if empty */}
                {Object.keys(dailyLogs).length === 0 && (
                  <option value={new Date().getFullYear().toString()}>{new Date().getFullYear()}</option>
                )}
              </select>
            )}
          </div>
        </div>
      )}

      {/* General Stats Grid */}
      <div className="grid-3 summary-stats-grid">
        {/* Realized Budget */}
        <div className="glass-panel summary-stat-card">
          <div className="meta">
            <span className="lbl">Realized Budget</span>
            <h3>₹{totalRealizedBudget.toLocaleString("en-IN")}</h3>
            <span className="desc">Total budget from student meals</span>
          </div>
          <Users size={32} className="card-bg-icon text-accent" />
        </div>

        {/* Cost of items */}
        <div className="glass-panel summary-stat-card">
          <div className="meta">
            <span className="lbl">Consumption Spent</span>
            <h3>₹{totalCost.toLocaleString("en-IN")}</h3>
            <span className="desc">Total cost of ingredients</span>
          </div>
          <PieChart size={32} className="card-bg-icon text-primary" />
        </div>

        {/* Net Savings */}
        <div className="glass-panel summary-stat-card">
          <div className="meta">
            <span className="lbl">Net Savings</span>
            <h3 className={totalSavingOrExcess >= 0 ? "text-success" : "text-danger"}>
              ₹{totalSavingOrExcess.toLocaleString("en-IN")}
            </h3>
            <span className="desc">
              {totalSavingOrExcess >= 0 ? "Budget remaining" : "Budget deficit"}
            </span>
          </div>
          {totalSavingOrExcess >= 0 ? (
            <TrendingUp size={32} className="card-bg-icon text-success" />
          ) : (
            <TrendingDown size={32} className="card-bg-icon text-danger" />
          )}
        </div>
      </div>

      {/* Additional Stats Panel */}
      <div className="glass-panel meta-detail-panel">
        <div className="meta-detail-col">
          <span className="detail-lbl">Average cost per head (daily)</span>
          <span className="detail-val">₹{averageCostPerHead}</span>
        </div>
        <div className="vertical-divider" />
        <div className="meta-detail-col">
          <span className="detail-lbl">Total meals served</span>
          <span className="detail-val">{totalDiningStrength.toLocaleString()}</span>
        </div>
        <div className="vertical-divider" />
        <div className="meta-detail-col">
          <span className="detail-lbl">Days recorded</span>
          <span className="detail-val">{daysCount} Days</span>
        </div>
      </div>

      {/* Itemized consumption list */}
      <div className="glass-panel list-panel">
        <div className="panel-header">
          <h3>Consumption Breakdown</h3>
          <p className="subtitle">All items consumed during this period sorted by spending</p>
        </div>

        <div className="table-container list-table-container">
          <table className="custom-table reports-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>
                  <button onClick={() => handleSort("nameEn")} className="sort-th-btn">
                    <span>Item Name</span>
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th>Category</th>
                <th>
                  <button onClick={() => handleSort("totalQty")} className="sort-th-btn">
                    <span>Qty Consumed</span>
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th>Unit</th>
                <th>Price per Unit (₹)</th>
                <th>
                  <button onClick={() => handleSort("totalCost")} className="sort-th-btn">
                    <span>Total Cost</span>
                    <ArrowUpDown size={14} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {itemized.length > 0 ? (
                getSortedItemized().map(({ item, totalQty, totalCost: itemCost }, idx) => (
                  <tr key={item.id}>
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
                    <td className="font-weight-600">
                      {Math.round(totalQty * 1000) / 1000}
                    </td>
                    <td><span className="unit-label">{item.unit}</span></td>
                    <td>₹{item.price}</td>
                    <td className="total-cost-col">₹{Math.round(itemCost * 100) / 100}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "40px 0" }}>
                    No daily logs recorded during this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
