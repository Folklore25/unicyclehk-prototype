const DEFAULT_PRODUCTS = [
  { id: 1, title: "Solid wood dining table", category: "Furniture", price: 320, condition: "Good condition", location: "CityU residence", time: "12 min ago", age: 12, seller: "Amelia", initials: "AL", rating: "4.9 · 18 exchanges", image: 0, description: "Compact solid wood table from a student flat. Comfortable for two people and also works well as a study desk. A few light surface marks from normal use.", pickup: "Student residence lobby" },
  { id: 2, title: "Stainless steel electric kettle", category: "Appliances", price: 70, condition: "Good condition", location: "Kowloon Tong", time: "28 min ago", age: 28, seller: "Rohan", initials: "RK", rating: "4.8 · 11 exchanges", image: 1, description: "1.7L electric kettle in full working order. Used for one academic year, cleaned and descaled before listing. Selling because I am leaving Hong Kong.", pickup: "Kowloon Tong MTR Exit C" },
  { id: 3, title: "Black mesh office chair", category: "Furniture", price: 180, condition: "Well kept", location: "Festival Walk", time: "1 hr ago", age: 60, seller: "Minji", initials: "MK", rating: "5.0 · 9 exchanges", image: 2, description: "Comfortable mesh chair with adjustable height and armrests. The wheels and gas lift work properly. Ideal for studying at home.", pickup: "Festival Walk atrium" },
  { id: 4, title: "Yoga mat with carry strap", category: "Lifestyle", price: 45, condition: "Lightly used", location: "CityU main campus", time: "2 hrs ago", age: 120, seller: "Nora", initials: "NZ", rating: "4.9 · 7 exchanges", image: 3, description: "Purple exercise mat with carrying strap. Used only a few times, wiped clean and ready to go. Easy to carry to the sports centre.", pickup: "CityU main entrance" },
  { id: 5, title: "Portable induction cooker", category: "Appliances", price: 110, condition: "Works perfectly", location: "Shek Kip Mei", time: "Yesterday", age: 1440, seller: "Santiago", initials: "SM", rating: "4.7 · 14 exchanges", image: 4, description: "Single-zone induction cooker suitable for a small flat. All controls work and the cable is intact. Visible surface scratches do not affect use.", pickup: "Shek Kip Mei MTR Exit B2" },
  { id: 6, title: "Floor lamp with bedside shelf", category: "Furniture", price: 90, condition: "Good condition", location: "CityU residence", time: "Yesterday", age: 1500, seller: "Eva", initials: "ET", rating: "4.9 · 22 exchanges", image: 5, description: "Warm floor lamp with two small shelves for books or bedside items. Bulb included. Slim design fits comfortably in a compact student room.", pickup: "Student residence lobby" },
];

const STORAGE_KEY = "unicyclehk-demo-v4";
localStorage.removeItem("unicyclehk-demo-v3");
const DEFAULT_SAVED = [2, 5];
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const money = (value) => `HK$${Number(value).toLocaleString("en-HK")}`;
const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);

function loadPersistedState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

const persisted = loadPersistedState();
let products = [...(Array.isArray(persisted.products) ? persisted.products : []), ...DEFAULT_PRODUCTS];
const state = {
  query: "", category: "All", sort: "recommended", route: "home",
  saved: new Set(Array.isArray(persisted.saved) ? persisted.saved : DEFAULT_SAVED),
  activeProduct: products[0], formStep: 1, rating: 0,
  messages: persisted.messages || {}, reviews: persisted.reviews || {},
  draft: persisted.draft || null, photoData: persisted.draft?.photoData || null,
  installPrompt: null,
};

const grid = $("#productGrid");
const emptyState = $("#emptyState");
const resultCount = $("#resultCount");
const savedCount = $("#savedCount");
const searchInput = $("#searchInput");
const sortSelect = $("#sortSelect");
const toast = $("#toast");
const toastText = $("#toastText");

function icon(name) { return `<svg aria-hidden="true"><use href="#i-${name}"></use></svg>`; }

function showToast(message) {
  toastText.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3300);
}

function persistState({ quiet = true } = {}) {
  const data = { products: products.filter((product) => product.local), saved: [...state.saved], messages: state.messages, reviews: state.reviews, draft: state.draft };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); return true; }
  catch { if (!quiet) showToast("This browser is out of local storage space"); return false; }
}

function findProduct(id) { return products.find((product) => String(product.id) === String(id)); }

function productImageMarkup(product, extraClass = "", label = product.title) {
  if (product.imageData) return `<div class="product-image custom-image ${extraClass}" style="background-image:url('${product.imageData}')" role="img" aria-label="${escapeHtml(label)}"></div>`;
  return `<div class="product-image sprite-${product.image} ${extraClass}" role="img" aria-label="${escapeHtml(label)}"></div>`;
}

function productCard(product, index) {
  const saved = state.saved.has(product.id);
  return `<article class="product-card" style="animation-delay:${Math.min(index * 45, 220)}ms">
    <button class="card-open" data-product="${escapeHtml(product.id)}" aria-label="View ${escapeHtml(product.title)}">
      ${productImageMarkup(product, "", `${product.title} photographed in a student flat`)}
      <div class="product-body">
        <div class="product-meta"><span>${icon("map")}${escapeHtml(product.location)}</span><span>${escapeHtml(product.time)}</span></div>
        <h3 class="product-title">${escapeHtml(product.title)}</h3>
        <div class="product-footer"><strong class="price">${money(product.price)}</strong><span class="seller-line">${escapeHtml(product.seller)}<i class="verified-mini">${icon("check")}</i></span></div>
      </div>
    </button>
    <span class="condition-badge">${escapeHtml(product.condition)}</span>
    <button class="heart-button ${saved ? "saved" : ""}" data-save="${escapeHtml(product.id)}" aria-label="${saved ? "Remove from" : "Add to"} saved items" aria-pressed="${saved}">${icon("heart")}</button>
  </article>`;
}

function filteredProducts() {
  const query = state.query.trim().toLowerCase();
  const list = products.filter((product) => {
    const categoryMatch = state.category === "All" || product.category === state.category;
    const queryMatch = !query || `${product.title} ${product.category} ${product.location}`.toLowerCase().includes(query);
    return categoryMatch && queryMatch;
  });
  if (state.sort === "priceLow") return [...list].sort((a, b) => a.price - b.price);
  if (state.sort === "newest") return [...list].sort((a, b) => a.age - b.age);
  return list;
}

function renderProducts(list = filteredProducts(), label = null) {
  grid.innerHTML = list.map(productCard).join("");
  emptyState.hidden = list.length > 0;
  grid.hidden = list.length === 0;
  resultCount.textContent = label || `${list.length} ${list.length === 1 ? "item" : "items"} from verified students`;
  savedCount.textContent = state.saved.size;
}

function renderCurrentMarket() {
  if (state.route === "saved") {
    const savedProducts = products.filter((product) => state.saved.has(product.id));
    renderProducts(savedProducts, `${savedProducts.length} saved ${savedProducts.length === 1 ? "item" : "items"}`);
    $("#market-title").textContent = "Saved for later";
    return;
  }
  $("#market-title").textContent = "Recommended near you";
  renderProducts();
}

function openDialog(dialog) { if (dialog && !dialog.open) dialog.showModal(); }
function closeAllOverlays() {
  $$("dialog[open]").forEach((dialog) => dialog.close());
  $("#chatPanel").classList.remove("open");
  $("#chatPanel").setAttribute("aria-hidden", "true");
}

function openProductView(product) {
  if (!product) return;
  state.activeProduct = product;
  const saved = state.saved.has(product.id);
  $("#productDialogContent").innerHTML = `<div class="product-detail">
    <div class="detail-visual">${productImageMarkup(product, "", `${product.title} in the seller's home`)}</div>
    <div class="detail-content">
      <p class="eyebrow">${escapeHtml(product.category)} · ${escapeHtml(product.condition)}</p>
      <h2>${escapeHtml(product.title)}</h2><p class="detail-price">${money(product.price)}</p>
      <p class="detail-description">${escapeHtml(product.description)}</p>
      <div class="detail-facts"><div class="detail-fact"><small>Preferred handover</small><strong>${escapeHtml(product.pickup)}</strong></div><div class="detail-fact"><small>Listed</small><strong>${escapeHtml(product.time)}</strong></div></div>
      <div class="seller-card"><div class="avatar seller-avatar">${escapeHtml(product.initials)}</div><div><strong>${escapeHtml(product.seller)}</strong><span>Verified student seller</span></div><span class="seller-rating">${escapeHtml(product.rating)}</span></div>
      <div class="detail-actions"><button class="primary-button" id="messageSeller">${icon("message")}Message seller</button><button class="secondary-button" id="detailSave" aria-pressed="${saved}">${icon("heart")}${saved ? "Saved" : "Save"}</button><button class="secondary-button share-button" id="shareItem">${icon("share")}Share</button></div>
      <p class="safe-line">${icon("shield")}Meet in a public campus location. Inspect the item before paying.</p>
    </div>
  </div>`;
  openDialog($("#productDialog"));
  $("#messageSeller").addEventListener("click", () => navigate(`messages-${product.id}`));
  $("#detailSave").addEventListener("click", (event) => {
    toggleSave(product.id);
    const isSaved = state.saved.has(product.id);
    event.currentTarget.setAttribute("aria-pressed", isSaved);
    event.currentTarget.innerHTML = `${icon("heart")}${isSaved ? "Saved" : "Save"}`;
  });
  $("#shareItem").addEventListener("click", () => shareProduct(product));
}

function toggleSave(id) {
  if (state.saved.has(id)) { state.saved.delete(id); showToast("Removed from saved items"); }
  else { state.saved.add(id); showToast("Saved for later"); }
  persistState();
  renderCurrentMarket();
}

function defaultThread(product) {
  return [
    { from: "received", text: `Hi! Yes, the ${product.title.toLowerCase()} is still available.` },
    { from: "sent", text: "Great, could we meet on campus?" },
    { from: "received", text: `${product.pickup} works for me.` },
  ];
}

function threadFor(product) {
  const key = String(product.id);
  if (!Array.isArray(state.messages[key])) state.messages[key] = defaultThread(product);
  return state.messages[key];
}

function renderMessages(product) {
  $("#messages").innerHTML = `<p class="day-label">Today</p>${threadFor(product).map((message) => `<div class="bubble ${message.from}">${escapeHtml(message.text)}</div>`).join("")}`;
  $("#messages").scrollTop = $("#messages").scrollHeight;
}

function openChatView(product) {
  if (!product) return;
  state.activeProduct = product;
  $("#chatSeller").textContent = product.seller;
  $("#chatItem").innerHTML = `${productImageMarkup(product, "mini-thumb")}<div><small>About this item</small><strong>${escapeHtml(product.title)}</strong><span>${money(product.price)}</span></div>`;
  renderMessages(product);
  $("#chatPanel").classList.add("open");
  $("#chatPanel").setAttribute("aria-hidden", "false");
  setTimeout(() => $("#messageInput").focus(), 180);
}

function sendMessage(text) {
  const cleanText = text.trim();
  if (!cleanText || !state.activeProduct) return;
  const thread = threadFor(state.activeProduct);
  thread.push({ from: "sent", text: cleanText });
  $("#messageInput").value = "";
  persistState();
  renderMessages(state.activeProduct);
  setTimeout(() => {
    thread.push({ from: "received", text: "Sounds good. I’ll confirm the handover time here." });
    persistState();
    renderMessages(state.activeProduct);
  }, 550);
}

function updateFormStep() {
  $$(".form-step").forEach((step) => step.classList.toggle("active", Number(step.dataset.step) === state.formStep));
  $$(".stepper span").forEach((step, index) => step.classList.toggle("active", index + 1 <= state.formStep));
  $("#formBack").disabled = state.formStep === 1;
  $("#formNext").hidden = state.formStep === 3;
  $("#formPublish").hidden = state.formStep !== 3;
  $("#stepLabel").textContent = ["Item details", "Price & handover", "Review listing"][state.formStep - 1];
  if (state.formStep === 3) $("#previewTitle").textContent = new FormData($("#sellForm")).get("title") || "Your item";
}

function validateStep(step) {
  const invalid = $$('[required]', $(`.form-step[data-step="${step}"]`)).find((input) => !input.value.trim());
  if (!invalid) return true;
  invalid.setAttribute("aria-invalid", "true");
  invalid.focus();
  showToast("Please complete the highlighted details");
  return false;
}

function collectDraft() {
  const data = new FormData($("#sellForm"));
  return { title: data.get("title") || "", category: data.get("category") || "", description: data.get("description") || "", price: data.get("price") || "", condition: data.get("condition") || "Like new", location: data.get("location") || "CityU main entrance", photoData: state.photoData, step: state.formStep };
}

function saveDraft() { state.draft = collectDraft(); persistState(); }

function renderUploadPreview(dataUrl) {
  const zone = $("#uploadZone");
  const heading = $("strong", zone);
  const helper = $(".upload-copy > span", zone);
  if (dataUrl) {
    zone.classList.add("has-preview"); zone.style.backgroundImage = `url("${dataUrl}")`;
    heading.textContent = "Photo ready"; helper.textContent = "Choose another photo to replace it";
  } else {
    zone.classList.remove("has-preview"); zone.style.backgroundImage = "";
    heading.textContent = "Add a product photo"; helper.textContent = "It stays on this device and is compressed automatically";
  }
}

function restoreDraft() {
  const form = $("#sellForm");
  form.reset();
  const draft = state.draft;
  if (draft) {
    ["title", "category", "description", "price", "condition", "location"].forEach((name) => { if (form.elements[name] && draft[name] != null) form.elements[name].value = draft[name]; });
    state.formStep = Math.min(3, Math.max(1, Number(draft.step) || 1));
    state.photoData = draft.photoData || null;
  } else { state.formStep = 1; state.photoData = null; }
  renderUploadPreview(state.photoData);
  updateFormStep();
}

function compressPhoto(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) { reject(new Error("Please choose an image file")); return; }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("The photo could not be read"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("This image format is not supported"));
      image.onload = () => {
        const maxEdge = 900;
        const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        context.fillStyle = "#ffffff"; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.76));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function routeFromLocation() { return location.hash.replace(/^#/, "") || "home"; }
function navigate(route, { replace = false } = {}) {
  history[replace ? "replaceState" : "pushState"]({ route }, "", `#${route}`);
  renderRoute(route);
}

function setActiveNavigation(route) {
  const baseRoute = route.startsWith("messages") ? "messages" : route;
  $$(".nav-item, .mobile-nav button[data-route]").forEach((button) => button.classList.toggle("active", button.dataset.route === baseRoute));
}

function renderRoute(route) {
  closeAllOverlays();
  state.route = route;
  setActiveNavigation(route);
  if (route === "home") {
    state.category = "All"; state.query = ""; searchInput.value = "";
    $$(".category-chip").forEach((chip) => { const active = chip.dataset.category === "All"; chip.classList.toggle("active", active); chip.setAttribute("aria-pressed", active); });
    renderCurrentMarket(); return;
  }
  if (route === "saved") { renderCurrentMarket(); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
  if (route === "sell") { restoreDraft(); openDialog($("#sellDialog")); return; }
  if (route === "profile") { openDialog($("#verifyDialog")); return; }
  if (route.startsWith("item-")) { const product = findProduct(route.slice(5)); if (product) openProductView(product); else navigate("home", { replace: true }); return; }
  if (route.startsWith("messages-")) { const product = findProduct(route.slice(9)); if (product) openChatView(product); else navigate("home", { replace: true }); return; }
  if (route.startsWith("rating-")) { const product = findProduct(route.slice(7)); if (product) { state.activeProduct = product; openDialog($("#ratingDialog")); } else navigate("home", { replace: true }); return; }
  navigate("home", { replace: true });
}

async function shareProduct(product) {
  const url = new URL(location.href); url.hash = `item-${product.id}`;
  const shareData = { title: `${product.title} · UniCycleHK`, text: `${product.title} for ${money(product.price)}`, url: url.href };
  try {
    if (navigator.share) { await navigator.share(shareData); return; }
    await navigator.clipboard.writeText(url.href); showToast("Item link copied");
  } catch (error) { if (error.name !== "AbortError") showToast("Copy the item link from your browser address bar"); }
}

function exportDemoData() {
  const content = localStorage.getItem(STORAGE_KEY) || JSON.stringify({});
  const blob = new Blob([content], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob); link.download = `unicyclehk-demo-${new Date().toISOString().slice(0, 10)}.json`; link.click();
  URL.revokeObjectURL(link.href); showToast("Demo data exported");
}

grid.addEventListener("click", (event) => {
  const saveButton = event.target.closest("[data-save]");
  if (saveButton) { event.stopPropagation(); const product = findProduct(saveButton.dataset.save); if (product) toggleSave(product.id); return; }
  const card = event.target.closest("[data-product]");
  if (card) navigate(`item-${card.dataset.product}`);
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  if (state.route !== "home") { history.replaceState({ route: "home" }, "", "#home"); state.route = "home"; setActiveNavigation("home"); }
  renderCurrentMarket();
});

sortSelect.addEventListener("change", (event) => { state.sort = event.target.value; renderCurrentMarket(); });
$$('.category-chip').forEach((chip) => chip.addEventListener("click", () => {
  state.category = chip.dataset.category; state.route = "home"; history.replaceState({ route: "home" }, "", "#home"); setActiveNavigation("home");
  $$(".category-chip").forEach((item) => { const active = item === chip; item.classList.toggle("active", active); item.setAttribute("aria-pressed", active); });
  renderCurrentMarket();
}));

$("#clearFilters").addEventListener("click", () => navigate("home"));
$$('[data-route]').forEach((button) => button.addEventListener("click", () => navigate(button.dataset.route === "messages" ? `messages-${state.activeProduct.id}` : button.dataset.route)));
$("#openVerify").addEventListener("click", () => navigate("profile"));
$("#openSell").addEventListener("click", () => navigate("sell"));
$("#mobileSell").addEventListener("click", () => navigate("sell"));
$$('[data-close]').forEach((button) => button.addEventListener("click", () => navigate("home")));
$$('dialog').forEach((dialog) => {
  dialog.addEventListener("cancel", (event) => { event.preventDefault(); navigate("home"); });
  dialog.addEventListener("click", (event) => { if (event.target === dialog) navigate("home"); });
});

$("#formNext").addEventListener("click", () => { if (!validateStep(state.formStep)) return; state.formStep = Math.min(3, state.formStep + 1); saveDraft(); updateFormStep(); });
$("#formBack").addEventListener("click", () => { state.formStep = Math.max(1, state.formStep - 1); saveDraft(); updateFormStep(); });

let draftTimer;
$("#sellForm").addEventListener("input", () => {
  clearTimeout(draftTimer); draftTimer = setTimeout(saveDraft, 250);
  $$('[aria-invalid="true"]', $("#sellForm")).forEach((input) => input.removeAttribute("aria-invalid"));
});

$("#sellForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const newProduct = { id: `local-${Date.now()}`, local: true, title: data.get("title"), category: data.get("category"), price: Number(data.get("price")), condition: data.get("condition"), location: "CityU campus", time: "Just now", age: 0, seller: "Xiao Ming", initials: "XM", rating: "New seller", image: 0, imageData: state.photoData, description: data.get("description"), pickup: data.get("location") };
  products.unshift(newProduct); state.draft = null; state.photoData = null; event.currentTarget.reset(); state.formStep = 1;
  persistState({ quiet: false }); renderUploadPreview(null); navigate(`item-${newProduct.id}`); showToast("Your listing is now live on this device");
});

$("#photoInput").addEventListener("change", async (event) => {
  const [file] = event.target.files; if (!file) return;
  try { showToast("Preparing your photo…"); state.photoData = await compressPhoto(file); renderUploadPreview(state.photoData); saveDraft(); showToast("Photo added and saved locally"); }
  catch (error) { showToast(error.message); }
});

$("#closeChat").addEventListener("click", () => navigate("home"));
$("#messageForm").addEventListener("submit", (event) => { event.preventDefault(); sendMessage($("#messageInput").value); });
$$('.quick-replies button').forEach((button) => button.addEventListener("click", () => sendMessage(button.textContent)));
$("#completeExchange").addEventListener("click", () => navigate(`rating-${state.activeProduct.id}`));
$$('[data-rating]').forEach((button) => button.addEventListener("click", () => {
  state.rating = Number(button.dataset.rating);
  $$('[data-rating]').forEach((star) => star.classList.toggle("active", Number(star.dataset.rating) <= state.rating));
  $("#submitRating").disabled = false;
}));

$("#submitRating").addEventListener("click", () => {
  state.reviews[String(state.activeProduct.id)] = { score: state.rating, note: $("#ratingNote").value.trim(), createdAt: new Date().toISOString() };
  persistState(); showToast(`Thanks — your ${state.rating}-star review was saved`); state.rating = 0;
  $$('[data-rating]').forEach((star) => star.classList.remove("active")); $("#submitRating").disabled = true; $("#ratingNote").value = ""; navigate("home");
});

$("#exportData").addEventListener("click", exportDemoData);
$("#resetData").addEventListener("click", async () => {
  if (!confirm("Reset saved items, listings, chats, reviews and the current draft on this device?")) return;
  localStorage.removeItem(STORAGE_KEY);
  if ("caches" in window) await Promise.all((await caches.keys()).map((key) => caches.delete(key)));
  location.hash = "home"; location.reload();
});

$("#installApp").addEventListener("click", async () => {
  if (!state.installPrompt) return;
  state.installPrompt.prompt(); await state.installPrompt.userChoice; state.installPrompt = null; $("#installApp").hidden = true;
});
window.addEventListener("beforeinstallprompt", (event) => { event.preventDefault(); state.installPrompt = event; $("#installApp").hidden = false; });
window.addEventListener("appinstalled", () => { state.installPrompt = null; $("#installApp").hidden = true; showToast("UniCycleHK installed"); });

function updateConnectionStatus() {
  $("#connectionStatus").hidden = navigator.onLine;
  if (!navigator.onLine) showToast("Offline mode — your saved data still works");
}

window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);
window.addEventListener("popstate", () => renderRoute(routeFromLocation()));
document.addEventListener("keydown", (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); searchInput.focus(); } });

if ("serviceWorker" in navigator && location.protocol !== "file:") window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(() => {}));
updateConnectionStatus();
updateFormStep();
navigate(routeFromLocation(), { replace: true });
