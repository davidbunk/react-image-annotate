import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import HeaderButton, { HeaderButtonContext } from "../HeaderButton";
import BackIcon from "@material-ui/icons/KeyboardArrowLeft";
import NextIcon from "@material-ui/icons/KeyboardArrowRight";
import PlayIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SettingsIcon from "@material-ui/icons/Settings";
import HelpIcon from "@material-ui/icons/Help";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import ExitIcon from "@material-ui/icons/ExitToApp";
import QueuePlayNextIcon from "@material-ui/icons/QueuePlayNext";
import HotkeysIcon from "@material-ui/icons/Keyboard";
import styles from "./styles";
import KeyframeTimeline from "../KeyframeTimeline";
import classnames from "classnames";
var useStyles = makeStyles(styles);
export var Header = function Header(_ref) {
  var onHeaderButtonClick = _ref.onHeaderButtonClick,
      title = _ref.title,
      inFullScreen = _ref.inFullScreen,
      videoMode = _ref.videoMode,
      _ref$isAVideoFrame = _ref.isAVideoFrame,
      isAVideoFrame = _ref$isAVideoFrame === void 0 ? false : _ref$isAVideoFrame,
      _ref$nextVideoFrameHa = _ref.nextVideoFrameHasRegions,
      nextVideoFrameHasRegions = _ref$nextVideoFrameHa === void 0 ? false : _ref$nextVideoFrameHa,
      videoDuration = _ref.videoDuration,
      currentVideoTime = _ref.currentVideoTime,
      multipleImages = _ref.multipleImages,
      videoPlaying = _ref.videoPlaying,
      onChangeCurrentTime = _ref.onChangeCurrentTime,
      keyframes = _ref.keyframes,
      alwaysShowPrevButton = _ref.alwaysShowPrevButton,
      alwaysShowNextButton = _ref.alwaysShowNextButton;
  var classes = useStyles();
  return React.createElement("div", {
    className: classes.header
  }, React.createElement("div", {
    className: classnames(classes.fileInfo, videoMode && "videoMode")
  }, title), videoMode && React.createElement(KeyframeTimeline, {
    key: "keyframeTimeline",
    currentTime: currentVideoTime,
    duration: videoDuration,
    onChangeCurrentTime: onChangeCurrentTime,
    keyframes: keyframes
  }), React.createElement("div", {
    className: classes.headerActions
  }, React.createElement(HeaderButtonContext.Provider, {
    value: {
      onHeaderButtonClick: onHeaderButtonClick
    }
  }, (multipleImages || alwaysShowPrevButton) && React.createElement(HeaderButton, {
    name: "Prev",
    Icon: BackIcon
  }), (multipleImages || alwaysShowNextButton) && React.createElement(React.Fragment, null, React.createElement(HeaderButton, {
    name: "Next",
    Icon: NextIcon
  }), React.createElement(HeaderButton, {
    name: "Clone",
    disabled: nextVideoFrameHasRegions,
    Icon: QueuePlayNextIcon
  })), videoMode && React.createElement(React.Fragment, null, !videoPlaying ? React.createElement(HeaderButton, {
    key: "play",
    name: "Play",
    Icon: PlayIcon
  }) : React.createElement(HeaderButton, {
    key: "pause",
    name: "Pause",
    Icon: PauseIcon
  })), React.createElement(HeaderButton, {
    name: "Settings",
    Icon: SettingsIcon
  }), inFullScreen ? React.createElement(HeaderButton, {
    name: "Window",
    Icon: FullscreenIcon
  }) : React.createElement(HeaderButton, {
    name: "Fullscreen",
    Icon: FullscreenIcon
  }), React.createElement(HeaderButton, {
    name: "Save",
    Icon: ExitIcon
  }))));
};
export default Header;