<template>
    <div>
        <template v-if="roleUser">
            <div class="col-12" v-if="medical_patient">
                <center>
                    <h3>Datos y historial del paciente</h3>
                </center>
                <div class="table-reponsive">
                    <table class="table table-dark rounded">
                        <tr>
                            <th>Numero de paciente</th>
                            <td>{{ medical_patient.id }}</td>
                        </tr>
                        <tr>
                            <th>Nombre del paciente</th>
                            <td>{{ medical_patient.name }}</td>
                        </tr>
                        <tr>
                            <th>Genero del paciente</th>
                            <td>{{ medical_patient.gender }}</td>
                        </tr>
                        <tr>
                            <th>Fecha de nacimiento del paciente</th>
                            <td>{{ medical_patient.date_of_birth }}</td>
                        </tr>
                        <tr>
                            <th>Direccion del paciente</th>
                            <td>{{ medical_patient.address }}</td>
                        </tr>
                        <tr>
                            <th>Numero de telefono del paciente</th>
                            <td>{{ medical_patient.phone }}</td>
                        </tr>
                        <tr>
                            <th>Peso del paciente (En Kilogramos)</th>
                            <td>{{ medical_patient.weight }}</td>
                        </tr>
                        <tr>
                            <th>Altura del paciente (En Metros)</th>
                            <td>{{ medical_patient.height }}</td>
                        </tr>
                    </table>
                </div>
                <center>
                    <div
                        class="btn-group mb-2"
                        role="group"
                        aria-label="Basic example"
                    >
                        <button
                            type="button"
                            @click="presionSistolica"
                            class="btn btn-outline-danger"
                        >
                            Presion Sistolica
                        </button>
                        <button
                            type="button"
                            @click="presionDiastolica"
                            class="btn btn-outline-danger"
                        >
                            Presion Diastolica
                        </button>
                        <button
                            type="button"
                            @click="saturacionOxigeno"
                            class="btn btn-outline-danger"
                        >
                            Saturacion de Oxigeno
                        </button>
                        <button
                            type="button"
                            @click="temperatura"
                            class="btn btn-outline-danger"
                        >
                            Temperatura Corporal
                        </button>
                        <button
                            type="button"
                            @click="glucosaPre"
                            class="btn btn-outline-danger"
                        >
                            Glucosa Preprandial
                        </button>
                        <button
                            type="button"
                            @click="glucosaPost"
                            class="btn btn-outline-danger"
                        >
                            Glucosa Postprandial
                        </button>
                    </div>
                </center>
                <template>
                    <div
                        :key="forzar"
                        class="container text-center justify-content-center"
                    >
                        <LineChart v-if="loaded" :chartdata="chartdata" />
                    </div>
                </template>
                <template v-if="observations.length > 0">
                    <div class="alert alert-dark mt-2" role="alert">
                        <h3>Observaciones</h3>
                        <ul>
                            <li
                                v-for="observation in observations"
                                :key="observation.id"
                            >
                                {{ observation }}
                            </li>
                        </ul>
                    </div>
                </template>
                <router-link
                    type="button mb-2"
                    class="btn btn-primary btn-block"
                    to="/medicalPatients"
                    >Regresar</router-link
                >
            </div>
        </template>
        <template v-else>
            <h1>Pagina no encontrada</h1>
        </template>
    </div>
</template>

<script>
import axios from "axios";
// Presion sistolica
import LineChart from "./LineChart";

export default {
    name: "mostrarMedicalPatient",
    components: {
        LineChart,
    },
    created() {
        axios
            .get(`https://pacientescovid2019.transformacionuniversitaria.com/api/medicalPatients/${this.$route.params.id}`, {
                headers: {
                    Authorization: `Bearer ${this.currentUser.token}`,
                },
            })
            .then((response) => {
                this.medical_patient = response.data;
            });
        axios
            .get(`https://pacientescovid2019.transformacionuniversitaria.com/api/healtConditions/${this.$route.params.id}`, {
                headers: {
                    Authorization: `Bearer ${this.currentUser.token}`,
                },
            })
            .then((response) => {
                this.datos = response.data;
                this.datos.forEach((dato) => {
                    this.systolic_pressure.push(dato.systolic_pressure);
                    this.diastolic_pressure.push(dato.diastolic_pressure);
                    this.oxigen_saturation.push(dato.oxigen_saturation);
                    this.temperature.push(dato.temperature);
                    this.fasting_glucose.push(dato.fasting_glucose);
                    this.postprandial_glucose.push(dato.postprandial_glucose);
                    this.observations.push(
                        `${dato.description}  ${dato.created_at}\n`
                    );
                    this.fechaCreacion.push(dato.created_at);
                });
            })
            .catch((error) => {
                console.log(error.response);
            });
        // this.chartdata = userlist;
    },
    data() {
        return {
            medical_patient: null,
            loaded: false,
            chartdata: {
                labels: [],
                datasets: [
                    {
                        label: "",
                        data: [],
                        fill: false,
                        borderColor: "",
                        backgroundColor: "",
                        borderWidth: 1,
                    },
                ],
            },
            datos: null,
            systolic_pressure: [],
            diastolic_pressure: [],
            fechaCreacion: [],
            oxigen_saturation: [],
            temperature: [],
            fasting_glucose: [],
            postprandial_glucose: [],
            observations: [],
            forzar: 0,
        };
    },
    computed: {
        currentUser() {
            return this.$store.getters.currentUser;
        },
    },
    methods: {
        roleUser() {
            if (this.currentUser.role === "doctor") {
                return true;
            } else {
                return false;
            }
        },
        presionSistolica() {
            this.loaded = false;

            this.chartdata.labels = this.fechaCreacion;
            this.chartdata.datasets[0].data = this.systolic_pressure;
            this.chartdata.datasets[0].label = "Presión Sistolica";
            this.chartdata.datasets[0].backgroundColor = "#FF6384";
            this.chartdata.datasets[0].borderColor = "#FF6384";
            this.loaded = true;
            this.forzar++;
        },
        presionDiastolica() {
            this.loaded = false;

            this.chartdata.labels = this.fechaCreacion;
            this.chartdata.datasets[0].data = this.diastolic_pressure;
            this.chartdata.datasets[0].label = "Presión Diastolica";
            this.chartdata.datasets[0].backgroundColor = "#FFCE56";
            this.chartdata.datasets[0].borderColor = "#FFCE56";
            this.loaded = true;
            this.forzar++;
        },
        saturacionOxigeno() {
            this.loaded = false;

            this.chartdata.labels = this.fechaCreacion;
            this.chartdata.datasets[0].data = this.oxigen_saturation;
            this.chartdata.datasets[0].label = "Saturacion de Oxigeno";
            this.chartdata.datasets[0].backgroundColor = "#36A2EB";
            this.chartdata.datasets[0].borderColor = "#36A2EB";
            this.loaded = true;
            this.forzar++;
        },
        temperatura() {
            this.loaded = false;

            this.chartdata.labels = this.fechaCreacion;
            this.chartdata.datasets[0].data = this.temperature;
            this.chartdata.datasets[0].label = "Temperatura";
            this.chartdata.datasets[0].backgroundColor = "#333538";
            this.chartdata.datasets[0].borderColor = "#333538";
            this.loaded = true;
            this.forzar++;
        },
        glucosaPre() {
            this.loaded = false;

            this.chartdata.labels = this.fechaCreacion;
            this.chartdata.datasets[0].data = this.fasting_glucose;
            this.chartdata.datasets[0].label = "Glucosa Preprandial";
            this.chartdata.datasets[0].backgroundColor = "#4BC0C0";
            this.chartdata.datasets[0].borderColor = "#4BC0C0";
            this.loaded = true;
            this.forzar++;
        },
        glucosaPost() {
            this.loaded = false;

            this.chartdata.labels = this.fechaCreacion;
            this.chartdata.datasets[0].data = this.postprandial_glucose;
            this.chartdata.datasets[0].label = "Glucosa Postprandial";
            this.chartdata.datasets[0].backgroundColor = "#FF6384";
            this.chartdata.datasets[0].borderColor = "#FF6384";
            this.loaded = true;
            this.forzar++;
        },
    },
};
</script>

<style></style>
