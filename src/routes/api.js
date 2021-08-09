const Router = require('@koa/router');
const ApiController = require('../controllers/api');

const apiRouter = new Router({ prefix: '/api' });

apiRouter.post('/upload1', ApiController.uploadByFormData);
apiRouter.post('/upload2', ApiController.uploadByBase64);
apiRouter.post('/upload3', ApiController.uploadBySlice);
apiRouter.get('/merge', ApiController.merge);

module.exports = apiRouter;