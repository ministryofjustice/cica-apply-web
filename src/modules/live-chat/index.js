function createLiveChat(element) {
    const chatIframe = element;
    if (chatIframe) {
        const queryStringParameters = window.location.search;
        chatIframe.src += queryStringParameters;
    }
}

export default createLiveChat;
