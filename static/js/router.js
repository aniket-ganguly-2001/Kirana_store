import Home from "./components/homepage.js";
import StoreManagerLogin from "./components/store_manager_login.js";
import CustomerLogin from "./components/customer_login.js";
import Signup from "./components/signup.js";
import StoreManagerSignup from "./components/store_manager_signup.js";
import StoreManagerDashboard from "./components/store_manager_dashboard.js"
import AdminLogin from "./components/admin_login.js";
import AdminDashboard from "./components/admin_dashboard.js";

const router=new VueRouter({
    routes: [
        {path: '/', component: Home},
        {path: '/admin_login', component: AdminLogin},
        {path: '/admin_dashboard', component: AdminDashboard},
        {path: '/store_manager_signup', component: StoreManagerSignup},
        {path: '/store_manager_login', component: StoreManagerLogin},
        {path: '/store_manager_dashboard', component: StoreManagerDashboard},
        {path: '/customer_login', component: CustomerLogin},
        {path: '/signup', component: Signup}
    ]
})

const app=new Vue({
    el: '#app',
    router: router,   
});