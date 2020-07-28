import React, { memo, createContext, useContext } from "react";
import { styled } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import useEventCallback from "use-event-callback";
var StyledButton = styled(Button)({
  width: 80,
  margin: 2
});
var IconName = styled("div")({
  fontWeight: "bold"
});
export var HeaderButtonContext = createContext();
var MemoizedHeaderButton = memo(function (_ref) {
  var name = _ref.name,
      disabled = _ref.disabled,
      Icon = _ref.Icon,
      onClick = _ref.onClick;
  return React.createElement(StyledButton, {
    disabled: disabled,
    onClick: onClick
  }, React.createElement("div", null, React.createElement(Icon, null), React.createElement(IconName, null, name)));
}, function (prevProps, nextProps) {
  return prevProps.name === nextProps.name && prevProps.disabled === nextProps.disabled;
});
export var HeaderButton = function HeaderButton(_ref2) {
  var name = _ref2.name,
      disabled = _ref2.disabled,
      Icon = _ref2.Icon;

  var _useContext = useContext(HeaderButtonContext),
      onHeaderButtonClick = _useContext.onHeaderButtonClick;

  var onClick = useEventCallback(function () {
    return onHeaderButtonClick(name);
  });
  return React.createElement(MemoizedHeaderButton, {
    name: name,
    disabled: disabled,
    Icon: Icon,
    onClick: onClick
  });
};
export default HeaderButton;