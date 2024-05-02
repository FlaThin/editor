const body = document.querySelector("body");
const canvas = document.querySelector("canvas");
const picker = document.querySelector("#file-picker");
const itemsDraggable = document.querySelector(".item-menu");



const dropzone = document.querySelector(".wrapper-canvas");

const context = canvas.getContext("2d");

canvas.addEventListener("click", insertImageToCanvas);

function insertImageToCanvas(event) {
  picker.click();
}

itemsDraggable.addEventListener("dragstart", (event) => {
  console.log(event)
});

itemsDraggable.addEventListener("dragend", (event) => {
  console.log(event)
});



picker.onchange = (event) => {
  const file = event.target.files[0];

  if (!file || !file.type.startsWith('image/')) {
    return;
  }

  render(file)

};

body.addEventListener('dragover', (event) => {
  event.preventDefault();

  dropzone.classList.add("droppable");

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
  render(file)
  
});




function render(file) {
  const reader = new FileReader();

  reader.onloadend = (event) => {
    const imageData = event.target.result;

    const image = new Image();
    image.src = imageData;

    image.onload = () => {
      var maxWidth = 1920; // Altere para a largura máxima desejada
      var maxHeight = 1000; // Altere para a altura máxima desejada
      var ratio = Math.min(maxWidth / image.width, maxHeight / image.height);
      canvas.width = image.width * ratio;
      canvas.height = image.height * ratio;

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  };
  
  reader.readAsDataURL(file);
}