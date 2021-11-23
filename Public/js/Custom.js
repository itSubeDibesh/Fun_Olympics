document.getElementById("showPassword").addEventListener("click", ()=>{
    const _field = ["password","retype"]
    let id= []
    for(let i=0; i<_field.length; i++){
        id.push(document.getElementById(_field[i]))
    }
    id.forEach(element => {
        if(element.type == "password"){
            element.type = "text";
        } else {
            element.type = "password";
        }
    });
});