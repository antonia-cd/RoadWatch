let mapImage;
let sounds = [];
let hotspots = [];
let started = false;

function preload() {
  mapImage = loadImage("sf-map.png");
  sounds[0] = loadSound("101.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Loop all sounds quietly
  for (let s of sounds) {
    s.loop();
    s.setVolume(0);
  }

  // Define hotspot areas
  hotspots = [
    { x: 0.265 * width, y: 0.388 * height, radius: 0.30 * width, sound: sounds[0] },  // San Francisco
    { x: 0.345 * width, y: 0.370 * height, radius: 0.30 * width, sound: sounds[0] },  // Oakland
    { x: 0.345 * width, y: 0.290 * height, radius: 0.24 * width, sound: sounds[0] },  // Berkeley
    { x: 0.290 * width, y: 0.450 * height, radius: 0.20 * width, sound: sounds[0] },  // Bayview District
    { x: 0.245 * width, y: 0.510 * height, radius: 0.22 * width, sound: sounds[0] },  // Daly City
    { x: 0.275 * width, y: 0.580 * height, radius: 0.18 * width, sound: sounds[0] },  // San Bruno
    { x: 0.330 * width, y: 0.660 * height, radius: 0.22 * width, sound: sounds[0] },  // San Mateo
    { x: 0.380 * width, y: 0.755 * height, radius: 0.22 * width, sound: sounds[0] },  // Redwood City
    { x: 0.410 * width, y: 0.810 * height, radius: 0.22 * width, sound: sounds[0] },  // Palo Alto
    { x: 0.480 * width, y: 0.890 * height, radius: 0.24 * width, sound: sounds[0] },  // Sunnyvale
    { x: 0.470 * width, y: 0.955 * height, radius: 0.22 * width, sound: sounds[0] },  // Cupertino
    { x: 0.555 * width, y: 0.955 * height, radius: 0.30 * width, sound: sounds[0] },  // San Jose
    { x: 0.550 * width, y: 0.840 * height, radius: 0.22 * width, sound: sounds[0] },  // Milpitas
    { x: 0.500 * width, y: 0.680 * height, radius: 0.26 * width, sound: sounds[0] },  // Fremont
    { x: 0.455 * width, y: 0.535 * height, radius: 0.26 * width, sound: sounds[0] },  // Hayward
    { x: 0.410 * width, y: 0.460 * height, radius: 0.22 * width, sound: sounds[0] },  // San Leandro
    { x: 0.450 * width, y: 0.605 * height, radius: 0.18 * width, sound: sounds[0] },  // Alvarado
    { x: 0.305 * width, y: 0.205 * height, radius: 0.24 * width, sound: sounds[0] },  // Richmond
    { x: 0.205 * width, y: 0.155 * height, radius: 0.22 * width, sound: sounds[0] },  // San Rafael
    { x: 0.460 * width, y: 0.250 * height, radius: 0.26 * width, sound: sounds[0] },  // Walnut Creek
    { x: 0.480 * width, y: 0.155 * height, radius: 0.26 * width, sound: sounds[0] },  // Concord
    { x: 0.490 * width, y: 0.345 * height, radius: 0.18 * width, sound: sounds[0] },  // Danville
    { x: 0.515 * width, y: 0.425 * height, radius: 0.18 * width, sound: sounds[0] },  // San Ramon
    { x: 0.535 * width, y: 0.490 * height, radius: 0.20 * width, sound: sounds[0] },  // Dublin
    { x: 0.625 * width, y: 0.520 * height, radius: 0.24 * width, sound: sounds[0] },  // Livermore
    { x: 0.605 * width, y: 0.105 * height, radius: 0.24 * width, sound: sounds[0] },  // Antioch
  ];
}

function draw() {
  background(0);

  // Splash screen until user clicks
  if (!started) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(28);
    textFont("Helvetica");
    text("click and listen", width / 2, height / 2);
    return;
  }

  drawMap();

  background(0);

  // Draw blurry map first
  filter(BLUR, 9);
  drawMap();
  filter(BLUR, 0);

  // Reveal sharp map inside cursor
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.arc(mouseX, mouseY, 70, 0, Math.PI * 2);
  drawingContext.clip();
  drawMap();
  drawingContext.restore();

  // Find the CLOSEST hotspot and set volume based on that
  // (since all hotspots share sounds[0], we can't set volume per hotspot)
  let maxVol = 0;
  for (let h of hotspots) {
    if (h.sound && h.sound.isLoaded()) {
      let d = dist(mouseX, mouseY, h.x, h.y);
      let vol = map(d, 0, h.radius, 1, 0);
      vol = constrain(vol, 0, 1);
      if (vol > maxVol) maxVol = vol;
    }
  }
  if (sounds[0] && sounds[0].isLoaded()) {
    sounds[0].setVolume(maxVol, 0.2);
  }

  // Cursor glow
  noFill();
  noStroke();
  for (let i = 120; i > 0; i -= 10) {
    fill(255, 255, 255, 2);
    circle(mouseX, mouseY, i * 2);
  }
  circle(mouseX, mouseY, 140);
}

function drawMap() {
  let imgRatio = mapImage.width / mapImage.height;
  let canvasRatio = width / height;

  let drawWidth, drawHeight;

  if (imgRatio > canvasRatio) {
    drawWidth = width;
    drawHeight = width / imgRatio;
  } else {
    drawHeight = height;
    drawWidth = height * imgRatio;
  }

  let x = (width - drawWidth) / 2;
  let y = (height - drawHeight) / 2;

  image(mapImage, x, y, drawWidth, drawHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  if (!started) {
    userStartAudio();
    started = true;
  }
}
