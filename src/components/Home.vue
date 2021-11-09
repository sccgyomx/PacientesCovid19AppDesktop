<template>
    <b-container>
        {{ patient.length }}
        <b-conatiner v-if="currentUser.role === 'doctor'">
            <b-row class="justify-content-center">
                <b-col class="col-md-12">
                    <h1 class="display-5">Listado de acciones</h1>
                            <router-link class="lista-groupo-item" to="/medicalPatients">
                                Ver todos los pacientes
                            </router-link>
                    
                </b-col>
            </b-row>
        </b-conatiner>

        <!-- logica para el paciente -->
        <b-container v-if="currentUser.role === 'patient'">
            <b-row class="justify-content-center">
                <b-col class="col-md-12">
                    <template v-if="existe">
                        <h1 class="display-5">Datos del paciente</h1>
                        <div class="table-reponsive">
                            <table class="table table-dark rounded">
                                <tr>
                                    <th>Numero de paciente</th>
                                    <td>
                                        {{ patient.id }}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Nombre del paciente</th>
                                    <td>
                                        {{ patient.name }}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Genero del paciente</th>
                                    <td>
                                        {{ patient.gender }}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Fecha de nacimiento del paciente</th>
                                    <td>
                                        {{ patient.date_of_birth }}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Direccion del paciente</th>
                                    <td>
                                        {{ patient.address }}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Numero de telefono del paciente</th>
                                    <td>
                                        {{ patient.phone }}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Peso del paciente (En Kilogramos)</th>
                                    <td>
                                        {{ patient.weight }}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Altura del paciente (En Metros)</th>
                                    <td>
                                        {{ patient.height }}
                                    </td>
                                </tr>
                            </table>

                            <router-link
                                :to="`/medicalPatients/healtConditions${patient.id}`"
                                class="btn btn-warning btn-block mb-2 mt-2"
                            >
                                Agregar signos vitales
                            </router-link>
                        </div>
                    </template>
                    <template v-else>
                        <h1 class="display-5">Buscar Paciente</h1>
                        <label for=""> Introdusca su numero de paciente </label>
                        <p></p>
                        <label for="">
                            El cual le proporcionado por el medico
                        </label>
                        <b-form>
                            <div class="form-group mt-4">
                                <input
                                    class="form-control mr-sm-2"
                                    type="text"
                                    placeholder="Numero de paciente"
                                    aria-label="Search"
                                    v-model="numberPatient"
                                />
                            </div>
                            <button
                                class="btn btn-outline-success mt-4"
                                type="button"
                                @click="buscarMyPatient"
                            >
                                Buscar
                            </button>
                            <div
                                v-if="errors.length > 0"
                                class="alert alert-danger mt-2 mb-2"
                                role="alert"
                            >
                                <ul>
                                    <li v-for="error in errors" :key="error.id">
                                        {{ error }}
                                    </li>
                                </ul>
                            </div>
                        </b-form>

                        <template v-if="medical_patient != null">
                            <div class="table-reponsive mt-2 mb-2">
                                <table class="table table-dark rounded">
                                    <tr>
                                        <th>Numero de paciente</th>
                                        <td>
                                            {{ medical_patient.id }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Nombre del paciente</th>
                                        <td>
                                            {{ medical_patient.name }}
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <button
                                class="btn btn-success btn-block"
                                type="button"
                                @click="sincronizar"
                            >
                                Sincronizar
                            </button>
                        </template>
                    </template>
                </b-col>
            </b-row>
        </b-container>
    </b-container>
</template>

<script>
import axios from "axios";
export default {
    name: "Home",
    created() {
        axios
            .get(`https://pacientescovid2019.transformacionuniversitaria.com/api/search/${this.currentUser.id}`, {
                headers: {
                    Authorization: `Bearer ${this.currentUser.token}`,
                },
            })
            .then((response) => {
                
                 if (
                    response.data.name === undefined ||
                    response.data.id === undefined
                ) {
                    this.existe=false;
                } else {
                    this.patient = response.data;
                    this.existe=true;
                }
            });
    },
    data() {
        return {
            patient: {},
            numberPatient: null,
            medical_patient: null,
            errors: [],
            existe:false,
        };
    },
    computed: {
        currentUser() {
            // console.log(this.$store.getters.currentUser);
            return this.$store.getters.currentUser;
        },
    },
    methods: {
        buscarMyPatient() {
            this.errors = [];
            if (this.numberPatient != null) {
                if (this.validarEntrada(this.numberPatient)) {
                    axios
                        .get(`https://pacientescovid2019.transformacionuniversitaria.com/api/medicalPatients/${this.numberPatient}`, {
                            headers: {
                                Authorization: `Bearer ${this.currentUser.token}`,
                            },
                        })
                        .then((response) => {
                            if (
                                response.data.name === undefined ||
                                response.data.id === undefined
                            ) {
                                this.errors.push(
                                    "Compruebe si su numero de paciente es correcto"
                                );
                            } else {
                                this.medical_patient = response.data;
                            }
                        });
                } else {
                    this.errors.push(
                        "El valor introducido debe ser un numero entero"
                    );
                }
            } else {
                this.errors.push("Debe llenar el campo");
            }
        },

        validarEntrada(entrada) {
            let valoresAceptados = /^[0-9]+$/;
            if (entrada.match(valoresAceptados)) {
                return true;
            } else {
                return false;
            }
        },

        async sincronizar() {
            this.medical_patient.paciente_id = this.currentUser.id;
            console.log(this.medical_patient);
            axios
                .post("https://pacientescovid2019.transformacionuniversitaria.com/api/medicalPatients/update", this.medical_patient, {
                    headers: {
                        Authorization: `Bearer ${this.currentUser.token}`,
                    },
                })
                .then((response) => {
                    console.log(response.data);
                    if (response.status === 200) {
                        this.patient = response.data;
                    } else {
                        console.log("algo salio mal al registrar");
                    }
                })
                .catch((error) => {
                    console.log(error.response.data);
                });
        },
    },
};
</script>

<style>
.lista-groupo-item {
    position: relative;
    display: block;
    padding: 0.75rem 1.25rem;
    border: 1px solid rgba(0, 0, 0, 0.125);
    border-radius: 5px;
    background-color: #343a40 !important;
    color: white !important;
    text-decoration: none;
}
.w-80 {
    width: 80% !important;
}
table {
    display: table;
    text-indent: initial;
    border-spacing: 2px;
    border-color: gray;
}
.table-dark {
    color: #fff;
    background-color: #212529;
}
.table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 1rem;
}

.table-dark td, .table-dark th, .table-dark thead th {
    border-color: #32383e;
}
.table-dark td, .table-dark th, .table-dark thead th {
    border-color: #32383e;
}

.table thead th {
    vertical-align: bottom;
    border-bottom: 2
px
 solid #dee2e6;
}
.table td, .table th {
    padding: 0.75rem;
    border-top: 1px solid #dee2e6;
}
th {
    text-align: inherit;
}
*, ::after, ::before {
    box-sizing: border-box;
}
th {
    display: table-cell;
    font-weight: bold;
}
</style>
