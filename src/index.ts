import "./index.css";
import { drag, zoom, translate, scale } from "./mouse";
import { autoResizeCanvas, createShader } from "./utils";
import triangleShader from "./assets/shaders/triangle";
import { mat4 } from "gl-matrix";
import { dip } from "./dip";

const canvas = document.querySelector("#app") as HTMLCanvasElement;

autoResizeCanvas(canvas);
drag(canvas);
zoom(canvas);

const gl = canvas.getContext("webgl2", {
  antialias: true,
  preserveDrawingBuffer: true,
}) as WebGL2RenderingContext;

dip(gl);

const program = gl.createProgram();
const vertShader = createShader(gl, gl.VERTEX_SHADER, triangleShader.vs);
const fragShader = createShader(gl, gl.FRAGMENT_SHADER, triangleShader.fs);
gl.attachShader(program, vertShader);
gl.attachShader(program, fragShader);
gl.linkProgram(program);
gl.useProgram(program);

const iPos = gl.getAttribLocation(program, "iPos");
const iColor = gl.getAttribLocation(program, "iColor");
const uMatrix = gl.getUniformLocation(program, "uMatrix");

const vao = gl.createVertexArray();
const posBuf = gl.createBuffer();

gl.bindVertexArray(vao);
gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);

gl.vertexAttribPointer(iPos, 2, gl.FLOAT, false, 5 * 4, 0 * 4);
gl.enableVertexAttribArray(iPos);

gl.vertexAttribPointer(iColor, 3, gl.FLOAT, false, 5 * 4, 2 * 4);
gl.enableVertexAttribArray(iColor);

gl.bindVertexArray(null);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

const size = 5;

// prettier-ignore
let positions = [
  200, 400, 1, 0, 0,
  300, 400 - 100 * Math.sqrt(3), 0, 1, 0,
  400, 400, 0, 0, 1,
];

gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

const modelMatrix = mat4.create();
const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();
const matrix = mat4.create();

gl.clearColor(0.9, 0.9, 0.9, 1.0);
gl.enable(gl.BLEND);
gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

const tick = () => {
  const { width, height } = canvas;
  const dpr = window.devicePixelRatio;

  gl.viewport(0, 0, width, height);
  gl.clear(gl.COLOR_BUFFER_BIT);

  mat4.identity(modelMatrix);
  mat4.scale(modelMatrix, modelMatrix, [1, -1, 1]);
  mat4.translate(modelMatrix, modelMatrix, [
    translate.x,
    translate.y,
    translate.z,
  ]);
  mat4.scale(modelMatrix, modelMatrix, [scale.x, scale.y, scale.z]);

  mat4.lookAt(viewMatrix, [0, 0, 1], [0, 0, 0], [0, 1, 0]);
  mat4.invert(viewMatrix, viewMatrix);

  mat4.identity(projectionMatrix);
  mat4.translate(projectionMatrix, projectionMatrix, [-1, 1, 0]);
  mat4.scale(projectionMatrix, projectionMatrix, [
    (2 * dpr) / width,
    (2 * dpr) / height,
    1,
  ]);

  mat4.multiply(matrix, viewMatrix, modelMatrix);
  mat4.multiply(matrix, projectionMatrix, matrix);

  gl.uniformMatrix4fv(uMatrix, false, matrix);

  gl.bindVertexArray(vao);
  gl.drawArrays(gl.TRIANGLES, 0, positions.length / size);
  gl.bindVertexArray(null);

  requestAnimationFrame(tick);
};

requestAnimationFrame(tick);
