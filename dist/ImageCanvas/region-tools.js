import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
export var getEnclosingBox = function getEnclosingBox(region) {
  switch (region.type) {
    case "polygon":
      {
        var box = {
          x: Math.min.apply(Math, _toConsumableArray(region.points.map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                x = _ref2[0],
                y = _ref2[1];

            return x;
          }))),
          y: Math.min.apply(Math, _toConsumableArray(region.points.map(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
                x = _ref4[0],
                y = _ref4[1];

            return y;
          }))),
          w: 0,
          h: 0
        };
        box.w = Math.max.apply(Math, _toConsumableArray(region.points.map(function (_ref5) {
          var _ref6 = _slicedToArray(_ref5, 2),
              x = _ref6[0],
              y = _ref6[1];

          return x;
        }))) - box.x;
        box.h = Math.max.apply(Math, _toConsumableArray(region.points.map(function (_ref7) {
          var _ref8 = _slicedToArray(_ref7, 2),
              x = _ref8[0],
              y = _ref8[1];

          return y;
        }))) - box.y;
        return box;
      }

    case "expanding-line":
      {
        var _box = {
          x: Math.min.apply(Math, _toConsumableArray(region.points.map(function (_ref9) {
            var x = _ref9.x,
                y = _ref9.y;
            return x;
          }))),
          y: Math.min.apply(Math, _toConsumableArray(region.points.map(function (_ref10) {
            var x = _ref10.x,
                y = _ref10.y;
            return y;
          }))),
          w: 0,
          h: 0
        };
        _box.w = Math.max.apply(Math, _toConsumableArray(region.points.map(function (_ref11) {
          var x = _ref11.x,
              y = _ref11.y;
          return x;
        }))) - _box.x;
        _box.h = Math.max.apply(Math, _toConsumableArray(region.points.map(function (_ref12) {
          var x = _ref12.x,
              y = _ref12.y;
          return y;
        }))) - _box.y;
        return _box;
      }

    case "box":
      {
        return {
          x: region.x,
          y: region.y,
          w: region.w,
          h: region.h
        };
      }

    case "point":
      {
        return {
          x: region.x,
          y: region.y,
          w: 0,
          h: 0
        };
      }

    default:
      {
        return {
          x: 0,
          y: 0,
          w: 0,
          h: 0
        };
      }
  }

  throw new Error("unknown region");
};
export var moveRegion = function moveRegion(region, x, y) {
  switch (region.type) {
    case "point":
      {
        return _objectSpread({}, region, {
          x: x,
          y: y
        });
      }

    case "box":
      {
        return _objectSpread({}, region, {
          x: x - region.w / 2,
          y: y - region.h / 2
        });
      }
  }

  return region;
};