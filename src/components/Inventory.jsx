import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Layers, 
  Check, 
  X,
  XCircle,
  AlertCircle
} from "lucide-react";
import "../styles/Inventory.css";

const Inventory = () => {
  const { 
    inventory, 
    updateItemPrice, 
    addItemToInventory, 
    editInventoryItem, 
    deleteItemFromInventory,
    triggerSync
  } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Add Item Form Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    nameEn: "",
    nameHi: "",
    category: "",
    price: "",
    unit: ""
  });

  // Edit Pricing Inline state
  const [editingId, setEditingId] = useState(null);
  const [tempPrice, setTempPrice] = useState("");

  const categories = ["All", ...new Set(inventory.map((item) => item.category))];

  // Common units
  const units = ["kg", "lit", "gm", "Pkt", "Nos", "Dozen"];

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setTempPrice(item.price.toString());
  };

  const handleSavePrice = (id) => {
    const parsed = parseFloat(tempPrice);
    if (!isNaN(parsed) && parsed >= 0) {
      updateItemPrice(id, parsed);
      setEditingId(null);
      triggerSync(); // sync changes to sheet if connected
    }
  };

  const handleCancelPrice = () => {
    setEditingId(null);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newItem.nameEn || !newItem.category || !newItem.price || !newItem.unit) {
      alert("Please fill all fields!");
      return;
    }

    const payload = {
      nameEn: newItem.nameEn,
      nameHi: newItem.nameHi || newItem.nameEn,
      category: newItem.category,
      price: parseFloat(newItem.price) || 0,
      unit: newItem.unit
    };

    addItemToInventory(payload);
    setShowAddModal(false);
    setNewItem({ nameEn: "", nameHi: "", category: "", price: "", unit: "" });
    triggerSync();
  };

  const handleDeleteItem = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from inventory?`)) {
      deleteItemFromInventory(id);
      triggerSync();
    }
  };

  // Filtered inventory list
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = 
      item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameHi.includes(searchQuery);
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="inventory-view">
      <div className="view-header">
        <div>
          <h1>Inventory & Price List</h1>
          <p className="subtitle">Configure mess items, units of measurement, and current market prices</p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Control filters panel */}
      <div className="glass-panel controls-panel">
        <div className="indent-filters">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search items by name..." 
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

        <div className="inventory-stats">
          <span>Total items: <strong>{inventory.length}</strong></span>
          <span>Filtered: <strong>{filteredInventory.length}</strong></span>
        </div>
      </div>

      {/* Main List Table */}
      <div className="glass-panel table-panel">
        <div className="table-container list-table-container">
          <table className="custom-table inventory-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Item Name (English)</th>
                <th>Item Name (Hindi)</th>
                <th>Category</th>
                <th style={{ width: "200px" }}>Price per Unit (₹)</th>
                <th>Unit</th>
                <th style={{ width: "120px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td className="font-weight-600">{item.nameEn}</td>
                    <td className="text-muted font-weight-500">{item.nameHi}</td>
                    <td>
                      <span className="category-pill">{item.category}</span>
                    </td>
                    <td>
                      {editingId === item.id ? (
                        <div className="inline-edit-wrapper">
                          <span className="currency-symbol">₹</span>
                          <input 
                            type="number" 
                            step="0.01"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            className="input-field inline-price-input"
                            autoFocus
                          />
                          <button onClick={() => handleSavePrice(item.id)} className="edit-btn save-btn" title="Save Price">
                            <Check size={16} />
                          </button>
                          <button onClick={handleCancelPrice} className="edit-btn cancel-btn" title="Cancel">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="price-display-wrapper" onClick={() => handleStartEdit(item)}>
                          <span className="price-text">₹{item.price}</span>
                          <button className="edit-trigger-btn" title="Edit Price">
                            <Edit3 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td><span className="unit-label">{item.unit}</span></td>
                    <td>
                      <div className="row-actions">
                        <button 
                          onClick={() => handleDeleteItem(item.id, item.nameEn)} 
                          className="action-icon-btn delete-btn"
                          title="Delete Item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "48px 0" }}>
                    <AlertCircle size={28} className="empty-icon" style={{ marginBottom: "8px" }} />
                    <p>No items found matching the search criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Item Dialog Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content glass-panel animated-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Inventory Item</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Item Name (English) *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Basmati Rice" 
                  value={newItem.nameEn}
                  onChange={(e) => setNewItem({ ...newItem, nameEn: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Item Name (Hindi)</label>
                <input 
                  type="text" 
                  placeholder="e.g. बासमती चावल" 
                  value={newItem.nameHi}
                  onChange={(e) => setNewItem({ ...newItem, nameHi: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select 
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Grains & Pulses">Grains & Pulses</option>
                    <option value="Oils & Fats">Oils & Fats</option>
                    <option value="Spices">Spices & Seasoning</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Dairy">Dairy Products</option>
                    <option value="Snacks">Snacks & Packaged</option>
                    <option value="Dry Fruits">Dry Fruits</option>
                    <option value="Utilities">Utilities & Cleaning</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Unit of Measure *</label>
                  <select 
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Select Unit</option>
                    {units.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Price per Unit (₹) *</label>
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="e.g. 45" 
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
