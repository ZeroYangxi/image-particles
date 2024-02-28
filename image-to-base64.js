// const { base } = require("mocha/lib/reporters");

// Convert Button
document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOMContentLoaded");
  let base64 = 0;

  // function toDataURL(url, callback) {
  //   let xhr = new XMLHttpRequest();

  //   xhr.onload = function () {
  //     // FileReader对象，用于读取文件或数据
  //     let reader = new FileReader();
  //     reader.onloadend = function () {
  //       callback(reader.result);
  //     };
  //     reader.readAsDataURL(xhr.response);
  //   };
  //   xhr.open("GET", url);
  //   // 设置XHR请求的响应类型为'blob'，这样响应的数据会被当作二进制大对象处理
  //   xhr.responseType = "blob";
  //   xhr.send();
  // }

  // 当文件输入发生变化时执行这个函数
  document
    .getElementById("imageInput")
    .addEventListener("change", function (event) {
      // 获取用户选择的文件
      let file = event.target.files[0];
      // 确保文件存在
      if (file) {
        let reader = new FileReader();

        // 设置当读取操作完成后要执行的函数
        reader.onload = function (e) {
          // 获取转换后的Base64编码
          base64 = e.target.result;
          console.log(base64);

          // // 显示Base64编码，或者将其用作图片预览
          // document.getElementById("result").innerHTML =
          //   '<p>Base64 code:</p><textarea rows="5" cols="70">' +
          //   base64 +
          //   '<h2>Image Preview:</h2></textarea><br><br><img src="' +
          //   base64 +
          //   '" alt="Image Preview"/>';
        };

        // 以DataURL的形式读取文件，结果会是一个Base64编码的字符串
        reader.readAsDataURL(file);
      }
    });
});
