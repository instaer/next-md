/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    env: {
        title: 'My Document',
    },

    /*指定访问路径前缀*/
    basePath: '/doc',
}

module.exports = nextConfig
