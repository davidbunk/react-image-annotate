import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useRef, useState, useLayoutEffect, useMemo } from "react";
import { Matrix } from "transformation-matrix-js";
import Crosshairs from "../Crosshairs";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./styles";
import PreventScrollToParents from "../PreventScrollToParents";
import useWindowSize from "../hooks/use-window-size.js";
import useMouse from "./use-mouse";
import useProjectRegionBox from "./use-project-box";
import useExcludePattern from "../hooks/use-exclude-pattern";
import { useRafState } from "react-use";
import PointDistances from "../PointDistances";
import RegionTags from "../RegionTags";
import RegionLabel from "../RegionLabel";
import ImageMask from "../ImageMask";
import RegionSelectAndTransformBoxes from "../RegionSelectAndTransformBoxes";
import VideoOrImageCanvasBackground from "../VideoOrImageCanvasBackground";
import useEventCallback from "use-event-callback";
import RegionShapes from "../RegionShapes";
import useWasdMode from "./use-wasd-mode";
var useStyles = makeStyles(styles);

var getDefaultMat = function getDefaultMat() {
  return Matrix.from(1, 0, 0, 1, -10, -10);
};

export var ImageCanvas = function ImageCanvas(_ref) {
  var regions = _ref.regions,
      imageSrc = _ref.imageSrc,
      videoSrc = _ref.videoSrc,
      videoTime = _ref.videoTime,
      realSize = _ref.realSize,
      showTags = _ref.showTags,
      _ref$onMouseMove = _ref.onMouseMove,
      onMouseMove = _ref$onMouseMove === void 0 ? function (p) {
    return null;
  } : _ref$onMouseMove,
      _ref$onMouseDown = _ref.onMouseDown,
      onMouseDown = _ref$onMouseDown === void 0 ? function (p) {
    return null;
  } : _ref$onMouseDown,
      _ref$onMouseUp = _ref.onMouseUp,
      onMouseUp = _ref$onMouseUp === void 0 ? function (p) {
    return null;
  } : _ref$onMouseUp,
      _ref$dragWithPrimary = _ref.dragWithPrimary,
      dragWithPrimary = _ref$dragWithPrimary === void 0 ? false : _ref$dragWithPrimary,
      _ref$zoomWithPrimary = _ref.zoomWithPrimary,
      zoomWithPrimary = _ref$zoomWithPrimary === void 0 ? false : _ref$zoomWithPrimary,
      _ref$createWithPrimar = _ref.createWithPrimary,
      createWithPrimary = _ref$createWithPrimar === void 0 ? false : _ref$createWithPrimar,
      _ref$pointDistancePre = _ref.pointDistancePrecision,
      pointDistancePrecision = _ref$pointDistancePre === void 0 ? 0 : _ref$pointDistancePre,
      regionClsList = _ref.regionClsList,
      regionTagList = _ref.regionTagList,
      showCrosshairs = _ref.showCrosshairs,
      _ref$showHighlightBox = _ref.showHighlightBox,
      showHighlightBox = _ref$showHighlightBox === void 0 ? true : _ref$showHighlightBox,
      showPointDistances = _ref.showPointDistances,
      allowedArea = _ref.allowedArea,
      _ref$RegionEditLabel = _ref.RegionEditLabel,
      RegionEditLabel = _ref$RegionEditLabel === void 0 ? null : _ref$RegionEditLabel,
      _ref$videoPlaying = _ref.videoPlaying,
      videoPlaying = _ref$videoPlaying === void 0 ? false : _ref$videoPlaying,
      _ref$showMask = _ref.showMask,
      showMask = _ref$showMask === void 0 ? true : _ref$showMask,
      fullImageSegmentationMode = _ref.fullImageSegmentationMode,
      autoSegmentationOptions = _ref.autoSegmentationOptions,
      onImageOrVideoLoaded = _ref.onImageOrVideoLoaded,
      onChangeRegion = _ref.onChangeRegion,
      onBeginRegionEdit = _ref.onBeginRegionEdit,
      onCloseRegionEdit = _ref.onCloseRegionEdit,
      onBeginBoxTransform = _ref.onBeginBoxTransform,
      onBeginMovePolygonPoint = _ref.onBeginMovePolygonPoint,
      onAddPolygonPoint = _ref.onAddPolygonPoint,
      onSelectRegion = _ref.onSelectRegion,
      onBeginMovePoint = _ref.onBeginMovePoint,
      onDeleteRegion = _ref.onDeleteRegion,
      onChangeVideoTime = _ref.onChangeVideoTime,
      onChangeVideoPlaying = _ref.onChangeVideoPlaying,
      onRegionClassAdded = _ref.onRegionClassAdded;
  var classes = useStyles();
  var canvasEl = useRef(null);
  var layoutParams = useRef({});

  var _useRafState = useRafState(false),
      _useRafState2 = _slicedToArray(_useRafState, 2),
      dragging = _useRafState2[0],
      changeDragging = _useRafState2[1];

  var _useRafState3 = useRafState(0),
      _useRafState4 = _slicedToArray(_useRafState3, 2),
      maskImagesLoaded = _useRafState4[0],
      changeMaskImagesLoaded = _useRafState4[1];

  var _useRafState5 = useRafState(null),
      _useRafState6 = _slicedToArray(_useRafState5, 2),
      zoomStart = _useRafState6[0],
      changeZoomStart = _useRafState6[1];

  var _useRafState7 = useRafState(null),
      _useRafState8 = _slicedToArray(_useRafState7, 2),
      zoomEnd = _useRafState8[0],
      changeZoomEnd = _useRafState8[1];

  var _useRafState9 = useRafState(getDefaultMat()),
      _useRafState10 = _slicedToArray(_useRafState9, 2),
      mat = _useRafState10[0],
      changeMat = _useRafState10[1];

  var maskImages = useRef({});
  var windowSize = useWindowSize();
  var getLatestMat = useEventCallback(function () {
    return mat;
  });
  useWasdMode({
    getLatestMat: getLatestMat,
    changeMat: changeMat
  });

  var _useMouse = useMouse({
    canvasEl: canvasEl,
    dragging: dragging,
    mat: mat,
    layoutParams: layoutParams,
    changeMat: changeMat,
    zoomStart: zoomStart,
    zoomEnd: zoomEnd,
    changeZoomStart: changeZoomStart,
    changeZoomEnd: changeZoomEnd,
    changeDragging: changeDragging,
    zoomWithPrimary: zoomWithPrimary,
    dragWithPrimary: dragWithPrimary,
    onMouseMove: onMouseMove,
    onMouseDown: onMouseDown,
    onMouseUp: onMouseUp
  }),
      mouseEvents = _useMouse.mouseEvents,
      mousePosition = _useMouse.mousePosition;

  useLayoutEffect(function () {
    return changeMat(mat.clone());
  }, [windowSize]);
  var innerMousePos = mat.applyToPoint(mousePosition.current.x, mousePosition.current.y);
  var projectRegionBox = useProjectRegionBox({
    layoutParams: layoutParams,
    mat: mat
  });

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      imageDimensions = _useState2[0],
      changeImageDimensions = _useState2[1];

  var imageLoaded = Boolean(imageDimensions && imageDimensions.naturalWidth);
  var onVideoOrImageLoaded = useEventCallback(function (_ref2) {
    var naturalWidth = _ref2.naturalWidth,
        naturalHeight = _ref2.naturalHeight,
        duration = _ref2.duration;
    var dims = {
      naturalWidth: naturalWidth,
      naturalHeight: naturalHeight,
      duration: duration
    };
    if (onImageOrVideoLoaded) onImageOrVideoLoaded(dims);
    changeImageDimensions(dims); // Redundant update to fix rerendering issues

    setTimeout(function () {
      return changeImageDimensions(dims);
    }, 10);
  });
  var excludePattern = useExcludePattern();
  var canvas = canvasEl.current;

  if (canvas && imageLoaded) {
    var clientWidth = canvas.clientWidth,
        clientHeight = canvas.clientHeight;
    var fitScale = Math.max(imageDimensions.naturalWidth / (clientWidth - 20), imageDimensions.naturalHeight / (clientHeight - 20));

    var _iw = imageDimensions.naturalWidth / fitScale,
        _ih = imageDimensions.naturalHeight / fitScale;

    layoutParams.current = {
      iw: _iw,
      ih: _ih,
      fitScale: fitScale,
      canvasWidth: clientWidth,
      canvasHeight: clientHeight
    };
  }

  useLayoutEffect(function () {
    if (!imageDimensions) return;
    var clientWidth = canvas.clientWidth,
        clientHeight = canvas.clientHeight;
    canvas.width = clientWidth;
    canvas.height = clientHeight;
    var context = canvas.getContext("2d");
    context.save();
    context.transform.apply(context, _toConsumableArray(mat.clone().inverse().toArray()));
    var _layoutParams$current = layoutParams.current,
        iw = _layoutParams$current.iw,
        ih = _layoutParams$current.ih;

    if (allowedArea) {
      // Pattern to indicate the NOT allowed areas
      var x = allowedArea.x,
          y = allowedArea.y,
          w = allowedArea.w,
          h = allowedArea.h;
      context.save();
      context.globalAlpha = 1;
      var outer = [[0, 0], [iw, 0], [iw, ih], [0, ih]];
      var inner = [[x * iw, y * ih], [x * iw + w * iw, y * ih], [x * iw + w * iw, y * ih + h * ih], [x * iw, y * ih + h * ih]];
      context.moveTo.apply(context, _toConsumableArray(outer[0]));
      outer.forEach(function (p) {
        return context.lineTo.apply(context, _toConsumableArray(p));
      });
      context.lineTo.apply(context, _toConsumableArray(outer[0]));
      context.closePath();
      inner.reverse();
      context.moveTo.apply(context, _toConsumableArray(inner[0]));
      inner.forEach(function (p) {
        return context.lineTo.apply(context, _toConsumableArray(p));
      });
      context.lineTo.apply(context, _toConsumableArray(inner[0]));
      context.fillStyle = excludePattern || "#f00";
      context.fill();
      context.restore();
    }

    context.restore();
  });
  var _layoutParams$current2 = layoutParams.current,
      iw = _layoutParams$current2.iw,
      ih = _layoutParams$current2.ih;
  var zoomBox = !zoomStart || !zoomEnd ? null : _objectSpread({}, mat.clone().inverse().applyToPoint(zoomStart.x, zoomStart.y), {
    w: (zoomEnd.x - zoomStart.x) / mat.a,
    h: (zoomEnd.y - zoomStart.y) / mat.d
  });

  if (zoomBox) {
    if (zoomBox.w < 0) {
      zoomBox.x += zoomBox.w;
      zoomBox.w *= -1;
    }

    if (zoomBox.h < 0) {
      zoomBox.y += zoomBox.h;
      zoomBox.h *= -1;
    }
  }

  var imagePosition = {
    topLeft: mat.clone().inverse().applyToPoint(0, 0),
    bottomRight: mat.clone().inverse().applyToPoint(iw, ih)
  };
  var highlightedRegion = useMemo(function () {
    var highlightedRegions = regions.filter(function (r) {
      return r.highlighted;
    });
    if (highlightedRegions.length !== 1) return null;
    return highlightedRegions[0];
  }, [regions]);
  return React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      maxHeight: "calc(100vh - 68px)",
      position: "relative",
      overflow: "hidden",
      cursor: createWithPrimary ? "crosshair" : dragging ? "grabbing" : dragWithPrimary ? "grab" : zoomWithPrimary ? mat.a < 1 ? "zoom-out" : "zoom-in" : undefined
    }
  }, showCrosshairs && React.createElement(Crosshairs, {
    key: "crossHairs",
    mousePosition: mousePosition
  }), imageLoaded && !dragging && React.createElement(RegionSelectAndTransformBoxes, {
    key: "regionSelectAndTransformBoxes",
    regions: regions,
    mouseEvents: mouseEvents,
    projectRegionBox: projectRegionBox,
    dragWithPrimary: dragWithPrimary,
    createWithPrimary: createWithPrimary,
    zoomWithPrimary: zoomWithPrimary,
    onBeginMovePoint: onBeginMovePoint,
    onSelectRegion: onSelectRegion,
    layoutParams: layoutParams,
    mat: mat,
    onBeginBoxTransform: onBeginBoxTransform,
    onBeginMovePolygonPoint: onBeginMovePolygonPoint,
    onAddPolygonPoint: onAddPolygonPoint,
    showHighlightBox: showHighlightBox
  }), imageLoaded && showTags && !dragging && React.createElement(PreventScrollToParents, {
    key: "regionTags"
  }, React.createElement(RegionTags, {
    regions: regions,
    projectRegionBox: projectRegionBox,
    mouseEvents: mouseEvents,
    regionClsList: regionClsList,
    regionTagList: regionTagList,
    onBeginRegionEdit: onBeginRegionEdit,
    onChangeRegion: onChangeRegion,
    onCloseRegionEdit: onCloseRegionEdit,
    onDeleteRegion: onDeleteRegion,
    layoutParams: layoutParams,
    imageSrc: imageSrc,
    RegionEditLabel: RegionEditLabel,
    onRegionClassAdded: onRegionClassAdded
  })), !showTags && highlightedRegion && React.createElement("div", {
    key: "topLeftTag",
    className: classes.fixedRegionLabel
  }, React.createElement(RegionLabel, {
    disableClose: true,
    allowedClasses: regionClsList,
    allowedTags: regionTagList,
    onChange: onChangeRegion,
    onDelete: onDeleteRegion,
    editing: true,
    region: highlightedRegion,
    imageSrc: imageSrc
  })), zoomWithPrimary && zoomBox !== null && React.createElement("div", {
    key: "zoomBox",
    style: {
      position: "absolute",
      zIndex: 1,
      border: "1px solid #fff",
      pointerEvents: "none",
      left: zoomBox.x,
      top: zoomBox.y,
      width: zoomBox.w,
      height: zoomBox.h
    }
  }), showPointDistances && React.createElement(PointDistances, {
    key: "pointDistances",
    regions: regions,
    realSize: realSize,
    projectRegionBox: projectRegionBox,
    pointDistancePrecision: pointDistancePrecision
  }), React.createElement(PreventScrollToParents, Object.assign({
    style: {
      width: "100%",
      height: "100%"
    }
  }, mouseEvents), React.createElement(React.Fragment, null, fullImageSegmentationMode && React.createElement(ImageMask, {
    hide: !showMask,
    autoSegmentationOptions: autoSegmentationOptions,
    imagePosition: imagePosition,
    regionClsList: regionClsList,
    imageSrc: imageSrc,
    regions: regions
  }), React.createElement("canvas", {
    style: {
      opacity: 0.25
    },
    className: classes.canvas,
    ref: canvasEl
  }), React.createElement(RegionShapes, {
    mat: mat,
    imagePosition: imagePosition,
    regions: regions,
    fullSegmentationMode: fullImageSegmentationMode
  }), React.createElement(VideoOrImageCanvasBackground, {
    videoPlaying: videoPlaying,
    imagePosition: imagePosition,
    mouseEvents: mouseEvents,
    onLoad: onVideoOrImageLoaded,
    videoTime: videoTime,
    videoSrc: videoSrc,
    imageSrc: imageSrc,
    useCrossOrigin: fullImageSegmentationMode,
    onChangeVideoTime: onChangeVideoTime,
    onChangeVideoPlaying: onChangeVideoPlaying
  }))), React.createElement("div", {
    className: classes.zoomIndicator
  }, (1 / mat.a * 100).toFixed(0), "%"));
};
export default ImageCanvas;