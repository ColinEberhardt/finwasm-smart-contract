const nearUtils = require("near-shell/gulp-utils");
nearUtils.compile("./assembly/main.ts", "./out/main.wasm", () => {});
