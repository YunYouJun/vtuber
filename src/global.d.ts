import * as faceapi from "face-api.js";
import { DetectResult } from "vtuber/parse";

import { DefineComponent } from "vue";

declare module "*.vue" {
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare global {
  interface Window {
    Ammo: any;
    /**
     * Vtuber 是否已经被初始化
     */
    inited: boolean;
    /**
     * faceapi 相关
     */
    face: {
      enable: boolean;
      points: faceapi.Point[];
    };

    /**
     * Vtuber 数据
     */
    vtuberResult: DetectResult;
  }
}
