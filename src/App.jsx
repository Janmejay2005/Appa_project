import React, { useState, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import DailyEntry from "./components/DailyEntry";
import Inventory from "./components/Inventory";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import "./App.css";

const AppContent = () => {
  const { toasts } = useApp();
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedEntryDate, setSelectedEntryDate] = useState("");

  // Shared View check from URL search parameters
  const [sharedConfig, setSharedConfig] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isShared = params.get("share") === "true";
    
    if (isShared) {
      const month = params.get("month");
      const year = params.get("year");
      setSharedConfig({
        isShared: true,
        month: month || null,
        year: year || null
      });
    }
  }, []);

  const getToastIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} className="text-success" />;
      case "error":
        return <AlertCircle size={20} className="text-danger" />;
      case "warning":
        return <AlertTriangle size={20} className="text-warning" />;
      default:
        return <Info size={20} className="text-primary" />;
    }
  };

  // Render shared report separately (standalone report dashboard)
  if (sharedConfig?.isShared) {
    return (
      <div className="shared-view-layout animated-fade-in" style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        <Reports 
          isSharedView={true} 
          sharedParams={{ month: sharedConfig.month, year: sharedConfig.year }} 
        />
        <footer style={{ marginTop: "40px", textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)", padding: "16px 0", borderTop: "1px solid var(--border-color)" }}>
          <p>© {new Date().getFullYear()} Appa Mess Management System. Generated View-Only Link.</p>
        </footer>
      </div>
    );
  }

  // Active view router
  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <Dashboard 
            setActiveView={setActiveView} 
            setSelectedEntryDate={setSelectedEntryDate} 
          />
        );
      case "daily-entry":
        return <DailyEntry initialDate={selectedEntryDate} />;
      case "inventory":
        return <Inventory />;
      case "reports":
        return <Reports isSharedView={false} />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard setActiveView={setActiveView} setSelectedEntryDate={setSelectedEntryDate} />;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {renderView()}

      {/* Floating Toast Notification Overlay */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast glass-panel">
            {getToastIcon(toast.type)}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </Layout>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
