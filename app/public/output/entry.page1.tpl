<!DOCTYPE html>
<html lang="en">
  <head>
    <title>page1</title>
    <link rel="stylesheet" href="/static/normalize.css" />
    <link rel="icon" href="/static/logo.png" type="image/x-icon" />
  </head>
  <body style="color: red">
    <h1>page1</h1>
    <button id="getList">获取列表</button>
    <input type="text" id="env" value="{{ env }}" style="display: none" />
    <input
      type="text"
      id="options"
      value="{{ options }}"
      style="display: none"
    />
    <!-- <script src="https://cdn.bootcss.com/axios/0.18.0/axios.min.js"></script> -->
    <script src="https://cdn.jsdelivr.net/npm/js-md5@0.8.3/src/md5.min.js"></script>

    <script>
      try {
        const env = document.getElementById("env").value;
        const options = document.getElementById("options").value;
        window.options = JSON.parse(options);
        window.env = env;
        console.log(env, options);
      } catch (error) {}

      const signKye = "qwertyuiop1234567890";
      const st = Date.now();
      const signature = md5(`${signKye}${st}`);

      const getList = document.getElementById("getList");
      getList.addEventListener("click", () => {
        fetch("/api/project/getlist", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            s_t: st,
            s_sign: signature,
          },
          body: JSON.stringify({
            page: 1111,
            pageSize: 1000,
          }),
        }).then((res) => {
          console.log("output=--->res", res);
        });

        // axios.get("/api/project/getlist").then((res) => {
        //   console.log("output=--->res", res);
        // });
      });
    </script>
  </body>
</html>
