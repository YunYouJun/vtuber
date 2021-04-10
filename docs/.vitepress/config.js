/**
 * @type {import('vitepress').UserConfig}
 */
module.exports = {
  title: "Docs for Vtuber",
  description: "从一开始的 Vtuber",
  themeConfig: {
    repo: "YunYouJun/vtuber",
    docsBranch: "main",
    docsDir: "docs",

    editLinks: true,
    editLinkText: "帮助咱们改善文档！",
    lastUpdated: "上次更新",

    sidebar: {
      "/": [
        { text: "指南", link: "/guide" },
        { text: "参考", link: "/ref" },
      ],
    },
  },

  head: [
    ["link", { rel: "icon", href: "/logo.png", type: "image/png" }],
    ["meta", { name: "author", content: "YunYouJun" }],
  ],
};
