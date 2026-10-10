"use strict";
const vantaAssetBase = new URL('.', document.currentScript.src);
const entry = document.getElementById("entry");
const navigation = document.getElementById("navigation");
const menuToggle = document.getElementById("menu-toggle");
const projectDialog = document.getElementById("project-dialog");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let paused = reducedMotion.matches;
let selectedPaint = "blue";
const paints = {
  blue: "BLU NOTTE",
  violet: "VIOLA VISION",
  lime: "VERDE FLASH",
};
function closeEntry() {
  try {
    sessionStorage.setItem("vanta-entered", "yes");
  } catch {}
  if (reducedMotion.matches) {
    entry.close();
    return;
  }
  entry.classList.add("is-leaving");
  setTimeout(() => {
    entry.close();
    entry.classList.remove("is-leaving");
  }, 650);
}
let entered = false;
try {
  entered = sessionStorage.getItem("vanta-entered") === "yes";
} catch {}
if (!entered) {
  entry.showModal();
  document.body.classList.add("modal-open");
}
document.getElementById("enter-button").addEventListener("click", closeEntry);
entry.addEventListener("cancel", () => {
  try {
    sessionStorage.setItem("vanta-entered", "yes");
  } catch {}
});
document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("close", () => {
    if (dialog === navigation)
      menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.toggle(
      "modal-open",
      Boolean(document.querySelector("dialog[open]")),
    );
  });
});
menuToggle.addEventListener("click", () => {
  navigation.showModal();
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("modal-open");
});
document
  .querySelectorAll("[data-close]")
  .forEach((button) =>
    button.addEventListener("click", () =>
      document.getElementById(button.dataset.close).close(),
    ),
  );
navigation
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", () => navigation.close()));
document.querySelectorAll("[data-project]").forEach((button) =>
  button.addEventListener("click", () => {
    document.getElementById("project-paint").value = selectedPaint;
    projectDialog.showModal();
    document.body.classList.add("modal-open");
  }),
);
document.querySelectorAll("[data-paint]").forEach((button) =>
  button.addEventListener("click", () => {
    const paint = button.dataset.paint;
    selectedPaint = paint;
    document.getElementById("paint-name").textContent = paints[paint];
    document.querySelectorAll("[data-paint]").forEach((chip) => {
      const active = chip.dataset.paint === paint;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", String(active));
    });
    document.querySelectorAll("[data-paint-photo]").forEach((photo) => {
      const active = photo.dataset.paintPhoto === paint;
      photo.classList.toggle("is-selected", active);
      photo.setAttribute("aria-hidden", String(!active));
    });
    requestFrame();
  }),
);
const motionToggle = document.getElementById("motion-toggle");
function updateMotion() {
  const previouslyEnabled = document.body.classList.contains("motion-enabled");
  let anchor = null;
  if (previouslyEnabled && paused) {
    if (
      layout &&
      scrollY >= layout.story.top &&
      scrollY < layout.story.top + layout.story.height
    )
      anchor = storySteps.find((step) => step.classList.contains("is-active"));
    else if (layout && scrollY < layout.cinematic.height) anchor = cinematic;
    else if (layout && scrollY >= layout.statement.top && scrollY < layout.statement.top + layout.statement.height) anchor = statement;
  }
  document.body.classList.toggle("motion-paused", paused);
  document.body.classList.toggle(
    "motion-enabled",
    !paused && !reducedMotion.matches && innerHeight >= 620,
  );
  motionToggle.setAttribute("aria-pressed", String(paused));
  motionToggle.setAttribute(
    "aria-label",
    paused ? "Tiếp tục hiệu ứng" : "Tạm dừng hiệu ứng",
  );
  motionToggle.textContent = paused ? "▷" : "Ⅱ";
  motionToggle.disabled = reducedMotion.matches;
  if (!document.body.classList.contains("motion-enabled")) resetScenes();
  measureLayout();
  if (anchor)
    window.scrollTo({
      top: Math.max(0, scrollY + anchor.getBoundingClientRect().top - 100),
      behavior: "instant",
    });
  currentScroll = scrollY;
  requestFrame();
}
motionToggle.addEventListener("click", () => {
  paused = !paused;
  updateMotion();
});
reducedMotion.addEventListener("change", (event) => {
  paused = event.matches;
  updateMotion();
});
const header = document.querySelector(".site-header");
const cinematic = document.querySelector(".cinematic");
const stage = document.querySelector(".cinematic-stage");
const heroHeading = document.querySelector(".hero-heading");
const heroBottom = document.querySelector(".hero-bottom");
const interiorHeading = document.querySelector(".interior-heading");
const interiorPhoto = document.querySelector(".interior-photo");
const story = document.querySelector(".story-sequence");
const storyStage = document.querySelector(".story-stage");
const storySteps = [...document.querySelectorAll(".story-step")];
const storyBackgrounds = [
  ...document.querySelectorAll(".story-backgrounds img"),
];
const chapterDots = [...document.querySelectorAll(".chapter-dots i")];
const wordHeading = document.querySelector(".word-fill");
const statement = document.querySelector(".statement");
const finale = document.querySelector(".finale");
const { clamp, damp, range, sceneProgress, cinematicState, chapterMotion } =
  VantaMotion;
const chapterLetters = storySteps.map(step => {
  const heading = step.querySelector("h2");
  const title = heading.textContent;
  heading.setAttribute("aria-label", title);
  heading.textContent = "";
  return [...title].map(letter => {
    const span = document.createElement("span");
    span.className = "chapter-letter";
    span.setAttribute("aria-hidden", "true");
    span.textContent = letter;
    heading.append(span);
    return span;
  });
});
let layout = null,
  frame = 0,
  lastTime = 0,
  currentScroll = scrollY;
let pointer = [0, 0],
  pointerNow = [0, 0];
let frameCount = 0,
  totalFrameMs = 0;

// Wrap text nodes while preserving line breaks and emphasis.
const wordNodes = [];
const walker = document.createTreeWalker(wordHeading, NodeFilter.SHOW_TEXT);
while (walker.nextNode()) wordNodes.push(walker.currentNode);
wordNodes.forEach((node) => {
  const fragment = document.createDocumentFragment();
  node.textContent
    .split(/(\s+)/)
    .filter(Boolean)
    .forEach((part) => {
      if (/^\s+$/.test(part)) fragment.append(document.createTextNode(part));
      else {
        const span = document.createElement("span");
        span.className = "fill-word";
        span.textContent = part;
        fragment.append(span);
      }
    });
  node.replaceWith(fragment);
});
const words = [...wordHeading.querySelectorAll(".fill-word")];

function measureLayout() {
  function measure(element) {
    const rect = element.getBoundingClientRect();
    return { top: rect.top + scrollY, height: rect.height };
  }
  layout = {
    cinematic: measure(cinematic),
    story: measure(story),
    words: measure(wordHeading),
    statement: measure(statement),
    finale: measure(finale),
    height: innerHeight,
    width: innerWidth,
  };
  requestFrame();
}
function resetScenes() {
  stage.style.cssText = "";
  storyStage.style.cssText = "";
  statement.style.cssText = "";
  heroHeading.removeAttribute("aria-hidden");
  heroBottom.inert = false;
  heroBottom.removeAttribute("aria-hidden");
  interiorHeading.setAttribute("aria-hidden", "true");
  interiorPhoto.setAttribute("aria-hidden", "true");
  words.forEach((word) => word.style.removeProperty("--word-opacity"));
  storySteps.forEach((step) => {
    step.style.cssText = "";
    step.inert = false;
    step.removeAttribute("aria-hidden");
  });
  chapterLetters.flat().forEach(letter => letter.style.removeProperty("--letter-reveal"));
  pointer = [0, 0];
  pointerNow = [0, 0];
}
function requestFrame() {
  if (!frame && !document.hidden) frame = requestAnimationFrame(renderFrame);
}
function renderVehicle(position, enabled) {
  let kind = "hero", progress = 0;
  if (position >= layout.finale.top - layout.height * 0.8) {
    kind = "finale";
    progress = sceneProgress(position, layout.finale.top - layout.height, layout.finale.height);
  } else if (position >= layout.statement.top - layout.height * 0.8 && position < layout.statement.top + layout.statement.height) {
    kind = "explode";
    progress = enabled ? sceneProgress(position, layout.statement.top, layout.statement.height - layout.height) : 0.55;
  } else if (position < layout.cinematic.top + layout.cinematic.height) {
    progress = enabled ? sceneProgress(position, layout.cinematic.top, layout.cinematic.height - layout.height) : 0;
  } else return;
  window.VantaVehicle?.render({scene:kind, progress, paint:selectedPaint, mobile:layout.width < 768 || layout.width / layout.height < 1.05});
}
function renderFrame(time) {
  frame = 0;
  if (!layout || document.hidden) return;
  const start = performance.now();
  const enabled = document.body.classList.contains("motion-enabled");
  header.classList.toggle("is-scrolled", scrollY > 40);
  if (!enabled) {
    renderVehicle(scrollY, false);
    lastTime = 0;
    return;
  }
  const dt = lastTime ? Math.min(0.05, (time - lastTime) / 1000) : 1 / 60;
  lastTime = time;
  currentScroll =
    Math.abs(scrollY - currentScroll) < 0.05
      ? scrollY
      : damp(currentScroll, scrollY, 16, dt);
  pointerNow = pointerNow.map((value, index) =>
    Math.abs(value - pointer[index]) < 0.001
      ? pointer[index]
      : damp(value, pointer[index], 12, dt),
  );
  const cinematicProgress = sceneProgress(
    currentScroll,
    layout.cinematic.top,
    layout.cinematic.height - layout.height,
  );
  const state = cinematicState(cinematicProgress);
  if (document.body.classList.contains("vehicle-ready")) {
    state.heading = 1 - range(cinematicProgress, 0.025, 0.14);
    state.interiorHeading = range(cinematicProgress, 0.8, 0.94);
  }
  stage.dataset.progress = cinematicProgress.toFixed(3);
  stage.style.setProperty("--scene-progress", cinematicProgress);
  stage.style.setProperty("--hero-opacity", state.heading);
  stage.style.setProperty("--hero-y", `${-cinematicProgress * 70}px`);
  stage.style.setProperty("--exterior-opacity", 1 - state.interior);
  stage.style.setProperty("--exterior-zoom", state.zoom);
  stage.style.setProperty("--interior-opacity", state.interior);
  stage.style.setProperty("--interior-zoom", 1.12 - state.interior * 0.12);
  stage.style.setProperty("--interior-heading-opacity", state.interiorHeading);
  stage.style.setProperty(
    "--interior-heading-y",
    `${(1 - state.interiorHeading) * 35}px`,
  );
  stage.style.setProperty("--pointer-x", `${pointerNow[0] * 18}px`);
  stage.style.setProperty("--pointer-y", `${pointerNow[1] * 10}px`);
  const heroVisible = state.heading > 0.15;
  if (heroBottom.inert === heroVisible) {
    heroBottom.inert = !heroVisible;
    heroBottom.setAttribute("aria-hidden", String(!heroVisible));
  }
  heroHeading.setAttribute("aria-hidden", String(state.heading < 0.05));
  interiorHeading.setAttribute(
    "aria-hidden",
    String(state.interiorHeading < 0.05),
  );
  interiorPhoto.setAttribute("aria-hidden", String(state.interior < 0.05));
  const wordProgress = clamp(
    (currentScroll + layout.height * 0.8 - layout.words.top) /
      (layout.words.height + layout.height * 0.26),
  );
  words.forEach((word, index) =>
    word.style.setProperty(
      "--word-opacity",
      0.18 + 0.82 * clamp(wordProgress * words.length - index),
    ),
  );
  const storyProgress = sceneProgress(
    currentScroll,
    layout.story.top,
    layout.story.height - layout.height,
  );
  const choreography = chapterMotion(storyProgress);
  const activeIndex = storyProgress < 0.32 ? 0 : storyProgress < 0.67 ? 1 : 2;
  storyStage.dataset.chapter = activeIndex + 1;
  storyStage.dataset.progress = storyProgress.toFixed(3);
  storyStage.style.setProperty("--story-progress", storyProgress);
  storySteps.forEach((step, index) => {
    const active = index === activeIndex;
    const chapter = choreography[index];
    step.style.setProperty("--image-reveal", chapter.reveal);
    step.style.setProperty("--image-scale", chapter.scale);
    step.style.setProperty("--text-reveal", chapter.text);
    chapterLetters[index].forEach((letter, letterIndex) =>
      letter.style.setProperty("--letter-reveal", clamp(chapter.text * 1.5 - letterIndex * 0.04)));
    step.classList.toggle("is-active", active);
    if (step.inert === active) {
      step.inert = !active;
      step.setAttribute("aria-hidden", String(!active));
    }
    storyBackgrounds[index].style.opacity = chapter.reveal;
    storyBackgrounds[index].style.setProperty("--background-scale", chapter.scale + 0.06);
    chapterDots[index].classList.toggle("is-active", active);
  });
  const statementProgress = sceneProgress(currentScroll, layout.statement.top, layout.statement.height - layout.height);
  statement.style.setProperty("--explode-progress", statementProgress);
  statement.style.setProperty("--opening-opacity", 1 - range(statementProgress, 0.02, 0.15));
  statement.style.setProperty("--opening-y", `${-range(statementProgress, 0, 0.18) * 80}px`);
  statement.style.setProperty("--anatomy-opacity", range(statementProgress, 0.22, 0.32) * (1 - range(statementProgress, 0.78, 0.93)));
  finale.style.setProperty("--finale-y", `${(1 - range(currentScroll, layout.finale.top - layout.height * 0.7, layout.finale.top)) * 45}px`);
  renderVehicle(currentScroll, true);
  frameCount++;
  totalFrameMs += performance.now() - start;
  stage.dataset.animationFrames = frameCount;
  if (frameCount % 30 === 0)
    stage.dataset.cpuFrameMs = (totalFrameMs / frameCount).toFixed(2);
  if (
    currentScroll !== scrollY ||
    pointerNow.some((value, index) => value !== pointer[index])
  )
    requestFrame();
  else lastTime = 0;
}

stage.addEventListener("pointermove", (event) => {
  if (paused || reducedMotion.matches || event.pointerType !== "mouse") return;
  pointer = [
    event.clientX / innerWidth - 0.5,
    event.clientY / innerHeight - 0.5,
  ];
  requestFrame();
});
stage.addEventListener("pointerleave", () => {
  pointer = [0, 0];
  requestFrame();
});
window.addEventListener("scroll", requestFrame, { passive: true });
window.addEventListener("resize", updateMotion);
window.addEventListener("load", measureLayout);
document.addEventListener("vehicle-ready", requestFrame);
document.fonts.ready.then(measureLayout);
new ResizeObserver(measureLayout).observe(document.getElementById("main"));
document.addEventListener("visibilitychange", () => {
  lastTime = 0;
  if (document.hidden) {
    cancelAnimationFrame(frame);
    frame = 0;
  } else {
    currentScroll = scrollY;
    requestFrame();
  }
});
const revealObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((item) =>
      item.target.classList.toggle("is-visible", item.isIntersecting),
    ),
  { threshold: 0.12 },
);
document
  .querySelectorAll(".reveal")
  .forEach((item) => revealObserver.observe(item));
document.body.classList.add("animate-ready");

const serviceRows = [...document.querySelectorAll("[data-service]")];
const serviceImages = [...document.querySelectorAll(".service-visual>img")];
const serviceLabels = [
  "BODY & AERO",
  "INTERIOR",
  "LIGHT SIGNATURE",
  "V12 CHARACTER",
  "REAR EXPRESSION",
];
function selectService(index) {
  serviceRows.forEach((row, i) => {
    row.classList.toggle("is-active", i === index);
    row.setAttribute("aria-expanded", String(i === index));
  });
  serviceImages.forEach((image, i) => {
    image.classList.toggle("is-active", i === index);
    image.setAttribute("aria-hidden", String(i !== index));
  });
  document.getElementById("service-image-label").textContent =
    serviceLabels[index];
  document.getElementById("service-image-number").textContent =
    `0${index + 1} / 05`;
}
serviceRows.forEach((row, index) => {
  row.addEventListener("click", () => selectService(index));
  row.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") selectService(index);
  });
  row.addEventListener("focus", () => selectService(index));
});

const projectForm = document.getElementById("project-form");
const projectResult = document.getElementById("project-result");
const paintImages = {
  blue: "assets/exterior-b.webp",
  violet: "assets/exterior-a.webp",
  lime: "assets/exterior-c.webp",
};
projectForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("project-name");
  if (!name.value.trim()) {
    name.setCustomValidity("Bạn nhập tên trước khi xem bản phối nhé.");
    name.reportValidity();
    return;
  }
  name.setCustomValidity("");
  const paint = document.getElementById("project-paint").value;
  document.getElementById("result-name").textContent =
    `${name.value.trim()}, đây là dấu ấn của bạn.`;
  document.getElementById("result-summary").textContent =
    `Lamborghini Revuelto · ${paints[paint]} · ${document.getElementById("project-style").value}`;
  const resultImage = document.getElementById("result-image");
  resultImage.src = new URL(paintImages[paint], vantaAssetBase).href;
  resultImage.alt = `Revuelto ${paints[paint]} trong bản phối của bạn`;
  projectForm.hidden = true;
  projectResult.hidden = false;
  projectDialog.classList.add("has-result");
  document.getElementById("edit-project").focus();
});
document
  .getElementById("project-name")
  .addEventListener("input", (event) => event.target.setCustomValidity(""));
document.getElementById("edit-project").addEventListener("click", () => {
  projectResult.hidden = true;
  projectForm.hidden = false;
  projectDialog.classList.remove("has-result");
  document.getElementById("project-name").focus();
});

const gallery = document.getElementById("gallery-dialog");
const galleries = [
  {
    title: "Midnight expression.",
    photos: [
      ["assets/exterior-b.webp", "Revuelto màu xanh đậm trong studio"],
      ["assets/headlight.webp", "Cụm đèn chữ Y của Revuelto"],
      ["assets/interior.webp", "Khoang lái Revuelto"],
    ],
  },
  {
    title: "Beyond the city.",
    photos: [
      ["assets/road-1.webp", "Revuelto giữa núi tuyết"],
      ["assets/road-2.webp", "Revuelto màu cam trên đường đua"],
      ["assets/rear.webp", "Thiết kế đuôi Revuelto"],
    ],
  },
];
let gallerySet = 0,
  galleryIndex = 0;
function updateGallery() {
  const collection = galleries[gallerySet];
  const photo = collection.photos[galleryIndex];
  document.getElementById("gallery-title").textContent = collection.title;
  const image = document.getElementById("gallery-image");
  image.src = new URL(photo[0], vantaAssetBase).href;
  image.alt = photo[1];
  document.getElementById("gallery-count").textContent =
    `0${galleryIndex + 1} / 0${collection.photos.length}`;
}
function moveGallery(direction) {
  galleryIndex =
    (galleryIndex + direction + galleries[gallerySet].photos.length) %
    galleries[gallerySet].photos.length;
  updateGallery();
}
document.querySelectorAll("[data-gallery]").forEach((button) =>
  button.addEventListener("click", () => {
    gallerySet = Number(button.dataset.gallery);
    galleryIndex = 0;
    updateGallery();
    gallery.showModal();
    document.body.classList.add("modal-open");
  }),
);
document
  .getElementById("gallery-previous")
  .addEventListener("click", () => moveGallery(-1));
document
  .getElementById("gallery-next")
  .addEventListener("click", () => moveGallery(1));
gallery.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    event.preventDefault();
    moveGallery(event.key === "ArrowRight" ? 1 : -1);
  }
});
document
  .getElementById("back-to-top")
  .addEventListener("click", () =>
    window.scrollTo({
      top: 0,
      behavior: paused || reducedMotion.matches ? "instant" : "smooth",
    }),
  );
document.getElementById("replay-intro").addEventListener("click", () => {
  entry.showModal();
  document.body.classList.add("modal-open");
});
document.getElementById("finale-back").addEventListener("click", () =>
  document.getElementById("back-to-top").click());
document.querySelector(".scroll-cue").addEventListener("click", (event) => {
  event.preventDefault();
  window.scrollTo({top: paused || reducedMotion.matches ? layout.cinematic.height : layout.height * 0.9, behavior: paused || reducedMotion.matches ? "instant" : "smooth"});
});
document
  .querySelectorAll("[data-paint-photo]")
  .forEach((photo) =>
    photo.setAttribute(
      "aria-hidden",
      String(!photo.classList.contains("is-selected")),
    ),
  );
updateMotion();
