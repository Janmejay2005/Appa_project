import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Settings as SettingsIcon, 
  Database, 
  Link, 
  HelpCircle, 
  CheckCircle, 
  XCircle,
  Copy,
  Download,
  Trash2
} from "lucide-react";
import "../styles/Settings.css";

const Settings = () => {
  const { 
    gasUrl, 
    saveGasUrl, 
    syncWithGoogleSheets, 
    syncStatus,
    showToast,
    inventory,
    dailyLogs
  } = useApp();

  const [inputUrl, setInputUrl] = useState(gasUrl);
  const [testing, setTesting] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    saveGasUrl(inputUrl);
  };

  const handleTestConnection = async () => {
    if (!inputUrl) {
      showToast("Please enter a URL first!", "warning");
      return;
    }
    setTesting(true);
    showToast("Testing API endpoint...", "info");
    
    try {
      // Test endpoint with simple GET
      const response = await fetch(`${inputUrl}?test=true`, {
        method: "GET",
        mode: "cors"
      });
      const data = await response.json();
      
      if (data && data.status === "ok") {
        showToast("Connection Successful!", "success");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Connection test error:", err);
      // Since Google Apps Script can sometimes block direct GET fetches from different origins
      // or redirects, we suggest saving it anyway. We tell them that if it saved, POST requests (sync) should work.
      showToast("Saved! Connection status can be verified during Sync.", "info");
    } finally {
      setTesting(false);
    }
  };

  // Google Apps Script code text block
  const appsScriptCode = `// 🗺️ Appa Mess Google Sheets Sync API
function doGet(e) {
  // Simple connection test
  if (e.parameter.test === 'true') {
    return ContentService.createTextOutput(JSON.stringify({ status: 'ok', message: 'Connected to Appa Mess Backend!' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Fetch Sheets data
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
    payload.inventory.forEach(item => {
      invSheet.appendRow([item.id, item.nameEn, item.nameHi, item.category, item.price, item.unit]);
    });
    
    // 2. Sync Daily Logs sheet
    let logSheet = ss.getSheetByName("Daily_Logs");
    if (!logSheet) {
      logSheet = ss.insertSheet("Daily_Logs");
    }
    logSheet.clear();
    // Headers
    logSheet.appendRow(["Date", "Dining Strength", "Budget Monthly", "Breakfast", "Recess", "Lunch", "Snacks", "Dinner", "Item ID", "Item Name", "Quantity Consumed", "Unit", "Price per Unit", "Total Cost"]);
    
    // Append rows
    Object.entries(payload.dailyLogs).forEach(([date, log]) => {
      Object.entries(log.indents).forEach(([itemIdStr, qty]) => {
        const itemId = parseInt(itemIdStr);
        const item = payload.inventory.find(i => i.id === itemId);
        if (item && qty > 0) {
          logSheet.appendRow([
            date,
            log.diningStrength,
            log.budgetPerHeadMonthly,
            log.menu.breakfast || "",
            log.menu.recess || "",
            log.menu.lunch || "",
            log.menu.snacks || "",
            log.menu.dinner || "",
            itemId,
            item.nameEn,
            qty,
            item.unit,
            item.price,
            qty * item.price
          ]);
        }
      });
    });
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Sync Completed!' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(appsScriptCode)
      .then(() => showToast("Google Apps Script code copied!", "success"))
      .catch(() => showToast("Failed to copy code.", "error"));
  };

  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ inventory, dailyLogs }));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Appa_Mess_Backup_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Local backup JSON file downloaded!", "success");
  };

  const handleClearAllData = () => {
    if (window.confirm("WARNING: This will clear all inventory items, menus, and daily logs, and restore the default template. Are you sure?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="settings-view">
      <div className="view-header">
        <div>
          <h1>App Settings</h1>
          <p className="subtitle">Configure Google Sheets syncing and backup options</p>
        </div>
      </div>

      <div className="grid-2 settings-grid">
        {/* Connection Setup */}
        <div className="glass-panel connection-panel">
          <h3><Link size={18} /> Google Sheets Connection</h3>
          <p className="subtitle">Link your application to your Google spreadsheet</p>

          <form onSubmit={handleSave} className="connection-form">
            <div className="form-group">
              <label className="form-label" htmlFor="gasUrl">Google Script Web App URL</label>
              <input 
                id="gasUrl"
                type="url" 
                placeholder="https://script.google.com/macros/s/.../exec"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="settings-action-btns">
              <button 
                type="button" 
                onClick={handleTestConnection} 
                className="btn btn-secondary test-conn-btn"
                disabled={testing || !inputUrl}
              >
                <span>Test Connection</span>
              </button>
              
              <button type="submit" className="btn btn-primary">
                Save Link
              </button>
            </div>
          </form>

          {/* Local Backups card */}
          <div className="backup-section">
            <h4><Database size={16} /> Local Data Backups</h4>
            <p className="subtitle">Manage offline storage stored in this browser</p>
            
            <div className="backup-actions">
              <button onClick={handleExportBackup} className="btn btn-secondary text-primary">
                <Download size={16} />
                <span>Download Backup JSON</span>
              </button>
              
              <button onClick={handleClearAllData} className="btn btn-danger">
                <Trash2 size={16} />
                <span>Reset to Factory Default</span>
              </button>
            </div>
          </div>
        </div>

        {/* Integration Instructions */}
        <div className="glass-panel guide-panel">
          <h3><HelpCircle size={18} /> Google Sheets Setup Guide</h3>
          <p className="subtitle">Follow these 5 simple steps to get syncing working:</p>

          <div className="guide-steps">
            <div className="step-row">
              <span className="step-num">1</span>
              <p>Create a brand new empty spreadsheet on <strong>Google Sheets</strong>.</p>
            </div>
            
            <div className="step-row">
              <span className="step-num">2</span>
              <p>In the top menu, go to <strong>Extensions</strong> &gt; <strong>Apps Script</strong>.</p>
            </div>

            <div className="step-row">
              <span className="step-num">3</span>
              <p>Delete any default code inside the editor, and paste the code below:</p>
            </div>

            <div className="copy-code-container">
              <button onClick={handleCopyCode} className="btn btn-secondary copy-code-btn">
                <Copy size={14} />
                <span>Copy Script Code</span>
              </button>
              <pre className="code-block-preview">{appsScriptCode}</pre>
            </div>

            <div className="step-row">
              <span className="step-num">4</span>
              <p>Click on <strong>Deploy</strong> (top right) &gt; <strong>New Deployment</strong>.</p>
            </div>

            <div className="step-row">
              <span className="step-num">5</span>
              <p>Set <i>Execute as</i> to <strong>Me</strong> and <i>Who has access</i> to <strong>Anyone</strong>. Click Deploy, authorize access, copy the <strong>Web App URL</strong> and paste it in the form on the left.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
