import { Vector2D } from '../types/physics';

export const createVector = (x: number = 0, y: number = 0): Vector2D => ({ x, y });

export const add = (a: Vector2D, b: Vector2D): Vector2D => ({
  x: a.x + b.x,
  y: a.y + b.y,
});

export const subtract = (a: Vector2D, b: Vector2D): Vector2D => ({
  x: a.x - b.x,
  y: a.y - b.y,
});

export const multiply = (v: Vector2D, scalar: number): Vector2D => ({
  x: v.x * scalar,
  y: v.y * scalar,
});

export const divide = (v: Vector2D, scalar: number): Vector2D => ({
  x: v.x / scalar,
  y: v.y / scalar,
});

export const magnitude = (v: Vector2D): number => 
  Math.sqrt(v.x * v.x + v.y * v.y);

export const normalize = (v: Vector2D): Vector2D => {
  const mag = magnitude(v);
  return mag > 0 ? divide(v, mag) : createVector();
};

export const distance = (a: Vector2D, b: Vector2D): number => 
  magnitude(subtract(a, b));

export const limit = (v: Vector2D, max: number): Vector2D => {
  const mag = magnitude(v);
  return mag > max ? multiply(normalize(v), max) : v;
};

export const lerp = (a: Vector2D, b: Vector2D, t: number): Vector2D => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

export const dot = (a: Vector2D, b: Vector2D): number => 
  a.x * b.x + a.y * b.y;

export const rotate = (v: Vector2D, angle: number): Vector2D => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: v.x * cos - v.y * sin,
    y: v.x * sin + v.y * cos,
  };
};