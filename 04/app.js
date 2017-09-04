var express = require('express');
var eventproxy = require('eventproxy');
var cheerio = require('cheerio');
var superagent = require('superagent');

//url 模块是 node.js 标准库里面的
var url = require('url');

var app = express();
var cnodeUrl = 'https://cnodejs.org/';

app.get('/', function (req, res, next) {
	superagent.get(cnodeUrl)
		.end(function (err, sres) {
			if (err) {
				return next(err);
			}
			var topicUrls = [];
			var $ = cheerio.load(sres.text);

			//获取首页所有链接
			$('#topic_list .topic_title').each(function (index, element) {
				var $element = $(element);

				//$elememt.attr('href') 本来的样子是 /topic/5ac21b412323d21
				//我们用 url.resolve 来自动推断出完整 url ，变成https://...
				var href = url.resolve(cnodeUrl, $element.attr('href'));
				topicUrls.push(href);
			});

			//得到一个 eventproxy 的实例
			var ep = new eventproxy();

			//命令 ep 重复监听 topicUrls.length 次（这里是40次） `topic_html` 事件再行动
			ep.after('topic_html', topicUrls.length, function (topics) {
				//topics 是个数组，包含了 40 次 ep.emit('topic_html', pair) 中的那40个 pair

				//开始行动
				topics = topics.map(function (topicPair) {
					//jquery 用法
					var topicUrl = topicPair[0];
					var topicHtml = topicPair[1];
					var $ = cheerio.load(topicHtml);
					return ({
						title: $('.topic_full_title').text().trim(),
						href: topicUrl,
						comment1: $('.reply_content').eq(0).text().trim(),
					});
				});

				console.log('final:');
				console.log(topics);
			});

			topicUrls.forEach(function (topicUrl) {
				superagent.get(topicUrl)
					.end(function (err, res) {
						console.log('fetch ' + topicUrl + 'successful');
						ep.emit('topic_html', [topicUrl, res.text]);
					});
			});

		});
});

app.listen(3000, function () {
	console.log('starting listening port 3000 ...');
})