import { getLocalUser } from "./helpers/auth";
import axios from "axios";

const user = getLocalUser();

export default {
  state: {
    currentUser: user,
    isLoggedIn: !!user,
    loading: false,
    auth_error: null,
    medical_patients: [],
  },
  getters: {
    isLoading(state) {
      return state.loading;
    },
    isLoggedIn(state) {
      return state.isLoggedIn;
    },
    currentUser(state) {
      return state.currentUser;
    },
    authError(state) {
      return state.auth_error;
    },
    medical_patients(state) {
      return state.medical_patients;
    },
  },
  mutations: {
    login(state) {
      state.loading = true;
      state.auth_error = null;
    },
    loginSuccess(state, payload) {
      state.auth_error = null;
      state.isLoading = true;
      state.loading = false;
      state.currentUser = Object.assign({}, payload.user, {
        token: payload.access_token,
      });

      localStorage.setItem("user", JSON.stringify(state.currentUser));
    },
    loginFailed(state, payload) {
      state.loading = false;
      state.auth_error = payload.error;
    },
    logout(state) {
      localStorage.removeItem("user");
      state.isLoggerIn = false;
      state.currentUser = null;
    },
    updateMedicalPatients(state, payload) {
      state.medical_patients = payload;
    },
  },
  actions: {
    login(context) {
      context.commit("login");
    },
    getMedicalPatients(context) {
      axios
        .get(
          "https://pacientescovid2019.transformacionuniversitaria.com/api/medicalPatients",
          {
            headers: {
              Authorization: `Bearer ${context.state.currentUser.token}`,
            },
          }
        )
        .then((response) => {
          context.commit("updateMedicalPatients", response.data);
        });
    },
  },
};
