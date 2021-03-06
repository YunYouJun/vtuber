const cdnServer = "https://cdn.jsdelivr.net/gh/mrdoob/three.js";

type AssetName =
  | "THREE"
  | "GUI"
  | "Stats"
  | "OutlineEffect"
  | "MMDLoader"
  | "MMDAnimationHelper"
  | "Ammo";

type AssetsMap = {
  [propName in AssetName]: string;
};

const assetsMap: AssetsMap = {
  THREE: `/build/three.module.js`,
  GUI: `/examples/jsm/libs/dat.gui.module.js`,
  Stats: `/examples/jsm/libs/stats.module.js`,
  OutlineEffect: `/examples/jsm/effects/OutlineEffect.js`,
  MMDLoader: `/examples/jsm/loaders/MMDLoader.js`,
  MMDAnimationHelper: `/examples/jsm/animation/MMDAnimationHelper.js`,
  Ammo: `/examples/js/libs/ammo.wasm.js`,
};

interface AssetUrl {
  /**
   * CDN 路径
   */
  cdn: string;
  /**
   * 本地路径
   */
  local: string;
}

type AssetsUrl = {
  [propName in AssetName]: AssetUrl;
};

let assetsUrl: any = {};

for (const assetName in assetsMap) {
  assetsUrl[assetName as AssetName] = {
    cdn: cdnServer + assetsMap[assetName as AssetName],
    local: "/node_modules/three" + assetsMap[assetName as AssetName],
  };
}

const ASSETS = assetsUrl as AssetsUrl;
export { ASSETS };
