<template>
    <b-container>
        <b-row class="login justify-content-center">
            <b-col class="col-md-4">
                <b-card-group deck class="mt-4">
                    <b-card header-tag="header" footer-tag="footer">
                        <template #header>
                            <h6 class="mb-0">Inicio de sesión</h6>
                        </template>
                        <b-form @submit.prevent="authenticate">
                            <div class="form-group row">
                                <label for="email">Correo electronico</label>
                                <input
                                    type="email"
                                    v-model="form.email"
                                    class="form-control"
                                    placeholder="Correo Electronico"
                                />
                            </div>
                            <div class="form-group row">
                                <label for="password">Contraseña</label>
                                <input
                                    type="password"
                                    v-model="form.password"
                                    class="form-control"
                                    placeholder="Contraseña"
                                />
                            </div>
                            <div class="form-group row mt-4">
                                <button
                                    type="submit"
                                    class="btn btn-success btn-block"
                                >
                                    Iniciar sesion
                                </button>
                            </div>
                            <div class="form-group row" v-if="authError">
                                <p class="error">{{ authError }}</p>
                            </div>
                        </b-form>
                    </b-card>
                </b-card-group>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { login } from "../../helpers/auth";
export default {
    name: "login",
    data() {
        return {
            form: {
                email: "",
                password: ""
            },
            error: null
        };
    },
    methods: {
        authenticate() {
            this.$store.dispatch("login");

            login(this.form)
                .then(res => {
                    this.$store.commit("loginSuccess", res);
                    this.$router.push("/");
                })
                .catch(error => {
                    this.$store.commit("loginFailed", { error });
                });
        }
    },
    computed: {
        authError() {
            return this.$store.getters.authError;
        }
    }
};
</script>

<style>
.error {
    text-align: center;
    color: brown;
}
</style>
