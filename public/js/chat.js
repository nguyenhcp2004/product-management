import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

//Upload Image
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images', {
  multiple: true,
  maxFileCount: 6
});
//End Upload Image

//CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  const inputContent = formSendData.querySelector("input[name='content']")
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault()
    const content = inputContent.value;
    const images = upload.cachedFileArray || [];
    if (content || images.length > 0) {
      socket.emit('CLIENT_SEND_MESSAGE', {
        content: content,
        images: images
      });
      inputContent.value = "";
      socket.emit("CLIENT_SEND_TYPING", "hidden");
      upload.resetPreviewPanel()
    }
  })
}
//End CLIENT_SEND_MESSAGE

//SERVER_SEND_MESSAGE
socket.on("SERVER_SEND_MESSAGE", (data) => {
  const body = document.querySelector(".chat .inner-body")
  const elementListTyping = body.querySelector(".inner-list-typing");
  const myID = document.querySelector('[my-id]').getAttribute("my-id")

  const div = document.createElement("div")
  let htmlFullName = ''

  if (myID != data.userId) {
    div.classList.add("inner-incoming")
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`
  } else {
    div.classList.add("inner-outgoing")
  }

  div.innerHTML = `
    ${htmlFullName}
    <div class="inner-content">${data.content}</div>
  `
  body.insertBefore(div, elementListTyping);
  body.scrollTop = body.scrollHeight;
})
//End SERVER_SEND_MESSAGE

//Scroll chat to bottom
const bodyChat = document.querySelector(".chat .inner-body")
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
//End Scroll chat to bottom

//Show Icon Chat
const buttonIcon = document.querySelector(".button-icon")
if (buttonIcon) {
  const tooltip = document.querySelector('.tooltip')
  Popper.createPopper(buttonIcon, tooltip)

  buttonIcon.addEventListener("click", () => {
    tooltip.classList.toggle('shown')
  })
  //Insert Icon To Input 
  const emojiPicker = document.querySelector('emoji-picker')
  const inputChat = document.querySelector(".chat .inner-form input[name='content']")
  emojiPicker.addEventListener("emoji-click", event => {
    const icon = event.detail.unicode
    inputChat.value = inputChat.value + icon
  })

  //Show Typing
  var timeOut;
  inputChat.addEventListener("keyup", () => {
    socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeOut);

    timeOut = setTimeout(() => {
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }, 3000)

  })
}

//End Show Icon Chat

//SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-body .inner-list-typing")

socket.on("SERVER_RETURN_TYPING", (data) => {
  if (data.type == "show") {
    const existTyping = document.querySelector(`.box-typing[user-id='${data.userId}']`)
    if (!existTyping) {
      const boxTyping = document.createElement("div")
      boxTyping.classList.add("box-typing")
      boxTyping.setAttribute("user-id", data.userId)
      boxTyping.innerHTML = `
        <div class='inner-name'>${data.fullName}</div>
        <div class='inner-dots'>
          <span></span>
          <span></span>
          <span></span>
        </div>
      `
      elementListTyping.appendChild(boxTyping)
    }
  } else {
    const boxTyping = document.querySelector(`.box-typing[user-id='${data.userId}']`)
    if (boxTyping) {
      elementListTyping.removeChild(boxTyping)
    }
  }
})
//End SERVER_RETURN_TYPING


