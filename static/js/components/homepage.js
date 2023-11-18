const Home = {
  template: `
<div>
  <link rel="stylesheet" type="text/css" href="static/css/home.css">
  <div class="blur"></div>
  <div class="jumbotron center">
    <img src="/static/images/logo.png"/>
    <h1 class="headLine">Welcome to Kirana Store!</h1>
    <p><router-link to='/admin_login' class="btn btn-primary btn-lg" role="button">Administrator Login</router-link></p>
    <p>
      <router-link to='/store_manager_signup' class="btn btn-secondary btn-lg" role="button">Store Manager Signup</router-link>
      <router-link to='/store_manager_login' class="btn btn-secondary btn-lg" role="button">Store Manager Login</router-link>
      <router-link to='/signup' class="btn btn-secondary btn-lg" role="button">New Customer Signup</router-link>
      <router-link to='/customer_login' class="btn btn-secondary btn-lg" role="button">Existing Customer Login</router-link>            
    </p>
  </div>
</div>`,
};

export default Home;
