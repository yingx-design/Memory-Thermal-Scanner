// ====== Thermal Memory Scanner / 家乡物件热感扫描仪 ======

// 0: 老干妈   1: 小狗娃娃   2: 拍立得
let items = [
  {
    name: "Chili Sauce",
    heat: 1.0,
    text: "The moment I open this can and breathe is its familiar spicy warmth, I'm reminded of home in the simplest,most reliable way"
  },
  {
    name: "Doll",
    heat: 0.8,
    text: "“Since 2022, she’s been my silent bedside companion—steady, wordless, and always there when I reach out in a place that never quite feels like home.”"
  },
  {
    name: "Polaroid camera",
    heat: 0.7,
    text: "She captures not scenery but small, precious moments—faces, meals, smiles—that I hope will one day become the quiet backups of my future memories."
  }
];

let currentIndex = 0;
let scanY = -80; // 扫描线初始在画面上方

function setup() {
  createCanvas(900, 550);
  noStroke();
  textFont("sans-serif");
}

function draw() {
  let item = items[currentIndex];

  drawThermalBackground(currentIndex);
  drawHeatCore(item, currentIndex);
  drawScanLine(currentIndex);
  drawTexts(item);
}

// -------- 背景：根据物件不同配色 --------
function drawThermalBackground(index) {
  let topC, bottomC;

  if (index === 0) {
    topC = color(5, 10, 40);
    bottomC = color(120, 40, 80);
  } else if (index === 1) {
    topC = color(40, 0, 60);
    bottomC = color(200, 70, 140);
  } else {
    topC = color(0, 25, 70);
    bottomC = color(0, 130, 190);
  }

  for (let y = 0; y < height; y += 4) {
    let t = map(y, 0, height, 0, 1);
    let c = lerpColor(topC, bottomC, t);
    stroke(red(c), green(c), blue(c), 220);
    line(0, y, width, y);
  }
  noStroke();

  for (let x = 0; x < width; x += 24) {
    for (let y = 0; y < height; y += 24) {
      let n = noise(x * 0.02, y * 0.02, frameCount * 0.01);
      let r = map(n, 0, 1, 1.5, 4);
      let dotC = lerpColor(topC, bottomC, n * 0.8);
      fill(red(dotC), green(dotC), blue(dotC), 60);
      ellipse(x, y, r, r);
    }
  }
}

// -------- 热成像调色盘 --------
function heatColor(t) {
  t = constrain(t, 0, 1);
  let palette = [
    color(0, 20, 120),
    color(0, 180, 255),
    color(0, 220, 120),
    color(255, 230, 0),
    color(255, 140, 0),
    color(255, 40, 0),
    color(255, 0, 120)
  ];
  let n = palette.length - 1;
  let idx = t * n;
  let i0 = floor(idx);
  let i1 = min(i0 + 1, n);
  let f = idx - i0;
  return lerpColor(palette[i0], palette[i1], f);
}

// -------- 中间物件 + 热圈 + 扫描显现 --------
function drawHeatCore(item, index) {
  push();
  translate(width / 2, height / 2);
  rectMode(CENTER);

  let baseHeat = item.heat;

  // --- clip: 扫描线以下才可见 ---
  let ctx = drawingContext;
  ctx.save();
  ctx.beginPath();

  let visibleHeight = constrain(scanY, 0, height);
  ctx.rect(-width / 2, -height / 2, width, visibleHeight);
  ctx.clip();

  // ------- 物件本体 -------
  if (index === 0) {
    // ======= 老干妈（新版：无粉色、更瘦、更抽象） =======
    let bottleColor = color(160, 20, 20);     // 深红
    let chiliColor  = color(110, 0, 0);       // 深褐红
    let oilColor    = color(255, 220, 170, 180);
    let capColor    = color(200, 40, 40);
    let labelColor  = color(255, 200, 60, 230);

    let bodyW = 110;
    let bodyH = 260;

    // 玻璃瓶身
    fill(bottleColor);
    rect(0, 40, bodyW, bodyH, 40);

    // 辣椒主体（深红，不要粉色）
    fill(chiliColor);
    rect(0, 95, bodyW * 0.78, bodyH * 0.5, 28);

    // 油层
    fill(oilColor);
    ellipse(0, -5, bodyW * 0.8, 46);

    // 瓶盖
    fill(capColor);
    rect(0, -60, bodyW * 0.45, 26, 6);

    // 标签
    fill(labelColor);
    rect(0, 35, bodyW * 0.85, bodyH * 0.25, 18);

    // 商标热点（更小、更淡、更抽象）
    fill(255, 220, 180, 150);
    ellipse(0, 35, 22, 22);
    fill(200, 130, 60, 90);
    ellipse(0, 35, 10, 10);

  } else if (index === 1) {
    // 小狗娃娃
    let furLight = color(255, 235, 245);
    let furMid   = color(255, 190, 215);
    let furDeep  = color(250, 150, 195);
    let scarfCol = color(245, 110, 170);

    fill(furLight);
    ellipse(0, 85, 150, 170);
    fill(furMid);
    ellipse(0, 80, 120, 145);

    fill(furLight);
    ellipse(-45, 155, 60, 45);
    ellipse(45, 155, 60, 45);

    fill(furLight);
    ellipse(-5, -10, 115, 105);

    fill(furDeep);
    ellipse(-70, -5, 70, 40);
    ellipse(55, -20, 70, 45);

    fill(255, 245, 250);
    ellipse(-5, 5, 70, 50);

    fill(furDeep);
    ellipse(5, -2, 14, 12);

    fill(80, 40, 70);
    ellipse(-28, -18, 8, 8);
    ellipse(20, -20, 8, 8);

    noFill();
    stroke(80, 40, 70);
    strokeWeight(1.8);
    arc(-2, 8, 30, 18, 0.1, PI - 0.1);
    noStroke();

    fill(scarfCol);
    rect(-5, 30, 125, 26, 14);
    rect(20, 70, 32, 85, 14);

  } else if (index === 2) {
    // 拍立得
    let bodyCool = color(140, 190, 255);
    let bodyDeep = color(60, 120, 220);
    let glow     = color(210, 235, 255, 240);

    fill(bodyCool);
    let bodyW = 260;
    let bodyH = 190;
    rect(0, 20, bodyW, bodyH, 40);

    fill(red(bodyDeep), green(bodyDeep), blue(bodyDeep), 170);
    rect(0, 30, bodyW * 0.9, bodyH * 0.55, 30);

    fill(glow);
    rect(0, -60, bodyW * 0.6, 60, 20);

    fill(230, 245, 255);
    ellipse(-45, 18, 80, 80);
    fill(80, 140, 230);
    ellipse(-45, 18, 40, 40);

    fill(220, 240, 255, 230);
    rect(60, 55, 90, 30, 8);

    fill(255, 250, 240, 235);
    rect(60, 110, 80, 90, 10);
  }

  ctx.restore();

  // --- 热圈 halo ---
  let steps = 130;
  for (let i = 0; i < steps; i++) {
    let angle = (TWO_PI / steps) * i;
    let radius = 170 + noise(i * 0.12, frameCount * 0.01) * 45;
    let t = 0.6 + sin(angle * 2 + frameCount * 0.03) * 0.2;
    t *= baseHeat;

    let hc = heatColor(t);
    let alpha = map(t, 0, 1, 60, 200);
    fill(red(hc), green(hc), blue(hc), alpha);

    let w = 8;
    let h = 26;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;

    push();
    translate(x, y);
    rotate(angle);
    rect(0, 0, w, h, 4);
    pop();
  }

  pop();
}

// -------- 扫描线 --------
function drawScanLine(index) {
  scanY += 2;
  if (scanY > height + 80) scanY = height + 80;

  let lineHeight = 80;
  let baseC;

  if (index === 0) baseC = color(255, 150, 40);
  else if (index === 1) baseC = color(255, 140, 210);
  else baseC = color(140, 210, 255);

  for (let y = scanY - lineHeight / 2; y < scanY + lineHeight / 2; y++) {
    let t = map(y, scanY - lineHeight / 2, scanY + lineHeight / 2, 0, 1);
    let alpha = t < 0.5 ? map(t, 0, 0.5, 0, 160) : map(t, 0.5, 1, 160, 0);
    stroke(red(baseC), green(baseC), blue(baseC), alpha);
    line(0, y, width, y);
  }
  noStroke();
}

// -------- 文本（随扫描显现） --------
function drawTexts(item) {
  let startY = height - 170;

  // 若扫描线未扫到文字区域 → 不显示任何文字
  if (scanY < startY) return;

  // 重绘底部渐变背景，避免文字叠加
  let topC, bottomC;
  if (currentIndex === 0) {
    topC = color(5, 10, 40);
    bottomC = color(120, 40, 80);
  } else if (currentIndex === 1) {
    topC = color(40, 0, 60);
    bottomC = color(200, 70, 140);
  } else {
    topC = color(0, 25, 70);
    bottomC = color(0, 130, 190);
  }

  for (let y = startY; y < height; y += 3) {
    let t = map(y, 0, height, 0, 1);
    let c = lerpColor(topC, bottomC, t);
    stroke(red(c), green(c), blue(c), 235);
    line(0, y, width, y);
  }
  noStroke();

  // 文本内容
  fill(255);
  textAlign(LEFT, TOP);
  textSize(20);
  text("Object: " + item.name, 40, startY + 10);

  textSize(16);
  textWrap(WORD);
  text(item.text, 40, startY + 45, width - 80);

  textSize(13);
  textAlign(RIGHT, BOTTOM);
  text("Press 1–3 to scan different objects", width - 40, height - 20);
}

// -------- 切换物件 --------
function keyPressed() {
  if (key === '1') {
    currentIndex = 0;
  } else if (key === '2') {
    currentIndex = 1;
  } else if (key === '3') {
    currentIndex = 2;
  }
  scanY = -80; // 重置扫描线
}


