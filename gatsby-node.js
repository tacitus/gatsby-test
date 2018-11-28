// What is the point of this file?
// When is it run?
// What is it's purpose?
const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

// Create Node?  What does this mean?
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    // If we encounter an MD file then....
    // Make a file under pages??
    const slug = createFilePath({ node, getNode, basePath: `pages` });
    console.log(slug);
    // and add a slug... ?
    // This adds the slug to a node in the graph for the specific MarkDown Node
    createNodeField({
      node,
      name: `slug`,
      value: slug
    });
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `).then(result => {
      /// With the result of the query ..
      // For each node here....
      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        // Build the html page ...
        createPage({
          // At this path ...
          path: node.fields.slug,
          // Using this template ...
          component: path.resolve(`./src/templates/blog-post.js`),
          // Using this context ...
          context: {
            // Data passed to context is available
            // in page queries as GraphQL variables.
            slug: node.fields.slug
          }
        });
      });
      resolve();
    });
  });
};
