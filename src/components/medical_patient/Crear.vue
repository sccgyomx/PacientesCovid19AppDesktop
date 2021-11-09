<template>
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <template v-if="currentUser.role === 'doctor'">
                    <h1 class="display-5 text-center">Registro de paciente</h1>
                    <form @submit.prevent="crear">
                        <div class="row">
                            <div class="col-12 md-2">
                                <div class="form-group">
                                    <label>Nombre</label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        v-model="medicalPatient.name"
                                        placeholder="Nombre"
                                    />
                                </div>
                            </div>
                            <div class="col-12 md-2">
                                <div class="form-group">
                                    <label>Edad</label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        v-model="medicalPatient.age"
                                        placeholder="Edad"
                                    />
                                </div>
                            </div>
                            <div class="col-12 md-2">
                                <div class="form-group">
                                    <label>Genero</label>
                                    <select
                                        class="form-control"
                                        v-model="medicalPatient.gender"
                                    >
                                        <option value="Masculino">
                                            Masculino
                                        </option>
                                        <option value="Femenino">
                                            Femenino
                                        </option>
                                        <option value="No binario">
                                            No binario
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 md-2">
                                <div class="form-group">
                                    <label>Fecha de nacimiento</label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        v-model="medicalPatient.date_of_birth"
                                        placeholder="1997-11-29"
                                    />
                                </div>
                            </div>
                            <div class="col-12 md-2">
                                <div class="form-group">
                                    <label>Dirección</label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        v-model="medicalPatient.address"
                                        placeholder="Dirección"
                                    />
                                </div>
                            </div>
                            <div class="col-12 md-2">
                                <div class="form-group">
                                    <label>Numero de telefono</label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        v-model="medicalPatient.phone"
                                        placeholder="Telefono"
                                    />
                                </div>
                            </div>
                            <div class="col-12 md-2">
                                <div class="form-group">
                                    <label>Peso</label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        v-model="medicalPatient.weight"
                                        placeholder="20 kg"
                                    />
                                </div>
                            </div>
                            <div class="col-12 md-2">
                                <div class="form-group">
                                    <label>Altura</label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        v-model="medicalPatient.height"
                                        placeholder="1.7 mts"
                                    />
                                </div>
                            </div>
                            <div class="col-12 md-2 mb-2">
                                <button
                                    type="submit"
                                    class="btn btn-success btn-block"
                                >
                                    Guardar
                                </button>
                            </div>
                            <div class="col-12 md-2">
                                <router-link
                                    type="button"
                                    class="btn btn-primary btn-block"
                                    to="/medicalPatients"
                                    >Cancelar</router-link
                                >
                            </div>
                        </div>
                    </form>
                    <div class="alert alert-danger mt-4" v-if="errors">
                        <ul>
                            <li
                                v-for="(fieldsError, fieldName) in errors"
                                :key="fieldName"
                            >
                                <strong>{{ fieldName }}</strong>
                                {{ fieldsError.join("\n") }}
                            </li>
                        </ul>
                    </div>
                </template>
                <template>
                    <h1>Esta pagina no esta disponible</h1>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import validate from "validate.js";
import axios from "axios";

export default {
    name: "crearMedicalPatients",
    data() {
        return {
            medicalPatient: {
                name: "",
                age: "",
                gender: "",
                date_of_birth: "",
                address: "",
                phone: "",
                weight: "",
                height: "",
            },
            errors: null,
            aux:[],
        };
    },
    methods: {
        crear() {
            const constrains = this.getConstrains();

            const errors = validate(this.$data.medicalPatient, constrains);

            if (errors) {
                this.errors = errors;
                return;
            }

            axios
                .post("https://pacientescovid2019.transformacionuniversitaria.com/api/medicalPatients/new", this.$data.medicalPatient, {
                    headers: {
                        Authorization: `Bearer ${this.currentUser.token}`,
                    },
                })
                .then((response) => {
                    this.aux=response
                    this.aux=[]
                    this.$router.push("/medicalPatients");
                })
                .catch((error) => {
                    console.log(error.response.data);
                });
        },
        getConstrains() {
            return {
                name: {
                    presence: true,
                    length: {
                        minimum: 4,
                        message: "Por lo menos debe tener 4 caracteres",
                    },
                },
                age: {
                    presence: true,
                    numericality: true,
                    length: {
                        minimum: 1,
                        message: "Por lo menos debe tener 1 digitos",
                    },
                },
                gender: {
                    presence: true,
                    length: {
                        minimum: 1,
                        message: "Selecione una opcion",
                    },
                },
                date_of_birth: {
                    presence: true,

                    format: {
                        pattern: /^\d{4}-\d{2}-\d{2}$/,
                        message: this.isDateFormat(
                            this.medicalPatient.date_of_birth
                        ),
                    },
                },
                address: {
                    presence: true,
                    length: {
                        minimum: 10,
                        message: "Por lo menos debe tener 10 caracteres",
                    },
                },
                phone: {
                    presence: true,
                    numericality: true,
                    length: {
                        minimum: 10,
                        message: "Por lo menos debe tener 10 digitos",
                    },
                },
                weight: {
                    presence: true,
                    numericality: true,
                    length: {
                        minimum: 1,
                        message: "Por lo menos debe tener 1 digitos",
                    },
                },
                height: {
                    presence: true,
                    numericality: true,
                    length: {
                        minimum: 1,
                        message: "Por lo menos debe tener 1 digitos",
                    },
                },
            };
        },
        isValidDate(dateString) {
            var regEx = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateString.match(regEx)) return false; // Invalid format
            var d = new Date(dateString);
            if (Number.isNaN(d.getTime())) return false; // Invalid date
            return d.toISOString().slice(0, 10) === dateString;
        },
        isDateFormat(dateString) {
            if (!dateString) {
                return "No se agrego fecha de nacimiento";
            } else {
                if (!this.isValidDate(dateString)) {
                    return "El formato de fecha no es correcto";
                }
            }
        },
    },
    computed: {
        currentUser() {
            return this.$store.getters.currentUser;
        },
    },
};
</script>

<style></style>
