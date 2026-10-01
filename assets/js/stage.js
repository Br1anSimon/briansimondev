/**
 * three.js stage: one fixed, full-screen WebGL canvas behind the page.
 * Each project frame is pinned to an empty DOM element (#anchor-N), so the
 * 3D window scrolls with the page while the hero shows all three fanned out.
 */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { PROJECTS, makeCanvas, TW, TH, mountFlatFallback } from './mockups.js';

export function initStage() {
  const canvas = document.getElementById('stage');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Throws if WebGL is unavailable; main.js catches that and shows the flat fallback.
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });

  const isSmall = () => innerWidth < 760;
  renderer.setPixelRatio(Math.min(devicePixelRatio, isSmall() ? 1.5 : 1.75));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const FOV = 35,
    DIST = 10;
  const camera = new THREE.PerspectiveCamera(FOV, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0, DIST);

  scene.add(new THREE.AmbientLight(0xffffff, 0.45));
  const key = new THREE.DirectionalLight(0xffdcae, 1.6);
  key.position.set(4, 5, 7);
  scene.add(key);
  const rim = new THREE.PointLight(0xf2a541, 30, 30);
  rim.position.set(-5, -2, 3);
  scene.add(rim);
  const cool = new THREE.PointLight(0x8fb3c0, 12, 30);
  cool.position.set(6, -4, 2);
  scene.add(cool);

  // soft amber glow texture
  function glowTex() {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    r.addColorStop(0, 'rgba(242,165,65,0.55)');
    r.addColorStop(0.5, 'rgba(242,165,65,0.12)');
    r.addColorStop(1, 'rgba(242,165,65,0)');
    g.fillStyle = r;
    g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  const GLOW = glowTex();

  const SW = 3.2,
    SH = (SW * TH) / TW; // screen size in world units
  const FW = SW + 0.1,
    FH = SH + 0.1; // frame (bezel) size
  const bodyGeo = new RoundedBoxGeometry(FW, FH, 0.09, 4, 0.06);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1b1916, roughness: 0.42, metalness: 0.65 });
  const screenGeo = new THREE.PlaneGeometry(SW, SH);
  const maxAniso = renderer.capabilities.getMaxAnisotropy();

  const frames = PROJECTS.map((p, i) => {
    let tex = null;
    tex = new THREE.CanvasTexture(
      makeCanvas(p, () => {
        if (tex) tex.needsUpdate = true;
      }),
    );
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = maxAniso;
    tex.needsUpdate = true;
    const group = new THREE.Group();
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    const screen = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
    screen.position.z = 0.047;
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(FW * 1.9, FH * 2.1),
      new THREE.MeshBasicMaterial({
        map: GLOW,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: i === 2 ? 0.6 : 0.9,
      }),
    );
    glow.position.z = -0.4;
    group.add(glow, body, screen);
    scene.add(group);
    return { group, anchor: document.getElementById('anchor-' + i), hover: 0, hoverT: 0 };
  });
  frames.forEach((f) => {
    f.anchor.addEventListener('pointerenter', () => (f.hoverT = 1));
    f.anchor.addEventListener('pointerleave', () => (f.hoverT = 0));
  });

  // drifting dust
  const COUNT = isSmall() ? 900 : 2000;
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 26;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
    pos[i * 3 + 2] = -12 + Math.random() * 13;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({
      size: 0.035,
      color: 0xf2c88a,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  );
  scene.add(dust);

  // helpers
  const heroSection = document.getElementById('top');
  const heroAnchor = document.getElementById('hero-anchor');
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  let viewH, viewW;
  function measure() {
    viewH = 2 * DIST * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    viewW = viewH * camera.aspect;
  }
  function rectToWorld(r) {
    const cx = r.left + r.width / 2,
      cy = r.top + r.height / 2;
    return {
      x: (cx / innerWidth - 0.5) * viewW,
      y: -(cy / innerHeight - 0.5) * viewH,
      w: (r.width / innerWidth) * viewW,
      h: (r.height / innerHeight) * viewH,
      nx: cx / innerWidth - 0.5,
      ny: cy / innerHeight - 0.5,
    };
  }
  const fit = (a) => Math.min(a.w / FW, a.h / FH);

  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    measure();
  }
  addEventListener('resize', resize);
  resize();

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener(
    'pointermove',
    (e) => {
      mouse.tx = e.clientX / innerWidth - 0.5;
      mouse.ty = e.clientY / innerHeight - 0.5;
    },
    { passive: true },
  );

  // hero fan layout: [dx, dy, z, rotX, rotY, rotZ] relative to hero anchor
  const FAN = [
    [-0.06, 0.2, -1.8, -0.06, -0.42, 0.03], // Icing House, back left
    [0.04, -0.04, 0.0, -0.04, -0.3, -0.02], // PowerHouse, front
    [0.16, -0.3, -3.6, -0.02, -0.52, 0.05], // Yours, far back
  ];
  const tmp = { p: new THREE.Vector3(), r: new THREE.Euler() };
  const clock = new THREE.Clock();

  function frame() {
    const t = clock.getElapsedTime();
    mouse.x = lerp(mouse.x, mouse.tx, 0.06);
    mouse.y = lerp(mouse.y, mouse.ty, 0.06);

    const hr = heroSection.getBoundingClientRect();
    const k = ease(clamp(-hr.top / (hr.height * 0.7), 0, 1)); // 0 = hero fan, 1 = case anchors
    const ha = rectToWorld(heroAnchor.getBoundingClientRect());
    const hs = Math.min(ha.w / FW, ha.h / FH) * (isSmall() ? 0.78 : 0.82);

    frames.forEach((f, i) => {
      const a = rectToWorld(f.anchor.getBoundingClientRect());
      const s1 = fit(a) * 0.9;
      const F = FAN[i];
      const bob = reduce ? 0 : Math.sin(t * 0.8 + i * 1.7) * 0.05;

      // hero pose
      const hx = ha.x + F[0] * ha.w,
        hy = ha.y + F[1] * ha.h + bob,
        hz = F[2];
      // anchored pose: turn toward the page centre, tilt as it passes through the viewport
      const ax = a.x,
        ay = a.y + bob * 0.5,
        az = 0;
      const arY = clamp(-a.nx * 0.9, -0.38, 0.38),
        arX = clamp(a.ny * 0.45, -0.3, 0.3);

      f.hover = lerp(f.hover, f.hoverT, 0.12);
      const sc = lerp(hs, s1, k) * (1 + f.hover * 0.035);
      f.group.position.set(lerp(hx, ax, k), lerp(hy, ay, k), lerp(hz, az, k) + f.hover * 0.3);
      f.group.rotation.set(
        lerp(F[3], arX, k) + mouse.y * 0.08 * (reduce ? 0 : 1),
        lerp(F[4], arY, k) + mouse.x * 0.14 * (reduce ? 0 : 1) - f.hover * arY * 0.4,
        lerp(F[5], 0, k),
      );
      f.group.scale.setScalar(sc);
      f.group.visible = f.group.position.y < viewH + 6 && f.group.position.y > -viewH - 6;
    });

    if (!reduce) {
      dust.rotation.y = t * 0.012;
    }
    dust.position.y = (scrollY / innerHeight) * 1.2;

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    canvas.style.display = 'none';
    mountFlatFallback();
  });
  requestAnimationFrame(frame);
}
