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

// Streaming and Other stuffs

let Stream_List = []

let currentVideo = {}

function inject_stream(stream) {
    const
        Archived_List = document.getElementById('ArchivedList'),
        LiveList = document.getElementById('LiveList'),
        UpcomingList = document.getElementById('UpcomingList');
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
            li.className = 'col-sm-12 m-1';
            li.innerHTML = `<a onclick="set_reminder('${stream[i].videoId}')" class="list-group-item list-group-item-action d-flex justify-content-between align-items-start">
                                <div class="ms-2 me-auto">
                                    <div class="fw-bold">${stream[i].title}</div>
                                    ${stream[i].category}
                                </div>
                                <span class="badge bg-primary rounded-pill">${stream[i].date}</span>
                                &nbsp;
                                <span class="badge bg-success rounded-pill">Set reminder</span>
                            </a>`;
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
            const stream = data.StreamData;
            inject_stream(stream);
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

if (page_title === 'stream') {
    refreshStreamList()
    disable_enable_comment()
}
removeAlerts()