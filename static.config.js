const { readFileSync, existsSync, copyFileSync, writeFileSync } = require("fs");
const path = require("path");

const matter = require("gray-matter");
const webpack = require("webpack");
const { safeDump, FAILSAFE_SCHEMA } = require("js-yaml");

const COPY_FOLDER = "copy";

const langs = ["en", "fr", "es", "pt"];

const langData = {
  siteName: {
    en: "Game Workers Unite!",
    fr: "Travailleur·euse·s du jeu uni·e·s!",
    es: "Trabajadorxs de juegos unidxs!",
    pt: "Trabalhadorxs de jogos unidxs!"
  },
  collection: {
    en: "Pages (English)",
    fr: "Pages (français)",
    es: "Páginas (español)",
    pt: "Páginas (português)"
  },
  title: {
    en: "Title",
    fr: "Titre",
    es: "Título",
    pt: "Título"
  },
  text: {
    en: "Text",
    fr: "Texte",
    es: "Texto",
    pt: "Texto"
  }
};

const subPages = [
  {
    name: "Why Unionize?",
    path: "why-unionize",
    component: "src/pages/WhyUnionize"
  }
];

const routes = [
  {
    path: "/",
    component: "src/pages/Redirect"
  },
  // For each language defined, generate a base route, like '/en'...
  ...langs.map(lang => ({
    path: lang,
    // ...that maps to the homepage in that language...
    component: "src/pages/Home",
    getData: getCopy("home", lang),
    // ...and has child routes for the subpages in that language.
    children: subPages.map(pageData => ({
      ...pageData,
      getData: getCopy(pageData.path, lang)
    }))
  })),
  {
    is404: true,
    component: "src/pages/404"
  }
];

function getCopy(folderName, lang) {
  const filename = path.join(COPY_FOLDER, folderName, `${lang}.md`);
  if (!existsSync(filename)) {
    console.warn(`No file "${filename}"!`);
    return () => ({});
  }
  const data = matter.read(filename);

  return () => ({
    title: data.title,
    text: data.content,
    lang
  });
}

export default {
  getSiteData: () => {
    const res = {};
    // For each language, pluck some properties into a new object that's also keyed on language.
    langs.forEach(lang => {
      res[lang] = {
        title: langData.siteName[lang]
      };
    });
    return { languageData: res };
  },
  getRoutes: async () => routes,
  onBuild: async () => {
    console.log("Building CMS...");

    await new Promise(res =>
      webpack(require("./src/cms/webpack.config.js"), (err, stats) => {
        console.log(stats.toString({ colors: true }));

        if (err || stats.hasErrors()) {
          if (err) {
            console.error(err.stack || err);
            if (err.details) {
              console.error(err.details);
            }
            throw new Error(err);
          }

          if (stats.hasErrors()) {
            throw new Error("See Webpack report above for errors.");
          }
        }

        copyFileSync(
          require.resolve("netlify-cms/dist/cms.css"),
          path.join(__dirname, "dist/admin/cms.css")
        );

        writeFileSync(
          path.join(__dirname, "dist/admin/config.yml"),
          generateCMSConfig()
        );

        // copyFileSync(
        //   path.join(__dirname, "src/cms/config.yml"),
        //   path.join(__dirname, "dist/admin/config.yml")
        // );

        copyFileSync(
          path.join(__dirname, "src/cms/index.html"),
          path.join(__dirname, "dist/admin/index.html")
        );
        res();
      })
    );

    console.log("Done building CMS.");
  }
};

function generateCMSConfig() {
  // The list of Pages for the CMS is just the subpages, plus the home page
  // (which is a special case.)
  const cmsPageList = [
    {
      name: "Home",
      path: "home" // the path on disk to the copy is different for Home!
    },
    ...subPages
  ];

  const cmsConfig = {
    backend: {
      name: "github",
      repo: "lostfictions/barf"
    },
    // Media files will be stored in the repo under public/uploads.
    media_folder: "public/uploads",
    // Folder path where uploaded files will be accessed, relative to the base of the built site
    public_folder: "/uploads",
    // One collection of pages for each language...
    collections: langs.map(lang => ({
      name: `pages-${lang}`,
      label: langData.collection[lang],
      files: cmsPageList.map(({ name, path: filePath }) => ({
        file: path.join(COPY_FOLDER, filePath, `${lang}.md`),
        label: name,
        name: filePath,
        fields: [
          {
            name: "title",
            label: langData.title[lang],
            widget: "string"
          },
          {
            name: "text",
            label: langData.text[lang],
            widget: "markdown"
          }
        ]
      }))
    }))
  };

  return safeDump(cmsConfig, { schema: FAILSAFE_SCHEMA });
}
