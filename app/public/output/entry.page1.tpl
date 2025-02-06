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
    <script>
      try {
        const env = document.getElementById("env").value;
        const options = document.getElementById("options").value;
        window.options = JSON.parse(options);
        window.env = env;
        console.log(env, options);
      } catch (error) {}
      const getList = document.getElementById("getList");
      getList.addEventListener("click", () => {
        fetch("/api/project/getlist", {
          method: "post",
          body: JSON.stringify({
            a: 1,
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
