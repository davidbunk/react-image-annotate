import React from "react";
import Button from "@material-ui/core/Button";
import { styled } from "@material-ui/core/styles";
import * as colors from "@material-ui/core/colors";
import Grid from "@material-ui/core/Grid";
import Markdown from "react-markdown";
import GitHubButton from "react-github-btn";
import "./github-markdown.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/cjs/languages/hljs/javascript";
var contentMd = "# Features\r\n\r\n- Simple input/output format\r\n- Bounding Box, Point and Polygon Annotation\r\n- Zooming, Scaling, Panning\r\n- Multiple Images\r\n- Cursor Crosshair\r\n\r\n![Screenshot of Annotator](https://user-images.githubusercontent.com/1910070/51199716-83c72080-18c5-11e9-837c-c3a89c8caef4.png)\r\n\r\n# Usage\r\n\r\n## Installation\r\n\r\n```bash\r\nnpm install react-image-annotate\r\n```\r\n\r\n## Basic Example\r\n\r\n```javascript\r\nimport ReactImageAnnotate from \"react-image-annotate\"\r\n\r\nconst App = () => (\r\n  <ReactImageAnnotate\r\n    selectedImage=\"https://example.com/image1.png\"\r\n    taskDescription=\"# Draw region around each animal.\"\r\n    images={[{ src: \"https://example.com/image1.png\", name: \"Image 1\" }]}\r\n    regionClsList={[\"Dog\", \"Cat\"]}\r\n    enabledTools={[\"create-box\"]}\r\n  />\r\n)\r\n```\r\n\r\n# Props\r\n\r\nAll of the following properties can be defined on the `ReactImageAnnotate` component...\r\n\r\n| Prop                     | Type (\\* = required)                             | Description                                                                             | Default       |\r\n| ------------------------ | ------------------------------------------------ | --------------------------------------------------------------------------------------- | ------------- |\r\n| `taskDescription`        | \\*`string`                                       | Markdown description for what to do in the image.                                       |               |\r\n| `allowedArea`            | `{ x: number, y: number, w: number, h: number }` | Area that is available for annotation.                                                  | Entire image. |\r\n| `regionTagList`          | `Array<string>`                                  | Allowed \"tags\" (mutually inclusive classifications) for regions.                        |               |\r\n| `regionClsList`          | `Array<string>`                                  | Allowed \"classes\" (mutually exclusive classifications) for regions.                     |               |\r\n| `imageTagList`           | `Array<string>`                                  | Allowed tags for entire image.                                                          |               |\r\n| `imageClsList`           | `Array<string>`                                  | Allowed classes for entire image.                                                       |               |\r\n| `enabledTools`           | `Array<string>`                                  | Tools allowed to be used. e.g. \"select\", \"create-point\", \"create-box\", \"create-polygon\" | Everything.   |\r\n| `showTags`               | `boolean`                                        | Show tags and allow tags on regions.                                                    | `true`        |\r\n| `selectedImage`          | `string`                                         | URL of initially selected image.                                                        |               |\r\n| `images`                 | `Array<Image>`                                   | Array of images to load into annotator                                                  |               |\r\n| `showPointDistances`     | `boolean`                                        | Show distances between points.                                                          | `false`       |\r\n| `pointDistancePrecision` | `number`                                         | Precision on displayed points (e.g. 3 => 0.123)                                         |               |\r\n| `onExit`                 | `MainLayoutState => any`                         | Called when \"Save\" is called.                                                           |               |\r\n\r\n# Sponsors\r\n\r\n[![wao.ai sponsorship image](https://s3.amazonaws.com/asset.workaround.online/sponsorship-banner-1.png)](https://wao.ai)\r\n";
var RootContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
});
var ContentContainer = styled("div")({
  width: "100%",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  maxWidth: 1200
});
var Header = styled("div")({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  backgroundColor: colors.blue[600],
  padding: 8,
  boxSizing: "border-box"
});
var HeaderButton = styled(Button)({
  color: "white",
  margin: 8,
  padding: 16,
  paddingLeft: 24,
  paddingRight: 24
});
var Hero = styled("div")({
  display: "flex",
  justifyContent: "center",
  width: "100%",
  backgroundColor: colors.blue[500],
  padding: 16,
  color: "white",
  boxSizing: "border-box"
});
var HeroMain = styled("div")({
  fontSize: 48,
  fontWeight: "bold",
  paddingTop: 64,
  textShadow: "0px 1px 5px rgba(0,0,0,0.3)"
});
var HeroSub = styled("div")({
  paddingTop: 32,
  lineHeight: 1.5,
  fontSize: 24,
  textShadow: "0px 1px 3px rgba(0,0,0,0.2)"
});
var HeroButtons = styled("div")({
  paddingTop: 32,
  paddingBottom: 48
});
var Section = styled("div")({
  display: "flex",
  padding: 16,
  paddingTop: 32,
  flexDirection: "column"
});

var CodeBlock = function CodeBlock(_ref) {
  var language = _ref.language,
      value = _ref.value;
  return React.createElement(SyntaxHighlighter, {
    language: language,
    style: docco
  }, value);
};

function flatten(text, child) {
  return typeof child === "string" ? text + child : React.Children.toArray(child.props.children).reduce(flatten, text);
}

function HeadingRenderer(props) {
  var children = React.Children.toArray(props.children);
  var text = children.reduce(flatten, "");
  var slug = text.toLowerCase().replace(/\W/g, "-");
  return React.createElement("h" + props.level, {
    id: slug
  }, props.children);
}

var LandingPage = function LandingPage() {
  return React.createElement(RootContainer, null, React.createElement(Header, {
    id: "about"
  }, React.createElement(ContentContainer, {
    style: {
      flexDirection: "row",
      flexGrow: 1
    }
  }, React.createElement(HeaderButton, {
    href: "#features"
  }, "Features"), React.createElement(HeaderButton, {
    href: "#usage"
  }, "Usage"), React.createElement(HeaderButton, {
    href: "#props"
  }, "Props"), React.createElement(HeaderButton, {
    href: "./demo"
  }, "Demo Playground"))), React.createElement(Hero, null, React.createElement(ContentContainer, null, React.createElement(HeroMain, null, "React Image Annotate"), React.createElement(HeroSub, null, "Powerful React component for image annotations with bounding boxes, tagging, classification, multiple images and polygon segmentation."), React.createElement(HeroButtons, null, React.createElement(GitHubButton, {
    href: "https://github.com/waoai/react-image-annotate",
    "data-size": "large",
    "data-show-count": "true",
    "aria-label": "Star waoai/react-image-annotate on GitHub"
  }, "Star")))), React.createElement(ContentContainer, {
    className: "markdown-body"
  }, React.createElement(Section, {
    className: "markdown-body"
  }, React.createElement(Markdown, {
    escapeHtml: false,
    source: contentMd,
    renderers: {
      code: CodeBlock,
      heading: HeadingRenderer
    }
  }))));
};

export default LandingPage;