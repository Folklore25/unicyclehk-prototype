const DEFAULT_PRODUCTS = [
  { id: 1, title: "Solid wood dining table", category: "Furniture", price: 320, condition: "Good condition", university: "cityu", location: "CityUHK · Residence", time: "12 min ago", age: 12, seller: "Amelia", initials: "AL", rating: "4.9 · 18 exchanges", asset: "assets/products/01-table.webp", description: "Compact solid wood table from a student flat. Comfortable for two people and also works well as a study desk. A few light surface marks from normal use.", pickup: "Student residence lobby" },
  { id: 2, title: "Stainless steel electric kettle", category: "Appliances", price: 70, condition: "Good condition", university: "hku", location: "HKU · Pok Fu Lam", time: "28 min ago", age: 28, seller: "Rohan", initials: "RK", rating: "4.8 · 11 exchanges", asset: "assets/products/02-kettle.webp", description: "1.7L electric kettle in full working order. Used for one academic year, cleaned and descaled before listing. Selling because I am leaving Hong Kong.", pickup: "HKU MTR Exit A2" },
  { id: 3, title: "Black mesh office chair", category: "Furniture", price: 180, condition: "Well kept", university: "cuhk", location: "CUHK · Sha Tin", time: "1 hr ago", age: 60, seller: "Minji", initials: "MK", rating: "5.0 · 9 exchanges", asset: "assets/products/03-office-chair.webp", description: "Comfortable mesh chair with adjustable height and armrests. The wheels and gas lift work properly. Ideal for studying at home.", pickup: "University MTR Exit A" },
  { id: 4, title: "Yoga mat with carry strap", category: "Lifestyle", price: 45, condition: "Lightly used", university: "hkust", location: "HKUST · Clear Water Bay", time: "2 hrs ago", age: 120, seller: "Nora", initials: "NZ", rating: "4.9 · 7 exchanges", asset: "assets/products/04-yoga-mat.webp", description: "Purple exercise mat with carrying strap. Used only a few times, wiped clean and ready to go. Easy to carry to the sports centre.", pickup: "North Gate" },
  { id: 5, title: "Portable induction cooker", category: "Appliances", price: 110, condition: "Works perfectly", university: "polyu", location: "PolyU · Hung Hom", time: "Yesterday", age: 1440, seller: "Santiago", initials: "SM", rating: "4.7 · 14 exchanges", asset: "assets/products/05-induction-cooker.webp", description: "Single-zone induction cooker suitable for a small flat. All controls work and the cable is intact. Visible surface scratches do not affect use.", pickup: "Hung Hom MTR Exit A1" },
  { id: 6, title: "Floor lamp with bedside shelf", category: "Furniture", price: 90, condition: "Good condition", university: "hkbu", location: "HKBU · Kowloon Tong", time: "Yesterday", age: 1500, seller: "Eva", initials: "ET", rating: "4.9 · 22 exchanges", asset: "assets/products/06-floor-lamp.webp", description: "Warm floor lamp with two small shelves for books or bedside items. Bulb included. Slim design fits comfortably in a compact student room.", pickup: "Shaw Campus main entrance" },
  { id: 7, title: "Compact microwave oven", category: "Appliances", price: 130, condition: "Works well", university: "eduhk", location: "EdUHK · Tai Po", time: "18 min ago", age: 18, seller: "Aarav", initials: "AP", rating: "4.8 · 12 exchanges", asset: "assets/products/07-microwave.webp", description: "Compact microwave suitable for a shared student kitchen. Heating and timer controls work normally. Cleaned inside and ready for pickup.", pickup: "University shuttle stop" },
  { id: 8, title: "Full-length standing mirror", category: "Furniture", price: 95, condition: "Lightly used", university: "lingnan", location: "Lingnan · Tuen Mun", time: "35 min ago", age: 35, seller: "Sofia", initials: "SC", rating: "5.0 · 6 exchanges", asset: "assets/products/08-standing-mirror.webp", description: "Slim full-length mirror with a stable metal frame. No cracks or chips. Easy to carry in a taxi or larger car.", pickup: "Siu Hong MTR Exit F" },
  { id: 9, title: "Folding clothes drying rack", category: "Lifestyle", price: 55, condition: "Good condition", university: "polyu", location: "PolyU · Student hall", time: "52 min ago", age: 52, seller: "Haruto", initials: "HM", rating: "4.9 · 16 exchanges", asset: "assets/products/09-drying-rack.webp", description: "Lightweight folding drying rack with plenty of space for daily laundry. Folds flat for storage and has no broken rails.", pickup: "Core A podium" },
  { id: 10, title: "Three-drawer bedside cabinet", category: "Furniture", price: 120, condition: "Used, sturdy", university: "cityu", location: "CityUHK · Residence", time: "3 hrs ago", age: 180, seller: "Lina", initials: "LW", rating: "4.7 · 10 exchanges", asset: "assets/products/10-bedside-cabinet.webp", description: "Compact three-drawer cabinet with normal signs of use. Drawers open smoothly and it fits beside a single student bed.", pickup: "Student residence lobby" },
  { id: 11, title: "Quiet desktop fan", category: "Appliances", price: 60, condition: "Good condition", university: "hkbu", location: "HKBU · Kowloon Tong", time: "4 hrs ago", age: 240, seller: "Noah", initials: "NK", rating: "4.8 · 8 exchanges", asset: "assets/products/11-desk-fan.webp", description: "Small desktop fan with two speed settings. Quiet enough for studying and useful during warm evenings in a compact room.", pickup: "Academic Community Hall" },
  { id: 12, title: "Slim rolling storage trolley", category: "Furniture", price: 85, condition: "Good condition", university: "hku", location: "HKU · Pok Fu Lam", time: "Yesterday", age: 1480, seller: "Maya", initials: "MR", rating: "4.9 · 19 exchanges", asset: "assets/products/12-storage-trolley.webp", description: "Three-tier rolling trolley for toiletries, kitchen supplies or stationery. Wheels move smoothly and the narrow frame fits small flats.", pickup: "Haking Wong Podium" },
];

const STORAGE_KEY = "unicyclehk-demo-v4";
localStorage.removeItem("unicyclehk-demo-v3");
const DEFAULT_SAVED = [2, 5];
const UNIVERSITIES = {
  cityu: { short: "CityUHK", name: "City University of Hong Kong", points: [
    { id: "cityu-main", name: "CityU main entrance", meta: "Campus · covered meeting point" },
    { id: "festival-walk", name: "Festival Walk atrium", meta: "Indoor · near MTR and campus" },
    { id: "cityu-residence", name: "Student residence lobby", meta: "Residents · staffed common area" },
  ] },
  hku: { short: "HKU", name: "The University of Hong Kong", points: [
    { id: "hku-mtr", name: "HKU MTR Exit A2", meta: "Transit · street-level exit" },
    { id: "hku-centennial", name: "Centennial Campus entrance", meta: "Campus · public entrance" },
    { id: "hku-haking", name: "Haking Wong Podium", meta: "Campus · covered public area" },
  ] },
  cuhk: { short: "CUHK", name: "The Chinese University of Hong Kong", points: [
    { id: "cuhk-mtr", name: "University MTR Exit A", meta: "Transit · campus connection" },
    { id: "cuhk-yia", name: "Yasumoto International Academic Park", meta: "Campus · central meeting point" },
    { id: "cuhk-bfc", name: "Benjamin Franklin Centre", meta: "Campus · public concourse" },
  ] },
  hkust: { short: "HKUST", name: "Hong Kong University of Science and Technology", points: [
    { id: "hkust-north", name: "North Gate", meta: "Campus · transport drop-off" },
    { id: "hkust-atrium", name: "Academic Building atrium", meta: "Indoor · central campus" },
    { id: "hkust-south", name: "South Gate", meta: "Campus · public entrance" },
  ] },
  polyu: { short: "PolyU", name: "The Hong Kong Polytechnic University", points: [
    { id: "polyu-mtr", name: "Hung Hom MTR Exit A1", meta: "Transit · near campus" },
    { id: "polyu-main", name: "PolyU main entrance", meta: "Campus · public entrance" },
    { id: "polyu-core-a", name: "Core A podium", meta: "Campus · covered area" },
  ] },
  hkbu: { short: "HKBU", name: "Hong Kong Baptist University", points: [
    { id: "hkbu-shaw", name: "Shaw Campus main entrance", meta: "Campus · public entrance" },
    { id: "hkbu-ach", name: "Academic Community Hall", meta: "Campus · covered area" },
    { id: "hkbu-mtr", name: "Kowloon Tong MTR Exit E", meta: "Transit · near campus" },
  ] },
  lingnan: { short: "Lingnan", name: "Lingnan University", points: [
    { id: "lingnan-mtr", name: "Siu Hong MTR Exit F", meta: "Transit · shuttle connection" },
    { id: "lingnan-main", name: "Lingnan main entrance", meta: "Campus · public entrance" },
    { id: "lingnan-wong", name: "Wong Administration Building", meta: "Campus · central area" },
  ] },
  eduhk: { short: "EdUHK", name: "The Education University of Hong Kong", points: [
    { id: "eduhk-shuttle", name: "University shuttle stop", meta: "Transit · main drop-off" },
    { id: "eduhk-main", name: "EdUHK main entrance", meta: "Campus · public entrance" },
    { id: "eduhk-block-b", name: "Block B podium", meta: "Campus · covered area" },
  ] },
};
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
const initialUniversity = UNIVERSITIES[persisted.university] ? persisted.university : "cityu";
const initialPoints = UNIVERSITIES[initialUniversity].points;
const initialMeetup = initialPoints.some((point) => point.id === persisted.meetup) ? persisted.meetup : initialPoints[0].id;
const state = {
  query: "", category: "All", sort: "recommended", route: "home",
  saved: new Set(Array.isArray(persisted.saved) ? persisted.saved : DEFAULT_SAVED),
  activeProduct: products[0], formStep: 1, rating: 0,
  messages: persisted.messages || {}, reviews: persisted.reviews || {},
  draft: persisted.draft || null, photoData: persisted.draft?.photoData || null,
  university: initialUniversity,
  pendingUniversity: initialUniversity,
  meetup: initialMeetup,
  pendingMeetup: initialMeetup,
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
  const data = { products: products.filter((product) => product.local), saved: [...state.saved], messages: state.messages, reviews: state.reviews, draft: state.draft, university: state.university, meetup: state.meetup };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); return true; }
  catch { if (!quiet) showToast("This browser is out of local storage space"); return false; }
}

function findProduct(id) { return products.find((product) => String(product.id) === String(id)); }

function productImageMarkup(product, extraClass = "", label = product.title) {
  if (product.imageData) return `<div class="product-image custom-image ${extraClass}" style="background-image:url('${product.imageData}')" role="img" aria-label="${escapeHtml(label)}"></div>`;
  if (product.asset) return `<div class="product-image static-image ${extraClass}" style="background-image:url('${product.asset}')" role="img" aria-label="${escapeHtml(label)}"></div>`;
  return `<div class="product-image static-image ${extraClass}" style="background-image:url('assets/products/01-table.webp')" role="img" aria-label="${escapeHtml(label)}"></div>`;
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
  let sorted = [...list];
  if (state.sort === "priceLow") sorted.sort((a, b) => a.price - b.price);
  if (state.sort === "newest") sorted.sort((a, b) => a.age - b.age);
  sorted.sort((a, b) => productLocationScore(b) - productLocationScore(a));
  return sorted;
}

function productLocationScore(product) {
  let score = product.university === state.university ? 1 : 0;
  const selectedPoint = UNIVERSITIES[state.university].points.find((point) => point.id === state.meetup);
  if (selectedPoint && product.pickup === selectedPoint.name) score += 2;
  return score;
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
  const list = filteredProducts();
  const university = UNIVERSITIES[state.university];
  const point = university.points.find((item) => item.id === state.meetup);
  const label = `${list.length} items · ${university.short} and ${point.name} prioritised`;
  renderProducts(list, label);
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
      <div class="detail-actions"><button class="primary-button" id="messageSeller">${icon("message")}Message</button><button class="secondary-button" id="detailSave" aria-pressed="${saved}">${icon("heart")}${saved ? "Saved" : "Save"}</button><button class="secondary-button share-button" id="shareItem">${icon("share")}Share</button></div>
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
  return { title: data.get("title") || "", category: data.get("category") || "", description: data.get("description") || "", price: data.get("price") || "", condition: data.get("condition") || "Like new", location: data.get("location") || selectedMeetupPoint().name, photoData: state.photoData, step: state.formStep };
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
  updateListingHandoverOptions(draft?.location);
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

function selectedMeetupPoint(universityCode = state.university, meetupId = state.meetup) {
  const university = UNIVERSITIES[universityCode];
  return university.points.find((point) => point.id === meetupId) || university.points[0];
}

function renderUniversityOptions() {
  $("#universityList").innerHTML = Object.entries(UNIVERSITIES).map(([code, university]) => {
    const selected = code === state.pendingUniversity;
    return `<button type="button" class="university-option ${selected ? "selected" : ""}" data-university="${code}" aria-pressed="${selected}" title="${escapeHtml(university.name)}">${escapeHtml(university.short)}</button>`;
  }).join("");
}

function renderMeetupOptions() {
  const university = UNIVERSITIES[state.pendingUniversity];
  $("#meetupUniversityName").textContent = university.name;
  $("#meetupList").innerHTML = university.points.map((point) => {
    const selected = point.id === state.pendingMeetup;
    return `<button type="button" class="meetup-option ${selected ? "selected" : ""}" data-meetup="${point.id}" aria-pressed="${selected}"><span class="meetup-pin">${icon("map")}</span><span><strong>${escapeHtml(point.name)}</strong><small>${escapeHtml(point.meta)}</small></span><i class="verified-mini">${icon("check")}</i></button>`;
  }).join("");
}

function openMeetupView() {
  state.pendingUniversity = state.university;
  state.pendingMeetup = state.meetup;
  renderUniversityOptions();
  renderMeetupOptions();
  openDialog($("#meetupDialog"));
}

function updateMeetupDisplay() {
  const university = UNIVERSITIES[state.university];
  const point = selectedMeetupPoint();
  $("#currentMeetupName").textContent = `${university.short} · ${point.name}`;
  $("#nearUniversityLabel").textContent = `Near ${university.short}`;
  $("#previewUniversity").textContent = university.short;
  updateListingHandoverOptions();
}

function updateListingHandoverOptions(preferredValue = null) {
  const select = $("#listingHandover");
  if (!select) return;
  const points = UNIVERSITIES[state.university].points;
  select.innerHTML = points.map((point) => `<option value="${escapeHtml(point.name)}">${escapeHtml(point.name)}</option>`).join("");
  const selectedValue = preferredValue || selectedMeetupPoint().name;
  if (points.some((point) => point.name === selectedValue)) select.value = selectedValue;
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
  if (route === "meetup") { openMeetupView(); return; }
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
$("#openMeetup").addEventListener("click", () => navigate("meetup"));
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
  const newProduct = { id: `local-${Date.now()}`, local: true, title: data.get("title"), category: data.get("category"), price: Number(data.get("price")), condition: data.get("condition"), university: state.university, location: `${UNIVERSITIES[state.university].short} · Local listing`, time: "Just now", age: 0, seller: "Xiao Ming", initials: "XM", rating: "New seller", imageData: state.photoData, description: data.get("description"), pickup: data.get("location") };
  products.unshift(newProduct); state.draft = null; state.photoData = null; event.currentTarget.reset(); state.formStep = 1;
  persistState({ quiet: false }); renderUploadPreview(null); navigate(`item-${newProduct.id}`); showToast("Your listing is now live on this device");
});

$("#photoInput").addEventListener("change", async (event) => {
  const [file] = event.target.files; if (!file) return;
  try { showToast("Preparing your photo…"); state.photoData = await compressPhoto(file); renderUploadPreview(state.photoData); saveDraft(); showToast("Photo added and saved locally"); }
  catch (error) { showToast(error.message); }
});

$("#universityList").addEventListener("click", (event) => {
  const option = event.target.closest("[data-university]");
  if (!option) return;
  state.pendingUniversity = option.dataset.university;
  state.pendingMeetup = UNIVERSITIES[state.pendingUniversity].points[0].id;
  renderUniversityOptions();
  renderMeetupOptions();
});

$("#meetupList").addEventListener("click", (event) => {
  const option = event.target.closest("[data-meetup]");
  if (!option) return;
  state.pendingMeetup = option.dataset.meetup;
  renderMeetupOptions();
});

$("#applyMeetup").addEventListener("click", () => {
  state.university = state.pendingUniversity;
  state.meetup = state.pendingMeetup;
  persistState();
  updateMeetupDisplay();
  const areaName = `${UNIVERSITIES[state.university].short} · ${selectedMeetupPoint().name}`;
  navigate("home");
  showToast(`${areaName} is now prioritised`);
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
updateMeetupDisplay();
updateConnectionStatus();
updateFormStep();
navigate(routeFromLocation(), { replace: true });
