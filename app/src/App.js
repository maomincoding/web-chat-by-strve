import { h, setData } from 'strvejs';
import './style/app.css';

let socket = null;
const path = 'ws://localhost:3000/'; // 服务端地址
const bg = randomRgb();
const name = new Date().getTime().toString();
const chatArr = [];
let textValue = '';

init();

function App() {
	return h/*html*/ `
    <div class="home">
        <div class="content">
        <ul $key class="chat-box">
        ${chatArr.map(
					(item) => h/*html*/ `
                <li  class="chat-item">
                ${
									item.name === name
										? h/*html*/ `
                <div class="chat-msg mine">
                <p class="msg mineBg msg-m">${item.txt}</p>
                <p class="user" style="background: ${bg}">
                ${item.name.substring(item.name.length - 5, item.name.length)}
                </p>
                </div>`
										: h/*html*/ `
                <div  class="chat-msg other">
                <p class="user" style="background:${item.bg}" $key>
                ${item.name.substring(item.name.length - 5, item.name.length)}
                </p>
                <p class="msg otherBg msg-o" $key>${item.txt}</p>
                </div>
                `
								}
                </li>`
				)}
        </ul>
        </div>
        <div class="footer">
        <textarea
            id="textValue"
            $key
            placeholder="说点什么..."
            autofocus
            onChange=${onTextValue}
        ></textarea>
        <div class="send-box">
            <p class="send active" onClick=${send}>发送</p>
        </div>
        </div>
    </div>
    `;
}

// 随机获取头像背景
function randomRgb() {
	let R = Math.floor(Math.random() * 130 + 110);
	let G = Math.floor(Math.random() * 130 + 110);
	let B = Math.floor(Math.random() * 130 + 110);
	return 'rgb(' + R + ',' + G + ',' + B + ')';
}

// WebSocket初始化
function init() {
	if (typeof WebSocket === 'undefined') {
		alert('您的浏览器不支持socket');
	} else {
		socket = new WebSocket(path);
		socket.onopen = open;
		socket.onerror = error;
		socket.onclose = closed;
		socket.onmessage = getMessage;
	}
}

function open() {
	alert('服务连接成功');
}

function error() {
	alert('连接错误');
}

function closed() {
	alert('服务关闭');
}

// 监听信息
function getMessage(msg) {
	const obj = JSON.parse(msg.data);
	setData(() => {
		chatArr.push(obj);
	}).then(() => {
		document.querySelector('.chat-box').scrollTop =
			document.querySelector('.chat-box').scrollHeight;
	});
}

function onTextValue(v) {
	textValue = v.target.value;
	v.target.value = '';
}

// 发送消息
function send() {
	if (textValue.trim().length > 0) {
		const obj = {
			name: name,
			txt: textValue,
			bg: bg,
		};
		socket.send(JSON.stringify(obj));
		textValue = '';
		document.querySelector('#textValue').focus();
	}
}

export default App;
