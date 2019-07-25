
export default {
  treeShaking: true,
  routes: [
    {
      path: '/',
      redirect: '/perfectparty',
    },
    {
      path: '/perfectparty',
      component: '../layouts/index',
      routes: [
        { path: '/perfectparty', component: './index' },
        { path: '/perfectparty/events', component: './events/index' },
        { path: '/perfectparty/events/editor', component: './events/Editor' },
        { path: '/perfectparty/events/newform', component: './events/NewEventForm' },
        { path: '/perfectparty/clients', component: './clients/index' },
        { path: '/perfectparty/suppliers', component: './suppliers/index' },
        { path: '/perfectparty/venues', component: './venues/index' },
        { path: '/perfectparty/priced-host', component: './feeItems/PricedHost' },
        { path: '/perfectparty/priced-food', component: './feeItems/PricedFood' },
        { path: '/perfectparty/priced-decor', component: './feeItems/PricedDecor' },
        { path: '/perfectparty/priced-entertainment', component: './feeItems/PricedEntertainment' },
        { path: '/perfectparty/priced-other', component: './feeItems/PricedOther' },
        { path: '/perfectparty/payments', component: './payments/index' },
      ]
    },
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'perfect-party-frontend',
      dll: false,

      routes: {
        exclude: [
          /components\//,
        ],
      },
    }],
  ],
  proxy: {
    "/api": {
      "target": "http://localhost:3001",
      "changeOrigin": true,
      "pathRewrite": { "^/api" : "" }
    }
  }
}
