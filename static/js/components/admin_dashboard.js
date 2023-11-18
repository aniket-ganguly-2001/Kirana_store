const AdminDashboard = {
    template: `
    <div>
    <div>
        <link rel="stylesheet" type="text/css" href="static/css/dashboard.css">
        <nav class="navbar navbar-expand-lg navbar-dark">
            <div class="container">
                <a class="navbar-brand"><img src="./static/images/logo.png" width="5.5" height="5" alt=""></a>
                <h2>Welcome Administrator!!</h2>
                <div class="position-relative top-0 end-0">
                    <p class="btn btn-info" role="button" style="color: rgb(81, 87, 47)" @click.prevent="logout">Logout <i class="bi bi-box-arrow-right"></i></p>
                </div>
            </div>
        </nav>
        </div>
        </div>`,
}
export default AdminDashboard;