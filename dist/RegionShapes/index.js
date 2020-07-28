import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { memo } from "react";
import colorAlpha from "color-alpha";

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

var RegionComponents = {
  point: memo(function (_ref) {
    var region = _ref.region,
        iw = _ref.iw,
        ih = _ref.ih;
    return React.createElement("g", {
      transform: "translate(".concat(region.x * iw, " ").concat(region.y * ih, ")")
    }, React.createElement("path", {
      d: "M0 8L8 0L0 -8L-8 0Z",
      strokeWidth: 2,
      stroke: region.color,
      fill: "transparent"
    }));
  }),
  box: memo(function (_ref2) {
    var region = _ref2.region,
        iw = _ref2.iw,
        ih = _ref2.ih;
    return React.createElement("g", {
      transform: "translate(".concat(region.x * iw, " ").concat(region.y * ih, ")")
    }, React.createElement("rect", {
      strokeWidth: 2,
      x: 0,
      y: 0,
      width: region.w * iw,
      height: region.h * ih,
      stroke: colorAlpha(region.color, 0.75),
      fill: colorAlpha(region.color, 0.25)
    }));
  }),
  polygon: memo(function (_ref3) {
    var region = _ref3.region,
        iw = _ref3.iw,
        ih = _ref3.ih,
        fullSegmentationMode = _ref3.fullSegmentationMode;
    var Component = region.open ? "polyline" : "polygon";
    var alphaBase = fullSegmentationMode ? 0.5 : 1;
    return React.createElement(Component, {
      points: region.points.map(function (_ref4) {
        var _ref5 = _slicedToArray(_ref4, 2),
            x = _ref5[0],
            y = _ref5[1];

        return [x * iw, y * ih];
      }).map(function (a) {
        return a.join(" ");
      }).join(" "),
      strokeWidth: 2,
      stroke: colorAlpha(region.color, 0.75),
      fill: colorAlpha(region.color, 0.25)
    });
  }),
  "expanding-line": memo(function (_ref6) {
    var region = _ref6.region,
        iw = _ref6.iw,
        ih = _ref6.ih;
    var _region$expandingWidt = region.expandingWidth,
        expandingWidth = _region$expandingWidt === void 0 ? 0.005 : _region$expandingWidt,
        points = region.points;
    expandingWidth = points.slice(-1)[0].width || expandingWidth;
    var pointPairs = points.map(function (_ref7, i) {
      var x = _ref7.x,
          y = _ref7.y,
          angle = _ref7.angle,
          width = _ref7.width;

      if (!angle) {
        var n = points[clamp(i + 1, 0, points.length - 1)];
        var p = points[clamp(i - 1, 0, points.length - 1)];
        angle = Math.atan2(p.x - n.x, p.y - n.y) + Math.PI / 2;
      }

      var dx = Math.sin(angle) * (width || expandingWidth) / 2;
      var dy = Math.cos(angle) * (width || expandingWidth) / 2;
      return [{
        x: x + dx,
        y: y + dy
      }, {
        x: x - dx,
        y: y - dy
      }];
    });
    var firstSection = pointPairs.map(function (_ref8) {
      var _ref9 = _slicedToArray(_ref8, 2),
          p1 = _ref9[0],
          p2 = _ref9[1];

      return p1;
    });
    var secondSection = pointPairs.map(function (_ref10) {
      var _ref11 = _slicedToArray(_ref10, 2),
          p1 = _ref11[0],
          p2 = _ref11[1];

      return p2;
    }).asMutable();
    secondSection.reverse();
    var lastPoint = points.slice(-1)[0];
    return React.createElement(React.Fragment, null, React.createElement("polygon", {
      points: firstSection.concat(region.candidatePoint ? [region.candidatePoint] : []).concat(secondSection).map(function (p) {
        return "".concat(p.x * iw, " ").concat(p.y * ih);
      }).join(" "),
      strokeWidth: 2,
      stroke: colorAlpha(region.color, 0.75),
      fill: colorAlpha(region.color, 0.25)
    }), points.map(function (_ref12, i) {
      var x = _ref12.x,
          y = _ref12.y,
          angle = _ref12.angle;
      return React.createElement("g", {
        transform: "translate(".concat(x * iw, " ").concat(y * ih, ") rotate(").concat(-(angle || 0) * 180 / Math.PI, ")")
      }, React.createElement("g", null, React.createElement("rect", {
        x: -5,
        y: -5,
        width: 10,
        height: 10,
        strokeWidth: 2,
        stroke: colorAlpha(region.color, 0.75),
        fill: colorAlpha(region.color, 0.25)
      })));
    }), React.createElement("rect", {
      x: lastPoint.x * iw - 8,
      y: lastPoint.y * ih - 8,
      width: 16,
      height: 16,
      strokeWidth: 4,
      stroke: colorAlpha(region.color, 0.5),
      fill: "transparent"
    }));
  }),
  pixel: function pixel() {
    return null;
  }
};
export var WrappedRegionList = memo(function (_ref13) {
  var regions = _ref13.regions,
      iw = _ref13.iw,
      ih = _ref13.ih,
      fullSegmentationMode = _ref13.fullSegmentationMode;
  return regions.filter(function (r) {
    return r.visible !== false;
  }).map(function (r) {
    var Component = RegionComponents[r.type];
    return React.createElement(Component, {
      key: r.regionId,
      region: r,
      iw: iw,
      ih: ih,
      fullgeSegmentationMode: fullSegmentationMode
    });
  });
}, function (n, p) {
  return n.regions === p.regions && n.iw === p.iw && n.ih === p.ih;
});
export var RegionShapes = function RegionShapes(_ref14) {
  var mat = _ref14.mat,
      imagePosition = _ref14.imagePosition,
      _ref14$regions = _ref14.regions,
      regions = _ref14$regions === void 0 ? [] : _ref14$regions,
      fullSegmentationMode = _ref14.fullSegmentationMode;
  var iw = imagePosition.bottomRight.x - imagePosition.topLeft.x;
  var ih = imagePosition.bottomRight.y - imagePosition.topLeft.y;
  if (isNaN(iw) || isNaN(ih)) return null;
  return React.createElement("svg", {
    width: iw,
    height: ih,
    style: {
      position: "absolute",
      zIndex: 2,
      left: imagePosition.topLeft.x,
      top: imagePosition.topLeft.y,
      pointerEvents: "none",
      width: iw,
      height: ih
    }
  }, React.createElement(WrappedRegionList, {
    regions: regions,
    iw: iw,
    ih: ih,
    fullSegmentationMode: fullSegmentationMode
  }));
};
export default RegionShapes;