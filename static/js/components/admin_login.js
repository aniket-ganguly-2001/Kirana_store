const AdminLogin = {
    template: `<div>
    <link rel="stylesheet" type="text/css" href="static/css/login.css">
    <div class="align">
        <div class="container">
            <div class="grid">
                <form id="form" class="form login">
                    <div class="headLine">
                        <h2>Administrator Login</h2>
                    </div>
                    <div class="form__field">
                        <label for="login__username">
                            <i class="bi bi-envelope-fill"></i>
                            <span class="hidden">Email</span>
                        </label>
                        <input v-model="formData.email" autocomplete="email" id="email" type="text"
                            name="email" class="form__input" placeholder="Email" required>
                    </div>
                    <div class="form__field">
                        <label for="login__password">
                            <i class="bi bi-lock-fill"></i>
                            <span class="hidden">Password</span></label>
                            <input v-model="formData.password" autocomplete="current-password" id="password" type="password" 
                                name="password" class="form__input" placeholder="Password" required>
                    </div>
                    <button type="submit" @click.prevent='userLogin' class="btn btn-dark btn-lg pb-3 mt-2">Submit</button>
                </form>
                 <p class="text-center"><router-link to="/"><i class="bi bi-arrow-left"></i> Go back</router-link>
                 </p>
                 <p class="text-center">New user? <router-link to="/signup">Signup <i class="bi bi-arrow-right"></i></router-link>
                 </p>
  
            </div>
  
        </div>
    </div>
  </div>`,
  
    data() {
      return {
        formData: {
          email: "",
          password: "",
        }
      }
    },
    methods: {
      async userLogin() {
        if (this.check()) {
          const dataBuffer = new TextEncoder('utf-8').encode(document.getElementById("password").value)
          const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
          const hashArray = Array.from(new Uint8Array(hashBuffer))
          const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('')
          const get_tuple = await fetch(('/api/user/' + this.formData.email + '/' + hashHex), {
            method: "get",
            headers: { "Content-Type": "application/json" },
          })
          if (get_tuple.status != 404) {
            const tuple = await get_tuple.json()
              localStorage.setItem('email', this.formData.email);
              localStorage.setItem('hash_password', hashHex);
              localStorage.setItem('name', tuple.name)
              localStorage.setItem('login', true)
              return this.$router.push('/admin_dashboard')
          } else {
            alert("Incorrect login credentials!")
          }
        }
      },
      check() {
        var email = document.getElementById("email").value
        var password = document.getElementById("password").value
        if (! /.+@.+\.com$/.test(email)) {
          alert("Invalid email!")
          return false
        }
        if (email.length == 0) {
          alert('Email is required!')
          return false
        }
        if (password.length == 0) {
          alert('Password is required!')
          return false
        }
        if (/ /.test(password) || / /.test(email)) {
          alert("Email/password must not contain spaces!")
          return false
        }
        return true
      }
    },
  
  };
  
  
  export default AdminLogin;