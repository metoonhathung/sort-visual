let values = [];
let states = [];
var size = document.getElementById("size");
var speed = document.getElementById("speed");
let colWidth, delay, scale = 0.8;

const colors = {
  "off": -1,
  "current": 0,
  "access": 1,
  "sort": 2
}

async function setup() {
  canvas = createCanvas(windowWidth * scale, windowHeight * scale);
  canvas.parent("canvas");
  delay = speed.getAttribute("max") - speed.value;
  reset();
  await shuffling(values);
  noLoop();
}

function draw() {
  background(51);
  for (let i = 0; i < values.length; i++) {
    switch (states[i]) {
      case colors.current:
        fill('#E0777D');
        break;
      case colors.access:
        fill('#D6FFB7');
        break;
      case colors.sort:
        fill('#4DA8DA');
        break;
      default: //colors.off
        fill('#FFFFFF');
    }
    rect(i * colWidth, height - values[i], colWidth, values[i]);
  }
}

async function sorting(name) {
  loop();
  clickable(false);
  states.fill(-1);
  switch (name) {
    case 'shuffle':
      await shuffling(values);
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
      alert("not found");
  }
  clickable(true);
  noLoop();
}

function reset() {
  colWidth = size.getAttribute("max") - size.value;
  if (colWidth == 0) {colWidth = 1; }
  values = new Array(Math.floor(width / colWidth));
  states = new Array(Math.floor(width / colWidth));
  colWidth = width / values.length;
  for (let i = 0; i < values.length; i++) {
    values[i] = Math.floor((i + 1) * (height / values.length));
    coloring(i, "off");
  }
}

function coloring(index, color) {
  states[index] = colors[color];
}

function clickable(bool) {
  let elements = document.getElementsByClassName("sorting");
  for (element of elements) {
    if (bool == true) {
      element.classList.remove("disabled");
      element.disabled = false;
    } else {
      element.classList.add("disabled");
      element.disabled = true;
    }
  }
}

size.oninput = async () => {
  reset();
  if (colWidth < 2) {
    noStroke();
  } else {
    strokeWeight(1);
    stroke("black");
  }
  await shuffling(values);
  redraw();
}

speed.oninput = () => {
  delay = speed.getAttribute("max") - speed.value;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}