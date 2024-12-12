let token = null
let valAvatar="1"
const loginPage = document.querySelector('.login')
const chatPage = document.querySelector('.chat')
const buttonChoiceAvatar=document.querySelector('.avatarChoice')
const avatarBox = document.querySelector('.avatarBox')
const allAvatar=document.querySelectorAll('.inmputRadioDesign')
const avatarChoiceBox=document.querySelector('.avatarChoiceBox')
const logo=document.querySelector('.logo')
const input=document.querySelector('.username')
input.value=""

let premierMessageIa = {
    author : "Felix",
    content : "Bonjour je suis l'IA"
}
let premierMessageUser = {
    author : "arthur",
    content : `bonjour je suis Arthur.`,
}
let deuxiemeMessageIa = {
    author : "Felix",
    content : "Quelle est ta question ?"
}


let messages = [premierMessageIa, premierMessageUser, deuxiemeMessageIa]

logo.addEventListener('click', ()=>{
    location.reload();
})

allAvatar.forEach((avatarZ,i) => {
    avatarZ.addEventListener("click", () => {
        avatarBox.style.display = "none"
        if(avatarChoiceBox.firstChild){avatarChoiceBox.firstChild.remove()}
        currentAvatar = document.createElement("img")
        currentAvatar.classList.add("currentAvatar")
        currentAvatar.src = `images/avatar${i+1}.png`
        avatarChoiceBox.appendChild(currentAvatar)

    })
})


buttonChoiceAvatar.addEventListener("click", ()=>{
    if(avatarBox.style.display === "none"){
        avatarBox.style.display = "flex"
    }else{
        avatarBox.style.display = "none"
    }
})



async function login(username, password){
    console.log(username, password)
    let params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password,
        })
    }
    return await fetch('https://felix.esdlyon.dev/login', params)
        .then((response) =>  response.json())
        .then((json) => {
            console.log("test",json.token)
            return json.token
        })
}



function displayLoginForm(){

    loginPage.style.display = 'flex'
    chatPage.style.display = 'none'
    loginPage.classList.add("loginDesign")
    let username = document.querySelector('.username')
    let password = document.querySelector('.password')

    let loginButton = document.querySelector('.submitLogin')
    loginButton.addEventListener('click', ()=>{
        let radio=document.querySelectorAll('.inmputRadioDesign')
        radio.forEach((element,i) => {
            if(element.checked){
                valAvatar = i+1;
            }
        })
        login(username.value, password.value).then((data) => {
                token = data
                if(!(token===null||token===undefined)){
                displayChat()
                }
        })


    })

}

function displayMessages(){
    let submitButton = document.querySelector('.chatSubmit')
    let container= document.querySelector('.content')
    container.classList.remove("page")
    container.classList.add("pageChat")
    document.querySelector('.messages').innerHTML = ""
    messages.forEach(message => {
        divMessage = document.createElement('div')
        divMessage.classList.add('message')
        avatar = document.createElement('img')
        avatar.classList.add('profilePictureStyle')
        let paragraphe = document.createElement('span')
        paragraphe.textContent = message.content
        divMessage.appendChild(avatar)
        divMessage.appendChild(paragraphe)


        if(message.author === "Felix")
        {
            avatar.src=`images/avatarFelix.png`
            divMessage.classList.add('felix')
        }else{
            avatar.src=`images/avatar${valAvatar}.png`
            divMessage.classList.add('user')

        }
        document.querySelector('.messages').appendChild(divMessage)
    })
}

function handlePrompt(){

    let prompt = document.querySelector('.prompt')
    let submitButton = document.querySelector('.chatSubmit')

    submitButton.addEventListener('click', ()=>{
        let languageUsed=" en français"
        const inputLanguage=document.querySelectorAll('.inputLanguage')

        inputLanguage.forEach(language => {
            if(language.checked){
                languageUsed=language.value
            }
        })

        addMessageToMessagesArray({
            author : "User",
            content:(prompt.value+languageUsed)
        })

        displayMessages()


        askIa((prompt.value+languageUsed)).then((data) => {
            console.log(prompt.value)
            addMessageToMessagesArray({
                author : "Felix",
                content:data
            })
            displayMessages()
        })

    })
}

let sablier=document.querySelector('.chargement')
async function askIa(prompt) {
    let params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            prompt: prompt,
        })
    }
    sablier.style.display="block"
    return await fetch('https://felix.esdlyon.dev/ollama', params)
        .then(response => response.json())
        .then((json) => {
            sablier.style.display = 'none'
            return json.message

        })


}

function addMessageToMessagesArray(message)
{
    messages.push(message)
}

function displayChat(){
    chatPage.style.display = 'block'
    loginPage.classList.remove("loginDesign")
    loginPage.style.display = 'none'

    displayMessages()
    handlePrompt()
}

const startButton = document.querySelector('.start')

startButton.addEventListener('click', ()=>{
    startButton.style.display='none'

    if(!token){
        displayLoginForm()
    }else{
        displayChat()
        displayMessages()
    }
})

