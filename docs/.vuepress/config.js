module.exports = {
    title: 'lia后台管理系统',
    base: '/lia-app/',
    description: '基于React+SpringBoot的权限管理系统',
    themeConfig: {
        nav: [
            { text: 'Home', link: '/' },
            {
                text: 'Github',
                items: [
                    { text: 'lia-app', link: 'https://github.com/lwq0615/lia-app' },
                    { text: 'lia-nest', link: 'https://github.com/lwq0615/lia-nest' }
                ]
            }
        ],
        sidebar: [
            {
                title: '介绍',
                collapsable: false,
                path: '/'
            },
            {
                title: '快速开始',
                collapsable: false,
                path: '/start'
            },
            {
                title: '前端手册',
                collapsable: true,
                children: [
                    {
                        title: 'Crud组件',
                        collapsable: false,
                        path: '/crud'
                    }
                ]
            }
        ]
    }
}