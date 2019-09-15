function checkStatus(res) {
    if (res.status >= 200 && res.status < 300) {
        return res.json();
    } else {
        let err = new Error(res.statusText)
        err.response = res.json();
        throw err
    }
}

const HttpClient = {
    get: (url) => {
        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error('Not authenticated....');
                throw Error(`Request rejected with status ${response.status}`);
            }
        });
    },
    post: (url, bodyObj) => {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyObj)
        }).then(checkStatus)
    }
}

export default HttpClient;