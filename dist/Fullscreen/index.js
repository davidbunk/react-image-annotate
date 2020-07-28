import React from "react";
import ReactFullscreen from "react-full-screen";
export var Fullscreen = function Fullscreen(props) {
  if (!props.enabled) return props.children;
  return React.createElement(ReactFullscreen, props, props.children);
};
export default Fullscreen;