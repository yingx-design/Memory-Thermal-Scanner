// ====== Thermal Memory Scanner / 家乡物件热感扫描仪 ======

// 0: 老干妈   1: 小狗娃娃   2: 拍立得   3: 化妆袋   4: 鼻炎喷雾   5: 创可贴
let items = [
  {
    name: "Chili Sauce",
    heat: 1.0,
    text: "The moment I open this can and breathe its familiar spicy warmth, I'm reminded of home in the simplest, most reliable way."
  },
  {
    name: "Doll",
    heat: 0.8,
    text: "Since 2022, she’s been my silent bedside companion—steady, wordless, and always there when I reach out in a place that never quite feels like home."
  },
  {
    name: "Polaroid camera",
    heat: 0.7,
    text: "She captures not scenery but small, precious moments—faces, meals, smiles—that I hope will one day become the quiet backups of my future memories."
  },
  {
    name: "Makeup bag",
    heat: 0.65,
    text: "Stuffed with brushes, colors, and tiny tools, it’s the first thing I reach for when I need to rebuild a version of myself before going out into a new city."
  },
  {
    name: "Nasal spray",
    heat: 0.55,
    text: "It sits quietly on my desk, half medical, half emotional—a small reminder that even in a foreign place, I’m still being taken care of in the ways I’m used to."
  },
  {
    name: "Bandage strips",
    heat: 0.6,
    text: "They patch up small cuts and blisters from rushing between two lives, tiny squares of care that travel with me wherever I go."
  }
];

let currentIndex = 0;
let scanY = -80; // 扫描线初始在画面上方

// 🔹 图片变量（6 个物件）
let imgLaoganma;
let imgToy;
let imgPolaroid;
let imgHuazhuangdai;
let imgBiyan;
let imgChuangketie;

// 🔹 预加载图片（注意文件名要和左侧完全一致）
function preload() {
  imgLaoganma = loadImage("laoganma.png");
  imgToy = loadImage("toy.png");
  imgPolaroid = loadImage("polaroid.png");
  imgHuazhuangdai = loadImage("huazhuangdai.png");
  imgBiyan = loadImage("biyan.png");
  imgChuangketie = loadImage("chuangketie.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  textFont("sans-serif");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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
  } else if (index === 2) {
    topC = color(0, 25, 70);
    bottomC = color(0, 130, 190);
  } else if (index === 3) {
    topC = color(60, 10, 50);
    bottomC = color(230, 120, 150);
  } else if (index === 4) {
    topC = color(0, 30, 80);
    bottomC = color(0, 160, 150);
  } else {
    topC = color(40, 15, 10);
    bottomC = color(210, 140, 80);
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

// -------- 每个物品自己的光圈颜色 --------
function auraColorByIndex(index) {
  if (index === 0) return color(255, 150, 80);   // 老干妈：暖橙红
  if (index === 1) return color(255, 170, 210);  // 玩偶：柔粉
  if (index === 2) return color(150, 210, 255);  // 拍立得：青蓝
  if (index === 3) return color(255, 190, 200);  // 化妆袋：淡桃
  if (index === 4) return color(150, 230, 210);  // 鼻炎喷雾：薄荷青
  return color(255, 210, 160);                   // 创可贴：浅暖肤
}

// -------- 中间物件 + 空心柔光光圈 --------
function drawHeatCore(item, index) {
  push();
  translate(width / 2, height / 2);
  rectMode(CENTER);

  // --- clip: 扫描线以下才可见 ---
  let ctx = drawingContext;
  ctx.save();
  ctx.beginPath();
  let visibleHeight = constrain(scanY, 0, height);
  ctx.rect(-width / 2, -height / 2, width, visibleHeight);
  ctx.clip();

  // ------- 物件本体 -------
  imageMode(CENTER);
  if (index === 0)      image(imgLaoganma, 0, 40, 260, 260);
  else if (index === 1) image(imgToy, 0, 20, 260, 260);
  else if (index === 2) image(imgPolaroid, 0, 40, 260, 260);
  else if (index === 3) image(imgHuazhuangdai, 0, 40, 260, 260);
  else if (index === 4) image(imgBiyan, 0, 40, 260, 260);
  else if (index === 5) image(imgChuangketie, 0, 40, 300, 260);

  // -------- 空心柔光 Aura（加强版但仍然高级） --------
  let baseCol = auraColorByIndex(index);
  let baseR = 260;   // 起始半径
  let rings = 6;     // 圈数

  noFill();
  for (let i = 0; i < rings; i++) {
    let r = baseR + i * 26;

    // 比之前亮一些，但不会刺眼
    let alpha = map(i, 0, rings - 1, 80, 18);
    let w = map(i, 0, rings - 1, 26, 10); // 内圈粗一点，外圈细一点

    stroke(
      red(baseCol),
      green(baseCol),
      blue(baseCol),
      alpha
    );
    strokeWeight(w);
    ellipse(0, 40, r, r * 0.95); // 稍微扁一点，更像摄影柔光
  }

  // 还原
  strokeWeight(1);
  noStroke();
  ctx.restore();
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
  else if (index === 2) baseC = color(140, 210, 255);
  else if (index === 3) baseC = color(255, 170, 190);
  else if (index === 4) baseC = color(120, 220, 210);
  else baseC = color(255, 200, 140);

  strokeWeight(1);
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

  if (scanY < startY) return;

  let topC, bottomC;
  if (currentIndex === 0) {
    topC = color(5, 10, 40);
    bottomC = color(120, 40, 80);
  } else if (currentIndex === 1) {
    topC = color(40, 0, 60);
    bottomC = color(200, 70, 140);
  } else if (currentIndex === 2) {
    topC = color(0, 25, 70);
    bottomC = color(0, 130, 190);
  } else if (currentIndex === 3) {
    topC = color(60, 10, 50);
    bottomC = color(230, 120, 150);
  } else if (currentIndex === 4) {
    topC = color(0, 30, 80);
    bottomC = color(0, 160, 150);
  } else {
    topC = color(40, 15, 10);
    bottomC = color(210, 140, 80);
  }

  for (let y = startY; y < height; y += 3) {
    let t = map(y, 0, height, 0, 1);
    let c = lerpColor(topC, bottomC, t);
    stroke(red(c), green(c), blue(c), 235);
    line(0, y, width, y);
  }
  noStroke();

  fill(255);
  textAlign(LEFT, TOP);
  textSize(20);
  text("Object: " + item.name, 40, startY + 10);

  textSize(16);
  textWrap(WORD);
  text(item.text, 40, startY + 45, width - 80);

  textSize(13);
  textAlign(RIGHT, BOTTOM);
  text("Press 1–6 to scan different objects", width - 40, height - 20);
}

// -------- 切换物件 --------
function keyPressed() {
  if (key === '1') currentIndex = 0;
  else if (key === '2') currentIndex = 1;
  else if (key === '3') currentIndex = 2;
  else if (key === '4') currentIndex = 3;
  else if (key === '5') currentIndex = 4;
  else if (key === '6') currentIndex = 5;

  scanY = -80;
}
