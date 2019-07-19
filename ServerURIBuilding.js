// 2019.04.07, reset function

const { parse } = require('querystring');
var express = require('express');
var app = express();

var obj = { x: '-50284', y: '-10.69318', z: '-55255', rx: '-205.146', ry: '0', state: "init" };  

var reboot = { x: '-50284', y: '-10.69318', z: '-55255', rx: '-205.146', ry: '0', state: "init" };
// rx is Y axis, ry is X axis

var reset_count = 0;

console.log(obj);
console.log(Math.cos(18/180).toString());
console.log(("hi"=="hi").toString());

// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
   console.log("Got a GET request for the homepage");
   res.send('Hello GET');
})

// This responds a POST request for the homepage
app.post('/', function (req, res) {
   collectRequestData(req, result => {
        console.log(obj);
		
		// rotation by x
		obj.rx = (obj.rx)*1+(result.rx)*1;
		//if(obj.rx>180)
		//	obj.rx = -180;
		//if(obj.rx<-180)
		//	obj.rx = 180;
		obj.rx = obj.rx.toString();
		// rotation by y
		obj.ry = (obj.ry)*1+(result.ry)*1;
		if(obj.ry>180||obj.ry<-180)
			obj.ry = obj.ry*(-1);
		obj.ry = obj.ry.toString();
		
		// x position
		obj.x = (obj.x)*1  +  10*(result.x)*1*Math.cos(((obj.rx)*1/180)*Math.PI)  +  10*(result.z)*1*Math.sin(((obj.rx)*1/180)*Math.PI);//;
		//console.log(obj.x.toString());
		obj.x = obj.x.toString();
		// y position
		obj.y = (obj.y)*1+ 10*(result.y1)*1 - 10*(result.y2)*1;
		obj.y = obj.y.toString();
		// z position
		obj.z = (obj.z)*1  +  10*(result.z)*1*Math.cos(((obj.rx)*1/180)*Math.PI)  -  10*(result.x)*1*Math.sin(((obj.rx)*1/180)*Math.PI);//;
		obj.z = obj.z.toString();
		
		
		if(result.changed=="yes")
			obj.state = result.currentstate;
		
		try {
			if(result.reset=="yes")
			{
				reset_count = reset_count + 1;
				if(reset_count>=3)
				{
					obj.x =  reboot.x;
					obj.y =  reboot.y;
					obj.z =  reboot.z;
					obj.rx =  reboot.rx;
					obj.ry =  reboot.ry;
					obj.state =  reboot.state;
					reset_count = 0;
				}
			}
			
		}
		catch(error){
			console.error(error);
		}
		console.log(reset_count);
			
		// respond to post
        res.end(JSON.stringify(obj));
    });
})

// This responds a DELETE request for the /del_user page.
app.delete('/del_user', function (req, res) {
   console.log("Got a DELETE request for /del_user");
   res.send('Hello DELETE');
})

// This responds a GET request for the /list_user page.
app.get('/list_user', function (req, res) {
   console.log("Got a GET request for /list_user");
   res.send('Page Listing');
})

// This responds a GET request for abcd, abxcd, ab123cd, and so on
app.get('/ab*cd', function(req, res) {   
   console.log("Got a GET request for /ab*cd");
   res.send('Page Pattern Match');
})

var server = app.listen(8081, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}