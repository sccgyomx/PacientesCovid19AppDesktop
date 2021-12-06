<template>
    <b-container>
        <b-row class="justify-content-center">
            <b-col class="col-md-8">
                <template v-if="encontrado">
                    <h1 class="display-5 text-center">
                        Registro de datos vitales
                    </h1>
                    <b-form @submit.prevent="crear">
                        <b-row>
                            <b-col class="col-12 md-2">
                                <div class="form-group">
                                    <div class="row-1" v-if="errors.length > 0">
                                        <div class="w-97">
                                            <ul class="errors-danger">
                                                <li
                                                    v-for="error in errors"
                                                    :key="error.id"
                                                >
                                                    {{ error }}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="row-1">
                                        <label>Presión</label>
                                        <div class="col-sm">
                                            <input
                                                type="number"
                                                class="form-control"
                                                v-model="
                                                    healtCondition.systolic_pressure
                                                "
                                            />
                                        </div>
                                        <label>/</label>
                                        <div class="col-sm">
                                            <input
                                                type="number"
                                                class="form-control"
                                                v-model="
                                                    healtCondition.diastolic_pressure
                                                "
                                            />
                                        </div>
                                    </div>
                                    <div class="row-1">
                                        <label>Saturación de oxigeno</label>
                                        <div class="col-sm">
                                            <input
                                                type="number"
                                                class="form-control"
                                                v-model="
                                                    healtCondition.oxigen_saturation
                                                "
                                            />
                                        </div>
                                    </div>
                                    <div class="row-1">
                                        <label>Temperatura corporal</label>
                                        <div class="col-sm">
                                            <input
                                                type="number"
                                                class="form-control"
                                                v-model="
                                                    healtCondition.temperature
                                                "
                                            />
                                        </div>
                                    </div>
                                    <div class="row-1">
                                        <label
                                            >Glucosa en ayunas
                                            (Preprandial)</label
                                        >
                                        <div class="col-sm">
                                            <input
                                                type="number"
                                                class="form-control"
                                                v-model="
                                                    healtCondition.fasting_glucose
                                                "
                                            />
                                        </div>
                                    </div>
                                    <div class="row-1">
                                        <label
                                            >Glucosa después de una comida
                                            (Postprandial)</label
                                        >
                                        <div class="col-sm">
                                            <input
                                                type="number"
                                                class="form-control"
                                                v-model="
                                                    healtCondition.postprandial_glucose
                                                "
                                            />
                                        </div>
                                    </div>
                                    <div class="row-2">
                                        <label> Observaciones </label>
                                        <div class="col-sm">
                                            <textarea
                                                class="form-control"
                                                rows="3"
                                                v-model="
                                                    healtCondition.description
                                                "
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </b-col>
                        </b-row>
                    </b-form>
                    <div class="w-97">
                        <b-button block variant="success"
                        class="btn-block"
                            @click="enviarDatos"
                        >
                            Guardar datos
                        </b-button>
                    </div>
                </template>
                <template v-else>
                    <h1 class="display-5 text-center">
                        Paciente no encontrado
                    </h1>
                </template>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import axios from "axios";
export default {
    name: "healtConditions",
    data() {
        return {
            healtCondition: {
                description: "",
                systolic_pressure: "",
                diastolic_pressure: "",
                oxigen_saturation: "",
                temperature: "",
                fasting_glucose: "",
                postprandial_glucose: "",
                medical_patients_id: "",
            },
            medical_patient: {},
            encontrado: null,
            activo: false,
            errors: [],
            aux:[],
        };
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
                if (this.currentUser.role === "doctor") {
                    if (this.medical_patient.id === undefined) {
                        this.encontrado = false;
                    } else {
                        this.encontrado = true;
                    }
                } else {
                    if (
                        this.medical_patient.paciente_id == this.currentUser.id
                    ) {
                        this.encontrado = true;
                    } else {
                        this.encontrado = false;
                    }
                }
            });
    },
    computed: {
        currentUser() {
            // console.log(this.$store.getters.currentUser);
            return this.$store.getters.currentUser;
        },
    },
    methods: {
        enviarDatos() {
            this.errors = [];
            this.healtCondition.medical_patients_id = this.medical_patient.id;
            this.validarDatos();

            if (this.errors.length === 0) {
                axios
                    .post("https://pacientescovid2019.transformacionuniversitaria.com/api/healtConditions/new", this.healtCondition, {
                        headers: {
                            Authorization: `Bearer ${this.currentUser.token}`,
                        },
                    })
                    .then((response) => {
                        this.aux=response
                        this.aux=[]
                        if (this.currentUser.role === "doctor") {
                            this.$router.push("/medicalPatients");
                        } else {
                            this.$router.push("/");
                        }
                    })
                    .catch((error) => {
                        console.log(error.response.data);
                    });
            }
        },
    
        validarDatos() {
            //Descripción 

            if (this.healtCondition.description === "") {
                this.errors.push("El campo observaciones está vacío");
            }
            if (this.healtCondition.description.length > 50){
                this.errors.push("La descripción no puede contener más de 50 caracteres");
            }
           //systolic pressure
           
         
            if (this.healtCondition.systolic_pressure === "") {
                this.errors.push("El campo superior de presión está vacío");
            }
            if(this.healtCondition.systolic_pressure.length > 3 || this.healtCondition.systolic_pressure.length<2){
                this.errors.push("Escriba un valor válido");
            }
            
            
           //diastolic pressure
            if (this.healtCondition.diastolic_pressure === "") {
                this.errors.push("El campo superior de presión está vacío");
            }
            //oxigen saturation
            if (this.healtCondition.oxigen_saturation === "") {
                this.errors.push("El campo saturación de oxígeno está vacío");
            }
            //temperature
            if (this.healtCondition.temperature === "") {
                this.errors.push("El campo temperatura corporal está vacío");
            }
            //fasting glucose
            if (this.healtCondition.fasting_glucose === "") {
                this.errors.push("El campo glucosa preprandial está vacío");
            }
            //postprandial_glucose
            if (this.healtCondition.postprandial_glucose === "") {
                this.errors.push("El campo glucosa postprandial está vacío");
            }
        },
    },
};
</script>

<style>
.row-1 {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 0.5rem !important;
    align-items: center;
}
.row-2 {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 0.5rem !important;
    align-items: center;
}
.w-97 {
    width: 100%;
}
.errors-danger {
    color: #761b18;
    background-color: #f9d6d5;
    border: 1px solid;
    border-color: #f7c6c5;
    border-radius: 5px;
    padding-right: 15px;
}
</style>
