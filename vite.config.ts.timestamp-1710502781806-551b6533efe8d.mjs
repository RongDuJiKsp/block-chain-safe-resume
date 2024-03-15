// vite.config.ts
import { defineConfig } from "file:///D:/CodeWorkSpace/block-chain-safe-resume/node_modules/vite/dist/node/index.js";
import react from "file:///D:/CodeWorkSpace/block-chain-safe-resume/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { nodePolyfills } from "file:///D:/CodeWorkSpace/block-chain-safe-resume/node_modules/vite-plugin-node-polyfills/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    nodePolyfills({ include: ["crypto"] })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxDb2RlV29ya1NwYWNlXFxcXGJsb2NrLWNoYWluLXNhZmUtcmVzdW1lXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxDb2RlV29ya1NwYWNlXFxcXGJsb2NrLWNoYWluLXNhZmUtcmVzdW1lXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Db2RlV29ya1NwYWNlL2Jsb2NrLWNoYWluLXNhZmUtcmVzdW1lL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB7IG5vZGVQb2x5ZmlsbHMgfSBmcm9tICd2aXRlLXBsdWdpbi1ub2RlLXBvbHlmaWxscydcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICAgIHJlYWN0KCksXG4gICAgICBub2RlUG9seWZpbGxzKHtpbmNsdWRlOltcImNyeXB0b1wiXX0pLFxuICBdLFxuXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnVCxTQUFTLG9CQUFvQjtBQUM3VSxPQUFPLFdBQVc7QUFDbEIsU0FBUyxxQkFBcUI7QUFHOUIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sY0FBYyxFQUFDLFNBQVEsQ0FBQyxRQUFRLEVBQUMsQ0FBQztBQUFBLEVBQ3RDO0FBRUYsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
