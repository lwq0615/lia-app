module.exports = {
    title: 'lia后台管理系统',
    base: '/lia-nest/',
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
                path: '/markdown/start'
            },
            {
                title: '前端手册',
                collapsable: true,
                children: [
                    {
                        title: 'Crud组件',
                        collapsable: false,
                        path: '/markdown/crud'
                    }
                ]
            },
            {
                title: '后端手册',
                collapsable: true,
                children: [
                    {
                        title: '异常处理',
                        collapsable: false,
                        path: '/markdown/exception'
                    },
                    {
                        title: 'Redis',
                        collapsable: false,
                        path: '/markdown/redis'
                    },
                    {
                        title: '文件系统',
                        collapsable: false,
                        path: '/markdown/file'
                    }
                ]
            }
        ]
    }
}