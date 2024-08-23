let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Handle both mouse and touch events
    const moveEvent = (e) => {
      if (!this.rotating) {
        // Handle touch events
        if (e.type === 'touchmove') {
          this.mouseX = e.touches[0].clientX;
          this.mouseY = e.touches[0].clientY;
        } else {
          this.mouseX = e.clientX;
          this.mouseY = e.clientY;
        }
        
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = this.mouseX - this.mouseTouchX;
      const dirY = this.mouseY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // Mouse down or touch start event
    const startEvent = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      if (e.type === 'touchstart') {
        this.mouseTouchX = e.touches[0].clientX;
        this.mouseTouchY = e.touches[0].clientY;
        this.prevMouseX = e.touches[0].clientX;
        this.prevMouseY = e.touches[0].clientY;
      } else {
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }

      if (e.button === 2 || (e.touches && e.touches.length === 2)) {
        this.rotating = true;
      }
    };

    const endEvent = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    // Adding event listeners for both mouse and touch
    document.addEventListener('mousemove', moveEvent);
    document.addEventListener('touchmove', moveEvent);

    paper.addEventListener('mousedown', startEvent);
    paper.addEventListener('touchstart', startEvent);

    window.addEventListener('mouseup', endEvent);
    window.addEventListener('touchend', endEvent);
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
