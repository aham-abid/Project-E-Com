// FINAL fixed script.js (V4 - URL Input for BOTH Admin Add & Admin Edit)
(() => {
  const WA_PHONE = "8801897547953"; 

  const qs = id => document.getElementById(id);

  // load data
  let products = JSON.parse(localStorage.getItem("products") || "[]");
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  let lang = localStorage.getItem("lang") || "bn";
  let isAdmin = sessionStorage.getItem("isAdmin") === "true";

  let selectedCategory = "সব"; 

  // fallback default products if none
  if (!products || products.length === 0) {
    products = [
      { id: 1, name_bn: "আলু", name_en: "Potato", price: 80, image: "https://i.ibb.co/0cF1bVx/potato.jpg", desc: "তাজা দেশি আলু", category: "সবজি", min_qty: 5 },
      { id: 2, name_bn: "পেঁয়াজ", name_en: "Onion", price: 85, image: "https://i.ibb.co/5nbb2L3/onion.jpg", desc: "ঝাঁজালো পেঁয়াজ", category: "সবজি", min_qty: 5 },
      { id: 3, name_bn: "রসুন", name_en: "Garlic", price: 180, image: "https://i.ibb.co/SBgtzLt/garlic.jpg", desc: "মজাদার রসুন", category: "মশলা", min_qty: 1 },
      { id: 4, name_bn: "আদা", name_en: "Ginger", price: 150, image: "https://i.ibb.co/7RQXw1S/ginger.jpg", desc: "তাজা আদা", category: "মশলা", min_qty: 1 },
      { id: 5, name_bn: "ডাল", name_en: "Lentil", price: 140, image: "https://i.ibb.co/GJZxG9m/lentil.jpg", desc: "উচ্চমানের ডাল", category: "ডাল", min_qty: 5 },
      { id: 6, name_bn: "চিনি", name_en: "Sugar", price: 128, image: "https://i.ibb.co/BZcYZD2/sugar.jpg", desc: "শুদ্ধ চিনি", category: "চিনি", min_qty: 2 }
    ];
    // Ensure all products have min_qty, default to 1 if missing from old data
    products = products.map(p => ({...p, min_qty: p.min_qty || 1 }));
    localStorage.setItem("products", JSON.stringify(products));
  } else {
    // Ensure all loaded products have min_qty, default to 1 if missing from old data
    products = products.map(p => ({...p, min_qty: p.min_qty || 1 }));
  }

  /**
   * Saves data to localStorage and handles QuotaExceededError.
   * NOTE: This will only fail if non-image-URL data (cart, lang) grows too big, 
   * but the safety check remains good practice.
   * @returns {boolean} True if save was successful, false otherwise.
   */
  function saveAll() {
    try {
      localStorage.setItem("products", JSON.stringify(products));
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem("lang", lang);
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        alert((lang === "bn") ? "ত্রুটি: ডেটা সংরক্ষণের জায়গা পূর্ণ। অনুগ্রহ করে অপ্রয়োজনীয় পণ্য মুছে ফেলুন।" : "Error: Local storage limit reached. Please delete unnecessary products.");
      } else {
        console.error("Error saving to local storage:", e);
        alert((lang === "bn") ? "ডেটা সংরক্ষণে একটি অজানা ত্রুটি হয়েছে।" : "An unknown error occurred while saving data.");
      }
      return false; // Failure
    }
  }

  // small toast helper
  function toast(msg) {
    const t = document.createElement("div");
    t.textContent = msg;
    Object.assign(t.style, {
      position: "fixed",
      left: "50%",
      transform: "translateX(-50%)",
      bottom: "110px",
      background: "#1b5e20",
      color: "#fff",
      padding: "8px 14px",
      borderRadius: "8px",
      zIndex: 999999,
      fontSize: "14px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
    });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1500);
  }

  function placeholderImage() {
    return "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' rx='12' fill='#f4fff6'/></svg>`);
  }

  // CATEGORY RENDER (unchanged)
  function renderCategories() {
    const container = qs("categoryList");
    if (!container) return;
    
    // 1. Get all unique categories from the products list
    const productCategories = products.map(p => p.category).filter(Boolean);
    const uniqueCategories = [...new Set(productCategories)];

    // 2. Define the full list, starting with 'All' ("সব")
    const cats = ["সব", ...uniqueCategories].sort((a, b) => {
        if (a === "সব") return -1;
        if (b === "সব") return 1;
        return a.localeCompare(b, 'bn', { sensitivity: 'base' });
    });
    
    container.innerHTML = "";
    
    cats.forEach(c => {
      const pill = document.createElement("div");
      pill.className = "category-pill";
      
      // 3. Highlight the active category
      if (c === selectedCategory) {
        pill.classList.add("active");
      }

      pill.textContent = c;
      
      pill.onclick = () => {
        // 4. Update the state
        selectedCategory = c; 
        
        // 5. Re-render categories to show the new active pill
        renderCategories(); 
        
        // 6. Filter products and re-render grid
        if (c === "সব") renderProducts();
        else renderProducts(products.filter(p => p.category === c));
      };
      
      // 7. Append the pill to the container
      container.appendChild(pill);
    });
  }

  // SEARCH support (unchanged)
  const translit = {
    alu: "আলু",
    aloo: "আলু",
    peyaj: "পেঁয়াজ",
    peyajh: "পেঁয়াজ",
    onion: "পেঁয়াজ",
    rosun: "রসুন",
    roshun: "রসুন",
    garlic: "রসুন",
    ada: "আদা",
    ginger: "আদা",
    dal: "ডাল",
    lentil: "ডাল",
    chini: "চিনি",
    sugar: "চিনি"
  };

  // Render products (unchanged)
  function renderProducts(listArg) {
    const grid = qs("productGrid");
    if (!grid) return;
    const rawQ = (qs("searchInput") && qs("searchInput").value) ? String(qs("searchInput").value).trim() : "";
    const q = rawQ.toLowerCase();
    
    let ds = Array.isArray(listArg) ? listArg.slice() : products.slice();

    if (!listArg && selectedCategory !== "সব") {
      ds = ds.filter(p => p.category === selectedCategory);
    }

    if (q) {
      const isLatin = /[a-zA-Z]/.test(q);
      ds = ds.filter(p => {
        const bn = p.name_bn ? String(p.name_bn) : "";
        const en = p.name_en ? String(p.name_en).toLowerCase() : "";
        if (isLatin) {
          if (en.includes(q)) return true;
          if (translit[q] && bn.includes(translit[q])) return true;
          return false;
        } else {
          // bangla input
          if (bn.includes(q)) return true;
          const revKey = Object.keys(translit).find(k => translit[k] === q);
          if (revKey && en.includes(revKey)) return true;
          return false;
        }
      });
    }

    grid.innerHTML = "";
    if (!ds.length) {
      grid.innerHTML = `<div style="padding:18px;text-align:center;color:#888;">${lang === "bn" ? "কোন পণ্য পাওয়া যায়নি" : "No products found"}</div>`;
      return;
    }

    ds.forEach(p => {
      const card = document.createElement("div");
      card.className = "card";
      const img = p.image || placeholderImage();
      const title = (lang === "bn") ? p.name_bn : (p.name_en || p.name_bn);
      
      // Display minimum quantity hint
      const qtyHint = p.min_qty && p.min_qty > 1 
        ? `<div style="font-size: 0.8em; color: var(--muted); padding: 0 15px 5px;">Min: ${p.min_qty}kg</div>`
        : '';

      card.innerHTML = `
        <img src="${img}" alt="${title}" />
        <h4>${title}</h4>
        <div class="desc">${p.desc || ""}</div>
        <div class="price">৳${p.price} / kg</div>
        ${qtyHint}
        <div class="actions"></div>
      `;
      const actions = card.querySelector(".actions");
      if (isAdmin) {
        // Edit button
        const editBtn = document.createElement("button");
        editBtn.className = "small-btn edit-btn";
        editBtn.textContent = "✏️ Edit";
        editBtn.addEventListener("click", () => onEdit(p.id));
        actions.appendChild(editBtn);
        // Remove button
        const delBtn = document.createElement("button");
        delBtn.className = "small-btn danger-btn";
        delBtn.textContent = "🗑️ Remove";
        delBtn.addEventListener("click", () => onRemove(p.id));
        actions.appendChild(delBtn);
      } else {
        const addBtn = document.createElement("button");
        addBtn.className = "small-btn add-btn";
        addBtn.textContent = lang === "bn" ? "অর্ডার করুন" : "Add";
        
        addBtn.addEventListener("click", () => addToCart(p.id)); 
        
        actions.appendChild(addBtn);
      }
      grid.appendChild(card);
    });
  }

  // ADMIN: remove product (unchanged)
  function onRemove(id) {
    if (!isAdmin) return alert("Only admin can remove");
    const found = products.find(p => p.id === id);
    if (!found) return alert("Product not found");
    if (!confirm((lang === "bn") ? "আপনি কি এই পণ্যটি মুছে ফেলতে চান?" : "Are you sure you want to remove this product?")) return;
    products = products.filter(p => p.id !== id);
    saveAll();
    renderCategories(); 
    renderProducts();
    toast((lang === "bn") ? "🗑️ পণ্যটি মুছে ফেলা হয়েছে" : "Product removed");
  }

  // ADMIN EDIT LOGIC (UPDATED)
  function closeEdit() {
    const popup = qs("productEditPopup");
    if (popup) {
        // Reset the image URL input 
        const urlInput = qs("edit_image_url");
        if (urlInput) urlInput.value = ""; 
        popup.style.display = "none";
        popup.setAttribute("aria-hidden", "true");
        // Reset custom position if it was dragged
        const panel = popup.querySelector('.popup-panel');
        if (panel) {
            panel.style.position = ''; 
            panel.style.left = '';
            panel.style.top = '';
            panel.style.transform = '';
        }
    }
  }

  function finalizeSave() {
    if (saveAll()) { // Check for successful save
        renderCategories(); 
        renderProducts();
        closeEdit();
        toast((lang === "bn") ? "✅ পণ্য আপডেট করা হয়েছে" : "✅ Product updated");
    }
    // If save fails, the alert in saveAll runs, and we stay in the edit popup.
  }

  function saveEdit() {
    const id = parseInt(qs("edit_product_id").value);
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) {
        alert("Error: Product ID not found for editing.");
        closeEdit();
        return;
    }

    const p = products[idx];
    
    // 1. Get values from popup
    const bn = qs("edit_name_bn").value.trim();
    const en = qs("edit_name_en").value.trim();
    const pr = parseFloat(qs("edit_price").value.trim());
    const minQty = parseFloat(qs("edit_min_qty").value.trim());
    const cat = qs("edit_category").value;
    // UPDATED: Get URL from the new input field
    const imageURL = qs("edit_image_url").value.trim(); 
    
    if (!bn || isNaN(pr) || pr <= 0) {
        alert((lang === "bn") ? "সঠিক নাম ও মূল্য দিন" : "Please provide valid name and price");
        return;
    }
    if (isNaN(minQty) || minQty <= 0) {
        alert((lang === "bn") ? "সঠিক ন্যূনতম পরিমাণ দিন" : "Please provide valid minimum quantity");
        return;
    }
    // NEW Check: Require Image URL
    if (!imageURL) {
        alert((lang === "bn") ? "পাবলিক ইমেজ লিঙ্ক দিন" : "Please provide a public image link");
        return;
    }

    // 2. Apply changes to in-memory object
    p.name_bn = bn;
    p.name_en = en || bn;
    p.price = pr;
    p.min_qty = minQty;
    p.category = cat;
    p.image = imageURL; // Save the new URL

    // 3. Finalize the save
    finalizeSave();
  }

  function onEdit(id) {
    if (!isAdmin) return alert("Only admin");
    const p = products.find(x => x.id === id);
    if (!p) {
        alert("Product not found");
        return;
    }
    
    // Fill popup with product data
    qs("edit_product_id").value = p.id;
    qs("edit_name_bn").value = p.name_bn || "";
    qs("edit_name_en").value = p.name_en || "";
    qs("edit_price").value = p.price;
    qs("edit_min_qty").value = p.min_qty;
    qs("edit_category").value = p.category || "অন্যান্য";
    
    // UPDATED: Fill the new URL input with the current image URL
    const urlInput = qs("edit_image_url");
    if (urlInput) urlInput.value = p.image || ""; 

    const preview = qs("edit_image_preview");
    if (p.image) {
        preview.src = p.image;
        preview.style.display = "block";
    } else {
        preview.src = "";
        preview.style.display = "none";
    }
    
    // Show popup
    const popup = qs("productEditPopup");
    if (popup) {
        popup.style.display = "flex";
        popup.setAttribute("aria-hidden", "false");
    }
  }

  // CART helpers (unchanged)
  function updateCartCount() {
    const el = qs("cartCount");
    if (!el) return;
    const totalQty = cart.reduce((s, it) => s + (it.qty || 0), 0);
    el.textContent = totalQty;
  }

  function addToCart(id) {
    const p = products.find(x => x.id === id);
    if (!p) { toast("Product not found"); return; }
    
    // Use product-specific minimum quantity
    const minQty = p.min_qty || 1; 
    
    const existing = cart.find(c => c.id === id);
    if (existing) existing.qty += minQty;
    else cart.push({ id: p.id, name_bn: p.name_bn, name_en: p.name_en, price: p.price, qty: minQty, min_qty: minQty }); // Store min_qty in cart item
    
    saveAll();
    updateCartCount();
    
    // Instantly refresh UI elements
    renderCartItems(); 
    openCart();        
    
    toast((lang === "bn") ? "কার্টে যোগ হয়েছে" : "Added to cart");
  }

  function renderCartItems() {
    const container = qs("cartItems");
    const totalBlock = qs("cartTotalBlock");
    if (!container) return;
    container.innerHTML = "";
    if (!cart.length) {
      container.innerHTML = `<div style="padding:12px;color:#666;">${(lang === "bn") ? "আপনার কার্ট খালি।" : "Your cart is empty."}</div>`;
      if (totalBlock) totalBlock.innerHTML = "";
      return;
    }
    let total = 0;
    cart.forEach((it, idx) => {
      const sub = (it.price || 0) * (it.qty || 0);
      total += sub;
      
      const minQty = it.min_qty || 1; // Use product-specific min_qty
      
      const row = document.createElement("div");
      row.className = "cart-item";
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.alignItems = "center";
      
      const qtyText = `kg (${(lang === "bn") ? "কমপক্ষে" : "Min"}: ${minQty}kg)`;

      // UPDATED HTML to include + and - buttons
      row.innerHTML = `
        <div style="flex:1">
          <div style="font-weight:700">${(lang === "bn") ? it.name_bn : it.name_en}</div>
          <div style="font-size:13px;color:#666">৳${it.price} × ${it.qty}${qtyText} = ৳${sub}</div>
        </div>
        <div class="cart-qty-controls">
          <button class="qty-btn decrement-btn" data-id="${it.id}">-</button>
          <input type="number" min="${minQty}" value="${it.qty}" data-id="${it.id}" />
          <button class="qty-btn increment-btn" data-id="${it.id}">+</button>
          <button class="small-btn danger-btn remove-btn">❌ Remove</button>
        </div>
      `;
      const input = row.querySelector("input");
      const removeBtn = row.querySelector(".remove-btn");
      const incrementBtn = row.querySelector(".increment-btn");
      const decrementBtn = row.querySelector(".decrement-btn");
      
      // Helper function to update quantity and refresh cart
      const updateQty = (newQty) => {
          let v = parseInt(newQty, 10);
          if (isNaN(v) || v < minQty) {
              alert((lang === "bn") ? `ন্যূনতম ${minQty} কেজি প্রয়োজন` : `Minimum ${minQty}kg required`);
              v = minQty;
          }
          it.qty = v;
          saveAll();
          renderCartItems();
          updateCartCount();
      };
      
      // Input change listener
      input.addEventListener("change", (e) => {
        let valRaw = String(e.target.value || "");
        // convert bangla digits to latin if any
        const bnDigits = { "০":"0","১":"1","২":"2","৩":"3","৪":"4","৫":"5","৬":"6","৭":"7","৮":"8","৯":"9" };
        valRaw = valRaw.replace(/[০১২৩৪৫৬৭৮৯]/g, d => bnDigits[d] || d);
        updateQty(valRaw.replace(/[^\d]/g,""));
      });
      
      // Increment button listener
      incrementBtn.addEventListener("click", () => {
          updateQty(it.qty + 1);
      });
      
      // Decrement button listener
      decrementBtn.addEventListener("click", () => {
          // Prevent going below min_qty
          const newQty = it.qty - 1;
          if (newQty >= minQty) {
              updateQty(newQty);
          } else {
              alert((lang === "bn") ? `ন্যূনতম ${minQty} কেজি প্রয়োজন` : `Minimum ${minQty}kg required`);
          }
      });
      
      // Remove button listener
      removeBtn.addEventListener("click", () => {
        cart.splice(idx, 1);
        saveAll();
        renderCartItems();
        updateCartCount();
      });

      container.appendChild(row);
    });
    if (totalBlock) totalBlock.innerHTML = `<div style="font-weight:900;text-align:right">${(lang === "bn") ? "মোট:" : "Total"}: ৳${total}</div>`;
  }

  // Cart popup control (unchanged)
  function openCart() {
    const popup = qs("cartPopup");
    if (!popup) return;
    renderCartItems();
    popup.style.display = "flex";
    popup.setAttribute("aria-hidden", "false");
  }
  function closeCart() {
    const popup = qs("cartPopup");
    if (!popup) return;
    popup.style.display = "none";
    popup.setAttribute("aria-hidden", "true");
  }

  // Confirm order -> WhatsApp (unchanged)
  function confirmOrder() {
    if (!cart.length) { alert((lang === "bn") ? "আপনার কার্ট খালি" : "Your cart is empty"); return; }
    
    // Validate against product-specific minimum quantity
    const bad = cart.find(i => (i.qty || 0) < (i.min_qty || 1)); 
    if (bad) { 
      const minQty = bad.min_qty || 1;
      alert((lang === "bn") ? `ন্যূনতম ${minQty} কেজি প্রয়োজন: ${bad.name_bn}` : `Minimum ${minQty}kg required: ${bad.name_en}`); 
      return; 
    }
    
    const note = (qs("cartNote") && qs("cartNote").value) ? qs("cartNote").value.trim() : "";
    let total = 0;
    let msg = (lang === "bn") ? "🛒 Climax Online Shop - নতুন অর্ডার\n\n" : "🛒 Climax Online Shop - New Order\n\n";
    cart.forEach((it, idx) => {
      const sub = it.price * it.qty;
      total += sub;
      msg += `${idx+1}. ${(lang === "bn") ? it.name_bn : it.name_en} — ${it.qty}kg × ৳${it.price} = ৳${sub}\n`;
    });
    msg += `\n${(lang === "bn") ? "মোট বিল" : "Total"}: ৳${total}\n`;
    if (note) msg += `${(lang === "bn") ? "নোট/ঠিকানা" : "Note/Address"}: ${note}\n`;
    msg += `\n${(lang === "bn") ? "ফোন" : "Phone"}: +880${WA_PHONE}`;
    const waUrl = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
    // clear cart after sending
    cart = [];
    saveAll();
    updateCartCount();
    closeCart();
    toast((lang === "bn") ? "অর্ডার WhatsApp-এ পাঠানো হয়েছে!" : "Order sent to WhatsApp!");
  }

  // function to handle image URL preview
  function handleImageUrlChange(urlInputId, previewId) {
    const urlInput = qs(urlInputId);
    const preview = qs(previewId);
    if (!urlInput || !preview) return;

    const url = urlInput.value.trim();
    if (url && (url.startsWith('http') || url.startsWith('data:'))) {
        preview.src = url;
        preview.style.display = "block";
    } else {
        preview.src = "";
        preview.style.display = "none";
    }
  }

  // ADMIN: image preview handlers
  function adminImageUrlChanged() {
    handleImageUrlChange("admin_image_url", "admin_image_preview");
  }
  // NEW: Image URL change handler for EDIT
  function editImageUrlChanged() {
    handleImageUrlChange("edit_image_url", "edit_image_preview");
  }


  // ADMIN: add product (UNCHANGED from last update)
  function adminAdd() {
    const nameBnEl = qs("admin_name_bn");
    const nameEnEl = qs("admin_name_en");
    const priceEl = qs("admin_price");
    const minQtyEl = qs("admin_min_qty"); 
    const categoryEl = qs("admin_category");
    const imageUrlEl = qs("admin_image_url"); 
    
    if (!nameBnEl || !priceEl || !minQtyEl || !imageUrlEl) return alert("Admin fields missing in HTML structure");

    const bn = nameBnEl.value.trim();
    const en = (nameEnEl && nameEnEl.value.trim()) || bn;
    const pr = parseFloat(priceEl.value.trim()); 
    const minQty = parseFloat(minQtyEl.value.trim()); 
    const cat = (categoryEl && categoryEl.value) || "অন্যান্য";
    const imageSrc = imageUrlEl.value.trim(); // Get the URL

    if (!bn || isNaN(pr) || pr <= 0) return alert((lang === "bn") ? "সঠিক নাম ও মূল্য দিন" : "Please provide valid name and price");
    if (isNaN(minQty) || minQty <= 0) return alert((lang === "bn") ? "সঠিক ন্যূনতম পরিমাণ দিন" : "Please provide valid minimum quantity");
    if (!imageSrc) return alert((lang === "bn") ? "পাবলিক ইমেজ লিঙ্ক দিন" : "Please provide a public image link");

    const id = Date.now();

    // 1. Add product to the in-memory array
    products.push({
      id,
      name_bn: bn,
      name_en: en,
      price: pr,
      image: imageSrc, // Save the public URL
      desc: "",
      category: cat,
      min_qty: minQty 
    });

    // 2. Attempt to save all products
    const saveSuccess = saveAll();

    // 3. Handle success or failure
    if (!saveSuccess) {
        // If saving fails (e.g., QuotaExceededError), remove the product that was just added
        products.pop();
        renderCategories(); 
        renderProducts();
        return; // Stop execution
    }

    // reset admin form
    nameBnEl.value = "";
    nameEnEl.value = "";
    priceEl.value = "";
    minQtyEl.value = "1"; // Reset min_qty
    imageUrlEl.value = ""; // Reset URL field
    const preview = qs("admin_image_preview");
    if (preview) {
      preview.style.display = "none";
      preview.src = "";
    }

    renderCategories(); 
    renderProducts();
    toast((lang === "bn") ? "নতুন পণ্য যোগ হয়েছে" : "Product added");
  }


  // ADMIN: logout (unchanged)
  function adminLogout() {
    isAdmin = false;
    sessionStorage.removeItem("isAdmin");
    const panel = qs("adminPanel");
    if (panel) panel.style.display = "none";
    renderProducts();
    toast((lang === "bn") ? "Admin logged out" : "Admin logged out");
  }

  // keyboard admin login (Ctrl + A) (unchanged)
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "a") {
      const user = prompt("Admin Username:");
      const pass = prompt("Admin Password:");
      if (user === "Climax&Trade" && pass === "Climax&tradetrust") {
        isAdmin = true;
        sessionStorage.setItem("isAdmin", "true");
        const panel = qs("adminPanel");
        if (panel) {
          panel.style.display = "flex"; 
          panel.style.zIndex = 999999;
        }
        renderProducts();
        toast("🔐 Admin Mode Active");
      } else {
        alert((lang === "bn") ? "ভুল লগইন তথ্য!" : "Wrong credentials!");
      }
    }
  });

  // Safe DOM wiring on load
  document.addEventListener("DOMContentLoaded", () => {
    // wire search
    const sBtn = qs("searchBtn");
    const sInput = qs("searchInput");
    if (sBtn) sBtn.addEventListener("click", () => renderProducts());
    if (sInput) sInput.addEventListener("keyup", (e) => { if (e.key === "Enter") renderProducts(); });


    // Make admin panel and edit panel draggable (unchanged)
    (function makePanelsDraggable() {
      const adminPanel = document.getElementById("adminPanel");
      const editPanel = document.querySelector("#productEditPopup .popup-panel"); 

      [adminPanel, editPanel].filter(p => p !== null).forEach(panel => {
        let isDragging = false;
        let offsetX = 0, offsetY = 0;

        let dragHandle = panel.querySelector('h4') || panel.querySelector('.popup-header') || panel;
        if (dragHandle && dragHandle !== panel) {
            dragHandle.style.cursor = 'grab';
        }

        panel.addEventListener("mousedown", (e) => {
          if (e.target.tagName === "INPUT" || 
              e.target.tagName === "BUTTON" || 
              e.target.tagName === "SELECT" || 
              e.target.tagName === "TEXTAREA" || 
              e.target.id.includes("image_preview") || 
              e.target.id === "closeCart" ||
              e.target.id === "editCancelCloseBtn"
          ) {
              return;
          }
          
          if (panel.closest("#productEditPopup")) { 
              const rect = panel.getBoundingClientRect();
              panel.style.position = 'fixed';
              panel.style.margin = '0'; 
              panel.style.left = rect.left + 'px';
              panel.style.top = rect.top + 'px';
          } else {
              panel.style.position = 'fixed'; 
          }

          isDragging = true;
          offsetX = e.clientX - panel.getBoundingClientRect().left;
          offsetY = e.clientY - panel.getBoundingClientRect().top;
          
          document.body.style.cursor = "grabbing"; 
          panel.style.cursor = "grabbing";
          if (dragHandle && dragHandle !== panel) {
            dragHandle.style.cursor = 'grabbing';
          }
        });

        document.addEventListener("mousemove", (e) => {
          if (!isDragging) return;
          panel.style.left = e.clientX - offsetX + "px";
          panel.style.top = e.clientY - offsetY + "px";
          panel.style.transform = "translate(0,0)";
        });

        document.addEventListener("mouseup", () => {
          if (!isDragging) return;
          isDragging = false;
          
          document.body.style.cursor = "default";
          const defaultCursor = 'grab'; 
          panel.style.cursor = defaultCursor;
          if (dragHandle && dragHandle !== panel) {
            dragHandle.style.cursor = 'grab'; 
          }
        });
      });
    })();


    // theme toggle (unchanged)
    const themeBtn = qs("themeToggle");
    if (themeBtn) themeBtn.addEventListener("click", () => document.body.classList.toggle("dark-mode"));

    // lang toggle (unchanged)
    const langBtn = qs("langToggle");
    if (langBtn) {
      langBtn.textContent = (lang === "bn") ? "English" : "বাংলা";
      langBtn.addEventListener("click", () => {
        lang = (lang === "bn") ? "en" : "bn";
        langBtn.textContent = (lang === "bn") ? "English" : "বাংলা";
        saveAll();
        renderCategories(); 
        renderProducts();
      });
    }

    // cart popup buttons (unchanged)
    const cartBtn = qs("cartFloating");
    if (cartBtn) cartBtn.addEventListener("click", openCart);
    const closeCartBtn = qs("closeCart");
    if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
    const confirmBtn = qs("confirmOrder");
    if (confirmBtn) confirmBtn.addEventListener("click", confirmOrder);

    // admin panel controls 
    const adminAddBtn = qs("adminAddBtn");
    const adminCloseBtn = qs("adminClose");
    const adminUrlInput = qs("admin_image_url"); 
    const adminPanel = qs("adminPanel");
    const adminPanelFooter = qs("adminPanelFooter");

    if (adminAddBtn) adminAddBtn.addEventListener("click", adminAdd);
    if (adminCloseBtn) adminCloseBtn.addEventListener("click", () => {
      if (adminPanel) {
        adminPanel.style.display = "none";
        adminPanel.style.left = '';
        adminPanel.style.top = '';
        adminPanel.style.transform = '';
      }
    });
    // Wire up Admin ADD URL input for preview
    if (adminUrlInput) adminUrlInput.addEventListener("input", adminImageUrlChanged);
    
    // New edit panel controls 
    const editSaveBtn = qs("editSaveBtn");
    const editCancelBtn = qs("editCancelBtn");
    const editCancelCloseBtn = qs("editCancelCloseBtn");
    // NEW: Get the URL input for the edit panel
    const editUrlInput = qs("edit_image_url");

    if (editSaveBtn) editSaveBtn.addEventListener("click", saveEdit);
    if (editCancelBtn) editCancelBtn.addEventListener("click", closeEdit);
    if (editCancelCloseBtn) editCancelCloseBtn.addEventListener("click", closeEdit);
    // NEW: Wire up Admin EDIT URL input for preview
    if (editUrlInput) editUrlInput.addEventListener("input", editImageUrlChanged);


    // add logout inside panel 
    if (adminPanel && adminPanelFooter) {
      if (!qs("adminLogoutBtn")) {
          const logout = document.createElement("button");
          logout.id = "adminLogoutBtn";
          logout.className = "btn-secondary";
          logout.style.marginTop = "8px";
          logout.textContent = "Logout Admin"; 
          logout.addEventListener("click", adminLogout);
          adminPanelFooter.appendChild(logout);
      }
    }

    // ensure admin panel z-index so visible on top
    if (adminPanel) adminPanel.style.zIndex = 999999;

    // initial UI render
    renderCategories();
    renderProducts();
    updateCartCount();
  });

  // expose for debug/old inline handlers (keeps compatibility)
  window.addToCart = addToCart;
  window.openCart = openCart;
  window.closeCart = closeCart;
  window.renderProducts = renderProducts;
})();