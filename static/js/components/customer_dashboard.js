const CustomerDashboard = {
    template: `<div>
    <link rel="stylesheet" type="text/css" href="static/css/dashboard.css">
        <nav class="navbar navbar-expand-lg navbar-dark">
            <div class="container">
                <a class="navbar-brand"><img src="./static/images/logo.png" width="5" height="5" alt=""></a>
                <h2>Welcome {{customer}}</h2>
                <div class="position-relative top-0 end-0">
                    <p>
                        <button type="button" class="btn btn-info" style="color: rgb(81, 87, 47); text-decoration: none;" @click.prevent="profile">Profile<i class="bi bi-person-circle"></i></button>
                        <button type="button" class="btn btn-info" style="color: rgb(81, 87, 47); text-decoration: none;" @click.prevent="goToCart">Go to Cart<i class="bi bi-cart4"></i></button>
                        <button type="button" class="btn btn-info" style="color: rgb(81, 87, 47); text-decoration: none;" @click.prevent="logout">Logout<i class="bi bi-box-arrow-right"></i></button>
                    </p>
                </div>
            </div>
        </nav>
        </div>`,
    data() {
        return {
            customer: localStorage.name,
            customer_id: "",
            itemData: {},
            catData: {}
        }
    },
    methods: {
        async logout() {
            const res = await fetch('/logout', { method: 'GET' })
            const data = await res.json()
            console.log(data.json())
            if (res.ok) {
                window.localStorage.clear()
                alert(data)
                return this.$router.push('/')
            }
        }
    },
    async beforeCreate(){
        if (localStorage.getItem('login') === null) {
            return this.$router.push('/customer_login')
        } else {
            const res = await fetch('/api/show', {
                method: "get",
                headers: { "Content-Type": "application/json" }
            })
            const data = await res.json()
            if (data.length != 0) {
                this.showData = data
            }
            const theatre = await fetch('api/theatre', {
                method: "get",
                headers: { "Content-Type": "application/json" }
            })
            const tdata = await theatre.json()
            if (tdata.length != 0) {
                this.theatreData = tdata
            }
            this.user_id = localStorage.getItem('user_id')
        }
    }
}
export default CustomerDashboard;