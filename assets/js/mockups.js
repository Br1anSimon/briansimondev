/**
 * Drawn mockups of each client site, rendered to a <canvas>.
 * Used as the 3D frame textures and as the flat fallback when WebGL is unavailable.
 *
 * To show a real screenshot instead, add assets/img/work/<slug>.jpg (about 1600x940).
 * The mockup is replaced automatically once the image loads.
 */
export const TW = 1600,
  TH = 1000;
const BAR = 60;
function rr(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
function chrome(c, url, dark) {
  c.fillStyle = dark ? '#1E1C1A' : '#2A2725';
  c.fillRect(0, 0, TW, BAR);
  ['#FF5F57', '#FEBC2E', '#28C840'].forEach((col, i) => {
    c.fillStyle = col;
    c.beginPath();
    c.arc(32 + i * 26, BAR / 2, 8, 0, Math.PI * 2);
    c.fill();
  });
  c.fillStyle = '#3A3633';
  rr(c, TW / 2 - 300, 13, 600, 34, 17);
  c.fill();
  c.fillStyle = '#CFC6B8';
  c.font = '500 19px "JetBrains Mono", ui-monospace, monospace';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText(url, TW / 2, BAR / 2 + 1);
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
}
function cover(c, img) {
  const sw = TW,
    sh = TH - BAR,
    s = Math.max(sw / img.width, sh / img.height);
  const w = img.width * s;
  c.drawImage(img, (sw - w) / 2, BAR, w, img.height * s);
}

function icing(c) {
  c.fillStyle = '#FBF4EC';
  c.fillRect(0, BAR, TW, TH - BAR);
  const y0 = BAR;
  c.fillStyle = '#5A3426';
  c.font = 'italic 600 38px Georgia, "Times New Roman", serif';
  c.fillText('The Icing House', 70, y0 + 70);
  c.font = '500 20px system-ui, sans-serif';
  c.fillStyle = '#7A5A4E';
  ['Catalog', 'Press', 'About', 'Contact'].forEach((t, i) => c.fillText(t, 980 + i * 120, y0 + 66));
  c.fillStyle = '#D9788F';
  rr(c, 1440, y0 + 38, 110, 44, 22);
  c.fill();
  c.fillStyle = '#fff';
  c.font = '600 18px system-ui';
  c.fillText('Order', 1466, y0 + 66);
  c.fillStyle = '#E9DCCD';
  c.fillRect(70, y0 + 110, TW - 140, 2);
  c.fillStyle = '#D9788F';
  c.font = '600 20px system-ui';
  c.fillText('PROUDLY PERUVIAN, DELICIOUSLY AMERICAN', 80, y0 + 220);
  c.fillStyle = '#4A2C21';
  c.font = '600 76px Georgia, serif';
  ['Award-winning', 'alfajores, shipped', 'nationwide.'].forEach((t, i) =>
    c.fillText(t, 76, y0 + 310 + i * 84),
  );
  c.fillStyle = '#7A5A4E';
  c.font = '400 24px system-ui';
  c.fillText('Order ahead for kiosk pickup in Orlando, or ship a box anywhere.', 80, y0 + 530);
  c.fillStyle = '#4A2C21';
  rr(c, 80, y0 + 570, 230, 64, 32);
  c.fill();
  c.fillStyle = '#FBF4EC';
  c.font = '600 22px system-ui';
  c.fillText('Shop the catalog', 106, y0 + 610);
  c.strokeStyle = '#4A2C21';
  c.lineWidth = 2;
  rr(c, 330, y0 + 570, 200, 64, 32);
  c.stroke();
  c.fillStyle = '#4A2C21';
  c.fillText('Pickup info', 366, y0 + 610);
  // plate of alfajores
  const cx = 1180,
    cy = y0 + 400;
  const g = c.createRadialGradient(cx, cy, 40, cx, cy, 300);
  g.addColorStop(0, '#F6D9DF');
  g.addColorStop(1, '#F3C6CF');
  c.fillStyle = g;
  c.beginPath();
  c.arc(cx, cy, 290, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#FFFFFF';
  c.beginPath();
  c.arc(cx, cy, 230, 0, Math.PI * 2);
  c.fill();
  [
    [-80, -60],
    [90, -50],
    [0, 70],
    [-110, 90],
    [120, 100],
  ].forEach(([dx, dy]) => {
    c.fillStyle = '#E7C9A0';
    c.beginPath();
    c.ellipse(cx + dx, cy + dy + 10, 82, 60, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#8A5230';
    c.fillRect(cx + dx - 80, cy + dy - 2, 160, 12);
    c.fillStyle = '#F3E2C6';
    c.beginPath();
    c.ellipse(cx + dx, cy + dy - 8, 82, 58, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(255,255,255,.85)';
    for (let k = 0; k < 40; k++) {
      const a = Math.random() * 6.28,
        r = Math.random() * 70;
      c.fillRect(cx + dx + Math.cos(a) * r, cy + dy - 8 + Math.sin(a) * r * 0.7, 3, 3);
    }
  });
  // product row
  const names = ['Alfajores', 'Tiramisu', 'Brownies', 'Custom cakes'],
    cols = ['#E7C9A0', '#C9A27E', '#5B3A29', '#F2C3CC'];
  names.forEach((n, i) => {
    const x = 80 + i * 370,
      y = y0 + 700;
    c.fillStyle = '#fff';
    rr(c, x, y, 340, 200, 18);
    c.fill();
    c.fillStyle = cols[i];
    c.beginPath();
    c.arc(x + 90, y + 100, 58, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#4A2C21';
    c.font = '600 26px Georgia, serif';
    c.fillText(n, x + 170, y + 95);
    c.fillStyle = '#A07E70';
    c.font = '400 18px system-ui';
    c.fillText('View details', x + 170, y + 128);
  });
}

function powerhouse(c) {
  const y0 = BAR;
  c.fillStyle = '#14120F';
  c.fillRect(0, BAR, TW, TH - BAR);
  // industrial arched windows with warm glow
  for (let i = 0; i < 5; i++) {
    const x = 120 + i * 290,
      y = y0 + 120,
      w = 210,
      h = 440;
    const g = c.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, '#F5B35A');
    g.addColorStop(0.6, '#B5622A');
    g.addColorStop(1, '#3A1E10');
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(x, y + h);
    c.lineTo(x, y + w / 2);
    c.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0);
    c.lineTo(x + w, y + h);
    c.closePath();
    c.fill();
    c.strokeStyle = '#14120F';
    c.lineWidth = 6;
    for (let k = 1; k < 3; k++) {
      c.beginPath();
      c.moveTo(x + (k * w) / 3, y + 20);
      c.lineTo(x + (k * w) / 3, y + h);
      c.stroke();
    }
    for (let k = 1; k < 6; k++) {
      c.beginPath();
      c.moveTo(x, y + w / 2 + k * 62);
      c.lineTo(x + w, y + w / 2 + k * 62);
      c.stroke();
    }
  }
  const sh = c.createLinearGradient(0, y0, 0, TH);
  sh.addColorStop(0, 'rgba(20,18,15,.55)');
  sh.addColorStop(0.55, 'rgba(20,18,15,.35)');
  sh.addColorStop(1, 'rgba(20,18,15,1)');
  c.fillStyle = sh;
  c.fillRect(0, y0, TW, TH - y0);
  c.fillStyle = '#EDE2D0';
  c.font = '700 24px system-ui';
  c.fillText('POWERHOUSE', 70, y0 + 66);
  c.fillStyle = '#D98B3A';
  c.fillText('EATERY', 240, y0 + 66);
  c.fillStyle = '#BFB3A0';
  c.font = '500 19px system-ui';
  ['Menu', 'Events', 'Our Story', 'Visit'].forEach((t, i) => c.fillText(t, 1000 + i * 120, y0 + 64));
  c.textAlign = 'center';
  c.fillStyle = '#D98B3A';
  c.font = '600 20px system-ui';
  c.fillText('EST. 1989 · WHITE HAVEN, PA', TW / 2, y0 + 330);
  c.fillStyle = '#F4EBDD';
  c.font = '700 92px Georgia, serif';
  c.fillText('Dinner in a', TW / 2, y0 + 430);
  c.fillText('power plant.', TW / 2, y0 + 525);
  c.fillStyle = '#CBBFAE';
  c.font = '400 24px system-ui';
  c.fillText('Elevated American cuisine: steaks, seafood, and seasonal plates.', TW / 2, y0 + 580);
  c.fillStyle = '#D98B3A';
  rr(c, TW / 2 - 230, y0 + 615, 210, 62, 6);
  c.fill();
  c.fillStyle = '#14120F';
  c.font = '700 21px system-ui';
  c.fillText('VIEW MENU', TW / 2 - 125, y0 + 654);
  c.strokeStyle = '#EDE2D0';
  c.lineWidth = 2;
  rr(c, TW / 2 + 20, y0 + 615, 210, 62, 6);
  c.stroke();
  c.fillStyle = '#EDE2D0';
  c.fillText('RESERVE', TW / 2 + 125, y0 + 654);
  c.textAlign = 'left';
  ['Filet Mignon', 'Crab Cakes', 'Pork à la Powerhouse'].forEach((n, i) => {
    const x = 70 + i * 490,
      y = y0 + 740;
    c.fillStyle = '#1F1C18';
    c.fillRect(x, y, 460, 160);
    c.fillStyle = '#D98B3A';
    c.fillRect(x, y, 4, 160);
    c.fillStyle = '#F4EBDD';
    c.font = '600 30px Georgia, serif';
    c.fillText(n, x + 30, y + 70);
    c.fillStyle = '#9C907E';
    c.font = '400 18px system-ui';
    c.fillText('House favorite', x + 30, y + 108);
  });
}

function yours(c) {
  const y0 = BAR;
  c.fillStyle = '#121110';
  c.fillRect(0, BAR, TW, TH - BAR);
  c.strokeStyle = 'rgba(242,165,65,.55)';
  c.lineWidth = 3;
  c.setLineDash([16, 14]);
  rr(c, 60, y0 + 50, TW - 120, TH - y0 - 100, 24);
  c.stroke();
  c.setLineDash([]);
  c.fillStyle = '#2A2622';
  [
    [120, y0 + 110, 240, 26],
    [1100, y0 + 110, 90, 22],
    [1220, y0 + 110, 90, 22],
    [1340, y0 + 110, 140, 22],
  ].forEach((a) => {
    rr(c, ...a, 11);
    c.fill();
  });
  c.fillStyle = '#F2A541';
  c.font = '500 26px "JetBrains Mono", ui-monospace, monospace';
  c.fillText('yourbusiness.com', 120, y0 + 300);
  c.fillStyle = '#EDE6DA';
  c.font = '800 104px "Bricolage Grotesque", system-ui, sans-serif';
  c.fillText('This could be', 112, y0 + 420);
  c.fillText('your homepage.', 112, y0 + 530);
  c.fillStyle = '#2A2622';
  rr(c, 120, y0 + 590, 520, 22, 11);
  c.fill();
  rr(c, 120, y0 + 630, 420, 22, 11);
  c.fill();
  c.fillStyle = '#F2A541';
  rr(c, 120, y0 + 690, 240, 64, 32);
  c.fill();
  c.fillStyle = '#1A1206';
  c.font = '600 24px system-ui';
  c.fillText('Let’s talk', 176, y0 + 731);
  c.fillStyle = '#1E1B19';
  [0, 1, 2].forEach((i) => {
    rr(c, 120 + i * 460, y0 + 790, 430, 100, 16);
    c.fill();
  });
}

export const PROJECTS = [
  { slug: 'icinghouse', url: 'theicinghouse.com', draw: icing, dark: false },
  { slug: 'powerhouse', url: 'powerhouseeatery.com', draw: powerhouse, dark: true },
  { slug: 'yours', url: 'yourbusiness.com', draw: yours, dark: true },
];

export function makeCanvas(p, onUpdate) {
  const cv = document.createElement('canvas');
  cv.width = TW;
  cv.height = TH;
  const c = cv.getContext('2d');
  const paint = (img) => {
    c.clearRect(0, 0, TW, TH);
    if (img) cover(c, img);
    else p.draw(c);
    chrome(c, p.url, p.dark);
    onUpdate && onUpdate();
  };
  paint();
  let shot = null;
  if (p.slug !== 'yours') {
    const img = new Image();
    img.onload = () => {
      shot = img;
      paint(img);
    };
    img.onerror = () => {};
    img.src = 'assets/img/work/' + p.slug + '.jpg';
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => paint(shot));
  return cv;
}
/** Show flat images in place of the 3D frames (no WebGL, script blocked, or context lost). */
export function mountFlatFallback() {
  const root = document.documentElement;
  if (root.classList.contains('no-3d')) return;
  root.classList.add('no-3d');
  PROJECTS.forEach((p, i) => {
    const a = document.getElementById('anchor-' + i);
    if (a && !a.firstChild) a.appendChild(makeCanvas(p));
  });
  const hero = document.getElementById('hero-anchor');
  if (hero && !hero.firstChild) hero.appendChild(makeCanvas(PROJECTS[1]));
}
