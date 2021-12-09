const table = document.getElementsByTagName("table");
if (table) {
    $(document).ready(function () {
        $('table').DataTable(
            {
                responsive: true
            }
        );
    });
}


// Profanity Section
const modal = document.getElementById("AddWordModal");

if (modal) {
    let myModal = new bootstrap.Modal(modal, {
        keyboard: false
    })
    const url = window.location.href;
    const action = url.substring(url.lastIndexOf('/') + 1);
    if (action.includes('add') || action.includes('edit')) {
        myModal.show()
    }
    modal.addEventListener('hidden.bs.modal', function (e) {
        window.location.replace('/profanity')
    });
}

// Implementing Ckeditor
let ckEditor = document.getElementsByClassName("editor");
if (ckEditor !== null) {
    for (let i = 0; i < ckEditor.length; i++) {
        ClassicEditor.create(ckEditor[i]);
    }
}

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
if (page_title == 'login' || page_title == 'register' || page_title == 'users - add') {
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

if (page_title == 'users - edit') {
    const disabled = document.getElementById('disabled');
    disabled.addEventListener("click", () => {
        disabled.checked ? disabled.value = 'true' : disabled.value = 'false';
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

const inject_stream = (stream) => {
    const
        Archived_List = document.getElementById('ArchivedList'),
        LiveList = document.getElementById('LiveList'),
        UpcomingList = document.getElementById('UpcomingList');
    LiveList.innerHTML = '';
    UpcomingList.innerHTML = '';
    ArchivedList.innerHTML = '';
    for (let i = 0; i < stream.length; i++) {
        if (stream[i].type === 'Live') {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-start';
            li.innerHTML = `<div class="ms-2 me-auto">
                                    <div class="fw-bold">${stream[i].title}</div>
                                    ${stream[i].category}
                                </div>
                                <button onclick='load("${stream[i].videoId}")' class="btn btn-sm"><span class="badge bg-success rounded-pill">Watch Now</span></button>`;
            LiveList.appendChild(li);
        }
        else if (stream[i].type === 'Upcoming') {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-start';
            li.innerHTML = `<div class="ms-2 me-auto">
                                    <div class="fw-bold">${stream[i].title}</div>
                                    ${stream[i].category}
                                </div>
                                <span class="badge bg-primary rounded-pill">${stream[i].date}</span>
                                &nbsp;
                                <span class="badge bg-success rounded-pill">Set reminder</span>`;
            UpcomingList.appendChild(li);
        }
        else if (stream[i].type === 'Archived') {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-start';
            li.innerHTML = `<div class="ms-2 me-auto">
                                    <div class="fw-bold">${stream[i].title}</div>
                                    ${stream[i].category}
                                </div>
                                <span class="badge bg-danger rounded-pill">${stream[i].date}</span>
                                &nbsp;
                            <button onclick='load("${stream[i].videoId}")' class="btn btn-sm"><span class="badge bg-success rounded-pill">Watch Now</span></button>`;
            Archived_List.appendChild(li);
        }
    }
}

const load = (videoId) => {
    console.log(videoId);
    const player = document.getElementById('player');
    player.innerHTML = ''
    player.innerHTML = `<iframe height="450" src="https://www.youtube.com/embed/${videoId}?rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen" allowfullscreen></iframe>`
}

removeAlerts()