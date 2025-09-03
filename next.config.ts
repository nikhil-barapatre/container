const { NextFederationPlugin } = require("@module-federation/nextjs-mf");

module.exports = {
  trailingSlash: true,
  experimental: {
    esmExternals: false,
  },
  webpack(config: any, options: any) {
    const { isServer, dev } = options;
    
    // Only add module federation in development or client-side builds
    if (!isServer || dev) {
      const remoteUrl =
  process.env.NODE_ENV === "production"
    ? {
        dashboard: `dashboard@${process.env.NEXT_PUBLIC_DASHBOARD_URL}/_next/static/${
          isServer ? "ssr" : "chunks"
        }/remoteEntry.js?v=${Date.now()}`,
        remote2: `remote2@${process.env.NEXT_PUBLIC_REMOTE2_URL}/_next/static/${
          isServer ? "ssr" : "chunks"
        }/remoteEntry.js?v=${Date.now()}`,
      }
    : {
        dashboard: `dashboard@http://localhost:3001/_next/static/${
          isServer ? "ssr" : "chunks"
        }/remoteEntry.js`,
        remote2: `remote2@http://localhost:3002/_next/static/${
          isServer ? "ssr" : "chunks"
        }/remoteEntry.js`,
      };


      config.plugins.push(
        new NextFederationPlugin({
          name: "container",
          filename: "static/chunks/remoteEntry.js",
          remotes: remoteUrl,
          exposes: {
            "./LogoutButton": "./src/components/LogoutButton.tsx"
          },
          shared: {
            react: { singleton: true, requiredVersion: false },
            "react-dom": { singleton: true, requiredVersion: false },
          },
        })
      );
    }

    return config;
  },
  output: "standalone",
};
