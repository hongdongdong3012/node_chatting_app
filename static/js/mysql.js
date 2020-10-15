//https://medium.com/wasd/node-js%EC%97%90%EC%84%9C-mysql-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-1-b4b69ce7433f

var mysql = require('mysql');
var connection = mysql.createConnection({
  host : 'localhost', // 호스트 주소
  user : 'root',  // mysql user
  password : 12345,  //mysql password
  database : 'example'  // mysql 데이터베이스
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if(error) throw error;
  console.log('The solution is : ', results[0].solution);
});

connection.end();


/*
* connection 변수는 연결할 때 사용되는 정보를 담는다.
* connect(); 메소드가 mysql에 연결을 합니다.
* query('mysql_query', callback);에서 실제 데이터 베이스의 값을 다룬다.
* end();를 통해서 mysql 연결을 끊는다.
*/