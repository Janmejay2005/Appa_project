// 🗺️ Appa Mess Google Sheets Backend Script (google-script/Code.gs)
// Instructions:
// 1. Open your Google Sheet -> Extensions -> Apps Script
// 2. Paste this entire code into Code.gs
// 3. Click Deploy -> New deployment -> Select type: Web app
// 4. Set "Execute as": Me, "Who has access": Anyone
// 5. Copy the Web App URL and paste it into the App Settings page in your Appa Mess app.

function doGet(e) {
  // Simple connection check
  if (e && e.parameter && e.parameter.test === 'true') {
    return ContentService.createTextOutput(JSON.stringify({ status: 'ok', message: 'Connected to Appa Mess Backend!' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Fetch Sheets data overview
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    sheets: ss.getSheets().map(s => s.getName())
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Sync Inventory sheet
    let invSheet = ss.getSheetByName("Inventory");
    if (!invSheet) {
      invSheet = ss.insertSheet("Inventory");
    }
    invSheet.clear();
    // Headers
    invSheet.appendRow(["ID", "Item Name En", "Item Name Hi", "Category", "Price", "Unit"]);
    if (payload.inventory && Array.isArray(payload.inventory)) {
      payload.inventory.forEach(item => {
        invSheet.appendRow([item.id, item.nameEn, item.nameHi, item.category, item.price, item.unit]);
      });
    }
    
    // 2. Sync Daily Logs sheet
    let logSheet = ss.getSheetByName("Daily_Logs");
    if (!logSheet) {
      logSheet = ss.insertSheet("Daily_Logs");
    }
    logSheet.clear();
    // Headers
    logSheet.appendRow(["Date", "Dining Strength", "Budget Monthly", "Breakfast", "Recess", "Lunch", "Snacks", "Dinner", "Item ID", "Item Name", "Quantity Consumed", "Unit", "Price per Unit", "Total Cost"]);
    
    if (payload.dailyLogs && typeof payload.dailyLogs === 'object') {
      Object.entries(payload.dailyLogs).forEach(([date, log]) => {
        if (log.indents && typeof log.indents === 'object') {
          Object.entries(log.indents).forEach(([itemIdStr, qty]) => {
            const itemId = parseInt(itemIdStr);
            const item = payload.inventory ? payload.inventory.find(i => i.id === itemId) : null;
            if (qty > 0) {
              logSheet.appendRow([
                date,
                log.diningStrength || 0,
                log.budgetPerHeadMonthly || 2352,
                log.menu ? (log.menu.breakfast || "") : "",
                log.menu ? (log.menu.recess || "") : "",
                log.menu ? (log.menu.lunch || "") : "",
                log.menu ? (log.menu.snacks || "") : "",
                log.menu ? (log.menu.dinner || "") : "",
                itemId,
                item ? item.nameEn : ("Item #" + itemId),
                qty,
                item ? item.unit : "",
                item ? item.price : 0,
                item ? (qty * item.price) : 0
              ]);
            }
          });
        }
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Sync Completed!' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
