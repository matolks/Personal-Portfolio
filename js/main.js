document.addEventListener("DOMContentLoaded", () => {
  // tetris
  document.addEventListener("keydown", function (key) {
    if (key.keyCode == 32) {
      // window.location.href = "pong.html";
    }
  });

  ////// BUTTONS //////
  document.querySelector("#gitHub").addEventListener("click", () => {
    window.open("https://github.com/matolks", "_blank", "noopener");
  });
  document.querySelector("#linkedIn").addEventListener("click", () => {
    window.open(
      "https://www.linkedin.com/in/vincematolka",
      "_blank",
      "noopener"
    );
  });
  document.querySelector("#monkeyType").addEventListener("click", () => {
    window.open(
      "https://monkeytype.com/profile/matolkaVince",
      "_blank",
      "noopener"
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
  function halfSize() {
    const r = mover.getBoundingClientRect();
    return { hw: r.width / 2, hh: r.height / 2 };
  }
  let x = innerWidth / 2; // centering
  let y = innerHeight / 2;
  let tx = x;
  let ty = y;
  function applyTransform() {
    const { hw, hh } = halfSize();
    mover.style.transform = `translate(${x - hw}px, ${y - hh}px)`;
  }
  applyTransform();
  function onFirstMouseMove() {
    if (started) return;
    started = true;
    const margin = 375;
    tx = 1.5 * margin;
    ty = margin;
    startLoop();
    Array.from(fader).forEach((el) => el.classList.add("show"));
    window.removeEventListener("mousemove", onFirstMouseMove);
  }
  window.addEventListener("mousemove", onFirstMouseMove, { passive: true });
  const ease = 0.025; // speed
  let rafId = 0;
  function loop() {
    running = true;
    x += (tx - x) * ease;
    y += (ty - y) * ease;
    applyTransform();
    if (Math.hypot(tx - x, ty - y) < 0.5) {
      running = false;
      cancelAnimationFrame(rafId);
      return;
    }
    rafId = requestAnimationFrame(loop);
  }
  function startLoop() {
    if (!running) rafId = requestAnimationFrame(loop);
  }
});
