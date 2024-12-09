let token = null
const loginPage = document.querySelector('.login')
const chatPage = document.querySelector('.chat')


let premierMessageIa = {
    author : "Felix",
    content : "Bonjour je suis l'IA"
}
let premierMessageUser = {
    author : "arthur",
    content : "bonjour je suis Arthur.",
}
let deuxiemeMessageIa = {
    author : "Felix",
    content : "Quelle est ta question ?"
}


let messages = [premierMessageIa, premierMessageUser, deuxiemeMessageIa]
async function login(username, password, profilePicture){
    console.log(username, password)
    let params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password,
            profilePicture: profilePicture
        })
    }
    profilePicture=params.profilePicture
    return await fetch('https://felix.esdlyon.dev/login', params)
        .then((response) =>  response.json())
        .then((json) => {

            return json.token
        })
}


let photo=""
function displayLoginForm(){

    loginPage.style.display = 'block'
    chatPage.style.display = 'none'
    let profilePicture = document.querySelector('.picture')
    photo=profilePicture
    let username = document.querySelector('.username')
    let password = document.querySelector('.password')
    let loginButton = document.querySelector('.submitLogin')
    loginButton.addEventListener('click', ()=>{

        login(username.value, password.value , profilePicture.value).then((data) => {
            token = data
            displayChat()
            //console.log(token)
        })
    })

}

function displayMessages(){
    document.querySelector('.messages').innerHTML = ""
    messages.forEach(message => {

        divMessage = document.createElement('div')
        divMessage.classList.add('message')
        let profile=document.createElement("img")
        profile.classList.add('profilePictureStyle')
        let paragraphe = document.createElement('p')
        paragraphe.textContent = message.content
        divMessage.appendChild(profile)
        divMessage.appendChild(paragraphe)


        if(message.author === "Felix")
        {
            profile.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVhfSrzFm9YmvHjLxMLy1PrkfEyGkzISV4Jw&s"
            divMessage.classList.add('felix')
        }else{
            console.log(photo.value)
            profile.src=photo.value
            divMessage.classList.add('user')

        }
        document.querySelector('.messages').appendChild(divMessage)
    })



}

function handlePrompt(){
    let prompt = document.querySelector('.prompt')
    let submitButton = document.querySelector('.chatSubmit')

    submitButton.addEventListener('click', ()=>{
        addMessageToMessagesArray({
            author : "User",
            content:prompt.value
        })
        displayMessages()


        askIa(prompt.value).then((data) => {
            console.log(data)
            addMessageToMessagesArray({
                author : "Felix",
                content:data
            })
            displayMessages()
        })
    })
}

async function askIa(prompt)
{
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
    return await fetch('https://felix.esdlyon.dev/ollama', params)
        .then(response => response.json())
        .then((json) => {
            console.log(json)
            return json.message
        })
}

function addMessageToMessagesArray(message)
{
    messages.push(message)
}

function displayChat(){
    chatPage.style.display = 'block'
    loginPage.style.display = 'none'

    displayMessages()
    handlePrompt()
}



if(!token){
    displayLoginForm()
}else{
    displayChat()
    displayMessages()
}