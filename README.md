# next-md
使用[Next.js](https://nextjs.org/)开发的Markdown文档笔记工具。

## 环境要求

* Node.js 16.8 或更高版本

## 创建文档

1. 在markdown文件夹中创建`.md`后缀的文档，使用Markdown GFM （Github在标准Markdown语法基础上的扩展）语法写作。Markdown文档中引用的图片放置到`public/images`下面，并按照文档名称进行归类，引用方式请参考示例文档。

2. 在`data/documents.json`中添加对应的文档配置，各配置项说明如下：
    - `label`为文档的名称（不包括文件后缀名），用于在菜单中进行显示和构建时读取；
    - `key`为文档的唯一标识，必须唯一，用于生成文档访问地址；
    - `tags`为文档的标签，用于模糊匹配搜索。注意标签下的每个元素都必须唯一。当标签未配置或为空时，默认以文档的名称`label`为标签。

## 配置修改
- 在`next.config.js`中可以修改标题`title`（默认为`My Document`）以及指定访问路径前缀`basePath`（默认为`/doc`）。

- 默认使用`Next.js`静态导出功能为Markdown文件夹下所有文件生成对应的静态页面，如果在本地或服务端（Node.js环境）运行，请禁用相关的静态导出配置。

## 本地构建

在构建前，如果未安装项目依赖，请运行：
```bash
npm install
```

开始构建：
```bash
npm run build
```

运行构建命令后，将生成一个out文件夹，其中包含应用程序的HTML/CSS/JS等静态资源。

## 部署
将构建文件上传到服务器，通过代理服务器进行访问，以Nginx为例，配置如下，示例中构建文件所在路径为`/usr/share/nginx/html`，配置中的访问路径为`/doc`，代理端口为`6300`，可自行修改。

```
server {
    listen       6300;
    server_name  localhost;

    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    location /doc/ {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        rewrite ^/doc/$ /doc/index.html last;
        rewrite ^/doc/(.*)$ /doc/$1.html break;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    location ~* \.(gif|jpe?g|png|ico|swf)$ {
        root /usr/share/nginx/html;
        expires 1d;
        add_header Pragma public;
        add_header Cache-Control "public, must-revalidate, proxy-revalidate";
    }

    location ~* \.(css|js)$ {
        root /usr/share/nginx/html;
        expires 1d;
        add_header Pragma public;
        add_header Cache-Control "public, must-revalidate, proxy-revalidate";
    }

    location ~* .(?:manifest|appcache|html?|xml|json)$ {
        root /usr/share/nginx/html;
        expires 1d;
    }
}
```
