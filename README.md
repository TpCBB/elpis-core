# Elpis Core

Elpis Core is a schema-driven admin application framework built with Vue 3, Element Plus, Koa 2, and Webpack 5. It provides reusable dashboard layouts, configurable CRUD views, and a backend-for-frontend (BFF) layer for applications with shared UI and API conventions.

The package is exposed as `@tpccool/elpis`. This repository contains the reusable core; application-specific models, API implementations, and data sources belong in the consuming application.

## Core capabilities

- **Schema-driven views:** configure table columns, search fields, create/edit forms, and detail panels from a shared field schema.
- **Dashboard composition:** combine grouped menus, sidebar navigation, custom views, and embedded iframe views.
- **Model inheritance:** share a base model across projects, override matching configuration entries by key, and add project-specific entries.
- **Layered backend:** load configuration, extensions, services, controllers, middleware, route schemas, and routes by directory convention.
- **Request handling:** validate API parameters with JSON Schema and Ajv, verify request signatures, and return consistent response envelopes.
- **Frontend build pipeline:** discover multiple page entry points, generate HTML templates for Koa rendering, support development hot updates, and split production assets into dependency, shared, and runtime chunks.

## Technology stack

| Layer | Technologies |
| --- | --- |
| UI | Vue 3, Element Plus, Less |
| State and routing | Pinia, Vue Router |
| HTTP | Axios |
| Server | Koa 2, Koa Router, Nunjucks |
| Validation | JSON Schema, Ajv |
| Build | Webpack 5, Babel, Vue Loader |
| Checks | ESLint, Mocha, Supertest |

## Repository structure

```text
app/
  controller/       Request handlers and the base controller
  service/          Business logic and the base service
  middleware/       Validation, signature checks, and error handling
  router/           API and page routes
  router-schema/    API request schemas
  extend/           Application extensions, including logging
  pages/            Vue page entry points, layouts, stores, and widgets
  view/             HTML template used by Webpack
  webpack/          Development and production build helpers
config/             Default and environment-specific configuration
elpis-core/         Koa initialization and convention-based loaders
model/              Model discovery and project inheritance
test/              Controller integration tests
index.js            Public SDK exports
```

## SDK usage

The following examples belong in a consuming application that has `@tpccool/elpis` installed and supplies its own model and API configuration.

### Start the BFF server

```javascript
const { serverStart } = require('@tpccool/elpis')

const app = serverStart({
  name: 'Example Admin',
  homePage: '/view/dashboard?proj_key=example'
})
```

`serverStart(options)` returns the Koa application. The server uses `HOST=127.0.0.1` and `PORT=8080` unless overridden through environment variables. Set `NODE_ENV` explicitly to `local`, `beta`, or `production` to select the corresponding configuration file.

### Build the frontend

```javascript
const { frontendBuild } = require('@tpccool/elpis')

frontendBuild(process.env.NODE_ENV)
```

Use `NODE_ENV=local` to start the development asset server on port `9002`. Use `NODE_ENV=production` for a production build. Run the BFF server and the development asset server in separate processes during development.

The build discovers `app/pages/**/entry.*.js` files and generates templates under `app/public/dist/`. Koa renders these templates for `/view/:page` routes; Vue mounts the page and handles client-side routing.

### Reuse the server base classes

```javascript
const { Controller } = require('@tpccool/elpis')

module.exports = (app) => {
  return class ExampleController extends Controller.Base(app) {
    async get(ctx) {
      this.success(ctx, { name: 'Example' })
    }
  }
}
```

`Controller.Base(app)` provides `success` and `fail` response helpers. `Service.Base(app)` provides the service base class.

## Model and project configuration

Place shared model configuration in `model/<model-key>/model.js` and project configuration in `model/<model-key>/project/<project-key>.js` in the consuming application.

Projects inherit their model configuration. Arrays are merged by each item's `key`: matching items are merged recursively, model-only items are inherited, and project-only items are appended.

The following example illustrates a dashboard model with a schema-driven product view. The application must implement the referenced product API.

```javascript
module.exports = {
  module: 'dashboard',
  name: 'Product Admin',
  desc: 'Product management dashboard',
  homePage: '/view/dashboard/schema?proj_key=example&key=products',
  menu: [
    {
      key: 'products',
      name: 'Products',
      menuType: 'module',
      moduleType: 'schema',
      schemaConfig: {
        api: '/api/proj/product',
        schema: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              label: 'ID',
              tableOption: { visible: true },
              detailPanelOption: { visible: true }
            },
            name: {
              type: 'string',
              label: 'Name',
              tableOption: { visible: true },
              searchOption: { comType: 'input', default: '' },
              createFormOption: { comType: 'input', visible: true },
              editFormOption: { comType: 'input', visible: true },
              detailPanelOption: { visible: true }
            }
          },
          required: ['name'],
          tableConfig: {
            headerButtons: [
              {
                label: 'Create product',
                eventKey: 'ShowComponent',
                eventOption: { comName: 'createForm' }
              }
            ],
            rowButtons: [
              {
                label: 'Edit',
                eventKey: 'ShowComponent',
                eventOption: { comName: 'editForm' }
              },
              {
                label: 'Details',
                eventKey: 'ShowComponent',
                eventOption: { comName: 'detailPanel' }
              },
              {
                label: 'Delete',
                eventKey: 'remove',
                eventOption: { params: { product_id: 'schema::id' } }
              }
            ]
          },
          componentConfig: {
            createForm: {
              title: 'Create product',
              saveBtnText: 'Create'
            },
            editForm: {
              title: 'Edit product',
              saveBtnText: 'Save',
              mainKey: 'id'
            },
            detailPanel: {
              title: 'Product details',
              mainKey: 'id'
            }
          }
        }
      }
    }
  ]
}
```

### Configuration reference

| Setting | Purpose |
| --- | --- |
| `menuType: 'group'` | Groups nested items in `subMenu`. |
| `menuType: 'module'` | Displays a module selected by `moduleType`. |
| `moduleType: 'schema'` | Uses `schemaConfig` to render a CRUD view. |
| `moduleType: 'custom'` | Navigates to the route in `customConfig.path`. |
| `moduleType: 'iframe'` | Embeds the URL in `iframeConfig.path`. |
| `moduleType: 'sider'` | Renders sidebar items from `siderConfig.menu`. |
| `tableOption` | Field visibility and Element Plus table column props. |
| `searchOption` | Search control type, default value, and component props. |
| `createFormOption` / `editFormOption` | Form control type, visibility, disabled state, and component props. |
| `detailPanelOption` | Includes the field in the detail panel schema. |
| `schema.required` | Required field names used by form validation. |
| `schema.tableConfig` | Header buttons and row action buttons. |
| `schema.componentConfig` | Titles, save button labels, and primary keys for dynamic components. |

Form controls registered in the core are `input`, `inputNumber`, `select`, and `dateRange`. Search controls are `input`, `select`, `dynamicSelect`, and `dateRange`. Select controls accept an `enumList` of label/value options.

Button options can include Element Plus button props. A `ShowComponent` event opens the component named by `eventOption.comName`. A `remove` event maps request parameters to row fields using `schema::<field-name>`.

### CRUD API conventions

For a configured base API such as `/api/proj/product`, the widgets issue these requests:

| Action | Request |
| --- | --- |
| List | `GET /api/proj/product/list` with search values, `page`, and `pageSize` |
| Details / edit data | `GET /api/proj/product` with the configured primary key |
| Create | `POST /api/proj/product` with form values |
| Update | `PUT /api/proj/product` with form values |
| Delete | `DELETE /api/proj/product` with mapped row values |

Successful responses use `{ success: true, data, metadata }`. List responses provide an array in `data` and the total item count in `metadata.total`. The consuming application supplies endpoint implementations and persistence.

## Extension points

### Backend

Add application modules under `app/router-schema`, `app/router`, `app/controller`, `app/service`, `app/extend`, and `app/middleware`. Register application global middleware in `app/middleware.js`.

Controllers, services, and middleware are loaded into `app.controller`, `app.service`, and `app.middlewares`, respectively. Hyphenated and underscored file names are converted to camelCase. Extensions attach directly to the Koa application, such as `app.logger`.

Use `config/config.default.js` for shared settings and `config/config.local.js`, `config/config.beta.js`, or `config/config.prod.js` for environment-specific overrides.

### Frontend pages and routes

- Add a page entry named `entry.<page-name>.js` under `app/pages/`.
- Add custom dashboard views under `app/pages/dashboard/`.
- Export a function from `app/pages/dashboard/router.js` to extend `{ routes, siderRoutes }`.
- Provide application build overrides in `app/webpack.config.js`.

### Dynamic components and controls

| Extension | Core registry | Consuming application registry |
| --- | --- | --- |
| Schema view components | `app/pages/dashboard/complex-view/schema-view/complex-view/components/componentConfig.js` | `app/pages/dashboard/complex-view/schema-view/components/component-config.js` |
| Form controls | `app/pages/widgets/schema-form/form-item-config.js` | `app/pages/widgets/schema-form/form-item-config.js` |
| Search controls | `app/pages/widgets/schema-search-bar/search-item-config.js` | `app/pages/widgets/schema-search-bar/search-item-config.js` |

Create the Vue component and register it with `{ component: YourComponent }` under the desired key. The frontend merges each application registry with the corresponding core registry.

## Development checks

Install dependencies with `npm install`, then run:

```bash
npm run lint
```

The controller integration tests require application model/project fixtures and the corresponding API routes. The core checkout does not include those application-specific fixtures. In a configured development workspace, run the tests with an explicit environment:

```bash
NODE_ENV=local ./node_modules/.bin/mocha 'test/**/*.js' --exit
```

## License

ISC, as declared in `package.json`.
