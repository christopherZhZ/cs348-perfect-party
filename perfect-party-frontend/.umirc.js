
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
        { path: '/perfectparty/clients', component: './clients/index' },
        { path: '/perfectparty/suppliers', component: './suppliers/index' },
        { path: '/perfectparty/venues', component: './venues/index' },
        { path: '/perfectparty/priced', component: './feeItems/index' },
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
}
