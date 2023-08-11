/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    env: {
        title: 'My Document',
    },

    /*指定访问路径前缀*/
    basePath: '/doc',

    /*在服务端或本地运行时需禁用以下静态导出配置*/
    output: 'export',
    images: {
        unoptimized: true,
    },
}

module.exports = nextConfig
