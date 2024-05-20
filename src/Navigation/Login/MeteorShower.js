import React, { useRef, useEffect } from 'react';

const MeteorShower = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    canvas.width = windowWidth;
    canvas.height = windowHeight;

    const starCount = 30;
    const arr = [];
    const rainCount = 12;
    const rains = [];

    class Star {
      constructor() {
        this.x = windowWidth * Math.random();
        this.y = 5000 * Math.random();
        this.text = ".";
        this.color = "white";
      }

      getColor() {
        let _r = Math.random();
        this.color = _r < 0.5 ? "#333" : "white";
      }

      init() {
        this.getColor();
      }

      draw() {
        context.fillStyle = this.color;
        context.fillText(this.text, this.x, this.y);
      }
    }

    for (let i = 0; i < starCount; i++) {
      let star = new Star();
      star.init();
      star.draw();
      arr.push(star);
    }

    function playStars() {
      for (let n = 0; n < starCount; n++) {
        arr[n].getColor();
        arr[n].draw();
      }
      requestAnimationFrame(playStars);
    }

    class MeteorRain {
      constructor() {
        this.x = -1;
        this.y = -1;
        this.length = -1;
        this.angle = 30;
        this.width = -1;
        this.height = -1;
        this.speed = 1;
        this.offset_x = -1;
        this.offset_y = -1;
        this.alpha = 1;
        this.color1 = "";
        this.color2 = "";
      }

      init() {
        this.getPos();
        this.alpha = 1; 
        this.getRandomColor();
        let x = Math.random() * 80 + 150;
        this.length = Math.ceil(x);
        x = Math.random() + 0.5;
        this.speed = Math.ceil(x); //流星的速度
        let cos = Math.cos((this.angle * 3.14) / 180);
        let sin = Math.sin((this.angle * 3.14) / 180);
        this.width = this.length * cos;
        this.height = this.length * sin;
        this.offset_x = this.speed * cos;
        this.offset_y = this.speed * sin;
      }

      getRandomColor() {
        let a = Math.ceil(255 - 240 * Math.random());
        this.color1 = "rgba(" + a + "," + a + "," + a + ",1)";
        this.color2 = "black";
      }

      countPos() {
        this.x = this.x - this.offset_x;
        this.y = this.y + this.offset_y;
      }

      getPos() {
        this.x = Math.random() * window.innerWidth; // 窗口高度
        this.y = Math.random() * window.innerHeight * 0.5; 
      }

      draw() {
        context.save();
        context.beginPath();
        context.lineWidth = 1; 
        context.globalAlpha = this.alpha; 
        let line = context.createLinearGradient(
          this.x,
          this.y,
          this.x + this.width,
          this.y - this.height
        );

        line.addColorStop(0, "white");
        line.addColorStop(0.3, this.color1);
        line.addColorStop(0.6, this.color2);
        context.strokeStyle = line;
     
        context.moveTo(this.x, this.y);
        
        context.lineTo(this.x + this.width, this.y - this.height);
        context.closePath();
        context.stroke();
        context.restore();
      }

      move() {
        
        let x = this.x + this.width - this.offset_x;
        let y = this.y - this.height;
        context.clearRect(x - 3, y - 3, this.offset_x + 5, this.offset_y + 5);
        
        this.countPos();
       
        this.alpha -= 0.002;
       
        this.draw();
      }
    }

    for (let i = 0; i < rainCount; i++) {
      let rain = new MeteorRain();
      rain.init();
      rains.push(rain);
    }

    function playRains() {
      for (let n = 0; n < rainCount; n++) {
        let rain = rains[n];
        rain.move(); 
        if (rain.y > windowHeight) {
          
          context.clearRect(rain.x, rain.y - rain.height, rain.width, rain.height);
          rains[n] = new MeteorRain();
          rains[n].init();
        }
      }
      requestAnimationFrame(playRains);
    }

    playStars();
    playRains();
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', width: '100%', height: '100%', top: 0, left: 0  }} />;

};

export default MeteorShower;
