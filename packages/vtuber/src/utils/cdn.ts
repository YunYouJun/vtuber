const cdnServer = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js'

type AssetName =
  | 'THREE'
  | 'GUI'
  | 'Stats'
  | 'OutlineEffect'
  | 'Ammo'

const assetsMap = {
  THREE: '/build/three.module.js',
  GUI: '/examples/jsm/libs/lil-gui.module.min.js',
  Stats: '/examples/jsm/libs/stats.module.js',
  OutlineEffect: '/examples/jsm/effects/OutlineEffect.js',
  Ammo: '/examples/js/libs/ammo.wasm.js',
}

interface AssetUrl {
  /**
   * CDN 路径
   */
  cdn: string
  /**
   * 本地路径
   */
  local: string
}

type AssetsUrl = {
  [propName in AssetName]: AssetUrl;
}

const assetsUrl: any = {}

// eslint-disable-next-line no-restricted-syntax
for (const assetName in assetsMap) {
  assetsUrl[assetName as AssetName] = {
    cdn: cdnServer + assetsMap[assetName as AssetName],
    local: `/node_modules/three${assetsMap[assetName as AssetName]}`,
  }
}

const ASSETS = assetsUrl as AssetsUrl
export { ASSETS }
