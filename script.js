document.addEventListener("DOMContentLoaded", function() {
    const chatbotContainer = document.getElementById("chatbot-container");
    const chatbotIcon = document.getElementById("chatbot-icon");
    const closeButton = document.getElementById("close-btn");
    const sendBtn = document.getElementById("send-btn");
    const chatbotInput = document.getElementById("chatbot-input");
    const chatbotMessages = document.getElementById("chatbot-messages");

    // ✅ Paste your Gemini API key here
    const apiKey = "AIzaSyC8W6Y7gFsBR9IYjKxTygqrrF1R7dZdaEg";

    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

    chatbotIcon.addEventListener("click", function() {
        chatbotContainer.classList.remove("hidden");
        chatbotIcon.style.display = "none";
    });

    closeButton.addEventListener("click", function() {
        chatbotContainer.classList.add("hidden");
        chatbotIcon.style.display = "flex";
    });

    sendBtn.addEventListener("click", sendMessage);

    chatbotInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    function sendMessage() {
        const userMessage = chatbotInput.value.trim();
        if (userMessage) {
            appendMessage("user", userMessage);
            chatbotInput.value = "";
            getBotResponse(userMessage);
        }
    }

    function appendMessage(sender, message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", sender);
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    async function getBotResponse(userMessage) {
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    contents: [{
                        role: "user",
                        parts: [{ text: userMessage }],
                    }, ],
                }),
            });

            const data = await response.json();
            console.log("Gemini API response:", data); // ✅ helpful for debugging

            let botMessage = "Sorry, I couldn't understand that.";
            if (
                data &&
                data.candidates &&
                data.candidates.length > 0 &&
                data.candidates[0].content &&
                data.candidates[0].content.parts &&
                data.candidates[0].content.parts.length > 0
            ) {
                botMessage = data.candidates[0].content.parts[0].text;
            }

            appendMessage("bot", botMessage);
        } catch (error) {
            console.error("Error fetching bot response:", error);
            appendMessage("bot", "Sorry, something went wrong. Please try again.");
        }
    }
});