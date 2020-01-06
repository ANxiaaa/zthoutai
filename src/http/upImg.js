import axios from 'axios'
// 上传图片
export const upLoaderImg = file => {
    //file为 你读取成功的回调文件信息
    //new 一个FormData格式的参数
    let params = new FormData()
    params.append('file', file)
    let config = {
        headers: { //添加请求头
            'Content-Type': 'multipart/form-data'
        }
    }
    return new Promise((resolve, reject) => {
        axios.post('/apis/admin/pub/file/upload', params, config).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        });
    })
}