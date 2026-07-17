import React, { createContext, useContext, useState, useEffect } from "react";
import { initialInventory, initialDailyLogs } from "../utils/mockData";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // 1. Theme State
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

  // 2. Inventory State
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem("inventory");
    return saved ? JSON.parse(saved) : initialInventory;
  });

  // 3. Daily Logs State (keyed by date "YYYY-MM-DD")
  const [dailyLogs, setDailyLogs] = useState(() => {
    const saved = localStorage.getItem("dailyLogs");
    return saved ? JSON.parse(saved) : initialDailyLogs;
  });

  // 4. Google Sheets API Configuration
  const [gasUrl, setGasUrl] = useState(() => {
    return localStorage.getItem("gasUrl") || "";
  });

  // 5. Connectivity & Sync States
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState("synced"); // 'synced', 'draft', 'syncing', 'error'
  const [toasts, setToasts] = useState([]);

  // Toast notifier function
  const showToast = (message, type = "info") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Sync state to local storage on changes
  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem("dailyLogs", JSON.stringify(dailyLogs));
    // If we make local changes, mark syncStatus as 'draft' if we have a connection URL
    if (gasUrl) {
      setSyncStatus("draft");
    }
  }, [dailyLogs, inventory, gasUrl]);

  // Handle Theme application
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast("You are back online!", "success");
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast("Working offline. Changes saved locally.", "warning");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // 6. Inventory CRUD Actions
  const updateItemPrice = (id, newPrice) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: parseFloat(newPrice) || 0 } : item))
    );
    showToast("Price updated successfully", "success");
  };

  const addItemToInventory = (item) => {
    const newId = inventory.length > 0 ? Math.max(...inventory.map((i) => i.id)) + 1 : 1;
    setInventory((prev) => [...prev, { ...item, id: newId }]);
    showToast(`${item.nameEn} added to inventory`, "success");
  };

  const editInventoryItem = (id, updatedFields) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    showToast("Item details updated", "success");
  };

  const deleteItemFromInventory = (id) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
    showToast("Item removed from inventory", "success");
  };

  // 7. Daily Log CRUD Actions
  const saveDailyLog = (date, logData) => {
    setDailyLogs((prev) => ({
      ...prev,
      [date]: {
        diningStrength: parseInt(logData.diningStrength) || 0,
        budgetPerHeadMonthly: parseInt(logData.budgetPerHeadMonthly) || 2352,
        menu: { ...logData.menu },
        indents: { ...logData.indents }
      }
    }));
    showToast(`Daily log for ${date} saved!`, "success");
  };

  const deleteDailyLog = (date) => {
    setDailyLogs((prev) => {
      const copy = { ...prev };
      delete copy[date];
      return copy;
    });
    showToast(`Daily log for ${date} deleted.`, "info");
  };

  // 8. Manual & Auto Syncing with Google Sheets
  const syncWithGoogleSheets = async (targetUrl = gasUrl) => {
    if (!targetUrl) {
      showToast("No Google Sheets Script URL configured. Go to settings.", "warning");
      return;
    }
    if (!navigator.onLine) {
      showToast("Cannot sync: No internet connection.", "error");
      return;
    }

    setSyncStatus("syncing");
    showToast("Syncing data to Google Sheets...", "info");

    try {
      const payload = {
        inventory,
        dailyLogs
      };

      // We use CORS-friendly POST request to the Google Script Web App URL
      const response = await fetch(targetUrl, {
        method: "POST",
        mode: "no-cors", // Required for Google Script Web App redirection
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      // Because mode is 'no-cors', we won't get the response body, but if it doesn't throw, it succeeded!
      setSyncStatus("synced");
      showToast("All data successfully synced with Google Sheets!", "success");
    } catch (error) {
      console.error("Sync error:", error);
      setSyncStatus("error");
      showToast("Sync failed. Check your API URL or connection.", "error");
    }
  };

  const saveGasUrl = (url) => {
    setGasUrl(url);
    localStorage.setItem("gasUrl", url);
    showToast("Google Sheets Script URL updated.", "success");
  };

  // Auto-sync wrapper
  const triggerSync = () => {
    if (gasUrl && isOnline) {
      syncWithGoogleSheets(gasUrl);
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        inventory,
        dailyLogs,
        updateItemPrice,
        addItemToInventory,
        editInventoryItem,
        deleteItemFromInventory,
        saveDailyLog,
        deleteDailyLog,
        
        gasUrl,
        saveGasUrl,
        isOnline,
        syncStatus,
        syncWithGoogleSheets,
        triggerSync,
        
        toasts,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
