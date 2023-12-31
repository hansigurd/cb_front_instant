$(document).ready(function() {
    const userIdField = document.getElementById('user_id');
    const messagesDiv = document.querySelector('.messages');
    const messageInput = document.querySelector('.message-input');
    const sendButton = document.getElementById('send');
    const typingIndicator = document.querySelector('.typing-indicator');

    sendButton.addEventListener('click', function() {
        sendMessage();
    });

    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const session_id = userIdField.value;
        const userInput = messageInput.value;
        if (userInput.trim()) {
            const userMessage = document.createElement('div');
            userMessage.className = 'message user-message';
            userMessage.innerText = userInput;
            messagesDiv.appendChild(userMessage);
            messageInput.value = '';

            if (session_id.trim() === '') {
                alert('Error: User ID is required');
                return;
            }

            typingIndicator.style.display = 'flex';
            $.ajax({
                url: 'https://chatbot-cb-2a5f4f776879.herokuapp.com/api/chat', // Ensure this is your correct Heroku URL
                type: 'post',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    session_id: session_id,
                    input: userInput
                }),
                success: function(data) {
                    const botResponse = data.bot_response.replace(/\n/g, ' <br> ');

                    const gptMessage = document.createElement('div');
                    gptMessage.className = 'message gpt-message';
                    gptMessage.innerHTML = botResponse;
                    messagesDiv.appendChild(gptMessage);

                    messagesDiv.scrollTop = messagesDiv.scrollHeight;
                    typingIndicator.style.display = 'none'; // Hide the typing indicator here
                },
                error: function(err) {
                    console.error("Error:", err);
                }
            });
        }
    }
});

function updateSendButtonState() {
    var userId = $('#user_id').val();
    var userInput = $('#user_input').val();

    if(userId && userInput) {
        $('.send-button').removeClass('disabled').addClass('enabled');
    } else {
        $('.send-button').removeClass('enabled').addClass('disabled');
    }
}

$(document).ready(function() {
    updateSendButtonState(); // Disable button at page load

    $('#user_id, #user_input').on('input', updateSendButtonState);
});