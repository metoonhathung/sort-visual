let values = [];
let states = [];
var size = $("#size");
var speed = $("#speed");
let colWidth, colHeight, delay, currInfo, lastInfo, scale = 0.7;

const colors = {
  "off": -1,
  "current": 0,
  "access": 1,
  "sort": 2
};

function setup() {
  canvas = createCanvas(windowWidth * scale, windowHeight * scale);
  canvas.parent("canvas");
  delay = speed.attr("max") - speed.val();
  reset();
  noLoop();
}

function draw() {
  background("#333333");
  for (let i = 0; i < values.length; i++) {
    switch (states[i]) {
      case colors.current:
        fill('#FF4136');
        break;
      case colors.access:
        fill('#01FF70');
        break;
      case colors.sort:
        fill('#0074D9');
        break;
      case colors.off:
        fill('#FFFFFF');
        break;
      default:
        break;
    }
    rect(i * colWidth, height - values[i] * colHeight, colWidth, values[i] * colHeight);
  }
}

function windowResized() {
  resizeCanvas(windowWidth * scale, windowHeight * scale);
  colWidth = width / values.length;
  colHeight = height / values.length;
  changeStroke();
  redraw();
}

async function sorting(name) {
  showInfo(name);
  states.fill(-1);
  clickable(false);
  loop();
  switch (name) {
    case 'shuffle':
      shuffling(values);
      break;
    case 'bubble':
      await bubbleSort(values);
      break;
    case 'selection':
      await selectionSort(values);
      break;
    case 'insertion':
      await insertionSort(values);
      break;
    case 'merge':
      await mergeSort(values, 0, values.length - 1);
      break;
    case 'quick':
      await quickSort(values, 0, values.length - 1);
      break;
    case 'heap':
      await heapSort(values);
      break;
    case 'radix':
      await radixSort(values, values.length);
      break;
    default:
      break;
  }
  noLoop();
  clickable(true);
}

function reset() {
  colWidth = size.attr("max") - size.val();
  if (colWidth == 0) { colWidth = 1; }
  values = new Array(Math.floor(width / colWidth));
  states = new Array(Math.floor(width / colWidth));
  colWidth = width / values.length;
  for (let i = 0; i < values.length; i++) {
    values[i] = i + 1;
    coloring(i, "off");
  }
  colHeight = height / values.length;
  shuffling(values);
}

size.on("input", () => {
  reset();
  changeStroke();
  redraw();
});

speed.on("input", () => {
  delay = speed.attr("max") - speed.val();
});

function coloring(index, color) {
  states[index] = colors[color];
}

function showInfo(name) {
  if (lastInfo) lastInfo.attr("hidden", true);
  currInfo = $("#" + name);
  currInfo.removeAttr("hidden");
  lastInfo = currInfo;
}

function clickable(bool) {
  let elements = $(".sorting");
  for (element of elements) {
    if (bool == true) {
      $(element).removeClass("disabled");
    } else {
      $(element).addClass("disabled");
    }
  }
}

function changeStroke() {
  if (colWidth < 2) {
    noStroke();
  } else {
    strokeWeight(1);
    stroke("black");
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}