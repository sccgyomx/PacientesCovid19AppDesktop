const Home = () => import("./components/Home.vue");

// componentes para medical patients
const MainMP = () => import("./components/medical_patient/Main.vue");
const CrearMP = () => import("./components/medical_patient/Crear.vue");
const ListarMP = () => import("./components/medical_patient/Mostrar.vue");
const VerMP = () => import("./components/medical_patient/Ver.vue");
const Login = () => import("./components/auth/login.vue");
const Register = () => import("./components/auth/Register.vue");
const CrearHC = () => import("./components/medical_patient/HealtCondition.vue");

// rutas
export const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: "Login",
    path: "/login",
    component: Login,
  },
  {
    name: "Registro",
    path: "/register",
    component: Register,
  },

  {
    path: "/medicalPatients",
    component: MainMP,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "/",
        component: ListarMP,
      },
      {
        path: "new",
        component: CrearMP,
      },
      {
        path: "healtConditions:id",
        component: CrearHC,
      },
      {
        path: ":id",
        component: VerMP,
      },
    ],
  },
];
