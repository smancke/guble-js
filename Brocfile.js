/* eslint-disable no-var, object-shorthand */
var funnel = require('broccoli-funnel');
var uglify = require('broccoli-uglify-js');
var babel = require('broccoli-babel-transpiler');
var mergeTrees = require('broccoli-merge-trees');
var browserify = require('broccoli-fast-browserify');

var transpiledNodeModuleTree = babel('src');

/*
  Browser Module supports:
   - <script src="./node_modules/mock-socket/dist/guble.min.js"></script>
   - window.Guble
*/
var transpiledBrowserTree = babel('src');

var browserifiedSourceTree = browserify(transpiledBrowserTree, {
    browserify: { debug: true },
    bundles: { 'guble.js': { entryPoints: ['**/main.js'] } },
});

var minifiedBrowserTree = uglify(funnel(browserifiedSourceTree, {
    include: ['guble.js'],
    getDestinationPath: function destinationPath() {
        return 'guble.min.js';
    },
}));

module.exports = mergeTrees([
  transpiledNodeModuleTree,
  browserifiedSourceTree,
  minifiedBrowserTree,
]);
