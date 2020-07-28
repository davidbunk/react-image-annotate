import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import React, { useState, useRef, useCallback } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Sidebar from "../Sidebar";
import ImageCanvas from "../ImageCanvas";
import Header from "../Header";
import IconTools from "../IconTools";
import styles from "./styles";
import useKey from "use-key-hook";
import classnames from "classnames";
import { useSettings } from "../SettingsProvider";
import SettingsDialog from "../SettingsDialog";
import Fullscreen from "../Fullscreen";
import getActiveImage from "../Annotator/reducers/get-active-image";
import useImpliedVideoRegions from "./use-implied-video-regions";
import { useDispatchHotkeyHandlers } from "../ShortcutsManager";
import { withHotKeys } from "react-hotkeys";
var useStyles = makeStyles(styles);
var HotkeyDiv = withHotKeys(function (_ref) {
  var hotKeys = _ref.hotKeys,
      children = _ref.children,
      divRef = _ref.divRef,
      props = _objectWithoutProperties(_ref, ["hotKeys", "children", "divRef"]);

  return React.createElement("div", Object.assign({}, _objectSpread({}, hotKeys, props), {
    ref: divRef
  }), children);
});
export var MainLayout = function MainLayout(_ref2) {
  var _Object$assign;

  var state = _ref2.state,
      dispatch = _ref2.dispatch,
      _ref2$alwaysShowNextB = _ref2.alwaysShowNextButton,
      alwaysShowNextButton = _ref2$alwaysShowNextB === void 0 ? false : _ref2$alwaysShowNextB,
      _ref2$alwaysShowPrevB = _ref2.alwaysShowPrevButton,
      alwaysShowPrevButton = _ref2$alwaysShowPrevB === void 0 ? false : _ref2$alwaysShowPrevB,
      RegionEditLabel = _ref2.RegionEditLabel,
      onRegionClassAdded = _ref2.onRegionClassAdded;
  var classes = useStyles();
  var settings = useSettings();
  var memoizedActionFns = useRef({});

  var action = function action(type) {
    for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    var fnKey = "".concat(type, "(").concat(params.join(","), ")");
    if (memoizedActionFns.current[fnKey]) return memoizedActionFns.current[fnKey];

    var fn = function fn() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return params.length > 0 ? dispatch(_objectSpread({
        type: type
      }, params.reduce(function (acc, p, i) {
        return acc[p] = args[i], acc;
      }, {}))) : dispatch(_objectSpread({
        type: type
      }, args[0]));
    };

    memoizedActionFns.current[fnKey] = fn;
    return fn;
  };

  var _getActiveImage = getActiveImage(state),
      currentImageIndex = _getActiveImage.currentImageIndex,
      activeImage = _getActiveImage.activeImage;

  var nextImage;

  if (currentImageIndex !== null) {
    nextImage = state.images[currentImageIndex + 1];
  }

  useKey(function () {
    return dispatch({
      type: "CANCEL"
    });
  }, {
    detectKeys: [27]
  });
  var isAVideoFrame = activeImage && activeImage.frameTime !== undefined;
  var innerContainerRef = useRef();
  var hotkeyHandlers = useDispatchHotkeyHandlers({
    dispatch: dispatch
  });
  var impliedVideoRegions = useImpliedVideoRegions(state);
  var refocusOnMouseEvent = useCallback(function (e) {
    if (!innerContainerRef.current) return;
    if (innerContainerRef.current.contains(document.activeElement)) return;

    if (innerContainerRef.current.contains(e.target)) {
      innerContainerRef.current.focus();
      e.target.focus();
    }
  }, []);
  return React.createElement(Fullscreen, {
    enabled: state.fullScreen,
    onChange: function onChange(open) {
      if (!open) {
        action("HEADER_BUTTON_CLICKED", "buttonName")("Exit Fullscreen");
      }
    }
  }, React.createElement(HotkeyDiv, {
    tabIndex: -1,
    divRef: innerContainerRef,
    onMouseDown: refocusOnMouseEvent,
    onMouseOver: refocusOnMouseEvent,
    allowChanges: true,
    handlers: hotkeyHandlers,
    className: classnames(classes.container, state.fullScreen && "Fullscreen")
  }, React.createElement("div", {
    className: classes.headerContainer
  }, React.createElement(Header, {
    onHeaderButtonClick: action("HEADER_BUTTON_CLICKED", "buttonName"),
    videoMode: state.annotationType === "video",
    alwaysShowNextButton: alwaysShowNextButton,
    alwaysShowPrevButton: alwaysShowPrevButton,
    inFullScreen: state.fullScreen,
    isAVideoFrame: isAVideoFrame,
    nextVideoFrameHasRegions: !nextImage || nextImage.regions && nextImage.regions.length > 0,
    videoDuration: state.videoDuration,
    multipleImages: state.images && state.images.length > 1,
    title: state.annotationType === "image" ? activeImage ? activeImage.name : "No Image Selected" : state.videoName || "",
    onChangeCurrentTime: action("CHANGE_VIDEO_TIME", "newTime"),
    videoPlaying: state.videoPlaying,
    currentVideoTime: state.currentVideoTime,
    keyframes: state.keyframes
  })), React.createElement("div", {
    className: classes.workspace
  }, React.createElement("div", {
    className: classes.iconToolsContainer
  }, React.createElement(IconTools, {
    enabledTools: state.enabledTools,
    showTags: state.showTags,
    showMask: state.showMask,
    selectedTool: state.selectedTool,
    onClickTool: action("SELECT_TOOL", "selectedTool")
  })), React.createElement("div", {
    className: classes.imageCanvasContainer
  }, state.annotationType === "image" && !state.selectedImage ? React.createElement("div", {
    className: classes.noImageSelected
  }, "No Image Selected") : React.createElement("div", {
    style: {
      height: "100%",
      width: "100%"
    }
  }, React.createElement(ImageCanvas, Object.assign({}, settings, (_Object$assign = {
    key: state.selectedImage,
    showMask: state.showMask,
    fullImageSegmentationMode: state.fullImageSegmentationMode,
    autoSegmentationOptions: state.autoSegmentationOptions,
    showTags: state.showTags,
    allowedArea: state.allowedArea,
    regionClsList: state.regionClsList,
    regionTagList: state.regionTagList,
    regions: state.annotationType === "image" ? activeImage.regions || [] : impliedVideoRegions,
    realSize: activeImage ? activeImage.realSize : undefined,
    videoPlaying: state.videoPlaying,
    imageSrc: state.annotationType === "image" ? state.selectedImage : null,
    videoSrc: state.annotationType === "video" ? state.videoSrc : null,
    pointDistancePrecision: state.pointDistancePrecision,
    createWithPrimary: state.selectedTool.includes("create"),
    dragWithPrimary: state.selectedTool === "pan",
    zoomWithPrimary: state.selectedTool === "zoom",
    showPointDistances: state.showPointDistances
  }, _defineProperty(_Object$assign, "pointDistancePrecision", state.pointDistancePrecision), _defineProperty(_Object$assign, "videoTime", state.annotationType === "image" ? state.selectedImageFrameTime : state.currentVideoTime), _defineProperty(_Object$assign, "onMouseMove", action("MOUSE_MOVE")), _defineProperty(_Object$assign, "onMouseDown", action("MOUSE_DOWN")), _defineProperty(_Object$assign, "onMouseUp", action("MOUSE_UP")), _defineProperty(_Object$assign, "onChangeRegion", action("CHANGE_REGION", "region")), _defineProperty(_Object$assign, "onBeginRegionEdit", action("OPEN_REGION_EDITOR", "region")), _defineProperty(_Object$assign, "onCloseRegionEdit", action("CLOSE_REGION_EDITOR", "region")), _defineProperty(_Object$assign, "onDeleteRegion", action("DELETE_REGION", "region")), _defineProperty(_Object$assign, "onBeginBoxTransform", action("BEGIN_BOX_TRANSFORM", "box", "directions")), _defineProperty(_Object$assign, "onBeginMovePolygonPoint", action("BEGIN_MOVE_POLYGON_POINT", "polygon", "pointIndex")), _defineProperty(_Object$assign, "onAddPolygonPoint", action("ADD_POLYGON_POINT", "polygon", "point", "pointIndex")), _defineProperty(_Object$assign, "onSelectRegion", action("SELECT_REGION", "region")), _defineProperty(_Object$assign, "onBeginMovePoint", action("BEGIN_MOVE_POINT", "point")), _defineProperty(_Object$assign, "onImageLoaded", action("IMAGE_LOADED", "image")), _defineProperty(_Object$assign, "RegionEditLabel", RegionEditLabel), _defineProperty(_Object$assign, "onImageOrVideoLoaded", action("IMAGE_OR_VIDEO_LOADED", "metadata")), _defineProperty(_Object$assign, "onChangeVideoTime", action("CHANGE_VIDEO_TIME", "newTime")), _defineProperty(_Object$assign, "onChangeVideoPlaying", action("CHANGE_VIDEO_PLAYING", "isPlaying")), _defineProperty(_Object$assign, "onRegionClassAdded", onRegionClassAdded), _Object$assign))))), React.createElement("div", {
    className: classes.sidebarContainer
  }, React.createElement(Sidebar, {
    debug: window.localStorage.$ANNOTATE_DEBUG_MODE && state,
    taskDescription: state.taskDescription,
    images: state.images,
    regions: activeImage ? activeImage.regions : null,
    history: state.history,
    currentImage: activeImage,
    labelImages: state.labelImages,
    imageClsList: state.imageClsList,
    imageTagList: state.imageTagList,
    keyframes: state.keyframes,
    currentVideoTime: state.currentVideoTime,
    onChangeImage: action("CHANGE_IMAGE", "delta"),
    onSelectRegion: action("SELECT_REGION", "region"),
    onDeleteRegion: action("DELETE_REGION", "region"),
    onSelectImage: action("SELECT_IMAGE", "image"),
    onChangeRegion: action("CHANGE_REGION", "region"),
    onRestoreHistory: action("RESTORE_HISTORY"),
    onChangeVideoTime: action("CHANGE_VIDEO_TIME", "newTime"),
    onDeleteKeyframe: action("DELETE_KEYFRAME", "time"),
    onShortcutActionDispatched: dispatch
  }))), React.createElement(SettingsDialog, {
    open: state.settingsOpen,
    onClose: function onClose() {
      return dispatch({
        type: "HEADER_BUTTON_CLICKED",
        buttonName: "Settings"
      });
    }
  })));
};
export default MainLayout;