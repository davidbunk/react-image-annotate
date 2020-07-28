import React, { useMemo, memo } from "react";
import SidebarBoxContainer from "../SidebarBoxContainer";
import { makeStyles } from "@material-ui/core/styles";
import StyleIcon from "@material-ui/icons/Style";
import { grey } from "@material-ui/core/colors";
import Select from "react-select";
import useEventCallback from "use-event-callback";
import { asMutable } from "seamless-immutable";
var useStyles = makeStyles({});
var emptyArr = [];
export var TagsSidebarBox = function TagsSidebarBox(_ref) {
  var currentImage = _ref.currentImage,
      _ref$imageClsList = _ref.imageClsList,
      imageClsList = _ref$imageClsList === void 0 ? emptyArr : _ref$imageClsList,
      _ref$imageTagList = _ref.imageTagList,
      imageTagList = _ref$imageTagList === void 0 ? emptyArr : _ref$imageTagList,
      onChangeImage = _ref.onChangeImage;
  if (!currentImage) return null;
  var _currentImage$tags = currentImage.tags,
      tags = _currentImage$tags === void 0 ? [] : _currentImage$tags,
      _currentImage$cls = currentImage.cls,
      cls = _currentImage$cls === void 0 ? null : _currentImage$cls;
  var onChangeClassification = useEventCallback(function (o) {
    return onChangeImage({
      cls: o.value
    });
  });
  var onChangeTags = useEventCallback(function (o) {
    return onChangeImage({
      tags: o.map(function (a) {
        return a.value;
      })
    });
  });
  var selectValue = useMemo(function () {
    return cls ? {
      value: cls,
      label: cls
    } : null;
  }, [cls]);
  var memoImgClsList = useMemo(function () {
    return asMutable(imageClsList.map(function (c) {
      return {
        value: c,
        label: c
      };
    }));
  }, [imageClsList]);
  var memoImgTagList = useMemo(function () {
    return asMutable(imageTagList.map(function (c) {
      return {
        value: c,
        label: c
      };
    }));
  }, [imageTagList]);
  var memoCurrentTags = useMemo(function () {
    return tags.map(function (r) {
      return {
        value: r,
        label: r
      };
    });
  }, [tags]);
  return React.createElement(SidebarBoxContainer, {
    title: "Image Tags",
    expandedByDefault: true,
    noScroll: true,
    icon: React.createElement(StyleIcon, {
      style: {
        color: grey[700]
      }
    })
  }, imageClsList.length > 0 && React.createElement("div", {
    style: {
      padding: 8
    }
  }, React.createElement(Select, {
    placeholder: "Image Classification",
    onChange: onChangeClassification,
    value: selectValue,
    options: memoImgClsList
  })), imageTagList.length > 0 && React.createElement("div", {
    style: {
      padding: 8,
      paddingTop: 0
    }
  }, React.createElement(Select, {
    isMulti: true,
    placeholder: "Image Tags",
    onChange: onChangeTags,
    value: memoCurrentTags,
    options: memoImgTagList
  })));
};
export default memo(TagsSidebarBox, function (prevProps, nextProps) {
  return prevProps.currentImage.cls === nextProps.currentImage.cls && prevProps.currentImage.tags === nextProps.currentImage.tags && prevProps.imageClsList === nextProps.imageClsList && prevProps.imageTagList === nextProps.imageTagList;
});