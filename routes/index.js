var express = require('express');
var router = express.Router();
var multer = require('multer');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host : 'user.host',
    user : 'user.name',
    password: 'user_pw',
    database: 'user_lib'
});

var s3 = require('multer-storage-s3');
var storage = s3({
    destination : function(req,file,cb){
        cb(null,'file/');
    },
    filename : function(req,file,cb){
        cb(null,Date.now() +"." + file.originalname.split('.').pop());
    },
    bucket : 'minsoo'
    region : 'ap-northeast-2'
});
var upload = multer({ storage : storage});

router.get("/", function(req, res){
    res.render('fileup', function(errror,content){
        if(!error){
            res.end(content);
        }else{
            res.writeHead(501, {'Content-Type' : 'text/plain'});
            res.end("Error while reading a file");
        }
    });
});

router.post('/upload', upload.single('userPhoto'), function(req,res){
    var file_filename = req.file.filename;
    var file_path = req.file.s3.Location;
    console.log(path);
    
    connection.query('insert into file (filename, path) values  (?,?);',[file_filename,file_path],
                     function(error,info){
        if(error != undefined){
            res.sendStatus(503);
        }else{
            res.send('file was Uploaded Succesfully');
        }
    });
       console.log(filename);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
