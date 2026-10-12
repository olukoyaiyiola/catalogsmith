// Pre-packaged test datasets for ContentSmith Studio
window.CONTENTSMITH_FIXTURES = window.ContentSmith_FIXTURES = window.CATALOGSMITH_FIXTURES = {
  whatsapp: {
    name: "1. WhatsApp Chat Scroll",
    description: "Lola Fabrics & Chic Wear (Screen recording of WhatsApp chat cards and text prices)",
    data: {
      "vendor_name": "Lola Fabrics & Chic Wear",
      "vendor_phone": "+2348035550192",
      "currency_default": "NGN",
      "theme": "emerald",
      "tagline": "Luxury custom dresses & fabrics delivered nationwide",
      "products": [
        {
          "id": "p1",
          "name": "Luxury Silk Boubou Gown with Beaded Neckline",
          "price": { "amount": 28500, "currency": "NGN", "source": "on_screen" },
          "description": "Rich emerald green pure silk boubou with hand-stitched crystal beadwork around neckline. Free size fits UK 10-18.",
          "category": "Dresses",
          "best_timestamp_sec": 4.2,
          "confidence": 0.95
        },
        {
          "id": "p2",
          "name": "2-Piece Ankara Co-ord Trouser Set (Floral Sunset)",
          "price": { "amount": 16000, "currency": "NGN", "source": "on_screen" },
          "description": "Premium 100% cotton Ankara print in warm orange and violet tones. High-waisted wide-leg trousers with matching button-front shirt.",
          "category": "Co-ords",
          "best_timestamp_sec": 12.8,
          "confidence": 0.92
        },
        {
          "id": "p3",
          "name": "Crocodile Pattern Mini Kelly Handbag with Gold Chain",
          "price": { "amount": 18500, "currency": "NGN", "source": "on_screen" },
          "description": "Structured faux crocodile leather mini top-handle bag. Includes detachable crossbody gold link strap and twist lock.",
          "category": "Bags",
          "best_timestamp_sec": 21.0,
          "confidence": 0.88
        },
        {
          "id": "p4",
          "name": "Hand-Woven Aso-Oke Headtie & Sash Set",
          "price": { "amount": 35000, "currency": "NGN", "source": "on_screen" },
          "description": "Traditional metallic silver and royal blue woven Aso-Oke gele with matching shoulder ipelle for special ceremonies.",
          "category": "Traditional",
          "best_timestamp_sec": 31.4,
          "confidence": 0.89
        },
        {
          "id": "p5",
          "name": "Crystal Strap Block Heel Mules (Champagne)",
          "price": { "amount": 22000, "currency": "NGN", "source": "on_screen" },
          "description": "2.5-inch comfortable block heel mules with double rhinestone transparent band. Sizes 37 to 42 available.",
          "category": "Footwear",
          "best_timestamp_sec": 42.1,
          "confidence": 0.91
        },
        {
          "id": "p6",
          "name": "Limited Edition Embroidered Velvet Kimono",
          "price": null,
          "description": "Plush burgundy velvet kimono coat with gold thread floral embroidery along hem and sleeves. Custom pre-order only.",
          "category": "Outerwear",
          "best_timestamp_sec": 53.7,
          "confidence": 0.74
        }
      ]
    }
  },
  walkthrough: {
    name: "2. Handheld Walkthrough",
    description: "Zara Gems & Glamour Hub (Vendor holding up jewelry & hair pieces, narrating prices)",
    data: {
      "vendor_name": "Zara Gems & Glamour Hub",
      "vendor_phone": "+2348124991180",
      "currency_default": "NGN",
      "theme": "luxury-gold",
      "tagline": "Pure gold PVD jewelry & raw donor human hair",
      "products": [
        {
          "id": "p1",
          "name": "18K Gold PVD Waterproof Herringbone Chain",
          "price": { "amount": 14500, "currency": "NGN", "source": "spoken" },
          "description": "Non-tarnish surgical stainless steel layered necklace with 18k PVD real gold plating. 5mm width, 18 inches with 2-inch extender.",
          "category": "Jewelry",
          "best_timestamp_sec": 8.4,
          "confidence": 0.96
        },
        {
          "id": "p2",
          "name": "Iced Out Baguette Initial Pendant & Rope Chain",
          "price": { "amount": 21000, "currency": "NGN", "source": "spoken" },
          "description": "Customizable initial letter pendant handset with AAA cubic zirconia baguette stones. Paired with a 3mm diamond cut rope chain.",
          "category": "Jewelry",
          "best_timestamp_sec": 19.2,
          "confidence": 0.93
        },
        {
          "id": "p3",
          "name": "Vietnamese Raw Bone Straight 13x4 Lace Front Wig (24 Inches)",
          "price": { "amount": 135000, "currency": "NGN", "source": "spoken" },
          "description": "100% human raw donor hair in natural 1B black. Silky bone straight texture, HD lace pre-plucked with baby hair, 250% density.",
          "category": "Hair & Wigs",
          "best_timestamp_sec": 34.6,
          "confidence": 0.94
        },
        {
          "id": "p4",
          "name": "Luxury Matte Rose Gold Smart Quartz Watch",
          "price": { "amount": 26000, "currency": "NGN", "source": "spoken" },
          "description": "Scratch-resistant sapphire mineral glass with rose gold mesh band. Water resistant up to 30m with chronograph date dial.",
          "category": "Watches",
          "best_timestamp_sec": 48.0,
          "confidence": 0.89
        },
        {
          "id": "p5",
          "name": "Handmade Organic Cocoa Butter Body Soufflé (300g)",
          "price": { "amount": 6500, "currency": "NGN", "source": "spoken" },
          "description": "Whipped unrefined Ghana shea and cocoa butter infused with sweet almond oil and vanilla bean essential oils.",
          "category": "Skincare",
          "best_timestamp_sec": 61.5,
          "confidence": 0.91
        },
        {
          "id": "p6",
          "name": "Custom Engraved Stainless Steel Cuff Bracelet",
          "price": null,
          "description": "Minimalist open bangle cuff available in silver, yellow gold, and rose gold. Price varies based on custom engraving characters.",
          "category": "Accessories",
          "best_timestamp_sec": 73.8,
          "confidence": 0.72
        }
      ]
    }
  },
  shelf: {
    name: "3. Shelf / Display Footage",
    description: "Kano Heritage Leather & Craft (Panning across boutique leather shelf with tags)",
    data: {
      "vendor_name": "Kano Heritage Leather & Craft",
      "vendor_phone": "+2348098765432",
      "currency_default": "NGN",
      "theme": "sunset",
      "tagline": "Handcrafted Northern Nigerian full-grain leather goods",
      "products": [
        {
          "id": "p1",
          "name": "Full-Grain Cowhide Weekender Duffle Bag (Cognac)",
          "price": { "amount": 55000, "currency": "NGN", "source": "price_tag" },
          "description": "Hand-stitched genuine Northern Nigerian cowhide leather traveling duffle with reinforced brass hardware, YKK metal zippers, and shoe compartment.",
          "category": "Bags",
          "best_timestamp_sec": 6.8,
          "confidence": 0.95
        },
        {
          "id": "p2",
          "name": "Minimalist Slim Bifold Leather Wallet",
          "price": { "amount": 9500, "currency": "NGN", "source": "price_tag" },
          "description": "Vegetable-tanned leather bifold wallet with 6 card slots, 2 hidden receipt compartments, and full cash pocket. RFID blocking lining.",
          "category": "Wallets",
          "best_timestamp_sec": 15.3,
          "confidence": 0.92
        },
        {
          "id": "p3",
          "name": "Executive Leather Messenger Laptop Bag (Dark Espresso)",
          "price": { "amount": 42000, "currency": "NGN", "source": "price_tag" },
          "description": "Fits 15.6-inch laptop with padded sleeve. Dual buckle front flap, adjustable shoulder strap with comfort pad, and rear luggage trolley strap.",
          "category": "Bags",
          "best_timestamp_sec": 24.1,
          "confidence": 0.88
        },
        {
          "id": "p4",
          "name": "Braided Rawhide Dress Belt with Brass Buckle",
          "price": { "amount": 11000, "currency": "NGN", "source": "price_tag" },
          "description": "Solid leather intricately woven rawhide belt in mahogany finish. Solid brass single-prong buckle. 35mm width.",
          "category": "Belts",
          "best_timestamp_sec": 33.7,
          "confidence": 0.85
        },
        {
          "id": "p5",
          "name": "Handmade Leather Passport Cover & Boarding Pass Sleeve",
          "price": { "amount": 7500, "currency": "NGN", "source": "price_tag" },
          "description": "Compact travel organizer holding passport, 4 cards, and flight tickets. Hand-burnished wax edges in tan leather.",
          "category": "Travel",
          "best_timestamp_sec": 41.5,
          "confidence": 0.90
        },
        {
          "id": "p6",
          "name": "Hand-Tooled Leather Briefcase (Display Sample)",
          "price": null,
          "description": "Vintage carved geometric motifs on stiff harness leather with twin combination locks. Display piece - tag not visible on shelf.",
          "category": "Bags",
          "best_timestamp_sec": 50.2,
          "confidence": 0.76
        }
      ]
    }
  },
  social: {
    name: "4. Social Video / Tech Reels",
    description: "KevTech Gadgets & Audio (Short-form video showcase of headphones, powerbanks, chargers)",
    data: {
      "vendor_name": "KevTech Gadgets & Audio",
      "vendor_phone": "+2347089123456",
      "currency_default": "NGN",
      "theme": "tech-blue",
      "tagline": "Original mobile accessories, gaming gear & fast audio",
      "products": [
        {
          "id": "p1",
          "name": "Wireless ANC Noise-Cancelling Earbuds Pro",
          "price": { "amount": 18500, "currency": "NGN", "source": "on_screen" },
          "description": "Active Noise Cancellation up to 35dB, 36hr battery life with charging case, Bluetooth 5.3, and touch controls. Matte black.",
          "category": "Audio",
          "best_timestamp_sec": 5.1,
          "confidence": 0.96
        },
        {
          "id": "p2",
          "name": "65W GaN Ultra-Compact Fast Charger (3-Port)",
          "price": { "amount": 14000, "currency": "NGN", "source": "on_screen" },
          "description": "Gallium Nitride dual USB-C + USB-A ports. Powers MacBook Pro, iPad, iPhone, and Android devices simultaneously.",
          "category": "Accessories",
          "best_timestamp_sec": 13.4,
          "confidence": 0.94
        },
        {
          "id": "p3",
          "name": "20,000mAh 22.5W Power Bank with Built-in Cables",
          "price": { "amount": 22500, "currency": "NGN", "source": "on_screen" },
          "description": "Integrated Lightning and Type-C braided cables, digital LED battery percentage display, airline approved.",
          "category": "Power",
          "best_timestamp_sec": 22.7,
          "confidence": 0.91
        },
        {
          "id": "p4",
          "name": "Magnetic Wireless Car Mount & 15W Qi Charger",
          "price": { "amount": 11500, "currency": "NGN", "source": "on_screen" },
          "description": "Auto-clamping air vent mount with 360-degree ball joint and fast wireless charging for MagSafe and Qi phones.",
          "category": "Car Gear",
          "best_timestamp_sec": 31.0,
          "confidence": 0.89
        },
        {
          "id": "p5",
          "name": "RGB Mechanical Wireless Gaming Keyboard (60% Layout)",
          "price": { "amount": 34000, "currency": "NGN", "source": "spoken" },
          "description": "Hot-swappable red linear switches, per-key RGB backlighting, tri-mode connection (Bluetooth, 2.4G wireless, Type-C).",
          "category": "Gaming",
          "best_timestamp_sec": 43.8,
          "confidence": 0.92
        },
        {
          "id": "p6",
          "name": "Smart Fitness Band with AMOLED Screen & Heart Rate",
          "price": null,
          "description": "Continuous SPO2 blood oxygen tracking, 120 sports modes, 5ATM water resistance. Price on inquiry based on strap bundle.",
          "category": "Wearables",
          "best_timestamp_sec": 54.2,
          "confidence": 0.78
        }
      ]
    }
  },
  market: {
    name: "5. Market Stall Walkthrough",
    description: "Mama Chidi Organic Pantry & Spices (Panning across honey jars, smoked crayfish, and grains)",
    data: {
      "vendor_name": "Mama Chidi Organic Pantry & Spices",
      "vendor_phone": "+2348021112233",
      "currency_default": "NGN",
      "theme": "minimal",
      "tagline": "Farm-fresh unrefined pantry staples, natural oils & dry spices",
      "products": [
        {
          "id": "p1",
          "name": "Pure Raw Wildflower Forest Honey (1 Litre Jar)",
          "price": { "amount": 7500, "currency": "NGN", "source": "price_tag" },
          "description": "100% unpasteurized raw honey harvested from natural forest apiaries in Kogi State. Unfiltered with pure honeycomb bits.",
          "category": "Pantry",
          "best_timestamp_sec": 7.3,
          "confidence": 0.95
        },
        {
          "id": "p2",
          "name": "Oron Smoked Crayfish (Air-Tight Sealed 1kg Tub)",
          "price": { "amount": 12000, "currency": "NGN", "source": "spoken" },
          "description": "Sun-dried and gently hardwood-smoked jumbo crayfish from Akwa Ibom. Sand-free and clean, ground on order or whole.",
          "category": "Seafood",
          "best_timestamp_sec": 16.5,
          "confidence": 0.93
        },
        {
          "id": "p3",
          "name": "Stone-Ground Hand-Peeled Egusi Seeds (2kg Bag)",
          "price": { "amount": 9800, "currency": "NGN", "source": "spoken" },
          "description": "Premium hand-sorted melon seeds with high oil content. Ideal for traditional thick soup with rich yellow aroma.",
          "category": "Grains & Seeds",
          "best_timestamp_sec": 26.2,
          "confidence": 0.90
        },
        {
          "id": "p4",
          "name": "Cold-Pressed Virgin Coconut Oil (500ml Glass Bottle)",
          "price": { "amount": 5500, "currency": "NGN", "source": "price_tag" },
          "description": "Extra virgin edible and cosmetic coconut oil. Cold pressed from fresh coconuts without chemicals or heat processing.",
          "category": "Oils",
          "best_timestamp_sec": 35.8,
          "confidence": 0.94
        },
        {
          "id": "p5",
          "name": "Roasted Tiger Nut & Date Flour Powder (1.5kg)",
          "price": { "amount": 6200, "currency": "NGN", "source": "spoken" },
          "description": "Natural sweetener and grain-free baking flour. Made from roasted tiger nuts, dried dates, and organic ginger.",
          "category": "Healthy Living",
          "best_timestamp_sec": 44.9,
          "confidence": 0.88
        },
        {
          "id": "p6",
          "name": "Seasonal Sun-Dried Yellow Habenero Peppers (Big Basket)",
          "price": null,
          "description": "Locally harvested aromatic yellow chili peppers. Market price fluctuates weekly depending on harvest supply.",
          "category": "Spices",
          "best_timestamp_sec": 56.1,
          "confidence": 0.75
        }
      ]
    }
  }
};
