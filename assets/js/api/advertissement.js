import axiosClient from './axiosClient';

const apiAdvertissement = {
    create(data) {
        return axiosClient.post("/api/advertissements", data);
    },
    getAll() {
        return axiosClient.get("/api/advertissements");
    },
};

export default apiAdvertissement;
