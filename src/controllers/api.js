const fileModal = require('../models/file')

const uploadByFormData = async function (ctx) {
    const file = ctx.request.files.file; // 获取上传文件
    ctx.body = await fileModal.uploadByFormData(file);
}

const uploadByBase64 = async function (ctx) {
    const { chunk, filename } = ctx.request.body; // 获取上传文件
    ctx.body = fileModal.uploadByBase64(chunk, filename);
}

const uploadBySlice = async function (ctx) {
    const { chunk } = ctx.request.files;
    const { filename } = ctx.request.body;
    ctx.body = await fileModal.uploadBySlice(chunk, filename)
}
const merge = function (ctx) {
    const { hash } = ctx.query;
    ctx.body = fileModal.merge(hash);
}

module.exports = {
    uploadByFormData,
    uploadByBase64,
    uploadBySlice,
    merge
}