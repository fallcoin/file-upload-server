const Koa = require('koa');
const cors = require('koa2-cors');
const router = require('./src/routes');
const koaBody = require('koa-body');

const responseHandler = require('./src/middlewares/responseHandler');

const app = new Koa();

// 统一结果处理
app.use(responseHandler());

// 允许跨域
app.use(cors());

// 实现文件上传
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200 * 1024 * 1024,    // 设置上传文件大小最大限制，默认2M
    },
    jsonLimit: 200 * 1024 * 1024 * 1024,
    textLimit: 200 * 1024 * 1024 * 1024,
    formLimit: 200 * 1024 * 1024 * 1024
}));

// 路由声明
app.use(router.routes(), router.allowedMethods());

app.listen(3300, () => {
    console.log('app runing in port 3300');
});