let isDarkMode = false;
async function sendMessage() {
    const input = document.getElementById('user_input');
    const message = input.value;
    if (!message) return;

    const chatContent = document.getElementById('chat-content');

    const userDiv = document.createElement('div');
    userDiv.className = 'user';

    const userImg = document.createElement('img');
    userImg.className = 'user-avatar';
    userImg.src = "static/user.png";

    const userText = document.createElement('div');
    userText.className = 'user-text';
    userText.textContent = message;

    userDiv.appendChild(userImg);
    userDiv.appendChild(userText);
    chatContent.appendChild(userDiv);

    input.value = '';

    const typInd = document.getElementById('typing-indicator');
    typInd.classList.remove('hidden');

    try {
        const response = await fetch('/get_response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_input: message }),
        });
        const data = await response.json();

        setTimeout(() => {
            const botDiv = document.createElement('div');
            botDiv.className = 'bot';

            const botImg = document.createElement('img');
            botImg.className = 'bot-avatar';
            botImg.src = "static/chatbot.png";

            const botText = document.createElement('div');
            botText.className = 'bot-text';
            botText.textContent = `${data.response}`;
     
            botDiv.appendChild(botImg);
            botDiv.appendChild(botText);
            chatContent.appendChild(botDiv);

            typInd.classList.add('hidden');

            if (data.unknown) {
                lastQuestion = message;
                document.getElementById('answer-group').classList.remove('hidden');
            } else {
                document.getElementById('answer-group').classList.add('hidden');
            }
        }, 2000);
    } catch (error) {
        console.error('Error:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bot';
        errorDiv.textContent = `Chatbot: An error occurred.`;
        chatContent.appendChild(errorDiv);

        typInd.classList.add('hidden');
    }
}


function darkMode() {
    const chatbox = document.getElementById("chatbox");
    const chatnav = document.getElementById("chatnav");
    isDarkMode = !isDarkMode;

    if (isDarkMode) {
        chatbox.style.backgroundColor = "black";
        chatbox.style.color = "black";
        chatnav.style.color = "white";
    } else {
        chatbox.style.backgroundColor = "white";
        chatbox.style.color = "black";
        chatnav.style.color = "black";
    }
}

