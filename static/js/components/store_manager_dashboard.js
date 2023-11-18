const StoreManagerDashboard = {
    template: `
    <div>
    <div>
        <link rel="stylesheet" type="text/css" href="static/css/dashboard.css">
        <nav class="navbar navbar-expand-lg navbar-dark">
            <div class="container">
                <a class="navbar-brand"><img src="./static/images/logo.png" width="5" height="5" alt=""></a>
                <h2>Welcome {{store_manager}}</h2>
                <div class="position-relative top-0 end-0">
                    <p class="btn btn-info" role="button" style="color: rgb(81, 87, 47)" @click.prevent="logout">Logout <i class="bi bi-box-arrow-right"></i></p>
                </div>
            </div>
        </nav>
        <div class="text-center"><button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newTheatre"><i class="bi bi-plus-circle-fill"></i>Add New Theatre</button></div>
        <div class="modal fade" id="newTheatre" tabindex="-1" aria-labelledby="Label" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="Label">Add New Theatre</h1>
                                    <button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form id="form" class="form login">
                                        <div class="form-floating pb-4">
                                            <input type="text" class="form-control" id="theatre_name" placeholder="Theatre Name" required>
                                            <label for="theatre_name">Theatre Name</label>
                                        </div>
                                        <div class="form-floating pb-3">
                                            <input type="text" class="form-control" id="location" placeholder="Location" required>
                                            <label for="location">Location</label>
                                        </div>
                                        <div class="form-floating pb-4">
                                            <input type="text" id="capacity" class="form-control" placeholder="Capacity" required>
                                            <label for="capacity">Capacity</label>
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button @click.prevent='addTheatre' class="btn btn-primary" data-bs-dismiss="modal"><i class="bi bi-plus-circle-fill"></i>Add Theatre</button>
                                    <button class="btn btn-danger" data-bs-dismiss="modal"><i class="bi bi-x-circle-fill"></i>Cancel</button></div>
                                </div>
                            </div>
                        </div>
                    </div>
        <div v-if="hasTheatre">
            <div class="row text-center">
                <div v-for="i in theatreData" class="col-sm-6 mb-3 mb-sm-0">
                    <div class="card">
                        <div class="card-header">
                            <h1 class="card-title text-center"><strong>{{i.theatre_name}}, {{i.location}}</strong></h1>
                        </div>
                        <div v-if="hasShow" class="card-body text-center">
                        <br>
                            <div class="card" v-for="c in res_show[i.theatre_id]">
                                <div class="card-header">
                                    <h4 class="card-title">{{c.show_name}} <span class="badge text-bg-info">{{c.tags}}</span><span class="badge text-bg-warning">{{c.average_rating}}★</span></h4>
                                </div>
                                <div class="card-body text-center">
                                    <p class="card-text">Show Time: {{c.show_time}}</p>
                                    <p class="card-text">Ticket Price: <i class="bi bi-currency-rupee"></i>{{c.ticket_price}}</p>
                                    <p class="card-text" v-if="c.seats > 0">Tickets remaining: {{c.seats}}</p>
                                    <p class="card-text text-danger" v-else>Housefull!</p>
                                    <button @click.prevent="deleteShow(c.show_id)" class="btn btn-danger btn-lg"><i class="bi bi-shield-fill-x"></i>Delete Show</button>
                                    <router-link :to="'/edit_show/'+c.show_id" class="btn btn-primary btn-lg"><i class="bi bi-pencil-square"></i>Edit Show</router-link>
                                </div>
                            </div>
                            <br>
                        </div>
                        <div class="card-footer text-center">
                            <router-link :to="'/add_show/'+i.theatre_id" class="btn btn-primary btn-lg"><i class="bi bi-patch-plus-fill"></i>Add Show</router-link>
                            <router-link :to="'/edit_theatre/'+ i.theatre_id" class="btn btn-secondary btn-lg"><i class="bi bi-pencil-square"></i>Edit Theatre</router-link>
                            <button @click.prevent="deleteTheatre(i.theatre_id)" class="btn btn-danger btn-lg"><i class="bi bi-shield-fill-x"></i>Delete Theatre</button>
                            <button @click.prevent="exportTheatre(i.theatre_id)" class="btn btn-secondary btn-lg"><i class="bi bi-stack"></i>Export Theatre</button>    
                        </div>
                    </div>
                    </div>
                    <div class="modal fade" id="newTheatre" tabindex="-1" aria-labelledby="Label" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="Label">Add New Theatre</h1>
                                    <button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form id="form" class="form login">
                                        <div class="form-floating pb-4">
                                            <input type="text" class="form-control" id="theatre_name" placeholder="Theatre Name" required>
                                            <label for="theatre_name">Theatre Name</label>
                                        </div>
                                        <div class="form-floating pb-3">
                                            <input type="text" class="form-control" id="location" placeholder="Location" required>
                                            <label for="location">Location</label>
                                        </div>
                                        <div class="form-floating pb-4">
                                            <input type="text" id="capacity" class="form-control" placeholder="Capacity" required>
                                            <label for="capacity">Capacity</label>
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button @click.prevent='addTheatre' class="btn btn-primary" data-bs-dismiss="modal"><i class="bi bi-plus-circle-fill"></i>Add Theatre</button>
                                    <button class="btn btn-danger" data-bs-dismiss="modal"><i class="bi bi-x-circle-fill"></i>Cancel</button></div>
                                </div>
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
            admin: localStorage.getItem('store_manager_name'),
            hasCat: false,
            hasItem: false,
            catData: {},
            res_item: {}
        }
    },
    methods: {
        async logout() {
            const res = await fetch('/logout', { method: 'GET' })
            const data = await res.json()
            if (res.ok) {
                window.localStorage.clear()
                return this.$router.push('/store_manager_login')
            }
        },
        async addCat() {
            if (this.check()) {
                const res = await fetch('/api/category', {
                    method: "post",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        catName: document.getElementById("category_name").value,
                        quantity: document.getElementById("quantity").value,
                        price: document.getElementById("price").value
                    })
                })
                if (res.status != 409) {
                    const data = await res.json()
                    if (res.ok) {
                        location.reload()
                    } else {
                        alert(data.message)
                    }
                }
                else {
                    alert('Category already exists!')
                }
            }
        },
        async deleteCat(category_id) {
            if (confirm("Are you sure you want to delete? This action cannot be undone.")) {
                const res = await fetch('/api/theatre/' + category_id, {
                    method: "delete",
                    headers: { "Content-Type": "application/json" }
                })
                if (res.status != 404) {
                    window.location.reload()
                } else {
                    alert('Theatre does not exist!')
                }
            } else {
                window.location.reload()
            }
        },
        async deleteItem(item_id){
            if (confirm("Are you sure you want to delete? This action cannot be undone.")) {
                const res = await fetch('/api/show/' + item_id, {
                    method: "delete",
                    headers: { "Content-Type": "application/json" }
                })
                if (res.status != 404) {
                    window.location.reload()
                } else {
                    alert('Item does not exist!')
                }
            } else {
                window.location.reload()
            }
        },
        check() {
            if (document.getElementById("category_name").value.length == 0) {
                alert('Category Name is required!')
                return false
            }
            if (document.getElementById("quantity").value <= 0) {
                alert('Invalid quantity!')
                return false
            }
            if (document.getElementById("price").value <= 0) {
                alert('Invalid price!')
                return false
            }
            return true
        },
        exportCat(category_id) {
            fetch('/exportCat/' + category_id, { method: 'get' })
            alert("Please check your official email id for the document!")
        }
    },
    async beforeMount() {
        if (localStorage.getItem('login') === null) {
            return this.$router.push('/store_manager_login')
        } else if (localStorage.getItem('role') === 'user') {
            alert('Access Denied!')
            return this.$router.push('/')
        }
        const res_cat = await fetch('/api/category', {
            method: "get",
            headers: { "Content-Type": "application/json" }
        })
        const data_cat = await res_cat.json()
        if (res_cat.ok && data_cat.length != 0) {
            this.hasTheatre = true
            this.catData = data_cat
        }
        const temp = await (await fetch('/api/item')).json()
        for(const i of data_cat){
            this.res_item[i.category_id] = temp.filter(x=>x.category_id == i.category_id)
        }
        if (this.res_item.length != 0) {
            this.hasItem = true
        }
    }
}
export default StoreManagerDashboard;