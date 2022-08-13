import axios from 'axios'

const api = axios.create({
    baseURL: 'https://quleap.herokuapp.com',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        'Content-Type': 'application/json',

    },
    timeout: 40000,
    validateStatus: (status: any) => {
        return true;
    },
})

export { api }