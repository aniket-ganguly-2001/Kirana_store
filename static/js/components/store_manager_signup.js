const StoreManagerSignup = {
  template: `<div>
    <link rel="stylesheet" type="text/css" href="static/css/login.css">
    <div class="align">
        <div class="container">
            <div class="grid">
                <form id="form" class="form login">
                      <div class="headLine">
                          <h2>Apply as a New Store Manager</h2>
                      </div>
                      <div class="form__field">
                        <label for="login__name">
                            <i class="bi bi-person-fill"></i>
                            <span class="hidden">Name</span>
                        </label>
                        <input v-model="formData.name" id="name" type="text"
                            name="name" class="form__input" placeholder="Name" required>
                        </div>
                      <div class="form__field">
                          <label for="login__email">
                            <i class="bi bi-envelope-fill"></i>
                            <span class="hidden">Email</span>
                          </label>
                        <input v-model="formData.email" autocomplete="email" id="email" type="text"
                            name="email" class="form__input" placeholder="Email ID" required>
                    </div>
                    <div class="form__field">
                        <label for="login__password">
                            <i class="bi bi-lock-fill"></i>
                            <span class="hidden">Password</span></label>
                        <input v-model="formData.password" autocomplete="new-password" id="password" type="password" 
                            name="password" class="form__input" placeholder="Password" required>
                    </div>
                    <div class="form__field">
                        <label for="login_confirm_password">
                            <i class="bi bi-lock-fill"></i>
                            <span class="hidden">Confirm Password</span></label>
                        <input v-model="formData.confirm_password" autocomplete="new-password" id="confirm_password" type="password"
                            name="confirm_password" class="form__input" placeholder="Confirm Password" required>
                    </div>
                    <button type="submit" @click.prevent='signupUser' class="btn btn-dark btn-lg pb-3 mt-2">Submit</button>
                </form>
                <p class="text-center"><router-link to="/"><i class="bi bi-arrow-left"></i> Go back</router-link>
                </p>
                <p class="text-center">Already have an account? <router-link to="/user_login">Login <i class="bi bi-arrow-right"></i></router-link>
                </p>
  
            </div>
  
        </div>
    </div>
  </div>`,
  data() {
    return {
      formData: {
        name: "",
        email: "",
        password: "",
      }
    }
  },
  methods: {
    async signupUser() {
      if (this.check()) {
        const dataBuffer = new TextEncoder('utf-8').encode(this.formData.password)
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('')
        const res = await fetch('/api/queue', {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: this.formData.name,
            email: this.formData.email,
            password: hashHex
          })
        })
        if (res.status != 409) {
          const data = await res.json()
          if (res.ok) {
            alert('Account created succesfully! Please wait for the administrator to approve your account!')
            return this.$router.push('/customer_login')
          } else {
            alert(data.message)
          }
        }
        else {
          alert('You have already requested for an account. Please wait till it is approved by the administrator!')
        }
      }
    },
    check() {
      var name = document.getElementById("name").value
      var email = document.getElementById("email").value
      var password = document.getElementById("password").value
      var confirm_password = document.getElementById("confirm_password").value
      if (! /.+@.+\.com$/.test(email)) {
        alert("Invalid email!")
        return false
      }
      if (name.length == 0) {
        alert('Name is required!')
        return false
      }
      if (email.length == 0) {
        alert('Email is required')
        return false
      }
      if (password.length == 0) {
        alert('Password is required!')
        return false
      }
      if (confirm_password.length == 0) {
        alert('Please re-type your password for confirmation!')
        return false
      }
      if (/ /.test(password) || / /.test(confirm_password) || / /.test(email)) {
        alert("Email/password must not contain spaces!")
        return false
      }
      if (password == confirm_password) {
        return true
      } else {
        alert("Passwords do not match!")
        return false
      }
    }
  }
};

export default StoreManagerSignup;