import { ElMessage } from "element-plus";
const md5 = require("md5");
/**
 * 前端封装 curl 方法
 */

const curl = ({
  url, // 请求地址
  method = "POST", // 请求方法
  data = {}, // 请求体 post body
  query = {}, // 请求参数 get url query
  headers = {}, // 请求头
  responseType = "json", // 响应类型
  timeout = 60000, // 请求超时时间
  errorMessage = "网络异常", // 错误处理
}) => {
  //  加密
  const signKey = "qwertyuiop1234567890";
  const st = Date.now();
  const sign = md5(`${signKey}${st}`);

  const dtoHeaders = {
    ...headers,
    s_t: st,
    s_sign: sign,
  };

  if (url.indexOf('api/proj/') > -1) {
    dtoHeaders.proj_key = window.projKey
  }

  //   axios配置
  const axiosSetting = {
    url,
    method,
    data,
    params: query,
    headers: dtoHeaders,
    responseType,
    timeout,
  };

  //   axios请求
  return axios
    .request(axiosSetting)
    .then((response) => {
      const resData = response.data || {};
      //    后端返回格式
      const { success } = resData;

      //   失败处理
      if (!success) {
        const { code, message } = resData;
        if (code == 442) {
          ElMessage.error("请求参数错误");
        } else if (code == 445) {
          ElMessage.error("请求不合法");
        } else if (code == 446) {
          ElMessage.error("缺少项目参数");
        } else if (code == 50000) {
          ElMessage.error(message);
        } else {
          ElMessage.error(errorMessage);
        }
        console.log(`output->`, message);
        return Promise.resolve({ success, code, message });
      }

      //   成功处理
      const { data, metadata } = resData;
      return Promise.resolve({ success, data, metadata });
    })
    .catch((error) => {
      const { message } = error;

      if (message.match(/timeout/)) {
        return Promise.resolve({
          message: "请求超时",
          code: 504,
        });
      }
    });
};

export default curl;
