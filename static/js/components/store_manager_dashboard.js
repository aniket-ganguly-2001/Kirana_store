const StoreManagerDashboard = {
    template: `
      <div>
          <link rel="stylesheet" type="text/css" href="static/css/dashboard.css">
          <nav class="navbar navbar-expand-lg navbar-dark">
              <div class="container">
                  <a class="navbar-brand"><img src="./static/images/logo.png" width="5" height="5" alt=""></a>
                  <h2>Welcome {{ store_manager }}</h2>
                  <div class="position-relative top-0 end-0">
                      <p class="btn btn-info" role="button" style="color: rgb(81, 87, 47)" @click.prevent="logout">Logout <i class="bi bi-box-arrow-right"></i></p>
                  </div>
              </div>
          </nav>
  
          <div class="text-center">
              <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newCategory">
                  <i class="bi bi-plus-circle-fill"></i> Add New Category
              </button>
          </div>
  
          <div class="modal fade" id="newCategory" tabindex="-1" aria-labelledby="Label" aria-hidden="true">
              <div class="modal-dialog">
                  <div class="modal-content">
                      <div class="modal-header">
                          <h1 class="modal-title fs-5" id="Label">Add New Category</h1>
                          <button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                          <form id="form" class="form login">
                              <div class="form-floating pb-4">
                                  <input v-model="catName" type="text" class="form-control" id="cat_name" placeholder="Category Name" required>
                                  <label for="cat_name">Category Name</label>
                              </div>
                          </form>
                      </div>
                      <div class="modal-footer">
                          <button @click.prevent="addCat" class="btn btn-primary" data-bs-dismiss="modal">
                              <i class="bi bi-plus-circle-fill"></i> Add Category
                          </button>
                          <button class="btn btn-danger" data-bs-dismiss="modal">
                              <i class="bi bi-x-circle-fill"></i> Cancel
                          </button>
                      </div>
                  </div>
              </div>
          </div>
  
          <div v-if="hasCat">
              <div class="row text-center">
                  <div v-for="i in catData" class="col-sm-6 mb-3 mb-sm-0">
                      <div class="card">
                          <div class="card-header">
                              <h1 class="card-title text-center"><strong>{{i.cat_name}}</strong></h1>
                          </div>
                          <div v-if="hasItem" class="card-body text-center">
                              <br>
                              <div class="card" v-for="c in res_item[i.cat_id]">
                                  <div class="card-header">
                                      <h4 class="card-title">{{c.item_name}}</h4>
                                  </div>
                                  <div class="card-body text-center">
                                      <p class="card-text">Price per unit: <i class="bi bi-currency-rupee"></i>{{c.price}}</p>
                                      <p class="card-text" v-if="c.quantity > 0">Quantity remaining: {{c.quantity}}</p>
                                      <p class="card-text text-danger" v-else>Out of Stock!</p>
                                      <button @click.prevent="deleteItem(c.item_id)" class="btn btn-danger btn-lg"><i class="bi bi-shield-fill-x"></i>Delete Item</button>
                                      <router-link :to="'/edit_item/'+c.item_id" class="btn btn-primary btn-lg"><i class="bi bi-pencil-square"></i>Edit Item</router-link>
                                  </div>
                              </div>
                              <br>
                          </div>
                          <div class="card-footer text-center">
                              <router-link :to="'/add_item/'+i.cat_id" class="btn btn-primary btn-lg"><i class="bi bi-patch-plus-fill"></i>Add Item</router-link>
                              <router-link :to="'/edit_category/'+ i.cat_id" class="btn btn-secondary btn-lg"><i class="bi bi-pencil-square"></i>Edit Category</router-link>
                              <button @click.prevent="deleteCat(i.cat_id)" class="btn btn-danger btn-lg"><i class="bi bi-shield-fill-x"></i>Delete Category</button>
                              <button @click.prevent="exportCat(i.cat_id)" class="btn btn-secondary btn-lg"><i class="bi bi-stack"></i>Export Category</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>`,
  
    data() {
      return {
        store_manager: localStorage.getItem('store_manager'),
        hasCat: false,
        hasItem: false,
        catName: "",  // Added this line
        catData: [],
        res_item: {}
      }
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
      async addCat() {
        if (this.check()) {
          const res = await fetch('/api/category', {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              catName: this.catName,  // Updated this line
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
          } else {
            alert('Category already exists!')
          }
        }
      },
      async deleteCat(cat_id) {
        if (confirm("Are you sure you want to delete? This action cannot be undone.")) {
          const res = await fetch('/api/category/' + cat_id, {
            method: "delete",
            headers: { "Content-Type": "application/json" }
          })
          if (res.status != 404) {
            window.location.reload()
          } else {
            alert('Category does not exist!')
          }
        } else {
          window.location.reload()
        }
      },
      async deleteItem(item_id) {
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
        if (this.catName.length == 0) {  // Updated this line
          alert('Category Name is required!');
          return false;
        }
        if (document.getElementById("quantity").value <= 0) {
          alert('Invalid quantity!');
          return false;
        }
        if (document.getElementById("price").value <= 0) {
          alert('Invalid price!');
          return false;
        }
        return true;
      },
      exportCat(category_id) {
        fetch('/exportCat/' + category_id, { method: 'get' })
        alert("Please check your registered email id for the document!");
      }
    },
    async beforeCreate() {
      if (localStorage.getItem('login') === null) {
        return this.$router.push('/store_manager_login')
      }
      store_manager = this.localStorage.getItem('store_manager')
      const res_cat = await fetch('/api/category', {
        method: "get",
        headers: { "Content-Type": "application/json" }
      })
      const data_cat = await res_cat.json()
      if (res_cat.ok && data_cat.length != 0) {
        this.hasCat = true;
        this.catData = data_cat;
      }
      const temp = await (await fetch('/api/item')).json()
      for (const i of data_cat) {
        this.res_item[i.cat_id] = temp.filter(x => x.category_id == i.cat_id);
      }
      if (Object.keys(this.res_item).length != 0) {  // Updated this line
        this.hasItem = true
      }
    }
  }
  
  export default StoreManagerDashboard;
  