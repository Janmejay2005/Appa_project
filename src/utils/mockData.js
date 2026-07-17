export const initialInventory = [
  // Grains & Pulses
  { id: 1, nameEn: "Rice", nameHi: "चावल", unit: "kg", price: 45, category: "Grains & Pulses" },
  { id: 2, nameEn: "Atta (Wheat Flour)", nameHi: "आटा", unit: "kg", price: 35, category: "Grains & Pulses" },
  { id: 3, nameEn: "Sugar", nameHi: "चीनी", unit: "kg", price: 42, category: "Grains & Pulses" },
  { id: 4, nameEn: "Dal Arhar (Toor)", nameHi: "दाल अरहर", unit: "kg", price: 150, category: "Grains & Pulses" },
  { id: 5, nameEn: "Dal Urad", nameHi: "दाल उड़द", unit: "kg", price: 120, category: "Grains & Pulses" },
  { id: 6, nameEn: "Dal Moong", nameHi: "दाल मूंग", unit: "kg", price: 110, category: "Grains & Pulses" },
  { id: 7, nameEn: "Kabuli Chana", nameHi: "काबुली चना (छोले)", unit: "kg", price: 100, category: "Grains & Pulses" },
  { id: 8, nameEn: "Besan", nameHi: "बेसन", unit: "kg", price: 90, category: "Grains & Pulses" },
  { id: 9, nameEn: "Sooji (Semolina)", nameHi: "सूजी", unit: "kg", price: 40, category: "Grains & Pulses" },
  { id: 10, nameEn: "Maida", nameHi: "मैदा", unit: "kg", price: 38, category: "Grains & Pulses" },
  { id: 11, nameEn: "Poha", nameHi: "पोहा", unit: "kg", price: 48, category: "Grains & Pulses" },

  // Oils & Fats
  { id: 12, nameEn: "Refined Soybean Oil", nameHi: "सोयाबीन तेल (रिफाइंड)", unit: "lit", price: 130, category: "Oils & Fats" },
  { id: 13, nameEn: "Mustard Oil", nameHi: "सरसों का तेल", unit: "lit", price: 155, category: "Oils & Fats" },
  { id: 14, nameEn: "Vanaspati Ghee", nameHi: "वनस्पति घी", unit: "kg", price: 160, category: "Oils & Fats" },

  // Spices & Condiments
  { id: 15, nameEn: "Turmeric Powder", nameHi: "हल्दी पाउडर", unit: "gm", price: 0.25, category: "Spices" }, // price per gram (e.g. 250/kg)
  { id: 16, nameEn: "Coriander Powder", nameHi: "धनिया पाउडर", unit: "gm", price: 0.22, category: "Spices" },
  { id: 17, nameEn: "Chili Powder", nameHi: "मिर्च पाउडर", unit: "gm", price: 0.30, category: "Spices" },
  { id: 18, nameEn: "Cumin Seeds (Jeera)", nameHi: "जीरा", unit: "gm", price: 0.60, category: "Spices" },
  { id: 19, nameEn: "Tea Leaves", nameHi: "चायपत्ती", unit: "gm", price: 0.35, category: "Spices" },
  { id: 20, nameEn: "Salt", nameHi: "नमक", unit: "kg", price: 20, category: "Spices" },
  { id: 21, nameEn: "Chhole Masala", nameHi: "छोले मसाला", unit: "gm", price: 0.40, category: "Spices" },
  { id: 22, nameEn: "Sabzi Masala", nameHi: "सब्जी मसाला", unit: "gm", price: 0.38, category: "Spices" },
  { id: 23, nameEn: "Garam Masala", nameHi: "गरम मसाला", unit: "gm", price: 0.45, category: "Spices" },
  { id: 24, nameEn: "Paneer Masala", nameHi: "पनीर मसाला", unit: "gm", price: 0.45, category: "Spices" },
  { id: 25, nameEn: "Green Cardamom", nameHi: "छोटी इलाइची", unit: "gm", price: 3.50, category: "Spices" },
  { id: 26, nameEn: "Black Pepper", nameHi: "काली मिर्च", unit: "gm", price: 1.20, category: "Spices" },
  { id: 27, nameEn: "Clove (Laung)", nameHi: "लौंग", unit: "gm", price: 1.50, category: "Spices" },
  { id: 28, nameEn: "Black Cardamom", nameHi: "बड़ी इलाइची", unit: "gm", price: 1.80, category: "Spices" },
  { id: 29, nameEn: "Cinnamon (Dalchini)", nameHi: "दालचीनी", unit: "gm", price: 0.80, category: "Spices" },
  { id: 30, nameEn: "Mace (Javitri)", nameHi: "जावित्री", unit: "gm", price: 4.00, category: "Spices" },
  { id: 31, nameEn: "Pulav Masala", nameHi: "पुलाव मसाला", unit: "gm", price: 0.50, category: "Spices" },
  { id: 32, nameEn: "Asafoetida (Heeng)", nameHi: "हींग", unit: "gm", price: 2.50, category: "Spices" },
  { id: 33, nameEn: "Fennel Seeds (Saunf)", nameHi: "सौंफ", unit: "gm", price: 0.35, category: "Spices" },
  { id: 34, nameEn: "Carom Seeds (Ajwain)", nameHi: "अजवाइन", unit: "gm", price: 0.40, category: "Spices" },
  { id: 35, nameEn: "Mustard Seeds", nameHi: "सरसों दाना", unit: "gm", price: 0.15, category: "Spices" },
  { id: 36, nameEn: "Fenugreek Seeds", nameHi: "मेथी दाना", unit: "gm", price: 0.20, category: "Spices" },
  { id: 37, nameEn: "Kasuri Methi", nameHi: "कसूरी मेथी", unit: "gm", price: 0.80, category: "Spices" },

  // Vegetables & Fresh Items
  { id: 38, nameEn: "Potato", nameHi: "आलू", unit: "kg", price: 25, category: "Vegetables" },
  { id: 39, nameEn: "Onion", nameHi: "प्याज", unit: "kg", price: 40, category: "Vegetables" },
  { id: 40, nameEn: "Tomato", nameHi: "टमाटर", unit: "kg", price: 30, category: "Vegetables" },
  { id: 41, nameEn: "Green Chili", nameHi: "हरी मिर्च", unit: "kg", price: 60, category: "Vegetables" },
  { id: 42, nameEn: "Fresh Coriander", nameHi: "हरा धनिया", unit: "kg", price: 80, category: "Vegetables" },
  { id: 43, nameEn: "Ginger", nameHi: "अदरक", unit: "kg", price: 120, category: "Vegetables" },
  { id: 44, nameEn: "Garlic", nameHi: "लहसुन", unit: "kg", price: 180, category: "Vegetables" },
  { id: 45, nameEn: "Cauliflower", nameHi: "फूलगोभी", unit: "kg", price: 35, category: "Vegetables" },
  { id: 46, nameEn: "Cucumber (Kheera)", nameHi: "खीरा", unit: "kg", price: 20, category: "Vegetables" },
  { id: 47, nameEn: "Cabbage", nameHi: "पत्तागोभी", unit: "kg", price: 25, category: "Vegetables" },
  { id: 48, nameEn: "Carrots", nameHi: "गाजर", unit: "kg", price: 30, category: "Vegetables" },
  { id: 49, nameEn: "Capsicum", nameHi: "शिमला मिर्च", unit: "kg", price: 50, category: "Vegetables" },

  // Dairy
  { id: 50, nameEn: "Milk", nameHi: "दूध", unit: "lit", price: 60, category: "Dairy" },
  { id: 51, nameEn: "Paneer", nameHi: "पनीर", unit: "kg", price: 360, category: "Dairy" },

  // Snacks & Packaged
  { id: 52, nameEn: "Biscuits", nameHi: "बिस्कुट", unit: "Pkt", price: 10, category: "Snacks" },
  { id: 53, nameEn: "Namkeen", nameHi: "नमकीन", unit: "Pkt", price: 20, category: "Snacks" },
  { id: 54, nameEn: "Bread", nameHi: "ब्रेड", unit: "Pkt", price: 40, category: "Snacks" },
  { id: 55, nameEn: "Papad", nameHi: "पापड़", unit: "kg", price: 180, category: "Snacks" },
  { id: 56, nameEn: "Pickle", nameHi: "अचार", unit: "kg", price: 120, category: "Snacks" },
  { id: 57, nameEn: "Tomato Ketchup", nameHi: "टी. केचप (T. Ketchup)", unit: "kg", price: 90, category: "Snacks" },
  { id: 58, nameEn: "Tomato Sauce", nameHi: "टी. सॉस (T. Sauce)", unit: "lit", price: 80, category: "Snacks" },

  // Dry Fruits
  { id: 59, nameEn: "Raisins", nameHi: "किशमिश", unit: "gm", price: 0.35, category: "Dry Fruits" },
  { id: 60, nameEn: "Cashew", nameHi: "काजू", unit: "gm", price: 0.80, category: "Dry Fruits" },
  { id: 61, nameEn: "Makhana", nameHi: "मखाना", unit: "gm", price: 1.00, category: "Dry Fruits" },
  { id: 62, nameEn: "Coconut Powder", nameHi: "गरी बुरादा", unit: "kg", price: 220, category: "Dry Fruits" },
  { id: 63, nameEn: "Peanuts", nameHi: "मूंगफली", unit: "kg", price: 110, category: "Dry Fruits" },

  // Cleaning & Utilities
  { id: 64, nameEn: "Washing Powder", nameHi: "वाशिंग पाउडर", unit: "kg", price: 80, category: "Utilities" },
  { id: 65, nameEn: "Gas Cylinder", nameHi: "गैस सिलेंडर", unit: "Nos", price: 1050, category: "Utilities" },
  { id: 66, nameEn: "Matchbox", nameHi: "माचिस", unit: "Pkt", price: 15, category: "Utilities" },
  { id: 67, nameEn: "Dishwash Scrub (Goonja)", nameHi: "बर्तन धोने का गूंजा", unit: "Nos", price: 10, category: "Utilities" }
];

export const initialDailyLogs = {
  "2025-11-22": {
    diningStrength: 450,
    budgetPerHeadMonthly: 2352,
    menu: {
      breakfast: "Veg Biryani - Tea",
      recess: "Biscuits - 01 Pkt",
      lunch: "Aloo Chole, Sewaiya (Kheer), Poori, Salad, Fried Chilly",
      snacks: "Namkeen - 01 Pkt",
      dinner: "Dal Arhar, Chawal, Papad, Pickles"
    },
    indents: {
      1: 40,    // Rice (chaul): 40 kg
      3: 18,    // Sugar: 18 kg
      4: 16,    // Dal Arhar: 16 kg
      15: 400,  // Turmeric: 400 gm
      16: 600,  // Coriander powder: 600 gm
      17: 700,  // Chili powder: 700 gm
      18: 100,  // Cumin: 100 gm
      19: 500,  // Tea: 500 gm
      20: 7,    // Salt: 7 kg
      21: 100,  // Chhole Masala: 100 gm
      22: 50,   // Sabzi Masala: 50 gm
      23: 50,   // Garam Masala: 50 gm
      7: 10,    // Kabuli Chana: 10 kg
      14: 3.5,  // Soya bari: 3.5 kg
      62: 0.4,  // Coconut powder: 0.4 kg (400g)
      59: 250,  // Raisins: 250g
      61: 250,  // Makhana: 250g
      60: 250,  // Cashew: 250g
      25: 50,   // Cardamom: 50g
      26: 50,   // Black pepper: 50g
      27: 50,   // Clove: 50g
      28: 50,   // Big cardamom: 50g
      29: 50,   // Cinnamon: 50g
      30: 50,   // Mace: 50g
      31: 100,  // Pulav Masala: 100g
      56: 3,    // Pickle: 3kg
      55: 3,    // Papad: 3kg
      48: 5,    // Carrots: 5kg
      50: 125,  // Milk: 125 lit
      45: 30,   // Cauliflower: 30kg
      46: 45,   // Cucumber (kheera): 45kg
      47: 9,    // Cabbage: 9kg
      13: 4,    // Mustard oil: 4 lit
      64: 1,    // Washing powder: 1kg
      66: 1     // Matches: 1 Pkt
    }
  }
};
