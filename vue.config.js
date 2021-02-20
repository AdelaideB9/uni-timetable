module.exports = {
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "Uni Timetable";
      return args;
    });
  },
  pwa: {
    short_name: "Timetable",
    name: "Uni Timetable",
    background_color: "#ffffff",
    theme_color: "#6797ef",
    display: "standalone",
    start_url: '/',
    iconPaths: {
      favicon32: 'static/favicon-32x32.png',
      favicon16: 'static/favicon-16x16.png',
      appleTouchIcon: 'static/apple-icon-152x152.png',
      maskIcon: 'static/splash-screen-icon-512x512.png',
      msTileImage: 'static/ms-icon-144x144.png'
    }
  }
};
