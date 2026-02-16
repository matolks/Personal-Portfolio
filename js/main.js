document.addEventListener("DOMContentLoaded", () => {
  ////// BUTTONS //////
  document.querySelector("#gitHub").addEventListener("click", () => {
    window.open("https://github.com/matolks", "_blank", "noopener");
  });
  document.querySelector("#linkedIn").addEventListener("click", () => {
    window.open(
      "https://www.linkedin.com/in/vincematolka",
      "_blank",
      "noopener",
    );
  });
  document.querySelector("#monkeyType").addEventListener("click", () => {
    window.open(
      "https://monkeytype.com/profile/matolkaVince",
      "_blank",
      "noopener",
    );
  });

  //////// YELLOW WIGGLE //////////
  const canvas = document.getElementById("wiggle");
  const ctx = canvas.getContext("2d");
  let W = 0,
    H = 0,
    pad = 7.5,
    innerW = 0,
    innerH = 0;
  function resizeWiggleCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw in CSS
    W = rect.width;
    H = rect.height;

    innerW = W - 2 * pad;
    innerH = H - 2 * pad;
  }
  resizeWiggleCanvas();
  window.addEventListener("resize", resizeWiggleCanvas);
  const segments = 9; // # of wiggles
  const amp = 0.015;
  function drawBorder(time) {
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#FFD200";
    ctx.beginPath();
    const perimeter = 2 * (innerW + innerH);
    const totalSegments = segments * 4;
    const segLength = perimeter / totalSegments;
    let dist = 0;
    for (let seg = 0; seg < totalSegments; seg++) {
      const phase = seg % 2 === 0 ? 0 : Math.PI;
      const a = Math.sin(time * 0.005 + phase) * amp;
      const steps = 10;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const L = segLength;
        const xLocal = (t - 0.5) * L;
        const yLocal = a * (xLocal * xLocal - L * 0.5 * (L * 0.5));
        const pos = dist + t * L;
        let x, y;
        if (pos < innerW) {
          // top left
          x = pad + pos;
          y = pad + yLocal;
        } else if (pos < innerW + innerH) {
          // top right
          x = pad + innerW + yLocal;
          y = pad + (pos - innerW);
        } else if (pos < innerW + innerH + innerW) {
          // bottome right
          x = pad + (innerW + innerH + innerW - pos);
          y = pad + innerH - yLocal;
        } else {
          // bottom left
          x = pad - yLocal;
          y = pad + (2 * (innerW + innerH) - pos);
        }
        if (seg === 0 && i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      dist += segLength;
    }
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.closePath();
    ctx.stroke();
  }
  function animate(t) {
    drawBorder(t);
    requestAnimationFrame(animate);
  }
  animate(0);

  ////// MOVING AND FADING //////
  const mover = document.getElementById("nameID");
  const fader = document.getElementsByClassName("fadeIn");
  let started = false;
  let running = false;
  const ease = 0.02;
  const lift = 25; // screen percentage
  let yOff = 0;
  let tyOff = 0;
  function applyTransform() {
    mover.style.transform = `translate(-50%, -50%) translateY(${yOff}vh)`;
  }
  // ensure correct initial
  applyTransform();
  function startIntro() {
    if (started) return;
    started = true;
    tyOff = -lift;
    setTimeout(() => {
      Array.from(fader).forEach((el) => el.classList.add("show"));
    }, 120);
    startLoop();
    window.removeEventListener("mousemove", startIntro);
  }
  window.addEventListener("mousemove", startIntro, { passive: true });
  function loop() {
    running = true;
    yOff += (tyOff - yOff) * ease;
    applyTransform();
    if (Math.abs(tyOff - yOff) < 0.5) {
      running = false;
      return;
    }
    requestAnimationFrame(loop);
  }
  function startLoop() {
    if (!running) requestAnimationFrame(loop);
  }
});

////// BACKGROUND //////
const svg = document.getElementById("bg");
const width = 3840;
const height = 2160;
const shapeCount = 250;
const shapes = [];
function random(min, max) {
  // for random positioning
  return Math.random() * (max - min) + min;
}
// Add shapes, maybe only keep circles
for (let i = 0; i < shapeCount; i++) {
  const size = random(20, 90);
  const x = random(0, width);
  const y = random(0, height);
  let el;
  el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  el.setAttribute("cx", x);
  el.setAttribute("cy", y);
  el.setAttribute("r", size / 2);
  el.classList.add("shape");
  svg.appendChild(el);
  shapes.push({
    el: el,
    baseX: x,
  });
}
let start = null;
//Adjust -> maybe add a second wave
const duration = 12000; // wave timeing
const waveWidth = 400; // wave size
function animate(timestamp) {
  if (!start) start = timestamp; // heartbeat
  const elapsed = (timestamp - start) / 1000;
  const speed = width / (duration / 1000);
  const wavePosition =
    ((elapsed * speed) % (width + waveWidth * 2)) - waveWidth;
  const rootStyles = getComputedStyle(document.documentElement);
  const baseFill = rootStyles.getPropertyValue("--base-fill");
  const waveFill = rootStyles.getPropertyValue("--wave-fill");
  shapes.forEach((shape) => {
    const distance = Math.abs(shape.baseX - wavePosition);
    const influence = Math.max(0, 1 - distance / waveWidth); // wave effect
    const eased = Math.sin((influence * Math.PI) / 2); // maybe adjust
    const scale = 1 + eased * 0.04; // how *big* the wave is visually
    shape.el.style.transform = `scale(${scale})`;
    shape.el.style.fill = eased > 0 ? waveFill : baseFill;
  });
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
