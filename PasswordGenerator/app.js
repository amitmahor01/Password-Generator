const passwordButton = document.getElementById('btn-password-generate');
const passOutput = document.getElementById('password-output');


passwordButton.addEventListener('click',(e)=>{
e.preventDefault()

const passLength = Number(document.getElementById('enter-password-length').value);

console.log(passLength);
passOutput.innerText = generatePassword(passLength);

})


function generatePassword(length) {
  if(length>=8 && length <=20){
    
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
  
    return password;
  }
  else{
    return("Length must be between 8-20");
  }
  }
