import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  LayoutDashboard, 
  Calendar, 
  ClipboardList, 
  BarChart3,
  Settings, 
  Sun, 
  Moon, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  Menu,
  X
} from "lucide-react";
import "../styles/Layout.css";

const Layout = ({ activeView, setActiveView, children }) => {
  const { 
    theme, 
    toggleTheme, 
    isOnline, 
    syncStatus, 
    syncWithGoogleSheets, 
    gasUrl 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "daily-entry", label: "Daily Entry", icon: Calendar },
    { id: "inventory", label: "Inventory List", icon: ClipboardList },
    { id: "reports", label: "Reports & Costs", icon: BarChart3 },
    { id: "settings", label: "App Settings", icon: Settings }
  ];

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    setMobileMenuOpen(false);
  };

  const getSyncBadge = () => {
    if (!gasUrl) return null;
    
    switch (syncStatus) {
      case "synced":
        return (
          <span className="sync-badge synced" title="All data synced with Google Sheets">
            <RefreshCw size={14} className="icon-static" /> Synced
          </span>
        );
      case "syncing":
        return (
          <span className="sync-badge syncing" title="Syncing to Google Sheets...">
            <RefreshCw size={14} className="icon-spin" /> Syncing
          </span>
        );
      case "draft":
        return (
          <button 
            onClick={() => syncWithGoogleSheets()} 
            className="sync-badge draft-btn" 
            title="Local changes not saved to cloud. Click to sync."
          >
            <RefreshCw size={14} /> Sync Now
          </button>
        );
      case "error":
        return (
          <button 
            onClick={() => syncWithGoogleSheets()} 
            className="sync-badge error-btn" 
            title="Sync failed. Click to retry."
          >
            <RefreshCw size={14} /> Sync Error
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-shell">
      {/* 1. Desktop Sidebar */}
      <aside className="sidebar glass-panel">
        <div className="sidebar-logo">
          <h2>Appa Mess</h2>
          <span className="logo-sub">JNV Mess Manager</span>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-link ${isActive ? "active" : ""}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="status-container">
            {/* Online Status */}
            {isOnline ? (
              <div className="status-indicator online">
                <Wifi size={16} />
                <span>Online</span>
              </div>
            ) : (
              <div className="status-indicator offline">
                <WifiOff size={16} />
                <span>Offline Mode</span>
              </div>
            )}
            
            {/* Cloud Sync Status */}
            {getSyncBadge()}
          </div>

          <div className="footer-actions">
            <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Light/Dark Theme">
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Mobile Header */}
      <header className="mobile-header glass-panel">
        <button className="menu-btn" onClick={() => setMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>
        <div className="mobile-logo">
          <h3>Appa Mess</h3>
        </div>
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </header>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Navigation</h3>
              <button className="close-btn" onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <nav className="drawer-nav">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`drawer-link ${isActive ? "active" : ""}`}
                  >
                    <Icon size={22} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="drawer-footer">
              <div className="status-container">
                {isOnline ? (
                  <div className="status-indicator online">
                    <Wifi size={16} />
                    <span>Online</span>
                  </div>
                ) : (
                  <div className="status-indicator offline">
                    <WifiOff size={16} />
                    <span>Offline</span>
                  </div>
                )}
                {getSyncBadge()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Main Content Area */}
      <main className="main-content">
        <div className="view-container animated-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
