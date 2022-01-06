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
    config.alertList = document.querySelectorAll(".alert");
    config.alertList.forEach(element => {
        if (!element.classList.contains("alert-fixed")) {
            var bsAlert = new bootstrap.Alert(element);
            setTimeout(() => { bsAlert.close(); }, config.timeout)
        }
    });
}

// Streaming and Other stuffs

let Stream_List = []

let currentVideo = {}

let todays_reminder = []

function inject_stream(data) {
    const
        stream = data.StreamData,
        reminder = data.ReminderData,
        Archived_List = document.getElementById('ArchivedList'),
        LiveList = document.getElementById('LiveList'),
        UpcomingList = document.getElementById('UpcomingList'),
        UserEmail = document.getElementById('userEmail');
    LiveList.innerHTML = '';
    UpcomingList.innerHTML = '';
    ArchivedList.innerHTML = '';
    Stream_List = stream;
    for (let i = 0; i < stream.length; i++) {
        if (stream[i].type === 'Live') {
            const li = document.createElement('div');
            li.className = 'col-sm-12 m-1';
            li.innerHTML = `<a onclick="load('${stream[i].videoId}')" class="list-group-item list-group-item-action d-flex justify-content-between align-items-start">
                                <div class="ms-2 me-auto">
                                    <div class="fw-bold">${stream[i].title}</div>
                                    ${stream[i].category}
                                </div>
                                <span class="badge bg-success rounded-pill">Watch Now</span>
                            </a>`;
            LiveList.appendChild(li);
        }
        else if (stream[i].type === 'Upcoming') {
            const li = document.createElement('div');
            if (reminder.length > 0) {
                for (let j = 0; j < reminder.length; j++) {
                    li.className = 'col-sm-12 m-1';
                    if (reminder[j].date == new Date().toISOString().split('T')[0]) {
                        todays_reminder.push(reminder[j])
                    }
                    if (reminder[j].videoId == stream[i].videoId && reminder[j].email == UserEmail.value) {
                        li.innerHTML = `<a onclick="reminderAdded('${stream[i].videoId}')" class="list-group-item list-group-item-action d-flex justify-content-between align-items-start">
                            <div class="ms-2 me-auto">
                                <div class="fw-bold">${stream[i].title}</div>
                                ${stream[i].category}
                            </div>
                            <span class="badge bg-primary rounded-pill">${stream[i].date}</span>
                        </a>`;
                    } else {
                        li.innerHTML = `<a onclick="set_reminder('${stream[i].videoId}')" class="list-group-item list-group-item-action d-flex justify-content-between align-items-start">
                                        <div class="ms-2 me-auto">
                                            <div class="fw-bold">${stream[i].title}</div>
                                            ${stream[i].category}
                                        </div>
                                        <span class="badge bg-primary rounded-pill">${stream[i].date}</span>
                                        &nbsp;
                                        <span class="badge bg-success rounded-pill">Set reminder</span>
                                    </a>`;
                    }
                    UpcomingList.appendChild(li);
                }
            } else {
                li.innerHTML = `<a onclick="set_reminder('${stream[i].videoId}')" class="list-group-item list-group-item-action d-flex justify-content-between align-items-start">
                                        <div class="ms-2 me-auto">
                                            <div class="fw-bold">${stream[i].title}</div>
                                            ${stream[i].category}
                                        </div>
                                        <span class="badge bg-primary rounded-pill">${stream[i].date}</span>
                                        &nbsp;
                                        <span class="badge bg-success rounded-pill">Set reminder</span>
                                    </a>`;
            }
            UpcomingList.appendChild(li);
        }
        else if (stream[i].type === 'Archived') {
            const li = document.createElement('div');
            li.className = 'col-sm-12 m-1';
            li.innerHTML = `<a onclick="load('${stream[i].videoId}')" class="list-group-item list-group-item-action d-flex justify-content-between align-items-start">
                                <div class="ms-2 me-auto">
                                    <div class="fw-bold">${stream[i].title}</div>
                                    ${stream[i].category}
                                </div>
                                <span class="badge bg-danger rounded-pill">${stream[i].date}</span>
                                &nbsp;
                                <span class="badge bg-success rounded-pill">Watch Now</span>
                            </a>`;
            Archived_List.appendChild(li);
        }
    }
    show_reminder()

}

function show_reminder() {
    if (todays_reminder.length > 0) {
        for (let i = 0; i < todays_reminder.length; i++) {
            dom_alert(
                message = `You have a reminder: <a href="/stream?videoId=${todays_reminder[i].videoId}">${todays_reminder[i].title}</a>`,
                type = "primary",
                fixed = true
            )
        }
    }
}


function get_video_details(videoId) {
    for (let i = 0; i < Stream_List.length; i++) {
        if (Stream_List[i].videoId === videoId) {
            return Stream_List[i]
        }
    }
}

function disable_enable_comment() {
    const
        comment = document.getElementById('comment'),
        comment_button = document.getElementById('comment_button');
    if (currentVideo.videoId) {
        if (comment.attributes.disabled) {
            comment.attributes.removeNamedItem('disabled');
            comment_button.attributes.removeNamedItem('disabled');
        }
    }
    else {
        comment.attributes.setNamedItem(document.createAttribute('disabled'));
        comment_button.attributes.setNamedItem(document.createAttribute('disabled'));
    }
}

function refreshStreamList() {
    fetch('/stream/initial')
        .then(response => response.json())
        .then(data => {
            inject_stream(data);
        })
}

function load(videoId) {
    const
        video_details = get_video_details(videoId),
        player = document.getElementById('player'),
        stream_title = document.getElementById('stream_title'),
        stream_type = document.getElementById('stream_type');

    load_comments(videoId);
    currentVideo = video_details;
    stream_type.innerHTML = ''
    stream_title.innerHTML = ''
    player.innerHTML = ''

    if (video_details.type === 'Live') {
        stream_type.innerHTML = 'Live <div class="spinner-grow spinner-grow-sm text-danger" role="status"><span class="visually-hidden">Live</span></div>'
    }
    else if (video_details.type === 'Upcoming') {
        stream_type.innerHTML = 'Upcoming <i class="bi bi-camera-reels-fill"></i>'
    }
    else if (video_details.type === 'Archived') {
        stream_type.innerHTML = 'Archived <i class="bi bi-projector-fill"></i>'
    }

    disable_enable_comment()
    stream_title.innerHTML = video_details.title;
    player.innerHTML = `<iframe height="450" src="https://www.youtube.com/embed/${video_details.videoId}?rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen" allowfullscreen></iframe>`
}

function set_reminder(video_id) {
    const
        video_details = get_video_details(video_id);
    const data = {
        video_id: video_details.videoId,
        title: video_details.title,
        date: video_details.date,
        type: video_details.type
    }
    fetch('/stream/reminder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                dom_alert('Reminder set for ' + video_details.title, type = 'success')
            }
        }).catch(err => {
            if (err)
                dom_alert(message = 'Problem setting reminder, please try again later.', type = 'danger', fixed = false)
        })
        .finally(() => refreshStreamList())
}

function reminderAdded(video_id) {
    if (video_id) {
        const video_details = get_video_details(video_id);
        dom_alert(message = 'Reminder already set for ' + video_details.title, type = 'warning', fixed = false)
    }
}

function submit_comment(event) {
    event.preventDefault();
    const
        comment = document.getElementById('comment')
    if (comment.value.length > 0) {
        const data = {
            video_id: currentVideo.videoId,
            comment: comment.value,
            title: currentVideo.title,
        }
        fetch('/stream/comment', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.status) {
                    comment.value = '';
                    refreshStreamList();
                    load_comments(currentVideo.videoId);
                }
                else {
                    alert(data.message);
                }
            })
    }
    return false;
}

function timeStampToDate(timeStamp) {
    const date = new Date(timeStamp), monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], day = date.getDate(), monthIndex = date.getMonth(), year = date.getFullYear(), hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();
    return day + ' ' + monthNames[monthIndex] + ' ' + year + ' ' + hours + ':' + minutes + ':' + seconds;
}

function load_comments(video_id) {
    const url = `/stream/comment?video_id=${video_id}`
    const comment_list = document.getElementById('comment_list')
    comment_list.innerHTML = ''
    fetch(url)
        .then(response => response.json())
        .then(data => {
            for (let index = 0; index < data.comments.length; index++) {
                const comment = data.comments[index];
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-start';
                li.innerHTML = `<div class="ms-2 me-auto">             
                                <div class="fw-bold">
                                    ${comment.comment}
                                </div>
                                    ${comment.email}
                                </div>
                                <span class="badge bg-primary rounded-pill">${timeStampToDate((comment.createdAt))}</span>
                                `;
                comment_list.appendChild(li);
            }
        })
}

function dom_alert(message, type = "success", fixed = false) {
    const alert_dom = document.getElementById('alert_dom');
    const alert = `
        <div class ='alert alert-${type} ${fixed ? 'alert-fixed alert-dismissible' : 'alert-dismissible'}  fade show d-flex align-items-center' role='alert'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                class="bi bi-check-circle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="${type}:">
                <path
                    d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
                <div>
                ${message}
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    alert_dom.appendChild(htmlToElem(alert));
    removeAlerts()
}

if (page_title === 'stream') {
    // Extract video id from url 
    const videoId = window.location.href.split('/').pop().split('?')[1];
    if (videoId !== undefined) {
        if (videoId.includes('videoId')) {
            const exact_id = videoId.split('=')[1];
            refreshStreamList()
            setTimeout(() => {
                load(exact_id)
            }, 1000)
        } else {
            refreshStreamList()
            disable_enable_comment()
        }
    } else {
        refreshStreamList()
        disable_enable_comment()
    }
}

removeAlerts()