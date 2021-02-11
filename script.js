function login() {
    username = document.getElementById('field-username');
    password = document.getElementById('field-password');

    postLogin(username, password).then(data => {
        console.log(data);
    });

    getTimetable().then(data => {
        console.log(data);
    });
}

async function postLogin(username, password) {
    // Default options are marked with *
    const response = await fetch('https://access.adelaide.edu.au/sa/login.asp', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'no-cors', // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': 'https://access.adelaide.edu.au/sa/',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: `UID=${username}&PASS=${password}`
    });
    return response;
}



async function getTimetable() {
    // Default options are marked with *
    const response = await fetch('https://access.adelaide.edu.au/sa/student/Week.asp?career=UGRD&term=4120', {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'no-cors', // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Referer': 'https://access.adelaide.edu.au/sa/',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // redirect: 'follow', // manual, *follow, error
        // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response;
}