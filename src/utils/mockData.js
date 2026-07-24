// src/utils/mockData.js
// Comprehensive item inventory and sample daily log parsed from JNV School Mess Indent PDF

export const initialInventory = [
  // Grains & Pulses
  { id: 1, nameEn: "Rice (Chawal)", nameHi: "चावल", unit: "kg", price: 45, category: "Grains & Pulses" },
  { id: 2, nameEn: "Atta (Wheat Flour)", nameHi: "आटा", unit: "kg", price: 30, category: "Grains & Pulses" },
  { id: 3, nameEn: "Suji (Rawa)", nameHi: "सूजी", unit: "kg", price: 38, category: "Grains & Pulses" },
  { id: 4, nameEn: "Besan (Gram Flour)", nameHi: "बेसन", unit: "kg", price: 85, category: "Grains & Pulses" },
  { id: 5, nameEn: "Maida (Fine Flour)", nameHi: "मैदा", unit: "kg", price: 40, category: "Grains & Pulses" },
  { id: 6, nameEn: "Poha (Flattened Rice)", nameHi: "पोहा", unit: "kg", price: 50, category: "Grains & Pulses" },
  { id: 7, nameEn: "Dal Arhar (Toor Dal)", nameHi: "दाल अरहर", unit: "kg", price: 140, category: "Grains & Pulses" },
  { id: 8, nameEn: "Dal Chana", nameHi: "दाल चना", unit: "kg", price: 90, category: "Grains & Pulses" },
  { id: 9, nameEn: "Dal Moong Dhuli", nameHi: "दाल मूंग धुली", unit: "kg", price: 110, category: "Grains & Pulses" },
  { id: 10, nameEn: "Dal Moong Chilka", nameHi: "दाल मूंग छिलका", unit: "kg", price: 105, category: "Grains & Pulses" },
  { id: 11, nameEn: "Dal Urad Sabut", nameHi: "दाल उड़द साबुत", unit: "kg", price: 120, category: "Grains & Pulses" },
  { id: 12, nameEn: "Rajma (Kidney Beans)", nameHi: "राजमा", unit: "kg", price: 130, category: "Grains & Pulses" },
  { id: 13, nameEn: "Kabuli Chana", nameHi: "काबुली चना", unit: "kg", price: 125, category: "Grains & Pulses" },
  { id: 14, nameEn: "Chana Black", nameHi: "काला चना", unit: "kg", price: 80, category: "Grains & Pulses" },
  { id: 15, nameEn: "Soya Chunk / Badi", nameHi: "सोया बड़ी", unit: "kg", price: 95, category: "Grains & Pulses" },

  // Oils & Fats
  { id: 16, nameEn: "Refined Soya Oil", nameHi: "सोयाबीन तेल", unit: "lit", price: 125, category: "Oils & Fats" },
  { id: 17, nameEn: "Mustard Oil (Sarson)", nameHi: "सरसों का तेल", unit: "lit", price: 145, category: "Oils & Fats" },
  { id: 18, nameEn: "Desi Ghee", nameHi: "देसी घी", unit: "kg", price: 580, category: "Oils & Fats" },
  { id: 19, nameEn: "Butter / Makkhan", nameHi: "मक्खन", unit: "kg", price: 480, category: "Oils & Fats" },

  // Spices & Seasoning
  { id: 20, nameEn: "Haldi Powder (Turmeric)", nameHi: "हल्दी पाउडर", unit: "kg", price: 160, category: "Spices" },
  { id: 21, nameEn: "Mirch Powder (Chilli)", nameHi: "मिर्च पाउडर", unit: "kg", price: 240, category: "Spices" },
  { id: 22, nameEn: "Dhania Powder (Coriander)", nameHi: "धनिया पाउडर", unit: "kg", price: 180, category: "Spices" },
  { id: 23, nameEn: "Jeera (Cumin Seeds)", nameHi: "जीरा", unit: "kg", price: 320, category: "Spices" },
  { id: 24, nameEn: "Sabut Garam Masala", nameHi: "साबुत गरम मसाला", unit: "kg", price: 650, category: "Spices" },
  { id: 25, nameEn: "Garam Masala Powder", nameHi: "गरम मसाला पाउडर", unit: "kg", price: 400, category: "Spices" },
  { id: 26, nameEn: "Rai / Mustard Seeds", nameHi: "राई", unit: "kg", price: 110, category: "Spices" },
  { id: 27, nameEn: "Saunf (Fennel Seeds)", nameHi: "सौंफ़", unit: "kg", price: 220, category: "Spices" },
  { id: 28, nameEn: "Methi Dana", nameHi: "मेथी दाना", unit: "kg", price: 130, category: "Spices" },
  { id: 29, nameEn: "Amchur (Mango Powder)", nameHi: "आमचूर पाउडर", unit: "kg", price: 200, category: "Spices" },
  { id: 30, nameEn: "Kasuri Methi", nameHi: "कसूरी मेथी", unit: "kg", price: 350, category: "Spices" },
  { id: 31, nameEn: "Tej Patta (Bay Leaves)", nameHi: "तेज पत्ता", unit: "kg", price: 180, category: "Spices" },
  { id: 32, nameEn: "Salt (Iodized)", nameHi: "नमक", unit: "kg", price: 20, category: "Spices" },
  { id: 33, nameEn: "Black Salt (Kala Namak)", nameHi: "काला नमक", unit: "kg", price: 40, category: "Spices" },
  { id: 34, nameEn: "Hing (Asafoetida)", nameHi: "हींग", unit: "gm", price: 2.5, category: "Spices" },

  // Sweeteners & Tea
  { id: 35, nameEn: "Sugar (Chini)", nameHi: "चीनी", unit: "kg", price: 42, category: "Grains & Pulses" },
  { id: 36, nameEn: "Jaggery (Gur)", nameHi: "गुड़", unit: "kg", price: 55, category: "Grains & Pulses" },
  { id: 37, nameEn: "Tea Leaves (Chai Patti)", nameHi: "चाय पत्ती", unit: "kg", price: 280, category: "Grains & Pulses" },

  // Dairy Products
  { id: 38, nameEn: "Fresh Milk", nameHi: "दूध", unit: "lit", price: 55, category: "Dairy" },
  { id: 39, nameEn: "Paneer (Cottage Cheese)", nameHi: "पनीर", unit: "kg", price: 320, category: "Dairy" },
  { id: 40, nameEn: "Curd (Dahi)", nameHi: "दही", unit: "kg", price: 60, category: "Dairy" },

  // Fresh Vegetables
  { id: 41, nameEn: "Potato (Aloo)", nameHi: "आलू", unit: "kg", price: 22, category: "Vegetables" },
  { id: 42, nameEn: "Onion (Pyaz)", nameHi: "प्याज़", unit: "kg", price: 35, category: "Vegetables" },
  { id: 43, nameEn: "Tomato (Tamatar)", nameHi: "टमाटर", unit: "kg", price: 40, category: "Vegetables" },
  { id: 44, nameEn: "Green Chilli (Hari Mirch)", nameHi: "हरी मिर्च", unit: "kg", price: 60, category: "Vegetables" },
  { id: 45, nameEn: "Ginger (Adrak)", nameHi: "अदरक", unit: "kg", price: 120, category: "Vegetables" },
  { id: 46, nameEn: "Garlic (Lahsun)", nameHi: "लहसुन", unit: "kg", price: 180, category: "Vegetables" },
  { id: 47, nameEn: "Cauliflower (Phool Gobhi)", nameHi: "फूलगोभी", unit: "kg", price: 35, category: "Vegetables" },
  { id: 48, nameEn: "Cabbage (Patta Gobhi)", nameHi: "पत्तागोभी", unit: "kg", price: 25, category: "Vegetables" },
  { id: 49, nameEn: "Carrot (Gajar)", nameHi: "गाजर", unit: "kg", price: 40, category: "Vegetables" },
  { id: 50, nameEn: "Green Peas (Matar)", nameHi: "हरी मटर", unit: "kg", price: 65, category: "Vegetables" },
  { id: 51, nameEn: "Palak (Spinach)", nameHi: "पालक", unit: "kg", price: 30, category: "Vegetables" },
  { id: 52, nameEn: "Coriander Leaves (Dhaniya)", nameHi: "हरा धनिया", unit: "kg", price: 80, category: "Vegetables" },
  { id: 53, nameEn: "Lemon (Nimbu)", nameHi: "नींबू", unit: "Nos", price: 4, category: "Vegetables" },

  // Snacks & Packaged
  { id: 54, nameEn: "Biscuit Packets", nameHi: "बिस्कुट पैकेट", unit: "Pkt", price: 10, category: "Snacks" },
  { id: 55, nameEn: "Namkeen / Sev", nameHi: "नमकीन / सेव", unit: "kg", price: 120, category: "Snacks" },
  { id: 56, nameEn: "Papad Packets", nameHi: "पापड़", unit: "Pkt", price: 45, category: "Snacks" },
  { id: 57, nameEn: "Pickle (Achar)", nameHi: "अचार", unit: "kg", price: 110, category: "Snacks" },
  { id: 58, nameEn: "Bread Slices", nameHi: "ब्रेड", unit: "Pkt", price: 35, category: "Snacks" },
  { id: 59, nameEn: "Jam", nameHi: "जैम", unit: "kg", price: 160, category: "Snacks" },

  // Dry Fruits & Extra
  { id: 60, nameEn: "Kismis (Raisins)", nameHi: "किसमिस", unit: "kg", price: 280, category: "Dry Fruits" },
  { id: 61, nameEn: "Kaju (Cashew Nuts)", nameHi: "काजू", unit: "kg", price: 750, category: "Dry Fruits" },
  { id: 62, nameEn: "Badam (Almonds)", nameHi: "बादाम", unit: "kg", price: 680, category: "Dry Fruits" },
  { id: 63, nameEn: "Chhuara (Dried Dates)", nameHi: "छुआरा", unit: "kg", price: 250, category: "Dry Fruits" },

  // Fuel & Utilities
  { id: 64, nameEn: "LPG Gas Cylinder", nameHi: "एलपीजी गैस", unit: "Nos", price: 950, category: "Utilities" },
  { id: 65, nameEn: "Detergent / Washing Soap", nameHi: "डिटर्जेंट पाउडर", unit: "kg", price: 75, category: "Utilities" },
  { id: 66, nameEn: "Dishwash Bar", nameHi: "बर्तन धोने का साबुन", unit: "Nos", price: 15, category: "Utilities" },
  { id: 67, nameEn: "Matchbox", nameHi: "माचिस", unit: "Pkt", price: 12, category: "Utilities" }
];

// Sample daily log pre-populated for testing (parsed from Nov 22, 2025 school indent scan)
export const initialDailyLogs = {
  "2025-11-22": {
    diningStrength: 467,
    budgetPerHeadMonthly: 2352, // 467 * 78.40 = ₹36,612.80 realized daily budget
    menu: {
      breakfast: "Veg Biryani & Tea",
      recess: "Biscuits - 01 Pkt per student",
      lunch: "Aloo Chole, Poori, Rice, Green Salad",
      snacks: "Namkeen & Tea",
      dinner: "Dal Arhar, Chawal, Roti, Kheer"
    },
    indents: {
      1: "35 + 25",    // Rice
      2: "45 + 30",    // Atta
      7: "18",         // Dal Arhar
      16: "12",        // Refined Soya Oil
      20: "1.5",       // Haldi
      21: "1",         // Mirch
      22: "1.5",       // Dhania
      23: "0.5",       // Jeera
      32: "4",         // Salt
      35: "15",        // Sugar
      37: "1.2",       // Tea
      38: "95",        // Milk
      41: "50",        // Potato
      42: "20",        // Onion
      43: "15",        // Tomato
      47: "25",        // Cauliflower
      54: "467"        // Biscuits
    }
  }
};
