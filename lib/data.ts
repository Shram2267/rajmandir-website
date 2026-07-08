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

// ---------------------------------------------------------------------------
// Frequently asked questions (home-page FAQ section). Grouped into tabs.
// Edit the questions/answers here — plain text; an optional `link` renders a
// "Learn more" style link under the answer.
// ---------------------------------------------------------------------------

export type FaqItem = {
  q: string;
  a: string;
  link?: { href: string; label: string };
};

export type FaqCategory = {
  category: string;
  items: FaqItem[];
};

export const faqCategories: FaqCategory[] = [
  {
    category: "About Rajmandir",
    items: [
      {
        q: "What is Rajmandir Hypermarket?",
        a: "Rajmandir Hypermarket is a neighbourhood hypermarket chain that brings everyday groceries, FMCG, household and personal-care products together under one roof — all at wholesale rates. With 60+ stores across Delhi-NCR, quality shopping is always close to home.",
      },
      {
        q: "What makes Rajmandir different from other stores?",
        a: "Wholesale-rate pricing, a huge range of products in one place, fresh stock arriving regularly, and stores right in your neighbourhood. We focus on trusted brands and honest prices so every rupee goes further.",
      },
      {
        q: "Where are your stores located?",
        a: "We have 60+ stores across Delhi-NCR, including Rohini, Pitampura, Burari, Rani Bagh and many more areas. Use “Find a Store” to see the one nearest you with directions.",
        link: { href: "/stores", label: "Find a store near you" },
      },
      {
        q: "What are your store timings?",
        a: "All Rajmandir stores are open from 10 AM to 10 PM, every day of the week.",
      },
    ],
  },
  {
    category: "Offers & Pamphlets",
    items: [
      {
        q: "How do I see today’s offers?",
        a: "Browse the Offers page or tap “See Offers Near Me” on the home page. Offers are refreshed regularly, and you can filter them by category.",
        link: { href: "/offers", label: "See today’s offers" },
      },
      {
        q: "Do offers and prices differ by store?",
        a: "Yes — prices and availability can vary slightly from store to store. Each store’s page shows the offers currently running at that location.",
      },
      {
        q: "What are pamphlet offers?",
        a: "Our periodic promotional pamphlets highlight special deals and combos. You can view the latest ones any time on the Pamphlet Offers page.",
        link: { href: "/pamphlets", label: "View pamphlet offers" },
      },
      {
        q: "How often are offers updated?",
        a: "Frequently — new deals are added regularly, so it’s worth checking back before your shopping trip.",
      },
    ],
  },
  {
    category: "Products",
    items: [
      {
        q: "What products do you sell?",
        a: "Everything for your home: dairy & eggs, fruits & vegetables, snacks, staples like atta, rice and dal, cooking oil and masalas, beverages, cleaning essentials, personal care, baby care, pet care and more — over 20 categories.",
      },
      {
        q: "Are your products fresh?",
        a: "Yes. Fresh stock arrives regularly, and fruits, vegetables and dairy are restocked through the day so you get quality you can trust.",
      },
      {
        q: "Do you stock branded and imported items?",
        a: "Absolutely — leading national brands you know and love, plus a selection of imported and specialty products.",
      },
      {
        q: "How do I check if an item is in stock?",
        a: "Availability can vary by store. For a specific item, it’s best to call or WhatsApp your nearest store before visiting.",
        link: { href: "/contact", label: "Contact a store" },
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        q: "Which payment methods do you accept?",
        a: "Our stores accept cash, UPI, and major debit and credit cards. Accepted methods may vary slightly by store.",
      },
      {
        q: "Do you offer home delivery?",
        a: "Delivery options can vary by location. Please contact your nearest store to ask about delivery near you.",
        link: { href: "/contact", label: "Contact us" },
      },
      {
        q: "Are there any loyalty or savings programs?",
        a: "We regularly run promotions and savings programs designed to reward our regular shoppers. Ask in-store for the offers currently available.",
      },
    ],
  },
  {
    category: "Returns & Support",
    items: [
      {
        q: "What is your return or exchange policy?",
        a: "Please see our Returns page for full details. In general, bring the product along with its receipt to the store and our team will assist you.",
        link: { href: "/returns", label: "Read our returns policy" },
      },
      {
        q: "How do I contact Rajmandir?",
        a: "You can reach us through the Contact page, on WhatsApp, or by calling your nearest store directly.",
        link: { href: "/contact", label: "Get in touch" },
      },
      {
        q: "I have feedback or a complaint — what should I do?",
        a: "We’d love to hear from you. Reach out through Contact Us or WhatsApp and our team will get back to you. Your feedback helps us serve you better.",
        link: { href: "/contact", label: "Share feedback" },
      },
    ],
  },
];
