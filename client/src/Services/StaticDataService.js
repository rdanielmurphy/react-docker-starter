import httpClient from '../Services/HttpClient';

let allData;

const StaticDataService = {
    listeners: [],
    loadData() {
        //return fetch('/api/data')
        return httpClient.get('/api/data')
            .then(data => this.populateData(data.data))
            .catch((e) => {
                console.error(e);
            });
    },
    getData() {
        return allData;
    },
    populateData(data) {
        allData = {};

        data.forEach((obj) => {
            allData[obj.id] = obj;
        });
    }
}

export default StaticDataService;