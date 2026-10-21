<!DOCTYPE html>
<html lang="en" class='dark'>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="/static/normalize.css" />
    <link rel="icon" href="/static/logo.png" type="image/x-icon" />
    <title>{{ name }}</title>
  </head>
  <body>
    <input type="text" id="projKey" value="{{ projKey }}" style="display: none" />
    <input type="text" id="env" value="{{ env }}" style="display: none" />
    <input
      type="text"
      id="options"
      value="{{ options }}"
      style="display: none"
    />

    <div id="root"></div>
    <script>
      try {
        const projKey = document.getElementById('projKey').value
        const env = document.getElementById("env").value;
        const options = document.getElementById("options").value;
        window.options = JSON.parse(options);
        window.env = env;
        window.projKey = projKey;
        console.log(env, options, projKey);
      } catch (error) {}
    </script>
  </body>
</html>
