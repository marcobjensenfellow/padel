module.exports = {
    pluginOptions: {
        sitemap: {
            urls: ["https://padelamericano.nu/"],
            pretty: true,
            outputDir: "./public",
            defaults: {
                lastmod: "2020-12-07",
                changefreq: "weekly",
                priority: 1.0,
            },
        },
    },
};
