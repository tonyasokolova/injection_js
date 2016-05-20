var fs = require('fs');
var path = 'log.txt';
fs.write(path, 'start\n', 'w');
/*
 * первый клиент
 */
for (var i = 0; i < 10; i++) {
var webpage1 = require('webpage').create();
var startTime1;

var agent1 = "My Super Agent / 1.0";
webpage1.settings.userAgent = agent1;

webpage1.onConsoleMessage = function(msg) {
	var content = agent1 + ': msg from 1: ' + msg + '\n';
	fs.write(path, content, 'a');
	console.log(content);
	console.log("");
};

webpage1.onLoadStarted = function() {
	startTime1 = new Date();
};

webpage1.onLoadFinished = function(status) {
	if (status == "success") {
	    var endTime = new Date();
	    var content = agent1 + ': The page 1 is loaded in '+ ((endTime - startTime1)/1000)+ ' seconds\n';
	    fs.write(path, content, 'a');
	    console.log(content);
	} else {
		var content = agent1 + ': The loading 1 has failed\n';
		fs.write(path, content, 'a');
		console.log(content);
	}
	console.log("");
};

webpage1
	.open('http://127.0.0.1:7777', function(status){
		//вывод скрипта
		var mainTitle = webpage1.evaluate(function () {
	        return document.querySelector("script").textContent;
	    });
	    var content = agent1 + ': JS script: ' + mainTitle + '\n';
	    fs.write(path, content, 'a');
	    console.log(content);
	});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

/*
 * второй клиент
 */
var webpage2 = require('webpage').create();
var startTime2;

var agent2 = "My Super Agent / 2.0";
webpage2.settings.userAgent = agent2;

webpage2.onConsoleMessage = function(msg) {
	var content = agent2 + ': msg from: ' + msg + '\n';
	fs.write(path, content, 'a');
	console.log(content);
	console.log("");
};

webpage2.onLoadStarted = function(){
	startTime2 = new Date();
};

webpage2.onLoadFinished = function(status) {
	if (status == "success") {
	    var endTime = new Date();
	    var content = agent2 + ': The page is loaded in '+ ((endTime - startTime2)/1000)+ ' seconds\n'; 
	    fs.write(path, content, 'a');
	    console.log(content);
	} else {
		var content = agent2 + ': The loading has failed\n';
		fs.write(path, content, 'a');
		console.log(content); 
	}
	console.log("");
};

webpage2
	.open('http://127.0.0.1:7777', function(status){
		//вывод скрипта
		var mainTitle = webpage2.evaluate(function () {
	        return document.querySelector("script").textContent;
	    });
	    var content = agent2 + ': JS script: ' + mainTitle + '\n';
	    fs.write(path, content, 'a');
	    console.log(content);
	});	

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

/*
 * третий клиент
 */
var webpage3 = require('webpage').create();
var startTime3;

var agent3 = "My Super Agent / 3.0"
webpage3.settings.userAgent = agent3;

webpage3.onConsoleMessage = function(msg) {
	var content = agent3 + ': msg from: ' + msg + '\n';
	fs.write(path, content, 'a');
	console.log(content);
	console.log("");
};

webpage3.onLoadStarted = function(){
	startTime3 = new Date();
};

webpage3.onLoadFinished = function(status) {
	if (status == "success") {
	    var endTime = new Date();
	    var content = agent3 + ': The page is loaded in '+ ((endTime - startTime3)/1000)+ ' seconds\n';
	    fs.write(path, content, 'a');
	    console.log(content);
	} else {
		var content = agent3 + ": The loading has failed\n";
		fs.write(path, content, 'a');
		console.log(content);
	}
	console.log("");
};

webpage3
	.open('http://127.0.0.1:7777', function(status){
		//вывод скрипта
		var mainTitle = webpage3.evaluate(function () {
	        return document.querySelector("script").textContent;
	    });
	    var content = agent3 + ': JS script 3: ' + mainTitle + '\n';
	    fs.write(path, content, 'a');
	    console.log(content);
	});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

/*
 * четвертый клиент
 */
var webpage4 = require('webpage').create();
var startTime4;

var agent4 = "My Super Agent / 4.0";
webpage4.settings.userAgent = agent4;

webpage4.onConsoleMessage = function(msg) {
	var content = agent4 + ': msg from: ' + msg + '\n';
	fs.write(path, content, 'a');
	console.log(content);
	console.log("");
};

webpage4.onLoadStarted = function(){
	startTime4 = new Date();
};

webpage4.onLoadFinished = function(status) {
	if (status == "success") {
	    var endTime = new Date();
	    var content = agent4 + ': The page is loaded in '+ ((endTime - startTime4)/1000)+ ' seconds\n'; 
	    fs.write(path, content, 'a');
	    console.log(content);
	} else {
		var content = agent4 + ": The loading has failed\n";
		fs.write(path, content, 'a');
		console.log(content);
	}
	console.log("");
};

webpage4
	.open('http://127.0.0.1:7777', function(status){
		//вывод скрипта
		var mainTitle = webpage4.evaluate(function () {
	        return document.querySelector("script").textContent;
	    });
	    var content = agent4 + ': JS script: ' + mainTitle + '\n';
	    fs.write(path, content, 'a');
	    console.log(content);
	});	

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

/*
 * пятый клиент
 */
var webpage5 = require('webpage').create();
var startTime5;

var agent5 = "My Super Agent / 5.0"
webpage5.settings.userAgent = agent5;

webpage5.onConsoleMessage = function(msg) {
	var content = agent5 + ": msg from: " + msg + '\n';
	fs.write(path, content, 'a');
	console.log(content);
	console.log("");
};

webpage5.onLoadStarted = function(){
	startTime = new Date();
};

webpage5.onLoadFinished = function(status) {
	if (status == "success") {
	    var endTime = new Date();
	    var content = agent5 + ': The page is loaded in '+ ((endTime - startTime)/1000)+ ' seconds\n'; 
	    fs.write(path, content, 'a');
	    console.log(content);
	} else {
		var content = agent5 + ": The loading has failed\n";
		fs.write(path, content, 'a');
		console.log(content);
	}
	console.log("");
};

webpage5
	.open('http://127.0.0.1:7777', function(status){
		//вывод скрипта
		var mainTitle = webpage5.evaluate(function () {
	        return document.querySelector("script").textContent;
	    });
	    var content = agent5 + ': JS script: ' + mainTitle + '\n';
	    fs.write(path, content, 'a');
	    console.log(content);
	});	
}