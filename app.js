// 설치한 express 모듈 불러오기                                 //함수
const express = require('express')

// 설치한 socket.io 모듈 불러오기
const socket = require('socket.io');

// node.js 기본 내장 모듈 불러오기 // fs = 파일과 관련된 처리가 가능하다.
const http = require('http');
const fs = require('fs');

// express 객체 생성
const app = express()

//express http 서버 생성
const server = http.createServer(app)

//생성한 서버를 socket.io에 바인딩
const io = socket(server)

app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))

// Get 방식으로 경로에 접속하면 실행 됩니다.
app.get('/', function(request, response) {
  fs.readFile('./static/index.html', function(err, data) {  //readFile() = 지정된 파일을 읽어서 데이터를 가져온다.
    if(err) {
      response.send('에러') // response(응답) 객체를 통해 읽어온 데이터를 전달해줘야한다.
    }else {
      response.writeHead(200, {'Content-Type' : 'text/html'}) // 우리가 클라이언트에게 보낼 내용은 index.html다. HTML파일이라는 것을 알려야해서 헤더에 해당 내용을 작성해서 보내준다.
      response.write(data)  //헤더를 작성했으면 이제 HTML데이터를 보내준다.
      response.end()  //보냈으면 완료됬음을 알린다. ( wrtie를 통해 응답할 경우 꼭 end를 사용해주어야합니다.)
    }
  })
})

io.sockets.on('connection',function(socket){ //on()은 소켓에서 해당 이벤트를 받으면 콜백함수가 실행된다.
  
  //새로운 유저가 접속했을 경우 다른 소켓에게도 알려준다.
  socket.on('newUser', function(name){
    console.log(name + '님이 접속하였습니다.')

    //소켓에 이름 저장해두기 + 인원수
    socket.name = name

    //모든 소켓에게 전송
    io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: name + '님이 접속하였습니다.'})
    io.sockets.emit('plusNumber', {})
  })

  //전송한 메시지 받기
  socket.on('message', function(data){
    //받은 데이터에 누가 보냈는지 이름을 추가
    data.name = socket.name

    console.log(data)

    //보낸 사람을 제외한 나머지 유저에게 메시지 전송
    socket.broadcast.emit('update', data);
  })

  //접속 종료
  socket.on('disconnect', function(){
    console.log(socket.name + ' 님이 나가셨습니다.')

    //나가는 사람을 제외한 나머지 유저에게 메시지 전송
    socket.broadcast.emit('update', {type: 'disconnect', name: 'SERVER', message: socket.name + '님이 나가셨습니다.'});
  })
});

//서버를 8080 포트로 listen
server.listen(8080, function(){
  console.log('서버 실행 중...')
})

//node app.js 로 실행