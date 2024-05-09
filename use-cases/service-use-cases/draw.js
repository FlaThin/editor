class Draw {
  /**
  * @param {{
  *    canvas: HTMLCanvasElement, 
  *    context: CanvasRenderingContext2D
  * }} param 
  */
  constructor({
    canvas,
    context
  }) {
    this.canvas = canvas, this.context = context;
  }
  /**
  * @typedef Item
  * @type {object}
  * @property {HTMLImageElement?} image
  * @property {string?} text
  * @property {number} drawX
  * @property {number} drawY
  * @property {number} width
  * @property {number} height
   */

  /**
   * @param {{
    * item: Item,
    * type: string
   * }} param 
   */

  render(param) {
    const { type, item } = param
    type === "text" ? this.renderAsText(item) : this.renderAsImage(item);
  }


  /**
   * 
   * @param {Item} param 
   */ 
  renderAsText({
    drawX,
    drawY,
    width,
    text
  }) {
    this.context.fillText(text, drawX, drawY, width);
  }
  /**
   * 
   * @param {Item} param 
   */ 
  renderAsImage({
    drawX,
    drawY,
    width,
    height,
    image
  }) {
    this.context.drawImage(image, drawX, drawY, width, height);
  }
}