//引入依赖
var express = require('express');
var utility = require('utility');

//建立 express 实例
var app = express();

app.get('/', function (req, res) {
    //从 req.query 中取出我们的 q 参数。
    //如果是 post 传来的 body 数据，则是在 req.body 里面，不过 express 默认不处理 body 中的信息，需要引入 body-parser 这个中间件
    //如果分不清什么是 query， 什么是 body 的话，那就要补充一下 http 的知识了。
    var q = req.query.q;

    //调用 utility.md5 方法，得到 md5 之后的值
    //之所以使用 utility 这个库来生成 md5 值，其实只是习惯问题，大家每个人都有自己习惯的技术栈。
    var md5Value = utility.md5(q);

    res.send(md5Value);
});

app.listen(3000, function (req, res) {
    console.log('app is running at port 3000...');
});