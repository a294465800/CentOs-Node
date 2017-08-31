var express = require('express');
var eventproxy = require('eventproxy');
var cheerio = require('cheerio');
var superagent = require('superagent');

//url 模块是 node.js 标准库里面的
var url = require('url');

var app = express();
var cnodeUrl = 'https://cnodejs.org/';

app.get('/', function(req, res, next){
    superagent.get(cnodeUrl)
	.end(function(err, sres){
	    if(err){
	        return next(err);
 	    }
	    console.log(sres);
	    var topicUrls = [];
	    var $ = cheerio.load(sres.text);

	    //获取首页所有链接
	    $('#topic_list .topic_title').each(function(index, element){
		var $element = $(element);

		//$elememt.attr('href') 本来的样子是 /topic/5ac21b412323d21
		//我们用 url.resolve 来自动推断出完整 url ，变成https://...
		var href = url.resolve(cnodeUrl, $element.attr('href'));
		topicUrls.push(href);
	    });
	    console.log(topicUrls);
	    res.send(topicUrls);

	});
});

app.listen(3000, function(){
	console.log('start...');
})
