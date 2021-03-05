export default [{
  path: '/login',
  name: 'login',
  meta: {
    layout: 'main'
  },
  component: () => import('@/views/login/index')
}]
