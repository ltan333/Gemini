document.getElementById('user-message').addEventListener('keyup', function(messageInputevent) {
  if (event.key ==="Enter" && event.shiftKey) {
    // console.log("shift + enter")
  }
  else if (event.key === 'Enter') {
    handleAPI();
  }
});

document.addEventListener('DOMContentLoaded', function() {
  checkKey()
});

function checkKey() {
  if (localStorage.getItem("key") === null) {
    console.log("Chưa có key")
    btn = document.getElementById("enterKeyBtn")
    btn.textContent = "Nhập key - Yet"
    return
  }else {
    console.log("Đã có key")
    btn = document.getElementById("enterKeyBtn")
    btn.textContent = "Nhập key - OK"
    return
  }
}

function enterKey() {
  const key = prompt("Nhập key: ")
  if (key.trim() === "") {
    alert("Key sai!!!")
    return
  }
  localStorage.setItem("key", key)
  console.log(localStorage.getItem("key"))
  checkKey()
}

async function handleAPI() {
  const userMessage = document.getElementById('user-message').value;
  console.log(userMessage);
  if (userMessage === '') {
    appendMessage('User', "Không thể gửi tin rỗng!!!", 'user-message');
    return;
  }
  appendMessage('User', userMessage, 'user-message');
  //get the response from the bot
  var response = await ask(userMessage)
  console.log(response)
  try {
    var data = response['candidates'][0]['content']['parts'][0]['text']
  } catch (error) {
    if(error)
    appendMessage('Bot', "Đã xãy ra lỗi, vui lòng thử lại!!!", 'bot-message');
    history.pop()
    return;
  }
  
  // Simulate a bot response
  console.log(data)
  var botResponse = processMarkdown(data);
  
  history.push({"role":"model", "parts":[{"text":data}]})
  appendMessage('Bot', botResponse, 'bot-message');
  console.log(document.querySelectorAll('pre code'))
  console.log(hljs.getLanguage("import os"))
  document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightBlock(block, {language: "python"});
  });
}

function appendMessage(sender, content, className) {
  const chatContainer = document.getElementById('chatContainer');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message';

  const userName = document.createElement('div');

  if (sender === 'User') {
    userName.className = 'user-name-user';
  } else {
    userName.className = 'user-name-bot';
  }

  userName.textContent = sender;

  const messageContent = document.createElement('div');
  const messageContentpre = document.createElement('pre');
  messageContent.className = `message-content ${className}`;
  
  if (sender === 'User') {
    messageContentpre.textContent = content;
  } else {
    messageContentpre.innerHTML = content;
  }

  messageDiv.appendChild(userName);
  messageContent.appendChild(messageContentpre);
  messageDiv.appendChild(messageContent);

  chatContainer.appendChild(messageDiv);
  // Clear the input field after sending a message
  document.getElementById('user-message').value = '';
  
}

function processMarkdown(text) {
  
  return marked.parse(text);
  // return hljs.highlightAuto(html).value;
}


/*=========================== Gemini ===========================*/


const HEADER = {'Content-Type': 'application/json'}

let history = []

async function ask(_question) {
  var GEMINY_KEY = localStorage.getItem("key")
  var GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key='+GEMINY_KEY
  if (GEMINY_KEY === null) {
    alert("Vui lòng nhập key")
    return
  }
  let data = {
    "role":"user",
    "parts":[
      {
        "text": _question
      }
    ]
  }

  history.push(data)
  console.log(history)
  return fetch(GEMINI_BASE_URL, {
    method: 'POST',
    headers: HEADER,
    body: JSON.stringify({'contents': history})
  }).then(response => {
    return response.json()
  })
}

function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < 10; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
}

/*=========================== Pantry ===========================*/

const PANTRY_BASE_URL = "https://getpantry.cloud/apiv1/pantry/"

const PANTRY_KEY = 'Change-me'

function _send_request(method, data="", add_url="") {
    headers = new Headers()
    headers.append('Content-Type', 'application/json')
    if (method == "GET") {
        var requestOptions = {
            method: method,
            headers: headers,
            redirect: 'follow'
          };
    } else if (method == "POST") {
        var requestOptions = {
            method: method,
            headers: headers,
            body: JSON.stringify(data),
            redirect: 'follow'
          };
    } else if (method == "PUT") {
        var requestOptions = {
            method: method,
            headers: headers,
            body: JSON.stringify(data),
            redirect: 'follow'
          };
    } else if (method == "DELETE") {
        var requestOptions = {
            method: method,
            headers: headers,
            redirect: 'follow'
          };
    } else {
        throw new Error("Invalid method")
    }
    return fetch(PANTRY_BASE_URL+PANTRY_KEY+add_url, requestOptions)
}

function get_info() {
    response = _send_request("GET")
    response.then((response) => response.text())
    .then((result) => {console.log(result)})
}

function update_info(name, description) {
    payload = {"name": name, "description": description}
    response = _send_request("PUT", payload)
    response.then((response) => response.text())
    .then((result) => {console.log(result)})
}

function create_storage_box(box_name, data) {
    update_url = `/basket/${box_name}`
    response = _send_request("POST", data, update_url)
    response.then((response) => response.text())
    .then((result) => {console.log(result)})
}

function update_content(box_name, data) {
    update_url = `/basket/${box_name}`
    response = _send_request("PUT", data, update_url)
    response.then((response) => response.text())
    .then((result) => {console.log(result)})
}

function get_content(box_name) {
    update_url = `/basket/${box_name}`
    response = _send_request("GET", "", update_url)
    response.then((response) => response.text())
    .then((result) => {console.log(result)})
}

function delele_storage_box(box_name) {
    update_url = `/basket/${box_name}`
    response = _send_request("DELETE", "", update_url)
    response.then((response) => response.text())
    .then((result) => {console.log(result)})
}

function get_storage_boxes() {
    response = _send_request("GET")
    response.then((response) => response.text())
    .then((result) => {console.log(result)})
}

function check_duplicate(box_name) {
    response = _send_request("GET")
    response.then((response) => response.text())
    .then((result) => {console.log(result)})
}