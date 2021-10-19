#version 300 es
precision highp float;

in vec2 iPos;
in vec3 iColor;
uniform mat4 uMatrix;
out vec3 vColor;

void main() {
  vColor = iColor;
  gl_Position = uMatrix * vec4(iPos, 0.0, 1.0);
}