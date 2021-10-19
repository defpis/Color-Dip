import { autoResizeCanvas } from "./utils";

const getColorLight = (color: [number, number, number, number]) =>
  0.2126 * (color[0] / 255) +
  0.7152 * (color[1] / 255) +
  0.0722 * (color[2] / 255);

export const dip = (gl: WebGL2RenderingContext) => {
  const dpr = window.devicePixelRatio;
  const boxNum = 19;
  const halfBoxNum = Math.floor(boxNum / 2);
  const boxSize = 400 / boxNum;
  const pixels = new Uint8Array(boxNum ** 2 * 4);
  const glassCanvas = document.querySelector("#glass") as HTMLCanvasElement;
  const ctx = glassCanvas.getContext("2d") as CanvasRenderingContext2D;

  autoResizeCanvas(glassCanvas);

  const onMove = (ev: MouseEvent) => {
    gl.readPixels(
      ev.x * dpr - halfBoxNum,
      gl.canvas.height - ev.y * dpr - halfBoxNum,
      boxNum,
      boxNum,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixels
    );

    ctx.clearRect(0, 0, glassCanvas.width, glassCanvas.height);

    let color: [number, number, number, number] = [0, 0, 0, 0];

    for (let i = 0; i < boxNum ** 2; i++) {
      const j = i * 4;

      const r = pixels[j + 0];
      const g = pixels[j + 1];
      const b = pixels[j + 2];
      const a = pixels[j + 3];

      const row = Math.floor(i / boxNum);
      const col = i - row * boxNum;

      if (row === halfBoxNum && col === halfBoxNum) {
        color = [r, g, b, a];
      }

      const x = col * boxSize;
      const y = (boxNum - 1 - row) * boxSize;

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
      ctx.fillRect(x, y, boxSize, boxSize);

      ctx.beginPath();
      ctx.strokeStyle = `rgba(${255 - r}, ${255 - g}, ${255 - b}, 0.3)`;
      ctx.lineWidth = 1;
      ctx.moveTo(x, y);
      ctx.lineTo(x + boxSize, y);
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + boxSize);
      ctx.stroke();
    }

    const renderColor =
      getColorLight(color) >= 0.56
        ? "rgba(0, 0, 0, 1)"
        : "rgba(255, 255, 255, 1)";

    ctx.strokeStyle = renderColor;
    ctx.lineWidth = 2;
    const x = halfBoxNum * boxSize;
    const y = halfBoxNum * boxSize;
    ctx.strokeRect(x, y, boxSize, boxSize);

    ctx.fillStyle = renderColor;
    ctx.textAlign = "center";
    ctx.font = "24px Arial";
    ctx.fillText(
      `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`,
      200,
      300
    );
  };

  gl.canvas.addEventListener("mousemove", onMove);
};
