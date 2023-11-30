const AdminDashboard = {
    template: `
    <div>
        <link rel="stylesheet" type="text/css" href="static/css/dashboard.css">
        <nav class="navbar navbar-expand-lg navbar-dark">
            <div class="container">
                <a class="navbar-brand"><img src="./static/images/logo.png" width="5" height="5" alt=""></a>
                <h2>Welcome Admin!</h2>
                <div class="position-relative top-0 end-0">
                    <p class="btn btn-info" role="button" style="color: rgb(81, 87, 47); text-decoration: none;" @click.prevent="logout">Logout <i class="bi bi-box-arrow-right"></i></p>
                </div>
            </div>
        </nav>
        <div>
    <div v-if="managerData.length === 0">
        <h1><em>No managers found in the queue</em></h1>
    </div>
    <div v-else class="row row-text-center">
        <div class="col-sm-3 mb-2 mb-sm-0" v-for="manager in managerData" :key="manager.sl_no">
            <div class="card w-75 mb-3" style="width: 18rem;">
                <div class="card-header">
                    <h3 class="card-title text-center"><strong>{{ manager.name }}</strong></h3>
                </div>
                <div class="card-body">
                    <p>Email: {{ manager.email }}</p>
                    <button class="btn btn-info btn-sm" @click.prevent="approve(manager)">
                        Approve <i class="bi bi-patch-check-fill"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

            </div>
        </div>    
    </div>`,

    data() {
        return {
            managerData: [{sl_no: null, name: null, email: null, password: null}, ],
        };
    },
    methods: {
        async logout() {
            try {
                const res = await fetch('/logout', { method: 'GET', redirect: 'follow' });

                if (res.ok) {
                    window.localStorage.clear();
                    alert('Logout successful!');
                    return this.$router.push('/');
                } else {
                    const data = await res.json();
                    alert(data);
                }
            } catch (error) {
                console.error('Error during logout:', error);
                alert('Error during logout!');
            }
        },
        async approve(sl_no) {
            try {
                const res = await fetch(`/api/queue`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (res.ok) {
                    const managerInfo = await res.json();
                    const result = await fetch('/api/user', {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(managerInfo),
                    });

                    if (result.ok) {
                        alert("Approved!");
                        const del = await fetch(`/api/queue`, {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                        });
                    } else {
                        alert("Error during user creation!");
                    }
                } else {
                    console.log(res);
                    alert("Error fetching manager information!");
                }
            } catch (error) {
                console.error('Error during approval:', error);
                alert('Error during approval!');
            }
        },
    },
    async beforeCreate() {
        try {
            if (localStorage.getItem('login') === null) {
                return this.$router.push('/');
            } else {
                const res = await fetch('/api/queue', {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (res.ok) {
                    const data = await res.json();
                    console.log(data)
                    this.managerData = data;
                } else {
                    console.log(res);
                }
            }
        } catch (error) {
            console.error('Error during component creation:', error);
            alert('Error during component creation!');
        }
    },
};

export default AdminDashboard;
