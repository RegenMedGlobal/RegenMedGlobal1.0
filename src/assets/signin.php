<?php include('includes/header.php'); ?>
<?php include('includes/dbconnection.php'); ?>

<style>
	.text-custom
	{
		color: #682bd7;
	}
	.bg-custom
	{
		background-color: #682bd7;
	}
	.btn-custom
	{
		background-color: #682bd7;
		color: white;
	}
</style>

<main id="main">
	<section class="inner-page">

		<div class="container-fluid vh-50" style="margin-top:100px">
            <div class="" style="margin-top:200px">
                <div class="rounded d-flex justify-content-center">
                    <div class="col-md-4 col-sm-12 shadow-lg p-5 bg-light">
                        <div class="text-center">
                            <h3 class="text-custom">Sign In</h3>
                        </div>
                        <form action="requests/loginform.php" method="POST">
                            <div class="p-4">
                                <div class="input-group mb-3">
                                    <span class="input-group-text bg-custom"><i
                                            class="bi bi-person-plus-fill text-white"></i></span>
                                    <input type="text" class="form-control" name="uname" placeholder="Username">
                                </div>
                                <div class="input-group mb-3">
                                    <span class="input-group-text bg-custom"><i
                                            class="bi bi-key-fill text-white"></i></span>
                                    <input type="password" class="form-control" name="password" placeholder="password">
                                </div>
                                <button class="btn btn-custom text-center mt-2" type="submit">
                                    Login
                                </button>
                                <p class="text-center mt-5">Don't have an account?
                                    <span class="text-custom"><a href="register.php">Sign Up</a></span>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>	
		


	</section>
</main>








<?php include('includes/footer.php'); ?>