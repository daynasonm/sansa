const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const infoPanel = document.getElementById("infoPanel");
const templeButtons = document.querySelectorAll(".temple-name");
const featuredTemple = document.getElementById("featuredTemple");
const featureCount = document.getElementById("featureCount");
const featureTitle = document.getElementById("featureTitle");
const featureLocation = document.getElementById("featureLocation");
const featureDescription = document.getElementById("featureDescription");

const temples = {
  Buseoksa: {
    count: "01 / 07",
    image: "assets/images/Buseoksa.svg",
    location: "Yeongju, Gyeongsangbuk-do",
    description:
      "A northern stop in the Sansa group, Buseoksa introduces the route as a mountain monastery where architecture, worship, and landscape are read together."
  },
  Magoksa: {
    count: "02 / 07",
    image: "assets/images/Magoksa.svg",
    location: "Gongju, Chungcheongnam-do",
    description:
      "Magoksa sits in the central-western portion of the route, a useful pause for travelers moving between the historic cities and mountain valleys of Korea."
  },
  Bongjeongsa: {
    count: "03 / 07",
    image: "assets/images/Bongjeongsa.svg",
    location: "Andong, Gyeongsangbuk-do",
    description:
      "Bongjeongsa is part of the Sansa story of long continuity: a working monastery where the visitor reads time through timber, thresholds, and courtyards."
  },
  Beopjusa: {
    count: "04 / 07",
    image: "assets/images/Beopjusa.svg",
    location: "Boeun, Chungcheongbuk-do",
    description:
      "Beopjusa brings the vertical silhouette of Korean Buddhist architecture into the route, pairing monumental form with the quieter rhythm of mountain practice."
  },
  Seonamsa: {
    count: "05 / 07",
    image: "assets/images/Seonamsa.svg",
    location: "Suncheon, Jeollanam-do",
    description:
      "Seonamsa carries SANSA toward Korea's southern provinces, where temple paths, water, trees, and low buildings feel closely stitched together."
  },
  Tongdosa: {
    count: "06 / 07",
    image: "assets/images/Tongdosa.svg",
    location: "Yangsan, Gyeongsangnam-do",
    description:
      "Tongdosa is one of the seven UNESCO-listed monasteries and a strong anchor for travelers exploring the southeastern part of the SANSA route."
  },
  Daeheungsa: {
    count: "07 / 07",
    image: "assets/images/Daeheungsa.svg",
    location: "Haenam, Jeollanam-do",
    description:
      "Daeheungsa closes the route in the far south, inviting a slower trip where remoteness, mountain setting, and daily temple life matter as much as arrival."
  }
};

function setTemple(name) {
  const temple = temples[name];

  if (!temple) return;

  featuredTemple.src = temple.image;
  featuredTemple.alt = `${name} temple illustration`;
  featureCount.textContent = temple.count;
  featureTitle.textContent = name;
  featureLocation.textContent = temple.location;
  featureDescription.textContent = temple.description;

  templeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.temple === name);
  });
}

menuBtn.addEventListener("click", () => {
  infoPanel.classList.add("open");
  infoPanel.setAttribute("aria-hidden", "false");
});

closeBtn.addEventListener("click", () => {
  infoPanel.classList.remove("open");
  infoPanel.setAttribute("aria-hidden", "true");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    infoPanel.classList.remove("open");
    infoPanel.setAttribute("aria-hidden", "true");
  }
});

templeButtons.forEach((button) => {
  button.addEventListener("mouseenter", () => setTemple(button.dataset.temple));
  button.addEventListener("focus", () => setTemple(button.dataset.temple));
  button.addEventListener("click", () => setTemple(button.dataset.temple));
});
