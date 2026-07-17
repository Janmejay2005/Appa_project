import * as XLSX from "xlsx";

/**
 * Exports a monthly report summary to a multi-sheet Excel file.
 * Sheets: "Summary", "Itemized Consumption"
 */
export const exportMonthlyReportToExcel = (monthStr, summaryData) => {
  if (!summaryData) return;

  const {
    totalDiningStrength,
    totalRealizedBudget,
    totalCost,
    totalSavingOrExcess,
    averageCostPerHead,
    itemized
  } = summaryData;

  // 1. Prepare Summary Data
  const summaryRows = [
    { "Metric": "Report Month", "Value": monthStr },
    { "Metric": "Total Student / Dining Strength", "Value": totalDiningStrength },
    { "Metric": "Total Realized Budget (INR)", "Value": totalRealizedBudget },
    { "Metric": "Total Consumption Cost (INR)", "Value": totalCost },
    { "Metric": "Net Saving / Excess (INR)", "Value": totalSavingOrExcess },
    { "Metric": "Average Cost Per Head (INR)", "Value": averageCostPerHead },
  ];

  // 2. Prepare Itemized Data
  const itemizedRows = itemized.map(({ item, totalQty, totalCost: itemCost }, index) => ({
    "S.No.": index + 1,
    "Item Name (EN)": item.nameEn,
    "Item Name (HI)": item.nameHi,
    "Category": item.category,
    "Quantity Consumed": totalQty,
    "Unit": item.unit,
    "Price Per Unit (INR)": item.price,
    "Total Cost (INR)": Math.round(itemCost * 100) / 100
  }));

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Create Summary Sheet
  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
  // Auto-width columns for summary
  const summaryColsWidths = [{ wch: 30 }, { wch: 20 }];
  wsSummary["!cols"] = summaryColsWidths;
  XLSX.utils.book_append_sheet(wb, wsSummary, "Monthly Summary");

  // Create Itemized Sheet
  const wsItemized = XLSX.utils.json_to_sheet(itemizedRows);
  // Auto-width columns for itemized
  const itemizedColsWidths = [
    { wch: 8 },  // S.No
    { wch: 25 }, // English Name
    { wch: 25 }, // Hindi Name
    { wch: 18 }, // Category
    { wch: 18 }, // Quantity
    { wch: 8 },  // Unit
    { wch: 18 }, // Price
    { wch: 18 }  // Total Cost
  ];
  wsItemized["!cols"] = itemizedColsWidths;
  XLSX.utils.book_append_sheet(wb, wsItemized, "Itemized Consumption");

  // Write and download
  const filename = `Mess_Report_${monthStr}.xlsx`;
  XLSX.writeFile(wb, filename);
};
