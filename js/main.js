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
  const W = canvas.width,
    H = canvas.height;
  const pad = 7.5;
  const innerW = W - 2 * pad;
  const innerH = H - 2 * pad;
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
  let rafId = 0;
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
    rafId = requestAnimationFrame(loop);
  }
  function startLoop() {
    if (!running) rafId = requestAnimationFrame(loop);
  }
});
