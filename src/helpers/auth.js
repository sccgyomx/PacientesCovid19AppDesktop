import axios from "axios";

export function login(credentials) {
    return new Promise((res, rej) => {
        axios
            .post("https://pacientescovid2019.transformacionuniversitaria.com/api/auth/login", credentials)
            .then(response => {
                res(response.data);
            })
            .catch(err => {
                rej("Datos incorrectos");
                console.log(err.data);
            });
            
    });
}

export function getLocalUser() {
    const userStr = localStorage.getItem("user");

    if (!userStr) {
        return null;
    }

    return JSON.parse(userStr);
}
