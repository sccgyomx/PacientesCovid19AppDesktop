<template>
  <main>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-container fluid>
          <b-navbar-brand>Pacientes Covid-19</b-navbar-brand>

          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

          <b-collapse id="nav-collapse" is-nav class="justify-content-between">
            <b-navbar-nav>
              <b-nav-item>
                <router-link class="nav-link" to="/"> Inicio </router-link>
              </b-nav-item>
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="mr-auto">
              <!-- Using 'button-content' slot -->
              <template v-if="!currentUser">
                <b-nav-item>
                  <router-link class="nav-link" to="/login">Login</router-link>
                </b-nav-item>
                <b-nav-item>
                  <router-link class="nav-link" to="/register"
                    >Register
                  </router-link>
                </b-nav-item>
              </template>
              <template v-else>
                <b-nav-item-dropdown right>
                  <!-- Using 'button-content' slot -->
                  <template #button-content>{{ currentUser.name }} </template>
                  <b-dropdown-item>
                    <a @click.prevent="logout" class="dropdown-item">
                      Logout
                      <i class="bi bi-box-arrow-right"></i>
                    </a>
                  </b-dropdown-item>
                </b-nav-item-dropdown>
              </template>
            </b-navbar-nav>
          </b-collapse>
        </b-container>
      </b-navbar>
    </div>

    <div>
      <router-view></router-view>
    </div>
  </main>
</template>

<script>
  export default {
    name: "App",
    methods: {
      logout() {
        this.$store.commit("logout");
        this.$router.push("/login");
      },
    },
    computed: {
      currentUser() {
        // console.log(this.$store.getters.currentUser);
        return this.$store.getters.currentUser;
      },
    },
  };
</script>

<style>
  body {
    background-color: white;
  }
</style>
