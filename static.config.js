const fs = require("fs");
const klaw = require("klaw");
const path = require("path");
const matter = require("gray-matter");

console.log(require.resolve("webpack"));
const webpack = require("webpack");

function getPosts() {
  const items = [];
  // Walk ("klaw") through posts directory and push file paths into items array //
  const getFiles = () =>
    new Promise(resolve => {
      // Check if posts directory exists //
      if (fs.existsSync("./src/posts")) {
        klaw("./src/posts")
          .on("data", item => {
            // Filter function to retrieve .md files //
            if (path.extname(item.path) === ".md") {
              // If markdown file, read contents //
              const data = fs.readFileSync(item.path, "utf8");
              // Convert to frontmatter object and markdown content //
              const dataObj = matter(data);
              // Create slug for URL //
              dataObj.data.slug = dataObj.data.title
                .toLowerCase()
                .replace(/ /g, "-")
                .replace(/[^\w-]+/g, "");
              // Remove unused key //
              delete dataObj.orig;
              // Push object into items array //
              items.push(dataObj);
            }
          })
          .on("error", e => {
            console.log(e);
          })
          .on("end", () => {
            // Resolve promise for async getRoutes request //
            // posts = items for below routes //
            resolve(items);
          });
      } else {
        // If src/posts directory doesn't exist, return items as empty array //
        resolve(items);
      }
    });
  return getFiles();
}

export default {
  getSiteData: () => ({
    title: "React Static??? with Netlify CMS???"
  }),
  getRoutes: async () => {
    const posts = await getPosts();
    return [
      {
        path: "/",
        component: "src/containers/Home"
      },
      {
        path: "/about",
        component: "src/containers/About"
      },
      {
        path: "/blog",
        component: "src/containers/Blog",
        getData: () => ({
          posts
        }),
        children: posts.map(post => ({
          path: `/post/${post.data.slug}`,
          component: "src/containers/Post",
          getData: () => ({
            post
          })
        }))
      },
      {
        is404: true,
        component: "src/containers/404"
      }
    ];
  },
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

        fs.copyFileSync(
          require.resolve("netlify-cms/dist/cms.css"),
          path.join(__dirname, "dist/admin/cms.css")
        );

        fs.copyFileSync(
          path.join(__dirname, "src/cms/config.yml"),
          path.join(__dirname, "dist/admin/config.yml")
        );
        fs.copyFileSync(
          path.join(__dirname, "src/cms/index.html"),
          path.join(__dirname, "dist/admin/index.html")
        );
        res();
      })
    );

    console.log("Done building CMS.");
  }
};
