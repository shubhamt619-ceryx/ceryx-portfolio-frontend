export const DynamicAsideMenuConfig = {
  items: [
    {
      title: 'Dashboard',
      root: true,
      icon: 'flaticon2-architecture-and-city',
      svg: './assets/media/svg/icons/Design/Layers.svg',
      page: '/dashboard',
      translate: 'MENU.DASHBOARD',
      bullet: 'dot',
    },
    { section: 'User Management' },
    {
      title: 'Users',
      root: true,
      icon: 'flaticon2-bell',
      page: '/builder',
      svg: './assets/media/svg/icons/General/User.svg'
    },    
  ]
};
