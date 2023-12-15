var url = "ws://localhost:8080/ws";
var client = new StompJs.Client({
    brokerURL:url});

var globalUser ;





client.onConnect = (frame) => {
    console.log('Connected: ' + frame);
    client.subscribe('/topic/public', (msg) => {
        console.log("Message received: ");
        console.log(msg.body);
        console.log(JSON.parse(msg.body));
       receiveMessage(JSON.parse(msg.body));
    });
};

client.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};


client.onStompError = function (frame) {
  // Will be invoked in case of error encountered at Broker
  // Bad login/passcode typically will cause an error
  // Complaint brokers will set `message` header with a brief message. Body may contain details.
  // Compliant brokers will terminate the connection after any error
  console.log("Broker reported error: " + frame.headers["message"]);
  console.log("Additional details: " + frame.body);
};



function displayMessaging() {
  $(".messenger").css("display", "block");
}

function hideMessaging() {
  $(".messenger").css("display", "none");
}
function connect() {
  client.activate();
}

function disconnect() {
  client.disconnect();
}

function submitAndConnectWithBackend() {
  var inputValue = $("#username").val();
  if (!inputValue && inputValue.trim() == "") {
    alert("Username value is empty or null. Please enter a value.");
  }
  console.log("Setting user : "+inputValue)
  globalUser = inputValue
  $(".login").remove();
  displayMessaging();

  client.publish({
    destination: "/app/chat.addUser",
    body: JSON.stringify({
        content: "User: "+inputValue+" added to chat",
        sender: inputValue,
        messageType:"JOIN"
    }),
    skipContentLengthHeader: true,
  });
}


function receiveMessage(msg){
  
        const messageList = $('#message-list');
        // messageList.empty(); // Clear existing messages

        const li = $('<li>')
        li.append($('<div>').addClass('sender').text(msg.sender));
        li.append($('<div>').text(msg.content));
        messageList.append(li);
        
    
        // Scroll to the bottom to show the latest message
        $('#chat-container').scrollTop($('#chat-container')[0].scrollHeight);
    
        // Show the chat container once there are messages
        $('#chat-container').show();

    
}

function sendMessage(){
    var msg = $("#message-input-field").val()
    console.log("Sending message "+msg);
    client.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify({
            content: msg,
            sender: globalUser,
            messageType:"CHAT"
        }),
        skipContentLengthHeader: true,
      });
}


$(function () {
  hideMessaging();
  connect();

  $("form .submit").click((e) => {
    submitAndConnectWithBackend()
  });

  $(".messenger #send-button").click((e)=>{
    sendMessage()
  })
});
