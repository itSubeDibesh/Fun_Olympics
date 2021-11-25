$(document).ready(function () {
    $('.table').DataTable(
        {
            responsive: true
        }
    );
});

// Static Config Elements
let config = {
    timeout: 5e3,
    password_field: ["password", "retype"],
    alertList: document.querySelectorAll(".alert")
}

// Dynamic Config Elements 
var page_title = document.querySelector("head > title").innerText.split('|')[0].trim().toLowerCase();


// Creates Html Out of String
function htmlToElem(html) {
    let temp = document.createElement('template');
    html = html.trim(); // Never return a space text node as a result
    temp.innerHTML = html;
    return temp.content.firstChild;
}

// Show Hide Password 
if (page_title == 'login' || page_title == 'register') {
    document.getElementById("showPassword").addEventListener("click", () => {
        let existingId = []
        for (let i = 0; i < config.password_field.length; i++) {
            const element = document.getElementById(config.password_field[i])
            if (element != null) {
                existingId.push(element)
            }
        }
        existingId.forEach(element => {
            if (element.type == "password") {
                element.type = "text";
            } else {
                element.type = "password";
            }
        });
    });
}

//  Removing Alerts After Interval
function removeAlerts() {
    config.alertList.forEach(element => {
        if (!element.classList.contains("alert-fixed")) {
            var bsAlert = new bootstrap.Alert(element);
            setTimeout(() => { bsAlert.close(); }, config.timeout)
        }
    });
}

removeAlerts()