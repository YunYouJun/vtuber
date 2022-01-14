import type { Theme } from "vitepress";
import { VPTheme } from "vitepress-theme-you";

import "./styles/index.scss";
import "./styles/katex.scss";

import "uno.css";

const theme: Theme = Object.assign({}, VPTheme, {
  enhanceApp: ({ app }) => {
    // ...
  },
});

export default theme;
