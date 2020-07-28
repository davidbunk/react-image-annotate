import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsAlt, faMousePointer, faExpandArrowsAlt, faGripLines, faTag, faPaintBrush, faCrosshairs, faDrawPolygon, faVectorSquare, faHandPaper, faSearch, faMask } from "@fortawesome/free-solid-svg-icons";
import SmallToolButton, { SelectedTool } from "../SmallToolButton";
import { makeStyles } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";
var useStyles = makeStyles({
  iconTools: {
    display: "flex",
    padding: 4,
    flexDirection: "column",
    zIndex: 9,
    boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
    borderRight: "1px solid ".concat(grey[300]),
    backgroundColor: grey[100]
  },
  grow: {
    flexGrow: 1
  }
});
var defaultTools = ["select", "create-point", "create-box", "create-polygon", "create-expanding-line"];
export var IconTools = function IconTools(_ref) {
  var showTags = _ref.showTags,
      showMask = _ref.showMask,
      selectedTool = _ref.selectedTool,
      onClickTool = _ref.onClickTool,
      _ref$enabledTools = _ref.enabledTools,
      enabledTools = _ref$enabledTools === void 0 ? defaultTools : _ref$enabledTools;
  var classes = useStyles();
  var selectedToolContextValue = useMemo(function () {
    return {
      enabledTools: enabledTools,
      selectedTool: selectedTool,
      onClickTool: onClickTool
    };
  }, [enabledTools, selectedTool]);
  return React.createElement("div", {
    className: classes.iconTools
  }, React.createElement(SelectedTool.Provider, {
    value: selectedToolContextValue
  }, React.createElement(SmallToolButton, {
    id: "select",
    name: "Select Region",
    icon: React.createElement(FontAwesomeIcon, {
      size: "xs",
      fixedWidth: true,
      icon: faMousePointer
    })
  }), React.createElement(SmallToolButton, {
    alwaysShowing: true,
    id: "pan",
    name: "Drag/Pan",
    icon: React.createElement(FontAwesomeIcon, {
      size: "xs",
      fixedWidth: true,
      icon: faHandPaper
    })
  }), React.createElement(SmallToolButton, {
    alwaysShowing: true,
    id: "zoom",
    name: "Zoom In/Out",
    icon: React.createElement(FontAwesomeIcon, {
      size: "xs",
      fixedWidth: true,
      icon: faSearch
    })
  }), React.createElement(SmallToolButton, {
    alwaysShowing: true,
    togglable: true,
    id: "show-tags",
    selected: showTags,
    name: "Show Tags",
    icon: React.createElement(FontAwesomeIcon, {
      size: "xs",
      fixedWidth: true,
      icon: faTag
    })
  }), React.createElement(SmallToolButton, {
    id: "create-point",
    name: "Add Point",
    icon: React.createElement(FontAwesomeIcon, {
      size: "xs",
      fixedWidth: true,
      icon: faCrosshairs
    })
  }), React.createElement(SmallToolButton, {
    id: "create-box",
    name: "Add Bounding Box",
    icon: React.createElement(FontAwesomeIcon, {
      size: "xs",
      fixedWidth: true,
      icon: faVectorSquare
    })
  }), React.createElement(SmallToolButton, {
    id: "create-polygon",
    name: "Add Polygon",
    icon: React.createElement(FontAwesomeIcon, {
      size: "xs",
      fixedWidth: true,
      icon: faDrawPolygon
    })
  }), React.createElement(SmallToolButton, {
    id: "create-expanding-line",
    name: "Add Expanding Line",
    icon: React.createElement(FontAwesomeIcon, {
      size: "xs",
      fixedWidth: true,
      icon: faGripLines
    })
  }), React.createElement(SmallToolButton, {
    togglable: true,
    selected: showMask,
    id: "show-mask",
    name: "Show / Hide Mask",
    icon: React.createElement(FontAwesomeIcon, {
      size: "xs",
      fixedWidth: true,
      icon: faMask
    })
  })));
};
export default IconTools;