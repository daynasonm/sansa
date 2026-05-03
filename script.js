const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const infoPanel = document.getElementById("infoPanel");
const templeButtons = document.querySelectorAll(".temple-name");
const featuredTemple = document.getElementById("featuredTemple");
const featureCount = document.getElementById("featureCount");
const featureTitle = document.getElementById("featureTitle");
const featureLocation = document.getElementById("featureLocation");
const featureDescription = document.getElementById("featureDescription");
const hero = document.querySelector(".hero");
const heroRight = document.querySelector(".hero-right");
const heroTemples = document.querySelectorAll(".temple[data-temple]");
const routeMap = document.querySelector(".route-map");
const routeItems = document.querySelectorAll(".route-dot[data-temple], .route-label[data-temple]");
const revealItems = document.querySelectorAll("[data-reveal]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  const updateFeature = () => {
    featuredTemple.src = temple.image;
    featuredTemple.alt = `${name} temple illustration`;
    featureCount.textContent = temple.count;
    featureTitle.textContent = name;
    featureLocation.textContent = temple.location;
    featureDescription.textContent = temple.description;
    featuredTemple.classList.remove("is-changing");
  };

  if (!reduceMotion && featuredTemple.src && !featuredTemple.src.endsWith(temple.image)) {
    featuredTemple.classList.add("is-changing");
    window.setTimeout(updateFeature, 120);
  } else {
    updateFeature();
  }

  templeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.temple === name);
  });

  heroTemples.forEach((image) => {
    image.classList.toggle("is-active", image.dataset.temple === name);
  });

  routeItems.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.temple === name);
  });
}

document.body.classList.add("js-ready");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  if (routeMap) {
    const mapObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          routeMap.classList.add("is-visible");
          mapObserver.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    mapObserver.observe(routeMap);
  }
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
  routeMap?.classList.add("is-visible");
}

function updateHeroProgress() {
  if (!hero) return;

  const rect = hero.getBoundingClientRect();
  const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - window.innerHeight)));
  hero.style.setProperty("--hero-progress", progress.toFixed(3));
}

window.addEventListener("scroll", updateHeroProgress, { passive: true });
updateHeroProgress();

if (heroRight && !reduceMotion) {
  heroRight.addEventListener("pointermove", (event) => {
    const rect = heroRight.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    heroTemples.forEach((image) => {
      const depth = Number(image.dataset.depth) || 0;
      image.style.setProperty("--parallax-x", `${(x * depth * 34).toFixed(2)}px`);
      image.style.setProperty("--parallax-y", `${(y * depth * 24).toFixed(2)}px`);
    });
  });

  heroRight.addEventListener("pointerleave", () => {
    heroTemples.forEach((image) => {
      image.style.setProperty("--parallax-x", "0px");
      image.style.setProperty("--parallax-y", "0px");
    });
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

heroTemples.forEach((image) => {
  image.addEventListener("mouseenter", () => setTemple(image.dataset.temple));
});

routeItems.forEach((item) => {
  item.addEventListener("mouseenter", () => setTemple(item.dataset.temple));
  item.addEventListener("focus", () => setTemple(item.dataset.temple));
});
