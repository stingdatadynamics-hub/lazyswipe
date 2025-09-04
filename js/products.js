// Product data 
const products = [
    {
        id: "1",
        name: "Shopping Baskets",
        category: "home",
        image: "images/shopping_baskets.jpg",
        description: "Handwoven shopping baskets.",
        variations: [
            { size: "Small", price: 400 },
            { size: "Medium", price: 800 },
            { size: "Large", price: 1200 }
        ]
    },
    {
        id: "2",
        name: "Makuti Broom",
        category: "home",
        image: "images/makuti_broom.jpg",
        description: "Traditional handmade sisal broom.",
        variations: [
            { price: 250 }
        ]
    },
    {
        id: "23",
        name: "Papyrus Reeds Brooms",
        category: "home",
        image: "images/papyrus_reeds_brooms.jpg",
        description: "Traditional handmade coconut material broom.",
        variations: [
            { price: 100 }
        ]
    },
    {
        id: "3",
        name: "Mwikos (Cooking Sticks)",
        category: "home",
        image: "images/mwiko.jpg",
        description: "Wooden mwikos for cooking.",
        variations: [
            { size: "Small", price: 200 },
            { size: "Medium", price: 400 }
        ]
    },
    {
        id: "4",
        name: "Uteo (Woven Trays)",
        category: "home",
        image: "images/uteo.jpg",
        description: "Traditional winnowing trays.",
        variations: [
            { size: "Small", price: 300 },
            { size: "Big", price: 700 }
        ]
    },
    {
        id: "5",
        name: "Mortar & Pestle",
        category: "home",
        image: "images/mortar_pestle.jpg",
        description: "Traditional mortar & pestle for grinding.",
        variations: [
            { size: "Standard", price: 500 }
        ]
    },
    {
        id: "6",
        name: "Kitchen Towels",
        category: "home",
        image: "images/kitchen_towel.jpg",
        description: "Absorbent cotton kitchen towels.",
        variations: [
            { size: "Small", price: 100 },
            { size: "Medium", price: 150 },
            { size: "Big", price: 200 }
        ]
    },
    {
        id: "7",
        name: "Reusable Bottle",
        category: "home",
        image: "images/1ltr_bottle_blue.jpg",
        description: "Reusable bottle available in 1ltr and 2ltr sizes.",
        colors: [
            { name: "Brown", value: "#8B5C2A", image: "images/1ltr_bottle_brown.jpg" },
            { name: "Blue", value: "#3B82F6", image: "images/1ltr_bottle_blue.jpg" }
        ],
        variations: [
            { size: "1ltr", price: 700, image: "images/bottle_0.5ltr.jpg" },
            { size: "2ltr", price: 1200, image: "images/bottle_1ltr.jpg" }
        ]
    },
    {
        id: "21",
        name: "Lunchbox",
        category: "home",
        image: "images/lunch_box.jpg",
        description: "Reusable lunchbox.",
        variations: [
            { price: 500 }
        ]
    },
    {
        id: "22",
        name: "Hand Pouch",
        category: "fashion",
        image: "images/hand_pouch_blue.jpg",
        description: "Stylish hand pouch available in multiple colors.",
        colors: [
            { name: "Blue", value: "#3B82F6", image: "images/hand_pouch_blue.jpg" },
            { name: "Maroon", value: "#800000", image: "images/hand_pouch_maroon.jpg" },
            { name: "Mixed Colors", value: "#888888", image: "images/hand_pouch_mixed.jpg" }
        ],
        variations: [
            { price: 500 }
        ]
    },
    {
        id: "8",
        name: "Gourds / Calabash",
        category: "home",
        image: "images/calabash.jpg",
        description: "Traditional gourds for storage or decor.",
        variations: [
            { size: "3ltr", price: 800 },
            { size: "5ltr", price: 1200 }
        ]
    },
    {
        id: "9",
        name: "Dera (Free size)",
        category: "fashion",
        image: "images/dera_orange.jpg",
        description: "Comfortable traditional dress.",
        colors: [
            { name: "Orange", value: "#FFA500", image: "images/dera_orange.jpg" },
            { name: "Yellow", value: "#FFFF00", image: "images/dera_yellow.jpg" }
        ],
        variations: [
            { price: 800 }
        ]
    },
    {
        id: "17",
        name: "Top Quality Dera with Scarf",
        category: "fashion",
        image: "images/top_dera_brown.jpg",
        description: "Top quality dera with matching scarf.",
        colors: [
            { name: "Brown", value: "#8B5C2A", image: "images/top_dera_brown.jpg" },
            { name: "Green", value: "#22C55E", image: "images/top_dera_green.jpg" },
            { name: "Blue", value: "#3B82F6", image: "images/top_dera_blue.jpg" }
        ],
        variations: [
            { price: 1600 }
        ]
    },
    {
        id: "10",
        name: "Leso (Wrap)",
        category: "fashion",
        image: "images/leso1.jpg",
        description: "Colorful traditional leso wraps.",
        variations: [
            { price: 1300 }
        ]
    },
    {
        id: "11",
        name: "Maasai Sandals",
        category: "fashion",
        image: "images/maasai_sandals_women.jpg",
        description: "Handcrafted Maasai bead sandals.",
        variations: [
            { price: 1500 }
        ]
    },
    {
        id: "18",
        name: "Maasai Sandals (Men)",
        category: "fashion",
        image: "images/maasai_sandals_men.jpg",
        description: "Handcrafted Maasai bead sandals for men.",
        variations: [
            { price: 1500 }
        ]
    },
    {
        id: "19",
        name: "Sisal Handbag",
        category: "fashion",
        image: "images/chondo_blacknwhite.jpg",
        description: "Beautifully crafted sisal handbag.",
        colors: [
            { name: "B/White", value: "#000000", image: "images/chondo_blacknwhite.jpg" },
            { name: "Blue", value: "#3B82F6", image: "images/chondo_blue.jpg" },
            { name: "Brown", value: "#8B5C2A", image: "images/chondo_brown.jpg" },
            { name: "Grey", value: "#808080", image: "images/chondo_grey.jpg" },
            { name: "Pink", value: "#FF69B4", image: "images/chondo_pink.jpg" },
            { name: "Yellow", value: "#FFD600", image: "images/chondo_yellow.jpg" },
            { name: "Red", value: "#FF0000", image: "images/chondo_red.jpg" }
        ],
        variations: [
            { price: 1600 }
        ]
    },
    {
        id: "12",
        name: "Crocs",
        category: "fashion",
        image: "images/crocs.jpg",
        description: "Lightweight and comfy crocs.",
        variations: [
            { type: "Type A", price: 700 },
            { type: "Type B", price: 1200 }
        ]
    },
    {
        id: "13",
        name: "Kids Shoes",
        category: "fashion",
        image: "images/baby_shoes_black.jpg",
        description: "Durable shoes for children.",
        colors: [
            { name: "Black", value: "#000000", image: "images/baby_shoes_black.jpg" },
            { name: "White", value: "#ccd5ae", image: "images/baby_shoes_white.jpg" }
        ],
        variations: [
            { size: "Standard", price: 1500 }
        ]
    },
    {
        id: "14",
        name: "Beaded Necklaces",
        category: "jewelry",
        image: "images/beaded_necklace_brown.jpg",
        description: "Colorful hand-beaded necklaces.",
        colors: [
            { name: "Brown", value: "#8B5C2A", image: "images/beaded_necklace_brown.jpg" },
            { name: "White", value: "#d5bdaf", image: "images/beaded_necklace_white.jpg" },
            { name: "Pink", value: "#FF69B4", image: "images/beaded_necklace_pink.jpg" },
            { name: "Red", value: "#FF0000", image: "images/beaded_necklace_red.jpg" }
        ],
        variations: [
            { price: 600 }
        ]
    },
    {
        id: "15",
        name: "Shangas (Beaded)",
        category: "jewelry",
        image: "images/ushanga_white.jpg",
        description: "Traditional Maasai beaded shangas.",
        variations: [
            { price: 500 }
        ]
    },
    {
        id: "16",
        name: "Bracelets / Earrings",
        category: "jewelry",
        image: "images/bracelet_earings.jpg",
        description: "Handmade beaded earrings and bracelets.",
        variations: [
            { price: 800 }
        ]
    }
    // ... (rest of your products)
];

// Helper to get products by category
function getProductsByCategory(category) {
  if (category === 'all') return products;
  return products.filter(p => p.category === category);
}

// Render products grouped by category
function renderProductsGrouped() {
    const groupedContainer = document.getElementById('products-grouped');
    if (!groupedContainer) return;
    // Define categories and their display names/emojis and section IDs
    const categories = [
        { key: 'home', label: '🛍️ Home & Living', sectionId: 'category-home' },
        { key: 'fashion', label: '👗 Fashion & Wearables', sectionId: 'category-fashion' },
        { key: 'jewelry', label: '💍 Jewelry & Shangas', sectionId: 'category-jewelry' }
    ];
    let html = '';
    categories.forEach(cat => {
        const catProducts = products.filter(p => p.category === cat.key);
        if (catProducts.length === 0) return;
        html += `<section id="${cat.sectionId}"><h3 class="text-2xl font-bold mb-6 mt-12 text-dark">${cat.label}</h3>`;
        html += '<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">';
        html += catProducts.map(product => {
            let variationHtml = '';
            let price = product.variations && product.variations.length > 0 ? product.variations[0].price : '';
            let variationData = '';
            // Color options
            let colorHtml = '';
            if (product.colors && product.colors.length > 0) {
                colorHtml = `<div class="mb-3 flex flex-wrap items-center gap-y-2" style="row-gap:6px;"><span class="block text-sm font-medium text-gray-700 mr-2">Color:</span>` +
                    product.colors.map((c, i) => `<span class="color-option color-text${i === 0 ? ' selected' : ''}" data-img="${c.image || product.image}" data-color="${c.value || ''}" title="${c.name}" style="color:${c.value || 'inherit'};font-weight:bold;cursor:pointer;margin-right:10px;min-width:60px;">${c.name}</span>`).join('') +
                    `</div>`;
            }
            if (product.variations && product.variations.length > 1) {
                const hasSize = product.variations.some(v => v.size);
                const hasType = product.variations.some(v => v.type);
                if (hasSize) {
                    variationHtml = `<div class="mb-3">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Size:</label>
                        <select class="size-selector w-full border rounded p-2 text-sm">
                            ${product.variations.map((v, i) => `<option value="${v.size}" data-price="${v.price}" ${i === 0 ? 'selected' : ''}>${v.size} - KSh ${v.price}</option>`).join('')}
                        </select>
                    </div>`;
                    variationData = 'size';
                } else if (hasType) {
                    variationHtml = `<div class="mb-3">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Type:</label>
                        <select class="type-selector w-full border rounded p-2 text-sm">
                            ${product.variations.map((v, i) => `<option value="${v.type}" data-price="${v.price}" ${i === 0 ? 'selected' : ''}>${v.type} - KSh ${v.price}</option>`).join('')}
                        </select>
                    </div>`;
                    variationData = 'type';
                }
            }
            // Determine initial image for card (first color image if available, else product.image)
            let initialImg = product.image;
            if (product.colors && product.colors.length > 0 && product.colors[0].image) {
                initialImg = product.colors[0].image;
            }
            return `
            <div class="product-card bg-white rounded-lg overflow-hidden shadow-md transition duration-300" data-category="${product.category}" data-id="${product.id}">
                <div class="relative overflow-hidden h-48 flex items-center justify-center">
                    <img src="${initialImg}" alt="${product.name}" class="w-full h-full object-cover product-img">
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-2">${product.name}</h3>
                    <p class="text-gray-600 text-sm mb-3">${product.description}</p>
                    ${colorHtml}
                    ${variationHtml}
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-primary product-price">KSh ${price}</span>
                        <div class="flex space-x-2">
                            <button class="view-details bg-gray-200 text-dark px-3 py-1 rounded text-sm hover:bg-gray-300 transition" data-id="${product.id}">View</button>
                            <button class="add-to-cart bg-secondary text-white px-3 py-1 rounded text-sm hover:bg-teal-600 transition" data-name="${product.name}" data-id="${product.id}" data-variation="${variationData}">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }).join('');
        html += '</div></section>';
    });
    groupedContainer.innerHTML = html;
    if (typeof attachProductEventListeners === "function") {
        attachProductEventListeners();
    }
}