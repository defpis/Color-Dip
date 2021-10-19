import { translate } from "./const";

export const drag = (target: HTMLElement) => {
  const offset = { x: 0, y: 0 };

  const onDown = (ev: MouseEvent) => {
    offset.x = ev.x - translate.x;
    offset.y = ev.y - translate.y;

    target.addEventListener("mousemove", onMove);
    target.addEventListener("mouseup", onUp);
  };
  const onMove = (ev: MouseEvent) => {
    translate.x = ev.x - offset.x;
    translate.y = ev.y - offset.y;
  };
  const onUp = (ev: MouseEvent) => {
    translate.x = ev.x - offset.x;
    translate.y = ev.y - offset.y;

    target.removeEventListener("mousemove", onMove);
    target.removeEventListener("mouseup", onUp);
  };

  target.addEventListener("mousedown", onDown);

  return () => {
    target.removeEventListener("mousedown", onDown);
  };
};
