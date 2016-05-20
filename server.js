var http = require('http');
var url = require('url');
var querystring = require('querystring');
var static = require('node-static');
var file = new static.Server('.');

var hostname = 'http://127.0.0.1:';
var port = '7777';

/*
 * массив клиентов
 */
var user = [{
	agent : 'agent',
	ip : 'ip',
	cookie : 0,

	flag : {
		task : false,
	    cookie : false,
	    answer : false,
	    error : false,
	    ok : false
	},

	task : {
		a : [0,0,0,0,0,0,0,0,0,0],
		n : 10,
		sum : 0,
	},

	answer : {
    	mask : 0,
    	sum : 0,
    	ans : 0  
	}
}];


/*
 * генерация данных для задания
 */
function genn(num) {
    user[num].task.n = Math.floor(Math.random()*20)+10;
}

function genarray(num) {
	for (var i = 0; i < user[num].task.n; i++) {
	    user[num].task.a[i] = Math.floor(Math.random()*100)-50;
	}
}

function gensum(num) {
	user[num].task.sum = Math.floor(Math.random()*200)-100;
}


/*
 * очистка данных о клиенте (установка дефолтных данных)
 */
function clear(num) {
	for (var i = 0; i < 10; i++) { user[num].task.a[i] = 0; }
	if (user[num].task.n > 10) {
	    for (var i = 10; i < user[num].task.n; i++) { user[num].task.a.pop(); }
	}
	user[num].task.n = 10;
	user[num].task.sum = 0;
	user[num].task.count = 0;

    user[num].flag.task = false;
    user[num].flag.error = false;
    user[num].flag.ok = false;
    user[num].flag.answer = false;
    user[num].flag.cookie = false;
}


/*
 * массив старых данных (задания, которые были уже использованы)
 */
var old_data = [{
    n : 10,
    a : [0,0,0,0,0,0,0,0,0,0],
    sum : 0
}];


/*
 * поиск клиента по идентификатору User Agent и по IP-адресу
 * если клиент будет найден, то возвращаем его номер,
 * иначе добавляем его в массив клиентов
 */
function find_user(req) {
	var agent = req.headers['user-agent'];
	var ip = req.headers['x-forward-for'] || req.connection.remoteAddress;
	
	for (var i = 0; i < user.length; i++) {
		if (user[i].agent == agent && user[i].ip == ip) return i;
	}
	
	user.push({
		agent : agent,
		ip : ip,
		cookie : 0,

		flag : {
			task : false,
		    cookie : false,
		    answer : false,
		    error : false,
		    ok : false
		},

		task : {
			a : [0,0,0,0,0,0,0,0,0,0],
			n : 10,
			sum : 0,
		},

		answer : {
	    	mask : 0,
	    	sum : 0,
	    	ans : 0  
		}
	});

	return user.length-1; 
}


/*
 * проверка на наличие сгенерированного задания в массиве использованных ранее заданий
 * если в массиве найдется такое задание, то нужно будет сгенерировать новое, 
 * иначе записываем это задание в этот массив старых данных
 */
function check_task(num) {
    var f1 = 0, f2 = 0, f3 = 0;
    var arr = user[num].task.a;
    var n = user[num].task.n;
    arr.sort();
    
    for (var i = 0; i < old_data.length; i++) {
        if (n == old_data[i].n) f1 = 1;

        old_data[i].a.sort();
        
        for (var j = 0; (j < user[num].task.n) && (f1 == 1); j++) {
            if (arr[j] == old_data[i].a[j]) f2 = 1;
        }
        
        if (user[num].task.sum == old_data[i].sum) f3 = 1;
        if (f1 == 1 && f2 == 1 && f3 == 1) return 1;
        
        f1 = 0; 
        f2 = 0;
        f3 = 0;
    }

    old_data.push({
    	n : user[num].task.n, 
    	a : user[num].task.a, 
    	sum : user[num].task.sum
    });

    return 0;
}


/*
 * генерация задания и js кода, решающий это задание
 */
function gen_task(num) {
    while (check_task(num)) {
        genn(num);
        genarray(num);
        gensum(num);
    }

    var jscode = "<html>\n<meta charset='utf-8'>\n" +
        "<body onload='solveTask()'>\n<script>\n" + 
        "function solveTask() {\nvar xhttp = new XMLHttpRequest();\n" +
        "xhttp.open('POST', '', true);\n" +
        "xhttp.onreadystatechange = function() {\n" +
        "if (xhttp.readyState != 4) return;\n" +
        "if (xhttp.status == 503 || xhttp.status == 404) {\n" +
        "alert('Ошибка ' + xhttp.status + ': ' + xhttp.statusText);\n" +
        "return;\n}\nlocation.reload(); \n};\n" +
        "var text = '0';\n" +
        "var a = [" + user[num].task.a[0];

    for (var i = 1; i < user[num].task.n; i++) {
        jscode += ("," + user[num].task.a[i]);
    }

    jscode += "];\nvar n = " + user[num].task.n + ";\n" +
        "var sum = " + user[num].task.sum + ";\n" +
        "for (var mask = 1; mask < (1<<n); mask++) {\n" +
        "var tmp = mask, cur_sum = 0;\n" +
        "for (var i = 0; i < n; i++) {\n" +
        "if (tmp%2) { cur_sum += a[i]; }\n" +
        "tmp = Math.floor(tmp/2);\n}\n" +
        "if (cur_sum == sum) { " +
        "text = 'mask' + mask + 'sum' + sum + 'answer';\n" +
        "for (var k = 0; k < n; k++) {\n" +
        "if (mask%2) { text += a[k]; }\n" +
        "mask = Math.floor(mask/2);\n}\nbreak;\n}\n" +
        "}\nconsole.log(text);\n xhttp.send(text);\nif (text == 0) location.reload();\n}\n";
    jscode += "</script>\n</body>\n</html>";

    //console.log(jscode);

    return jscode;
}


/*
 * запись ответа
 */
function rem_answer(data, num) {
    if (data != 0) { 
        var m = data.search('mask');
        var s = data.search('sum');
        var a = data.search('answer');

        user[num].answer.mask = data.slice(m+4, s);
        user[num].answer.sum = data.slice(s+3, a);
        user[num].answer.ans = data.slice(a+6);
        user[num].flag.answer = true;
    }
}


/*
 * проверка ответа
 */
function check_answer(num) {
    for (var mask = 1; mask < (1<<user[num].task.n); mask++) { 
        var tmp = mask, cur_sum = 0;
        for (var i = 0; i < user[num].task.n; i++) { 
            if (tmp%2) { cur_sum += user[num].task.a[i]; } 
            tmp = Math.floor(tmp/2); 
        } 
    
        if (cur_sum == user[num].task.sum) {
            if (user[num].task.sum != user[num].answer.sum || mask != user[num].answer.mask) return 0; 
            var text = 'answer'; 
            for (var k = 0; k < user[num].task.n; k++) { 
                if (mask%2) { 
                    text += user[num].task.a[k];
                }
                mask = Math.floor(mask/2); 
            } 
            if (text != ('answer' + user[num].answer.ans)) return 0;
            return 1;
        }
    }
}


/*
 * проверка на наличие куки
 */
function check_cookie(req, num) {
    var keys = Object.keys(req.headers); 

    for(var i = 0; i < keys.length; i++) {
        var hname = keys[i];
        var hval = req.headers[hname];

        if (hname.toLowerCase() === "cookie" && hval == user[num].cookie) {
            return 1;
        }
    }

    return 0;
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

/* 
 * СЕРВЕР
 */
function accept(request, response) {
    switch(request.url) {
        case '/' :
        	var num = find_user(request);
            console.log("num user: " + num);
            user[num].flag.cookie = check_cookie(request, num);

            if (user[num].flag.cookie && user[num].flag.answer && check_answer(num) || user[num].flag.ok) {
                console.log("OK");
                user[num].flag.ok = true;
                response.writeHead(301, {Location: hostname + port + '/hello'});
                response.end();
            } else if (user[num].flag.cookie && user[num].flag.answer && !(user[num].flag.ok) || user[num].flag.error) {
                console.log("ERROR");
                user[num].flag.error = true;
                response.writeHead(301, {Location: hostname + port + '/error'});
                response.end();
            } else if (!(user[num].flag.answer) && user[num].flag.task) {
                console.log('answer');
                var data = '';
                user[num].flag.task = false;
                
                request.on('data', function(chunk) {
                    data += chunk.toString();
                });
                    
                request.on('end', function() {
                    user[num].cookie = data;
                    console.log("data : " + data);
                    rem_answer(data, num);
                    response.setHeader('Set-Cookie', user[num].cookie);
                    response.end();
                });
            } else {
            	clear(num);
                user[num].flag.task = true;
                response.writeHead(200, {'Content-Type' : 'text/html'});
                response.end(gen_task(num));
            }
        break;
        
        case '/hello' :
        	var num = find_user(request);
            if (user[num].flag.ok) {
                clear(num);
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end('<html><meta charset="utf-8"><head>Hello</head></html>');
            } else {
                response.writeHead(301, {Location: hostname + port + '/'});
                response.end();
            } 
        break;

        case '/error' :
        	var num = find_user(request);
            if (user[num].flag.error && !(user[num].flag.ok)) {
                response.writeHead(503, {'Content-Type': 'text/html'});
                response.end('Error 503: HTTP Service Temporarily Unavailable'); 
            } else {
                response.writeHead(404, {'Content-Type': 'text/plain'});
                response.end('Error 404');
            } 
        break;

        default :
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.end('Error 404');
        break;
    }
}


if (!module.parent) {
    console.log(port);
    http.createServer(accept).listen(port);
} else {
    exports.accept = accept;
}