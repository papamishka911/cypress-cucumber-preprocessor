"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEsbuildPlugin = void 0;
const template_1 = require("./lib/template");
function createEsbuildPlugin(configuration) {
    return {
        name: "feature",
        setup(build) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const fs = require("fs");
            build.onLoad({ filter: /\.feature$/ }, async (args) => {
                const content = await fs.promises.readFile(args.path, "utf8");
                return {
                    contents: await (0, template_1.compile)(configuration, content, args.path),
                    loader: "js",
                };
            });
        },
    };
}
exports.createEsbuildPlugin = createEsbuildPlugin;
exports.default = createEsbuildPlugin;
