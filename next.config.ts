const { NextFederationPlugin } = require("@module-federation/nextjs-mf");

module.exports = {
  webpack(config: any, options: any) {
    const { isServer } = options;
    const remoteUrl = process.env.NODE_ENV === 'production' 
      ? {
          dashboard: `dashboard@https://dashboard.vercel.app/_next/static/${isServer ? "ssr" : "chunks"}/remoteEntry.js`,
          remote2: `remote2@https://remote2.vercel.app/_next/static/${isServer ? "ssr" : "chunks"}/remoteEntry.js`
        }
      : {
          dashboard: `dashboard@http://localhost:3001/_next/static/${isServer ? "ssr" : "chunks"}/remoteEntry.js`,
          remote2: `remote2@http://localhost:3002/_next/static/${isServer ? "ssr" : "chunks"}/remoteEntry.js`
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

    return config;
  },
  output: "standalone"
};
