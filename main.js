const body = document.querySelector("body");
const canvas = document.querySelector("canvas");
const picker = document.querySelector("#file-picker");
const itemsDraggable = document.querySelectorAll(".item-menu");

const dropzone = document.querySelector(".wrapper-canvas");

const context = canvas.getContext("2d");

context.textRendering = "optimizeLegibility";





itemsDraggable.forEach(item => {
  item.addEventListener("dragstart", (event) => {

    event.dataTransfer.setData("text/plain", JSON.stringify({
      hash: item.getAttribute("hash"),
      type: item.getAttribute("type")
    }))
  });

  item.addEventListener("dragend", (event) => {
    console.log(event)
  });
})


picker.onchange = (event) => {
  const file = event.target.files[0];

  if (!file || !file.type.startsWith('image/')) {
    return;
  }

  render(file)

};

body.addEventListener('dragover', (event) => {
  event.preventDefault();

  // console.log(event)
  if (event.dataTransfer.items[0]?.length != 0) {

    dropzone.classList.add("droppable");
  }

});

body.addEventListener('dragleave', (event) => {
  event.preventDefault();
  dropzone.classList.remove("droppable");
});

body.addEventListener('drop', (event) => {
  event.preventDefault();

  const file = event.dataTransfer.files[0];

  if (!file || !file.type.startsWith('image/')) {
    return;
  }
  dropzone.classList.remove("droppable");
  render(file);
});

dropzone.addEventListener('drop', (event) => {
  event.preventDefault();

  const data = event.dataTransfer.getData("text/plain");
  const { hash, type } = JSON.parse(data);

  dropzone.classList.remove("droppable");

  if (!type) {
    loadImageAndCreateItem("logo.png", event.layerX - (100 / 2), event.layerY - (100 / 2), 100, 100, hash);
    return
  }

  createItemText("Odd", event.layerX, event.layerY, hash);


});

function createItemText(text, x, y, id) {
  const exist = items.some(item => item.id === id);

  if (exist) return;

  context.font = "24px Inter";
  const { width, emHeightAscent } = context.measureText(text);

  items.push({
    id: id,
    text: text,
    x: x,
    y: y,
    width,
    height: 24,
    resizing: false,
    dragging: false,
    resizeHandle: -1
  });

  context.fillText(text, x, y, width);
}


function render(file) {
  const reader = new FileReader();

  reader.onloadend = (event) => {
    const imageData = event.target.result;

    const image = new Image();
    image.src = imageData;

    image.onload = () => {
      var maxWidth = 1200; // Altere para a largura máxima desejada
      var maxHeight = 700; // Altere para a altura máxima desejada
      var ratio = Math.min(maxWidth / image.width, maxHeight / image.height);
      background = {
        ratio,
        image,
      }
      canvas.width = image.width * ratio;
      canvas.height = image.height * ratio;

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  };

  reader.readAsDataURL(file);
}


class Canvas {
  constructor(options) {
    this.shapes = [
      { id: "6a2b8497-a347-4c53-b2ce-09e4be36adb8", x: 0, y: 0, width: 0, height: 0 },
      { id: "9856b2db-f487-4cfb-bce0-a3ad7f31514e", x: 0, y: 0, width: 0, height: 0 }
    ];

    this.context = options.context

    this.render();
  }

  render() {
    this.context.clearReact(0, 0, this.canvas.width, this.canvas.height);
  }

  addImage() {

  }

  existImageOrText(id) {
    return this.shapes.some(shape => shape.id === id);
  }

}

// canvas.addEventListener("click", insertImageToCanvas);

var background = {}
var items = []; // Array to store items
var currentItem = null; // Variable to track the current selected item

/**
 * @param {MouseEvent} event 
 */
function insertImageToCanvas(event) {
  picker.click();
}

// Function to draw all items on the canvas
function drawItems() {

  const { image, ratio } = background;
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (background.image) {
    context.drawImage(image, 0, 0, image.width * ratio, image.height * ratio);
  }

  items.forEach(function (item) {
    if(item.text) {
      context.fillStyle = 'black';
      context.textBaseline = "top";
      context.fillText(item.text, item.x, item.y, item.width);
    } else {
      context.drawImage(item.image, item.x, item.y, item.width, item.height);
    }
    
    if (item === currentItem) {
      // Draw resize handles only if the item is selected
      context.fillStyle = '#37aafd';
      context.fillRect(item.x - 4, item.y - 4, 8, 8); // top left
      context.fillRect(item.x + item.width - 4, item.y - 4, 8, 8); // top right
      context.fillRect(item.x + item.width - 4, item.y + item.height - 4, 8, 8); // bottom right
      context.fillRect(item.x - 4, item.y + item.height - 4, 8, 8); // bottom left
      context.strokeStyle = "#37aafd"
      context.strokeRect(item.x, item.y, item.width, item.height)
    }
  });
}

const MOUSE_MARGIN = 4;

// Function to check if the mouse is over a resize handle
function isMouseOverResizeHandle(item, mouseX, mouseY) {
  const x = mouseX;
  const y = mouseY;
  const leftX = item.x - MOUSE_MARGIN;
  const rightX = item.x + item.width + MOUSE_MARGIN;
  const topY = item.y - MOUSE_MARGIN;
  const bottomY = item.y + item.height + MOUSE_MARGIN;

  if (x >= leftX && x <= leftX + MOUSE_MARGIN) {
    if (y >= topY && y <= topY + MOUSE_MARGIN) {
      return 0; // top left
    } else if (y >= bottomY - MOUSE_MARGIN && y <= bottomY) {
      return 3; // bottom left
    }
  } else if (x >= rightX - MOUSE_MARGIN && x <= rightX) {
    if (y >= topY && y <= topY + MOUSE_MARGIN) {
      return 1; // top right
    } else if (y >= bottomY - MOUSE_MARGIN && y <= bottomY) {
      return 2; // bottom right
    }
  }
  return -1;
}

// Function to load an image and create an item
function loadImageAndCreateItem(imageSrc, x, y, width, height, id) {
  const exist = items.some(item => item.id === id);

  if (exist) return;

  var img = new Image();
  img.onload = function () {
    var item = {
      id: id,
      image: img,
      x: x,
      y: y,
      width: width,
      height: height,
      resizing: false,
      dragging: false,
      resizeHandle: -1
    };
    items.push(item);
    drawItems();
  };
  img.src = imageSrc;
}

// Mouse down event
canvas.addEventListener('mousedown', function (e) {
  var mouseX = e.layerX;
  var mouseY = e.layerY;


  for (var i = items.length - 1; i >= 0; i--) {
    var item = items[i];
    var resizeHandle = isMouseOverResizeHandle(item, mouseX, mouseY);
    if (resizeHandle !== -1) {
      item.resizing = true;
      item.resizeHandle = resizeHandle;
      currentItem = item;
      break;
    } else if (
      mouseX >= item.x && mouseX <= item.x + item.width &&
      mouseY >= item.y && mouseY <= item.y + item.height
    ) {
      item.dragging = true;
      currentItem = item;
      break;
    }
  }

  drawItems();
});

// Mouse up event
canvas.addEventListener('mouseup', function (e) {
  if (currentItem) {
    currentItem.resizing = false;
    currentItem.dragging = false;
  }
  currentItem = null;
});

// Mouse move event
canvas.addEventListener('mousemove', function (e) {
  var mouseX = e.layerX;
  var mouseY = e.layerY;

  if (currentItem) {
    if (currentItem.resizing) {
      switch (currentItem.resizeHandle) {
        case 0:
          currentItem.width = currentItem.x + currentItem.width - mouseX;
          currentItem.height = currentItem.y + currentItem.height - mouseY;
          currentItem.x = mouseX;
          currentItem.y = mouseY;
          break;
        case 1:
          currentItem.width = mouseX - currentItem.x;
          currentItem.height = currentItem.y + currentItem.height - mouseY;
          currentItem.y = mouseY;
          break;
        case 2:
          currentItem.width = mouseX - currentItem.x;
          currentItem.height = mouseY - currentItem.y;
          break;
        case 3:
          currentItem.width = currentItem.x + currentItem.width - mouseX;
          currentItem.height = mouseY - currentItem.y;
          currentItem.x = mouseX;
          break;
      }
    } else if (currentItem.dragging) {
      currentItem.x = mouseX - currentItem.width / 2;
      currentItem.y = mouseY - currentItem.height / 2;
    }
    drawItems();
  }
});

// Key down event to handle delete key press
window.addEventListener('keydown', function (e) {

  if (currentItem && e.key === 'Delete') {
    console.log(e.key)

    var index = items.indexOf(currentItem);
    if (index !== -1) {
      items.splice(index, 1);
      currentItem = null;
      drawItems();
    }
  }
});

// Load images and create items
