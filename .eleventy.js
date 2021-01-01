const { DateTime } = require("luxon");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-es");
const htmlmin = require("html-minifier");
const slugify = require("slugify");
const moment = require("moment");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function(eleventyConfig) {

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addFilter("removeNonAlpha", text => {
    return text.replace(/[^- 0-9a-z]/gi, '');
  });  

  eleventyConfig.addFilter("squash", require("./filters/squash.js") );

  // Date formatting (human readable)
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy");
  });

  eleventyConfig.addFilter("momentDate", dateObj => {
    return moment.utc(dateObj).format('MMMM D, YYYY');
  });

  eleventyConfig.addFilter("momentYear", dateObj => {
    return moment.utc(dateObj).format('YYYY');
  });

  eleventyConfig.addFilter("getYearArray", collection => {
    let yearArray = [];
    collection.forEach((item) => {
      yearArray.push(moment.utc(item.date).format('YYYY'));
    });
    return [...new Set(yearArray)];
  });

  // Date formatting (machine readable)
  eleventyConfig.addFilter("machineDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd");
  });

  // Minify CSS
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Minify JS
  eleventyConfig.addFilter("jsmin", function(code) {
    let minified = UglifyJS.minify(code);
    if (minified.error) {
      console.log("UglifyJS error: ", minified.error);
      return code;
    }
    return minified.code;
  });

  eleventyConfig.addFilter("momentYear", dateObj => {
    return moment.utc(dateObj).format('YYYY');
  });
  
  eleventyConfig.addFilter("momentMonth", dateObj => {
    return moment.utc(dateObj).format('MMMM');
  });

  eleventyConfig.addFilter("momentDay", dateObj => {
    return moment.utc(dateObj).format('D');
  });

  eleventyConfig.addCollection("yeartips", function(collection) {
    const coll = collection.getFilteredByGlob("posts/365-day-wfh-tips/*.md");
  
    for(let i = 0; i < coll.length ; i++) {
      const prevPost = i === 0 ? coll[coll.length - 1] : coll[i - 1];
      const nextPost = i === coll.length - 1 ? coll[0] : coll[i + 1];
  
      coll[i].data["prevPost"] = prevPost;
      coll[i].data["nextPost"] = nextPost;

      coll[i].data["postNumber"] = i + 1;
    }
  
    return coll;
  });

  eleventyConfig.addCollection("communication", (collection) => {
    return collection.getFilteredByGlob("posts/*.md").filter( item => {
      const category = item.data.category;
      return ( category && category.toLowerCase() === "communication" ? item : false );
    }); 
  });

  eleventyConfig.addCollection("discipline", (collection) => {
    return collection.getFilteredByGlob("posts/*.md").filter( item => {
      const category = item.data.category;
      return ( category && category.toLowerCase() === "discipline" ? item : false );
    }); 
  });

  eleventyConfig.addCollection("health", (collection) => {
    return collection.getFilteredByGlob("posts/*.md").filter( item => {
      const category = item.data.category;
      return ( category && category.toLowerCase() === "health" ? item : false );
    }); 
  });

  eleventyConfig.addCollection("performance", (collection) => {
    return collection.getFilteredByGlob("posts/*.md").filter( item => {
      const category = item.data.category;
      return ( category && category.toLowerCase() === "performance" ? item : false );
    }); 
  });

  eleventyConfig.addCollection("management", (collection) => {
    return collection.getFilteredByGlob("posts/*.md").filter( item => {
      const category = item.data.category;
      return ( category && category.toLowerCase() === "management" ? item : false );
    }); 
  });

  eleventyConfig.addCollection("professional development", (collection) => {
    return collection.getFilteredByGlob("posts/*.md").filter( item => {
      const category = item.data.category;
      return ( category && category.toLowerCase() === "professional development" ? item : false );
    }); 
  });

  eleventyConfig.addCollection("workspace", (collection) => {
    return collection.getFilteredByGlob("posts/*.md").filter( item => {
      const category = item.data.category;
      return ( category && category.toLowerCase() === "workspace" ? item : false );
    }); 
  });
  
  eleventyConfig.addCollection("humor", (collection) => {
    return collection.getFilteredByGlob("posts/*.md").filter( item => {
      const category = item.data.category;
      return ( category && category.toLowerCase() === "humor" ? item : false );
    }); 
  });

  eleventyConfig.addCollection("news", (collection) => {
    return collection.getFilteredByGlob("posts/*.md").filter( item => {
      const category = item.data.category;
      return ( category && category.toLowerCase() === "news" ? item : false );
    }); 
  });
  
  eleventyConfig.addCollection("allPosts", (collection) =>
    collection.getFilteredByGlob("posts/*.md")
  );

  eleventyConfig.addCollection("tagList", require("./utils/getTagList.js"));

  const socialImages = require("@11tyrocks/eleventy-plugin-social-images");
  eleventyConfig.addPlugin(socialImages);

  const embedVimeo = require("eleventy-plugin-vimeo-embed");
  eleventyConfig.addPlugin(embedVimeo);

  const pluginEmbedTweet = require("eleventy-plugin-embed-tweet");
  let tweetEmbedOptions = {
      useInlineStyles: true,
      autoEmbed: true,
  }
  eleventyConfig.addPlugin(pluginEmbedTweet, tweetEmbedOptions);

  const embedInstagram = require("eleventy-plugin-embed-instagram");
  eleventyConfig.addPlugin(embedInstagram);

  const pluginRss = require("@11ty/eleventy-plugin-rss");
  eleventyConfig.addPlugin(pluginRss);

  const readingTime = require('eleventy-plugin-reading-time');
  eleventyConfig.addPlugin(readingTime);

  eleventyConfig.addShortcode("picture", require("./utils/picture.js"));
  eleventyConfig.addShortcode("pictureRt", require("./utils/pictureRt.js"));
  eleventyConfig.addShortcode("pictureRtSm", require("./utils/pictureRtSm.js"));
  eleventyConfig.addShortcode("githubGist", require("./utils/githubGist.js"));
  eleventyConfig.addShortcode("currentYear", function() {
    const year = new Date().getFullYear();
    return `${year}`;
  });

  eleventyConfig.addShortcode("yearsRemoteWorking", function() {
    const year = new Date().getFullYear();
    return `${year-1998}`;
  });

  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if (outputPath.indexOf(".html") > -1) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  // Universal slug filter strips unsafe chars from URLs
  eleventyConfig.addFilter("slugify", function(str) {
    return slugify(str, {
      lower: true,
      replacement: "-",
      remove: /[*+~.·,()'"`´%!?¿:@]/g
    });
  });

  eleventyConfig.addFilter('has_tag', function( arr, key, value ) {
    return arr.filter( item => {
        const keys = key.split( '.' );
        const reduce = keys.reduce( ( object, key ) => {
            return object[ key ];
        }, item );
        const str = String( reduce );

        return ( str.includes( value ) ? item : false );
    });
  });

  eleventyConfig.addFilter('lacks_tag', function( arr, key, value ) {
    return arr.filter( item => {
        const keys = key.split( '.' );
        const reduce = keys.reduce( ( object, key ) => {
            return object[ key ];
        }, item );
        const str = String( reduce );

        return ( str.includes( value ) ? false : item );
    });
  });

  eleventyConfig.addFilter('splitlines', function(input) {
    const parts = input.split(' ')
    const lines = parts.reduce(function(prev, current) {
      if(!prev.length) {
        return [current]
      }
      let lastOne = prev[prev.length - 1]
      if(lastOne.length + current.length > 18) {
        return [...prev, current]
      }
      prev[prev.length - 1] = lastOne + ' ' + current
      return prev
    }, [])
    return lines
  })

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("static/");
  eleventyConfig.addPassthroughCopy("images/");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("_includes/assets/");

  /* Markdown Plugins */
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  var markdownItAttrs = require('markdown-it-attrs');
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };
  let opts = {
    permalink: false
  };

  eleventyConfig.setLibrary("md", markdownIt(options)
    .use(markdownItAnchor, opts)
    .use(markdownItAttrs, {
      leftDelimiter: '{',
      rightDelimiter: '}',
      allowedAttributes: []  // empty array = all attributes are allowed
    })
  );

  return {
    templateFormats: ["md", "njk", "html", "liquid"],
    pathPrefix: "/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
