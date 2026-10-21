const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')
const merge = require("webpack-merge");
const fs = require('fs')
// Generate core entry points and HtmlWebpackPlugin instances
const elpisPageEntries = {}
const elpisHtmlWebpackPluginList = []
// Discover core page entry files under app/pages
const elpisEntryList = path.resolve(__dirname, '../../pages/**/entry.*.js')
handleEntry(elpisEntryList, elpisPageEntries, elpisHtmlWebpackPluginList)

// Generate application entry points and HtmlWebpackPlugin instances
const businessPageEntries = {}
const businessHtmlWebpackPluginList = []
// Discover application page entry files under app/pages
const businessEntryList = path.resolve(process.cwd(), './app/pages/**/entry.*.js')
handleEntry(businessEntryList, businessPageEntries, businessHtmlWebpackPluginList)

function handleEntry(entryList, pageEntries, htmlWebpackPluginList) {
  glob.sync(entryList).forEach((file) => {
    const entryName = path.basename(file, '.js')
    pageEntries[entryName] = file

    htmlWebpackPluginList.push(
      new HtmlWebpackPlugin({
        // Output path for the generated template
        filename: path.resolve(process.cwd(), './app/public/dist/', `${entryName}.tpl`),
        // Source template file
        template: path.resolve(__dirname, '../../view/entry.tpl'),
        // Chunks to inject
        chunks: [entryName]
      })
    )
  })
}


// Application webpack.config.js
let businessWebpackConfig = {}
try {
  businessWebpackConfig = require(path.resolve(process.cwd(), './app/webpack.config.js'))
} catch (error) {}

/**
 * Base Webpack configuration
 */

const webpackBaseConfig = merge.smart({
  // Entry points for server-rendered page templates
  entry: Object.assign({}, elpisPageEntries, businessPageEntries),

  // Module loading and transformation rules
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: require.resolve('vue-loader')
        }
      },
      {
        test: /\.js$/,
        include: [
          // Limit Babel processing to application source to reduce build work
          path.resolve(__dirname, '../../pages'),
          path.resolve(process.cwd(), './app/pages'),
        ],
        use: {
          loader: require.resolve('babel-loader')
        }
      },
      {
        test: /\.(png|jpe?g|gif)(\?.+)?$/,
        use: {
          loader: require.resolve('url-loader'),
          options: {
            limit: 300,
            esMoudle: false
          }
        }
      },
      {
        test: /\.css$/,
        use: [require.resolve('style-loader'), require.resolve('css-loader')]
      },
      {
        test: /\.less$/,
        use: [require.resolve('style-loader'), require.resolve('css-loader'), require.resolve('less-loader')]
      },
      {
        test: /\.(eot|svg|ttf|woff2)(\?\S*)?$/,
        use: require.resolve('file-loader')
      }
    ]
  },

  //Output configuration

  output: {},

  // Configure how Webpack resolves and loads modules
  resolve: {
    extensions: ['.js', '.vue', '.css', '.less'],
    alias: (()=>{
      const aliasMap = {}

      // Provide an empty fallback module for optional extensions
      const blankModulPath = path.resolve(__dirname, '../../webpack/libs/blank.js')

      // Application dashboard route extensions
      const businessDashboardRouterConfig = path.resolve(process.cwd(), './app/pages/dashboard/router.js')
      aliasMap['$businessDashboardRouterConfig'] = fs.existsSync(businessDashboardRouterConfig) ? businessDashboardRouterConfig : blankModulPath

      // Application schema-view component extensions
      const  businessComponentsConfig = path.resolve(process.cwd(), './app/pages/dashboard/complex-view/schema-view/components/component-config.js')
      aliasMap['$businessComponentsConfig'] = fs.existsSync(businessComponentsConfig) ? businessComponentsConfig : blankModulPath

      // Application schema-form control extensions
      const  $businessFormItemConfig = path.resolve(process.cwd(), './app/pages/widgets/schema-form/form-item-config.js')
      aliasMap['$businessFormItemConfig'] = fs.existsSync($businessFormItemConfig) ? $businessFormItemConfig : blankModulPath

      // Application schema-search-bar control extensions
      const  $businessSearchItemConfig = path.resolve(process.cwd(), './app/pages/widgets/schema-search-bar/search-item-config.js')
      aliasMap['$businessSearchItemConfig'] = fs.existsSync($businessSearchItemConfig) ? $businessSearchItemConfig : blankModulPath

      return {
        'vue': require.resolve('vue'),
        '@babel/runtime/helpers/asyncToGenerator': require.resolve('@babel/runtime/helpers/asyncToGenerator'),
        '@babel/runtime/regenerator': require.resolve('@babel/runtime/regenerator'),
        $elpisPages: path.resolve(__dirname, '../../pages'),
        $elpisCommon: path.resolve(__dirname, '../../pages/common'),
        $elpisStore: path.resolve(__dirname, '../../pages/store'),
        $elpisWidgets: path.resolve(__dirname, '../../pages/widgets'),
        $elpisAsserts: path.resolve(__dirname, '../../pages/asserts'),

        $elpisUtils: path.resolve(__dirname, '../../pages/common/utils.js'),
        $elpisCurl: path.resolve(__dirname, '../../pages/common/curl.js'),

        $elpisHeaderContainer: path.resolve(__dirname, '../../pages/widgets/header-container/header-container.vue'),
        $elpisSiderContainer: path.resolve(__dirname, '../../pages/widgets/sider-container/sider-container.vue'),
        $elpisSchemaTable: path.resolve(__dirname, '../../pages/widgets/schema-table/schema-table.vue'),
        $elpisSchemaForm: path.resolve(__dirname, '../../pages/widgets/schema-form/schema-form.vue'),
        $elpisSchemaSearchBar: path.resolve(__dirname, '../../pages/widgets/schema-search-bar/schema-search-bar.vue'),

        $elpisBoot: path.resolve(__dirname, '../../pages/boot.js'),

        ...aliasMap
      }
    })()
  },

  // Plugin configuration
  plugins: [
    // Required plugin for processing .vue files
    // Apply the configured loader rules to Vue single-file components
    // For example, JavaScript rules also apply to the script blocks in .vue files
    new VueLoaderPlugin(),
    // Provide third-party libraries as module identifiers
    new webpack.ProvidePlugin({
      Vue: 'vue',
      axios: 'axios',
      _: 'lodash'
    }),
    // Define compile-time constants
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true, //Enable the Vue Options API
      __VUE_PROD_DEVTOOLS__: false, // Disable Vue production devtools
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false' // Disable detailed hydration mismatch messages in production
    }),
    // Generate the final page templates
    ...elpisHtmlWebpackPluginList,
    ...businessHtmlWebpackPluginList
  ],

  // Optimize output with code splitting, caching, tree shaking, and minification
  optimization: {
    /**
     * Chunk splitting strategy
     * 1 vender: third-party dependencies, typically changed only during upgrades
     * 2 common: shared application code that changes less frequently
     * 3 entry.{page}: page-specific application code that changes frequently
     */
    splitChunks: {
      chunks: 'all', // Split both synchronous and asynchronous modules
      maxAsyncRequests: 10, // Maximum concurrent asynchronous requests
      maxInitialRequests: 10, // Maximum concurrent initial requests
      // Cache groups
      cacheGroups: {
        vender: {
          test: /[\\/]node_modules[\\/]/, // Match node_modules
          name: 'vender', // Third-party dependency chunk name
          priority: 20, // Higher-priority groups are processed first
          enforce: true, // Enforce this cache group
          reuseExistingChunk: true // Reuse an existing chunk when possible
        },
        common: {
          test: /[\\/]common|widgets[\\/]/, // Match common and widgets directories
          name: 'common',
          minChunks: 2, // Minimum number of modules sharing a chunk
          minSize: 1, // Minimum chunk size in bytes
          reuseExistingChunk: true, // Reuse existing chunks
          priority: 10 // Priority
        }
      }
    },

    // Extract Webpack runtime code into a separate chunk
    runtimeChunk: true
  }
}, businessWebpackConfig)
module.exports = webpackBaseConfig
