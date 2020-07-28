import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import { moveRegion } from "../../ImageCanvas/region-tools.js";
import { getIn, setIn, updateIn } from "seamless-immutable";
import moment from "moment";
import isEqual from "lodash/isEqual";
import getActiveImage from "./get-active-image";
import { saveToHistory } from "./history-handler.js";
import colors from "../../colors";
import fixTwisted from "./fix-twisted";
import convertExpandingLineToPolygon from "./convert-expanding-line-to-polygon";

var getRandomId = function getRandomId() {
  return Math.random().toString().split(".")[1];
};

export default (function (state, action) {
  if (action.type === "ON_CLS_ADDED" && action.cls && action.cls !== "") {
    var oldRegionClsList = state.regionClsList;

    var newState = _objectSpread({}, state, {
      regionClsList: oldRegionClsList.concat(action.cls)
    });

    return newState;
  } // Throttle certain actions


  if (action.type === "MOUSE_MOVE") {
    if (Date.now() - (state.lastMouseMoveCall || 0) < 16) return state;
    state = setIn(state, ["lastMouseMoveCall"], Date.now());
  }

  if (!action.type.includes("MOUSE")) {
    state = setIn(state, ["lastAction"], action);
  }

  var _getActiveImage = getActiveImage(state),
      currentImageIndex = _getActiveImage.currentImageIndex,
      pathToActiveImage = _getActiveImage.pathToActiveImage,
      activeImage = _getActiveImage.activeImage;

  var getRegionIndex = function getRegionIndex(region) {
    var regionId = typeof region === "string" ? region : region.id;
    if (!activeImage) return null;
    var regionIndex = (activeImage.regions || []).findIndex(function (r) {
      return r.id === regionId;
    });
    return regionIndex === -1 ? null : regionIndex;
  };

  var getRegion = function getRegion(regionId) {
    if (!activeImage) return null;
    var regionIndex = getRegionIndex(regionId);
    if (regionIndex === null) return [null, null];
    var region = activeImage.regions[regionIndex];
    return [region, regionIndex];
  };

  var modifyRegion = function modifyRegion(regionId, obj) {
    var _getRegion = getRegion(regionId),
        _getRegion2 = _slicedToArray(_getRegion, 2),
        region = _getRegion2[0],
        regionIndex = _getRegion2[1];

    if (!region) return state;

    if (obj !== null) {
      return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", regionIndex]), _objectSpread({}, region, obj));
    } else {
      // delete region
      var regions = activeImage.regions;
      return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions"]), (regions || []).filter(function (r) {
        return r.id !== region.id;
      }));
    }
  };

  var unselectRegions = function unselectRegions(state) {
    if (!activeImage) return state;
    return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions"]), (activeImage.regions || []).map(function (r) {
      return _objectSpread({}, r, {
        highlighted: false
      });
    }));
  };

  var closeEditors = function closeEditors(state) {
    if (currentImageIndex === null) return state;
    return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions"]), (activeImage.regions || []).map(function (r) {
      return _objectSpread({}, r, {
        editingLabels: false
      });
    }));
  };

  var setNewImage = function setNewImage(img) {
    var _ref = typeof img === "object" ? img : {
      src: img
    },
        src = _ref.src,
        frameTime = _ref.frameTime;

    return setIn(setIn(state, ["selectedImage"], src), ["selectedImageFrameTime"], frameTime);
  };

  switch (action.type) {
    case "@@INIT":
      {
        return state;
      }

    case "SELECT_IMAGE":
      {
        return setNewImage(action.image);
      }

    case "CHANGE_REGION":
      {
        var regionIndex = getRegionIndex(action.region);
        if (regionIndex === null) return state;
        var oldRegion = activeImage.regions[regionIndex];

        if (oldRegion.cls !== action.region.cls) {
          state = saveToHistory(state, "Change Region Classification");
          var clsIndex = state.regionClsList.indexOf(action.region.cls);

          if (clsIndex !== -1) {
            action.region.color = colors[clsIndex % colors.length];
          }
        }

        if (!isEqual(oldRegion.tags, action.region.tags)) {
          state = saveToHistory(state, "Change Region Tags");
        }

        return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", regionIndex]), action.region);
      }

    case "CHANGE_IMAGE":
      {
        if (!activeImage) return state;
        var delta = action.delta;

        for (var _i = 0, _Object$keys = Object.keys(delta); _i < _Object$keys.length; _i++) {
          var key = _Object$keys[_i];
          if (key === "cls") saveToHistory(state, "Change Image Class");
          if (key === "tags") saveToHistory(state, "Change Image Tags");
          state = setIn(state, [].concat(_toConsumableArray(pathToActiveImage), [key]), delta[key]);
        }

        return state;
      }

    case "SELECT_REGION":
      {
        var region = action.region;

        var _regionIndex = getRegionIndex(action.region);

        if (_regionIndex === null) return state;

        var regions = _toConsumableArray(activeImage.regions || []).map(function (r) {
          return _objectSpread({}, r, {
            highlighted: r.id === region.id,
            editingLabels: r.id === region.id
          });
        });

        return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions"]), regions);
      }

    case "BEGIN_MOVE_POINT":
      {
        state = closeEditors(state);
        return setIn(state, ["mode"], {
          mode: "MOVE_REGION",
          regionId: action.point.id
        });
      }

    case "BEGIN_BOX_TRANSFORM":
      {
        var box = action.box,
            directions = action.directions;
        state = closeEditors(state);

        if (directions[0] === 0 && directions[1] === 0) {
          return setIn(state, ["mode"], {
            mode: "MOVE_REGION",
            regionId: box.id
          });
        } else {
          return setIn(state, ["mode"], {
            mode: "RESIZE_BOX",
            regionId: box.id,
            freedom: directions,
            original: {
              x: box.x,
              y: box.y,
              w: box.w,
              h: box.h
            }
          });
        }
      }

    case "BEGIN_MOVE_POLYGON_POINT":
      {
        var polygon = action.polygon,
            pointIndex = action.pointIndex;
        state = closeEditors(state);

        if (state.mode && state.mode.mode === "DRAW_POLYGON" && pointIndex === 0) {
          return setIn(modifyRegion(polygon, {
            points: polygon.points.slice(0, -1),
            open: false
          }), ["mode"], null);
        } else {
          state = saveToHistory(state, "Move Polygon Point");
        }

        return setIn(state, ["mode"], {
          mode: "MOVE_POLYGON_POINT",
          regionId: polygon.id,
          pointIndex: pointIndex
        });
      }

    case "ADD_POLYGON_POINT":
      {
        var _polygon = action.polygon,
            point = action.point,
            _pointIndex = action.pointIndex;

        var _regionIndex2 = getRegionIndex(_polygon);

        if (_regionIndex2 === null) return state;

        var points = _toConsumableArray(_polygon.points);

        points.splice(_pointIndex, 0, point);
        return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex2]), _objectSpread({}, _polygon, {
          points: points
        }));
      }

    case "MOUSE_MOVE":
      {
        var x = action.x,
            y = action.y;
        if (!state.mode) return state;
        if (!activeImage) return state;
        var _state = state,
            mouseDownAt = _state.mouseDownAt;

        switch (state.mode.mode) {
          case "MOVE_POLYGON_POINT":
            {
              var _state$mode = state.mode,
                  _pointIndex2 = _state$mode.pointIndex,
                  regionId = _state$mode.regionId;

              var _regionIndex3 = getRegionIndex(regionId);

              if (_regionIndex3 === null) return state;
              return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex3, "points", _pointIndex2]), [x, y]);
            }

          case "MOVE_REGION":
            {
              var _regionId = state.mode.regionId;

              var _regionIndex4 = getRegionIndex(_regionId);

              if (_regionIndex4 === null) return state;
              return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex4]), moveRegion(activeImage.regions[_regionIndex4], x, y));
            }

          case "RESIZE_BOX":
            {
              var _state$mode2 = state.mode,
                  _regionId2 = _state$mode2.regionId,
                  _state$mode2$freedom = _slicedToArray(_state$mode2.freedom, 2),
                  xFree = _state$mode2$freedom[0],
                  yFree = _state$mode2$freedom[1],
                  _state$mode2$original = _state$mode2.original,
                  ox = _state$mode2$original.x,
                  oy = _state$mode2$original.y,
                  ow = _state$mode2$original.w,
                  oh = _state$mode2$original.h;

              var _regionIndex5 = getRegionIndex(_regionId2);

              if (_regionIndex5 === null) return state;
              var _box = activeImage.regions[_regionIndex5];
              var dx = xFree === 0 ? ox : xFree === -1 ? Math.min(ox + ow, x) : ox;
              var dw = xFree === 0 ? ow : xFree === -1 ? ow + (ox - dx) : Math.max(0, ow + (x - ox - ow));
              var dy = yFree === 0 ? oy : yFree === -1 ? Math.min(oy + oh, y) : oy;
              var dh = yFree === 0 ? oh : yFree === -1 ? oh + (oy - dy) : Math.max(0, oh + (y - oy - oh)); // determine if we should switch the freedom

              if (dw <= 0.001) {
                state = setIn(state, ["mode", "freedom"], [xFree * -1, yFree]);
              }

              if (dh <= 0.001) {
                state = setIn(state, ["mode", "freedom"], [xFree, yFree * -1]);
              }

              return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex5]), _objectSpread({}, _box, {
                x: dx,
                w: dw,
                y: dy,
                h: dh
              }));
            }

          case "DRAW_POLYGON":
            {
              var _regionId3 = state.mode.regionId;

              var _getRegion3 = getRegion(_regionId3),
                  _getRegion4 = _slicedToArray(_getRegion3, 2),
                  _region = _getRegion4[0],
                  _regionIndex6 = _getRegion4[1];

              if (!_region) return setIn(state, ["mode"], null);
              return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex6, "points", _region.points.length - 1]), [x, y]);
            }

          case "DRAW_EXPANDING_LINE":
            {
              var _regionId4 = state.mode.regionId;

              var _getRegion5 = getRegion(_regionId4),
                  _getRegion6 = _slicedToArray(_getRegion5, 2),
                  expandingLine = _getRegion6[0],
                  _regionIndex7 = _getRegion6[1];

              if (!expandingLine) return state;
              var isMouseDown = Boolean(state.mouseDownAt);

              if (isMouseDown) {
                // If the mouse is down, set width/angle
                var lastPoint = expandingLine.points.slice(-1)[0];
                var mouseDistFromLastPoint = Math.sqrt(Math.pow(lastPoint.x - x, 2) + Math.pow(lastPoint.y - y, 2));
                if (mouseDistFromLastPoint < 0.002 && !lastPoint.width) return state;

                var _newState = setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex7, "points"]), expandingLine.points.slice(0, -1).concat([_objectSpread({}, lastPoint, {
                  width: mouseDistFromLastPoint * 2,
                  angle: Math.atan2(lastPoint.x - x, lastPoint.y - y)
                })]));

                return _newState;
              } else {
                // If mouse is up, move the next candidate point
                return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex7]), _objectSpread({}, expandingLine, {
                  candidatePoint: {
                    x: x,
                    y: y
                  }
                }));
              }

              return state;
            }

          case "SET_EXPANDING_LINE_WIDTH":
            {
              var _regionId5 = state.mode.regionId;

              var _getRegion7 = getRegion(_regionId5),
                  _getRegion8 = _slicedToArray(_getRegion7, 2),
                  _expandingLine = _getRegion8[0],
                  _regionIndex8 = _getRegion8[1];

              if (!_expandingLine) return state;

              var _lastPoint = _expandingLine.points.slice(-1)[0];

              var _state2 = state,
                  _mouseDownAt = _state2.mouseDownAt;
              return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex8, "expandingWidth"]), Math.sqrt(Math.pow(_lastPoint.x - x, 2) + Math.pow(_lastPoint.y - y, 2)));
            }

          default:
            return state;
        }
      }

    case "MOUSE_DOWN":
      {
        if (!activeImage) return state;
        var _x = action.x,
            _y = action.y;
        state = setIn(state, ["mouseDownAt"], {
          x: _x,
          y: _y
        });

        if (state.allowedArea) {
          // TODO clamp x/y instead of giving up
          // TODO or image bounds
          var aa = state.allowedArea;

          if (_x < aa.x || _x > aa.x + aa.w || _y < aa.y || _y > aa.y + aa.h) {
            return state;
          }
        }

        if (state.mode) {
          switch (state.mode.mode) {
            case "DRAW_POLYGON":
              {
                var _getRegion9 = getRegion(state.mode.regionId),
                    _getRegion10 = _slicedToArray(_getRegion9, 2),
                    _polygon2 = _getRegion10[0],
                    _regionIndex9 = _getRegion10[1];

                if (!_polygon2) break;
                return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex9]), _objectSpread({}, _polygon2, {
                  points: _polygon2.points.concat([[_x, _y]])
                }));
              }

            case "DRAW_EXPANDING_LINE":
              {
                var _getRegion11 = getRegion(state.mode.regionId),
                    _getRegion12 = _slicedToArray(_getRegion11, 2),
                    _expandingLine2 = _getRegion12[0],
                    _regionIndex10 = _getRegion12[1];

                if (!_expandingLine2) break;

                var _lastPoint2 = _expandingLine2.points.slice(-1)[0];

                if (_expandingLine2.points.length > 1 && Math.sqrt(Math.pow(_lastPoint2.x - _x, 2) + Math.pow(_lastPoint2.y - _y, 2)) < 0.002) {
                  if (!_lastPoint2.width) {
                    return setIn(state, ["mode"], {
                      mode: "SET_EXPANDING_LINE_WIDTH",
                      regionId: state.mode.regionId
                    });
                  } else {
                    return state.setIn([].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex10]), convertExpandingLineToPolygon(_expandingLine2)).setIn(["mode"], null);
                  }
                } // Create new point


                return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex10, "points"]), _expandingLine2.points.concat([{
                  x: _x,
                  y: _y,
                  angle: null,
                  width: null
                }]));
              }

            case "SET_EXPANDING_LINE_WIDTH":
              {
                var _getRegion13 = getRegion(state.mode.regionId),
                    _getRegion14 = _slicedToArray(_getRegion13, 2),
                    _expandingLine3 = _getRegion14[0],
                    _regionIndex11 = _getRegion14[1];

                if (!_expandingLine3) break;
                var expandingWidth = _expandingLine3.expandingWidth;
                return state.setIn([].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex11]), convertExpandingLineToPolygon(_objectSpread({}, _expandingLine3, {
                  points: _expandingLine3.points.map(function (p) {
                    return p.width ? p : _objectSpread({}, p, {
                      width: expandingWidth
                    });
                  }),
                  expandingWidth: undefined
                }))).setIn(["mode"], null);
              }

            default:
              break;
          }
        }

        var newRegion;
        var defaultRegionCls = undefined,
            defaultRegionColor = "#ff0000";

        if (activeImage && (activeImage.regions || []).length > 0) {
          defaultRegionCls = activeImage.regions.slice(-1)[0].cls;

          var _clsIndex = (state.regionClsList || []).indexOf(defaultRegionCls);

          if (_clsIndex !== -1) {
            defaultRegionColor = colors[_clsIndex % colors.length];
          }
        }

        switch (state.selectedTool) {
          case "create-point":
            {
              state = saveToHistory(state, "Create Point");
              newRegion = {
                type: "point",
                x: _x,
                y: _y,
                highlighted: true,
                editingLabels: true,
                color: defaultRegionColor,
                id: getRandomId(),
                cls: defaultRegionCls
              };
              break;
            }

          case "create-box":
            {
              state = saveToHistory(state, "Create Box");
              newRegion = {
                type: "box",
                x: _x,
                y: _y,
                w: 0.01,
                h: 0.01,
                highlighted: true,
                editingLabels: false,
                color: defaultRegionColor,
                cls: defaultRegionCls,
                id: getRandomId()
              };
              state = setIn(state, ["mode"], {
                mode: "RESIZE_BOX",
                editLabelEditorAfter: true,
                regionId: newRegion.id,
                freedom: [1, 1],
                original: {
                  x: _x,
                  y: _y,
                  w: newRegion.w,
                  h: newRegion.h
                },
                isNew: true
              });
              break;
            }

          case "create-polygon":
            {
              if (state.mode && state.mode.mode === "DRAW_POLYGON") break;
              state = saveToHistory(state, "Create Polygon");
              newRegion = {
                type: "polygon",
                points: [[_x, _y], [_x, _y]],
                open: true,
                highlighted: true,
                color: defaultRegionColor,
                cls: defaultRegionCls,
                id: getRandomId()
              };
              state = setIn(state, ["mode"], {
                mode: "DRAW_POLYGON",
                regionId: newRegion.id
              });
              break;
            }

          case "create-expanding-line":
            {
              state = saveToHistory(state, "Create Expanding Line");
              newRegion = {
                type: "expanding-line",
                unfinished: true,
                points: [{
                  x: _x,
                  y: _y,
                  angle: null,
                  width: null
                }],
                open: true,
                highlighted: true,
                color: defaultRegionColor,
                cls: defaultRegionCls,
                id: getRandomId()
              };
              state = setIn(state, ["mode"], {
                mode: "DRAW_EXPANDING_LINE",
                regionId: newRegion.id
              });
              break;
            }

          default:
            break;
        }

        var _regions = _toConsumableArray(getIn(state, pathToActiveImage).regions || []).map(function (r) {
          return setIn(r, ["editingLabels"], false).setIn(["highlighted"], false);
        }).concat(newRegion ? [newRegion] : []);

        return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions"]), _regions);
      }

    case "MOUSE_UP":
      {
        var _x2 = action.x,
            _y2 = action.y;

        var _state3 = state,
            _state3$mouseDownAt = _state3.mouseDownAt,
            _mouseDownAt2 = _state3$mouseDownAt === void 0 ? {
          x: _x2,
          y: _y2
        } : _state3$mouseDownAt;

        if (!state.mode) return state;
        state = setIn(state, ["mouseDownAt"], null);

        switch (state.mode.mode) {
          case "RESIZE_BOX":
            {
              if (state.mode.isNew) {
                if (Math.abs(state.mode.original.x - _x2) < 0.002 && Math.abs(state.mode.original.y - _y2) < 0.002) {
                  return setIn(modifyRegion(state.mode.regionId, null), ["mode"], null);
                }
              }

              if (state.mode.editLabelEditorAfter) {
                return _objectSpread({}, modifyRegion(state.mode.regionId, {
                  editingLabels: true
                }), {
                  mode: null
                });
              }
            }

          case "MOVE_REGION":
          case "MOVE_POLYGON_POINT":
            {
              return _objectSpread({}, state, {
                mode: null
              });
            }

          case "CREATE_POINT_LINE":
            {
              return state;
            }

          case "DRAW_EXPANDING_LINE":
            {
              var _getRegion15 = getRegion(state.mode.regionId),
                  _getRegion16 = _slicedToArray(_getRegion15, 2),
                  _expandingLine4 = _getRegion16[0],
                  _regionIndex12 = _getRegion16[1];

              if (!_expandingLine4) return state;
              var newExpandingLine = _expandingLine4;

              var _lastPoint3 = _expandingLine4.points.length !== 0 ? _expandingLine4.points.slice(-1)[0] : _mouseDownAt2;

              var jointStart;

              if (_expandingLine4.points.length > 1) {
                jointStart = _expandingLine4.points.slice(-2)[0];
              } else {
                jointStart = _lastPoint3;
              }

              var _mouseDistFromLastPoint = Math.sqrt(Math.pow(_lastPoint3.x - _x2, 2) + Math.pow(_lastPoint3.y - _y2, 2));

              if (_mouseDistFromLastPoint > 0.002) {
                // The user is drawing has drawn the width for the last point
                var newPoints = _toConsumableArray(_expandingLine4.points);

                for (var i = 0; i < newPoints.length - 1; i++) {
                  if (newPoints[i].width) continue;
                  newPoints[i] = _objectSpread({}, newPoints[i], {
                    width: _lastPoint3.width
                  });
                }

                newExpandingLine = setIn(_expandingLine4, ["points"], fixTwisted(newPoints));
              } else {
                return state;
              }

              return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex12]), newExpandingLine);
            }

          default:
            return state;
        }
      }

    case "OPEN_REGION_EDITOR":
      {
        var _region2 = action.region;

        var _regionIndex13 = getRegionIndex(action.region);

        if (_regionIndex13 === null) return state;
        var newRegions = setIn(activeImage.regions.map(function (r) {
          return _objectSpread({}, r, {
            highlighted: false,
            editingLabels: false
          });
        }), [_regionIndex13], _objectSpread({}, (activeImage.regions || [])[_regionIndex13], {
          highlighted: true,
          editingLabels: true
        }));
        return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions"]), newRegions);
      }

    case "CLOSE_REGION_EDITOR":
      {
        var _region3 = action.region;

        var _regionIndex14 = getRegionIndex(action.region);

        if (_regionIndex14 === null) return state;
        return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions", _regionIndex14]), _objectSpread({}, (activeImage.regions || [])[_regionIndex14], {
          editingLabels: false
        }));
      }

    case "DELETE_REGION":
      {
        var _regionIndex15 = getRegionIndex(action.region);

        if (_regionIndex15 === null) return state;
        return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions"]), (activeImage.regions || []).filter(function (r) {
          return r.id !== action.region.id;
        }));
      }

    case "HEADER_BUTTON_CLICKED":
      {
        var buttonName = action.buttonName.toLowerCase();

        switch (buttonName) {
          case "prev":
            {
              if (currentImageIndex === null) return state;
              if (currentImageIndex === 0) return state;
              return setNewImage(state.images[currentImageIndex - 1]);
            }

          case "next":
            {
              if (currentImageIndex === null) return state;
              if (currentImageIndex === state.images.length - 1) return state;
              return setNewImage(state.images[currentImageIndex + 1]);
            }

          case "clone":
            {
              if (currentImageIndex === null) return state;
              if (currentImageIndex === state.images.length - 1) return state;
              return setIn(setNewImage(state.images[currentImageIndex + 1]), ["images", currentImageIndex + 1, "regions"], activeImage.regions);
            }

          case "settings":
            {
              return setIn(state, ["settingsOpen"], !state.settingsOpen);
            }

          case "help":
            {
              return state;
            }

          case "fullscreen":
            {
              return setIn(state, ["fullScreen"], true);
            }

          case "exit fullscreen":
          case "window":
            {
              return setIn(state, ["fullScreen"], false);
            }

          case "hotkeys":
            {
              return state;
            }

          case "exit":
          case "done":
            {
              return state;
            }

          default:
            return state;
        }
      }

    case "SELECT_TOOL":
      {
        if (action.selectedTool === "show-tags") {
          return setIn(state, ["showTags"], !state.showTags);
        } else if (action.selectedTool === "show-mask") {
          return setIn(state, ["showMask"], !state.showMask);
        }

        state = setIn(state, ["mode"], null);
        return setIn(state, ["selectedTool"], action.selectedTool);
      }

    case "CANCEL":
      {
        var _state4 = state,
            mode = _state4.mode;

        if (mode) {
          switch (mode.mode) {
            case "DRAW_EXPANDING_LINE":
            case "SET_EXPANDING_LINE_WIDTH":
            case "DRAW_POLYGON":
              {
                var _regionId6 = mode.regionId;
                return modifyRegion(_regionId6, null);
              }

            case "MOVE_POLYGON_POINT":
            case "RESIZE_BOX":
            case "MOVE_REGION":
              {
                return setIn(state, ["mode"], null);
              }

            default:
              return state;
          }
        } // Close any open boxes


        var _regions2 = activeImage.regions;

        if (_regions2 && _regions2.some(function (r) {
          return r.editingLabels;
        })) {
          return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions"]), _regions2.map(function (r) {
            return _objectSpread({}, r, {
              editingLabels: false
            });
          }));
        } else if (_regions2) {
          return setIn(state, [].concat(_toConsumableArray(pathToActiveImage), ["regions"]), _regions2.map(function (r) {
            return _objectSpread({}, r, {
              highlighted: false
            });
          }));
        }

        break;
      }

    default:
      break;
  }

  return state;
});