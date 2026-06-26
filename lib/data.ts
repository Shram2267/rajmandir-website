// ---------------------------------------------------------------------------
// Static presentation data for the Rajmandir Hypermarket site.
// (Stores and offers now come from Supabase; see lib/offers.ts and the
//  StoreProvider / OffersProvider. Only display constants live here.)
// ---------------------------------------------------------------------------

export const categories = [
  "Dairy, Bread & Eggs",
  "Fruits & Vegetables",
  "Cold Drinks & Juices",
  "Snacks & Munchies",
  "Breakfast & Instant Food",
  "Bakery & Biscuits",
  "Tea, Coffee & Milk Drinks",
  "Atta, Rice & Dal",
  "Masala, Oil & More",
  "Dry Fruits",
  "Sauces & Spreads",
  "Baby Care",
  "Cleaning Essentials",
  "Home & Office",
  "Personal Care",
  "Pet Care",
] as const;

export const categoryIcons: Record<string, string> = {
  "Dairy, Bread & Eggs": "🥛",
  "Fruits & Vegetables": "🥬",
  "Cold Drinks & Juices": "🥤",
  "Snacks & Munchies": "🍿",
  "Breakfast & Instant Food": "🥣",
  "Bakery & Biscuits": "🍞",
  "Tea, Coffee & Milk Drinks": "☕",
  "Atta, Rice & Dal": "🌾",
  "Masala, Oil & More": "🧂",
  "Dry Fruits": "🥜",
  "Sauces & Spreads": "🥫",
  "Baby Care": "🍼",
  "Cleaning Essentials": "🧼",
  "Home & Office": "🏠",
  "Personal Care": "🧴",
  "Pet Care": "🐾",
};

export const categoryCounts: Record<string, string> = {
  "Dairy, Bread & Eggs": "350+",
  "Fruits & Vegetables": "600+",
  "Cold Drinks & Juices": "500+",
  "Snacks & Munchies": "1,400+",
  "Breakfast & Instant Food": "450+",
  "Bakery & Biscuits": "400+",
  "Tea, Coffee & Milk Drinks": "300+",
  "Atta, Rice & Dal": "900+",
  "Masala, Oil & More": "1,200+",
  "Dry Fruits": "200+",
  "Sauces & Spreads": "250+",
  "Baby Care": "300+",
  "Cleaning Essentials": "1,100+",
  "Home & Office": "800+",
  "Personal Care": "1,800+",
  "Pet Care": "150+",
};

export const brandValues = [
  {
    icon: "🤝",
    t: "Service",
    d: "Our staff is trained to assist with efficiency and respect, ensuring a smooth shopping journey.",
  },
  {
    icon: "🛡️",
    t: "Trust",
    d: "We offer only authentic, quality-checked products sourced from reliable brands and suppliers.",
  },
  {
    icon: "❤️",
    t: "Loyalty",
    d: "Our pricing, promotions, and loyalty programs are designed to reward consistent customers.",
  },
];
