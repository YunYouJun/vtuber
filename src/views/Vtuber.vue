<template></template>

<script>
// @ts-nocheck
import { init, animate } from "../../packages/vtuber/mmd";
export default {
  mounted() {
    this.getScript(
      "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r123/examples/js/libs/ammo.wasm.js",
      () => {
        this.show();
      }
    );
  },
  methods: {
    show() {
      // var socket = io("http://127.0.0.1:6789/kizuna");
      // var websocketClose = () => socket.close();

      // socket.on("result_download", (result) => {
      //   requestAnimationFrame(() => animate(result));
      // });

      Ammo().then(function (AmmoLib) {
        Ammo = AmmoLib;
        // 30 25 24 21 20 19 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1 0

        // happy_eye_close: 0, 2, 3
        // neutral_eye_close: 1, 4, 5
        // blink: none -> 6 -> 1 -> 7 -> 8 -> none

        // mouth: 9 -> 13 -> 14 -> 12 -> 16 -> 17 -> 11
        // teeth: 10 15 21
        // happy: 18 23
        // unhappy: 19 24 25
        // what?: 20

        init();
        // run({ euler: [0, 0, 0], eye: [0, 0] });
        animate();
      });
    },
    getScript(url, callback) {
      const script = document.createElement("script");
      script.onload = () => {
        setTimeout(callback);
      };
      script.src = url;
      document.head.appendChild(script);
    },
  },
};
</script>
