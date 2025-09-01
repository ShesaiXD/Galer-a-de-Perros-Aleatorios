// ====== Elementos ======
const dogImage = document.getElementById("dogImage");
const breedSelect = document.getElementById("breedSelect");
const btnDog = document.getElementById("btnDog");
const btnHistory = document.getElementById("btnHistory");
const historyBox = document.getElementById("historyBox");
const btnShare = document.getElementById("btnShare");
const btnDownload = document.getElementById("btnDownload");
const themeToggle = document.getElementById("themeToggle");
const pawsToggle = document.getElementById("pawsToggle");
const langSelect = document.getElementById("langSelect");
const loader = document.getElementById("loader");

// Textos (i18n)
const T = {
  es: {
    title: "Galería de Perros Aleatorios",
    show: "Mostrar Perro",
    history: "Ver Historial",
    share: "Compartir",
    download: "Descargar",
    loading: "Cargando perrito...",
    historyTitle: "Historial de Perritos",
    historyHint: "Aquí aparecerán los perritos que ya viste.",
    anyBreed: "Cualquier raza",
    made: "Hecho con ❤️ usando Flask + Dog API",
    shareText: "Mira este perrito 🐶",
  },
  en: {
    title: "Random Dogs Gallery",
    show: "Show Dog",
    history: "View History",
    share: "Share",
    download: "Download",
    loading: "Loading puppy...",
    historyTitle: "Puppy History",
    historyHint: "Dogs you've already seen will appear here.",
    anyBreed: "Any breed",
    made: "Made with ❤️ using Flask + Dog API",
    shareText: "Check out this puppy 🐶",
  },
};

// ====== Tema (light/dark) ======
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  localStorage.setItem("theme", theme);
}
themeToggle.addEventListener("click", () => {
  const current =
    document.documentElement.getAttribute("data-theme") || "light";
  applyTheme(current === "light" ? "dark" : "light");
});

// ====== Idioma ======
function applyLang(lang) {
  const t = T[lang] || T.es;
  document.getElementById("t-title").textContent = t.title;
  document.getElementById("t-show").textContent = t.show;
  document.getElementById("t-history").textContent = t.history;
  document.getElementById("t-share").textContent = t.share;
  document.getElementById("t-download").textContent = t.download;
  document.getElementById("t-loading").textContent = t.loading;
  document.getElementById("t-historyTitle").textContent = t.historyTitle;
  document.getElementById("t-historyHint").textContent = t.historyHint;
  document.getElementById("t-made").textContent = t.made;

  // Actualiza opción "Cualquier raza"
  breedSelect.options[0].textContent = t.anyBreed;

  localStorage.setItem("lang", lang);
}
langSelect.addEventListener("change", () => applyLang(langSelect.value));

// ====== Carga de razas ======
async function loadBreeds() {
  const res = await fetch("/breeds");
  const data = await res.json();
  const breeds = Object.keys(data.message);
  // Limpia (deja la primera opción)
  breedSelect.length = 1;
  breeds.forEach((breed) => {
    const option = document.createElement("option");
    option.value = breed;
    option.textContent = breed.charAt(0).toUpperCase() + breed.slice(1);
    breedSelect.appendChild(option);
  });
}

// ====== Loader ======
function showLoader() {
  loader.style.display = "flex";
}
function hideLoader() {
  loader.style.display = "none";
}

// ====== Obtener perro ======
async function getDog() {
  showLoader();
  dogImage.src = ""; // evita parpadeos

  let url = "/random-dog";
  if (breedSelect.value) url = `/dog/${breedSelect.value}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const imgUrl = data.message;

    // Esperar a que la imagen cargue realmente antes de ocultar loader
    await loadImage(imgUrl);
    dogImage.src = imgUrl;
    hideLoader();

    // Actualiza botón de descargar con el blob (si falla, fallback)
    prepareDownload(imgUrl);
  } catch (e) {
    console.error(e);
    hideLoader();
    alert("Hubo un problema cargando el perrito 🐶");
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve();
    i.onerror = reject;
    i.src = src;
  });
}

// ====== Historial ======
async function getHistory() {
  const res = await fetch("/historial");
  const data = await res.json();
  renderHistory(data.historial);
}
function renderHistory(urls = []) {
  historyBox.innerHTML = "";
  urls
    .slice()
    .reverse()
    .forEach((imgUrl) => {
      const img = document.createElement("img");
      img.src = imgUrl;
      img.title = "Click para ver en grande";
      img.onclick = () => (dogImage.src = imgUrl);
      historyBox.appendChild(img);
    });
}

// ====== Compartir ======
btnShare.addEventListener("click", async () => {
  const lang = localStorage.getItem("lang") || "es";
  const text = T[lang].shareText;
  const url = dogImage.src || location.href;

  if (navigator.share) {
    try {
      await navigator.share({ title: "Dog Gallery", text, url });
    } catch {
      /* usuario canceló */
    }
  } else if (navigator.clipboard) {
    await navigator.clipboard.writeText(url);
    alert("Enlace copiado al portapapeles ✅");
  } else {
    prompt("Copia el enlace:", url);
  }
});

// ====== Descargar ======
async function prepareDownload(imgUrl) {
  // Intenta obtener blob para descarga directa
  try {
    const r = await fetch(imgUrl, { mode: "cors" });
    const b = await r.blob();
    const objectUrl = URL.createObjectURL(b);
    btnDownload.href = objectUrl;
    btnDownload.download = "dog.jpg";
  } catch {
    // Fallback: abrir imagen (el navegador permitirá guardar)
    btnDownload.href = imgUrl;
    btnDownload.removeAttribute("download");
  }
}

// ====== Partículas (huellitas) ======
const pawsCanvas = document.getElementById("pawsCanvas");
const ctx = pawsCanvas.getContext("2d");
let pawsEnabled = true;
let paws = [];
let rafId;

function resizeCanvas() {
  pawsCanvas.width = window.innerWidth;
  pawsCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);

function spawnPaw() {
  return {
    x: Math.random() * pawsCanvas.width,
    y: -20,
    vy: 0.6 + Math.random() * 0.8,
    size: 16 + Math.random() * 10,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.02,
    alpha: 0.8,
  };
}

function drawPaw(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.globalAlpha = p.alpha;
  ctx.font = `${p.size}px serif`;
  ctx.fillText("🐾", 0, 0);
  ctx.restore();
}

function tick() {
  if (!pawsEnabled) return;
  ctx.clearRect(0, 0, pawsCanvas.width, pawsCanvas.height);

  // Añade nuevas huellas
  if (paws.length < 60) paws.push(spawnPaw());

  // Actualiza y dibuja
  paws.forEach((p) => {
    p.y += p.vy;
    p.rot += p.vr;
    p.alpha -= 0.0008;
    drawPaw(p);
  });

  // Remueve las que ya salieron
  paws = paws.filter((p) => p.y < pawsCanvas.height + 30 && p.alpha > 0.05);

  rafId = requestAnimationFrame(tick);
}

pawsToggle.addEventListener("click", () => {
  pawsEnabled = !pawsEnabled;
  pawsToggle.textContent = pawsEnabled ? "🐾" : "🚫";
  if (pawsEnabled) {
    resizeCanvas();
    paws = [];
    cancelAnimationFrame(rafId);
    tick();
  } else {
    cancelAnimationFrame(rafId);
    ctx.clearRect(0, 0, pawsCanvas.width, pawsCanvas.height);
  }
});

// ====== Init ======
(async function init() {
  // Tema inicial
  applyTheme(localStorage.getItem("theme") || "light");

  // Idioma inicial
  const lang = localStorage.getItem("lang") || "es";
  langSelect.value = lang;
  applyLang(lang);

  // Canvas partículas
  resizeCanvas();
  tick();

  // Cargar razas e historial
  await loadBreeds();
  await getHistory();
})();

// Eventos
btnDog.addEventListener("click", getDog);
btnHistory.addEventListener("click", getHistory);
