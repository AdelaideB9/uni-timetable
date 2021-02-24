module.exports = {
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "Uni Timetable";
      return args;
    });
  },
  pwa: {
    name: "Uni Timetable",
    themeColor: "#6797ef",
    appleMobileWebAppCapable: "yes",
    manifestOptions: {
      short_name: "Timetable",
      background_color: "#ffffff",
      icons: [
        {
          src: "static/android-icon-36x36.png",
          sizes: "36x36",
          type: "image/png",
        },
        {
          src: "static/android-icon-48x48.png",
          sizes: "48x48",
          type: "image/png",
        },
        {
          src: "static/android-icon-72x72.png",
          sizes: "72x72",
          type: "image/png",
        },
        {
          src: "static/android-icon-96x96.png",
          sizes: "96x96",
          type: "image/png",
        },
        {
          src: "static/android-icon-144x144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          src: "static/android-icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "static/splash-screen-icon-512x512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    },
    iconPaths: {
      favicon32: 'static/favicon-32x32.png',
      favicon16: 'static/favicon-16x16.png',
      appleTouchIcon: 'static/apple-icon-152x152.png',
      maskIcon: 'static/splash-screen-icon-512x512.png',
      msTileImage: 'static/ms-icon-144x144.png'
    },
    workboxPluginMode: "GenerateSW",
    workboxOptions: {
      exclude: [/\.map$/, /_redirects/],
    }
  }
};
