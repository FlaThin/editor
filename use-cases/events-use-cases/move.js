class Move {
  /**
  * @param {{
  *  canvas: HTMLCanvasElement, 
  *  context: CanvasRenderingContext2D,
  *  items: Item[]
  * }} param 
  */
  constructor({ canvas, context, items }) {
    this.canvas = canvas, this.context = context;
    this.isDragging = false;
    this.items = items;

    this.canvas.addEventListener("mousedown", this.initCalc)
  }

  initCalc(event) {
    this.x = this.layerX;
    this.y = this.layerY;
  };

  setIsDrag() {


    const { items, x, y } = this;
    for (const shape of items) {
      mouseX >= shape.x && mouseX <= shape.x + shape.width &&
        mouseY >= shape.y && mouseY <= shape.y + shape.height
    }
  }


}