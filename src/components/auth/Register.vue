<template>
  <div class="container mb-2">
    <div class="login row justify-content-center">
      <div class="col-md-6 mt-4">
        <div v-if="visible == 1" class="alert alert-danger" role="alert">
          <ul>
            <li v-for="error in errors" :key="error.id">
              {{ error }}
            </li>
          </ul>
        </div>
        <div class="card">
          <div class="card-header text-center">
            <h1 class="display-5">Registro</h1>
          </div>
          <div class="card-body">
            <form>
              <div class="form-group row">
                <label for="text">Nombre</label>
                <input
                  type="text"
                  v-model="form.name"
                  class="form-control"
                  placeholder="Nombre"
                />
              </div>
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
              <div class="form-group row">
                <label for="address">Dirección</label>
                <input
                  type="text"
                  v-model="form.address"
                  class="form-control"
                  placeholder="Dirección"
                />
              </div>
              <div class="form-group row">
                <label for="phone">Telefono</label>
                <input
                  type="text"
                  v-model="form.phone"
                  class="form-control"
                  placeholder="Telefono"
                />
              </div>
              <div class="form-group row mt-4">
                <button
                  class="btn btn-success btn-block"
                  @click.prevent="registerbtn"
                >
                  Registrarse
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  export default {
    name: "Registro",
    data() {
      return {
        form: {
          name: "",
          email: "",
          password: "",
          address: "",
          phone: "",
        },
        errors: [],
        visible: 0,
      };
    },
    methods: {
      async registerbtn() {
        this.validar();
        try {
          let response = await axios.post(
            "https://pacientescovid2019.transformacionuniversitaria.com/api/register",
            this.form
          );
          // console.log(response);
          if (response.status === 200) {
            this.$router.push({ path: "/login" });
          } else {
            // console.log("algo salio mal al registrar");
          }
        } catch (error) {
          // console.log(error);
        }
      },
      validar() {
        if (this.form.name.length < 10) {
          this.errors.push(
            "El número mínimo de caracteres debe ser 3 para el atributo Nombre"
          );
        }
        if (this.form.email.length < 10) {
          this.errors.push(
            "El número mínimo de caracteres debe ser 5 para el atributo Correo"
          );
        }
       
        if (this.form.password.length < 8) {
          this.errors.push(
            "El número mínimo de caracteres debe ser 8 para el atributo Contraseña"
          );
        }
        if (this.form.address.length < 10) {
          this.errors.push(
            "El número mínimo de caracteres debe ser 10 para el atributo Dirección"
          );
        }
        if (this.form.phone.length < 10) {
          this.errors.push(
            "El número mínimo de caracteres debe ser 10 para el atributo Teléfono"
          );
        }
        if (this.errors.length > 0) {
          this.visible = 1;
        }
      },
    },
  };
</script>

<style></style>
