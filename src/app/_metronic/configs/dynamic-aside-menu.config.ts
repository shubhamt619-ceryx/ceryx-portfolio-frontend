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
    // { section: 'User Management' },
    {
      title: 'User Management',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/General/User.svg',
      page: '/user-management/users',
      permission: 'superadmin'
      // submenu: [
      //   {
      //     title: 'Users',
      //     page: '/user-management/users'
      //   },
      //   // {
      //   //   title: 'Roles',
      //   //   page: '/user-management/roles'
      //   // }
      // ]
    },
    // { section: 'Sample Management' },
    {
      title: 'Sample Management',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/General/User.svg',
      page: '/samples-management/all-samples',
      // submenu: [
      //   {
      //     title: 'All Samples',
      //     page: '/samples-management/all-samples'
      //    }
      //   // {
      //   //   title: 'Add Samples',
      //   //   page: '/samples-management/add-sample'
      //   // },
      // ]
    },   
    // { section: 'Portfolio Management' },
    {
      title: 'Portfolio Management',
      root: true,
      bullet: 'dot',
      icon: 'flaticon2-user-outline-symbol',
      svg: './assets/media/svg/icons/General/User.svg',
      page: '/portfolio-management/all-portfolios',
      // submenu: [
      //   {
      //     title: 'All Portfolios',
      //     page: '/portfolio-management/all-portfolios'
      //   }
      //   // {
      //   //   title: 'Create portfolio',
      //   //   page: '/portfolio-management/add-portfolio'
      //   // },
      // ]
    },   
  ]
};