const {
    override,
    addWebpackAlias,
    adjustWorkbox,
} = require("customize-cra");
const path = require("path");

module.exports = override(
    // add an alias for "ag-grid-react" imports
    addWebpackAlias({
        "@app": path.resolve(__dirname, "./src/app"),
        "@entities": path.resolve(__dirname, "./src/entities"),
        "@features": path.resolve(__dirname, "./src/features"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@shared": path.resolve(__dirname, "./src/shared"),
        "@widgets": path.resolve(__dirname, "./src/widgets"),
    }),
    // adjust the underlying workbox
    adjustWorkbox(wb =>
        Object.assign(wb, {
            skipWaiting: true,
            exclude: (wb.exclude || []).concat("index.html")
        })
    )
);