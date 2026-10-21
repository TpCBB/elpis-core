import { ElMessage } from "element-plus";
const md5 = require("md5");
/**
 * Frontend HTTP request wrapper
 */

const curl = ({
  url, // Request URL
  method = "POST", // HTTP method
  data = {}, // Request body
  query = {}, // URL query parameters
  headers = {}, // Request headers
  responseType = "json", // Response type
  timeout = 60000, // Request timeout in milliseconds
  errorMessage = "网络异常", // Error handling
}) => {
  //  Generate the request signature
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

  //   Axios configuration
  const axiosSetting = {
    url,
    method,
    data,
    params: query,
    headers: dtoHeaders,
    responseType,
    timeout,
  };

  //   Send the Axios request
  return axios
    .request(axiosSetting)
    .then((response) => {
      const resData = response.data || {};
      //    Backend response format
      const { success } = resData;

      //   Handle failures
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

      //   Handle success
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
