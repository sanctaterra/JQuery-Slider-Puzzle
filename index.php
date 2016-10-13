<?php
// Start session
session_start();
// If a session hasn't been logged into,
// then go to the login page
if(!isset($_SESSION['user_id'])){
	require('../../login_tools.php');
	load();
}
$page_title = 'jsslider';
?>
<!DOCTYPE html>
<html lang="en-GB">
<head>
	<meta charset="utf-8" /> 
	<title>Mark Holden - Web Developer</title>
	<meta name="description" content="Web portfolio for Mark Holden - HTML / CSS / JS / PHP / CMSs" />
	<meta name="keywords" content="web, developer, development, html, css, javascript, php" />
	<meta name="author" content="Mark Holden" />
	<meta name="admin_email" content="markholden1989@googlemail.com" />
	<meta name="robots" content="noindex, nofollow" />
	<link rel="stylesheet" type="text/css" href="../../css/base_css.css" />
	<link rel="stylesheet" type="text/css" href="css/JSSliderPuzzle.css" />
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
</head>
<body class="no-js">
	<section id="container"><!-- Content Container -->
		<section id="mini-nav">
			<a href="http://sanctaterrawebdev.com/home.php">Home</a>
			<a href="http://sanctaterrawebdev.com/logout.php">Logout</a>
		</section>
		<header>
			<h1>JQuery Slider Puzzle</h1>
		</header>
		<section id="image-selection"><!-- Image Selector -->
			<p>Select an image you'd like to play:</p>
			<ul>
				<li><img class="active-selection" src="img/balloon.jpg" /></li>
				<li><img src="img/landscape.jpg" /></li>
				<li><img src="img/space.jpeg"></li>
			</ul>
		</section><!-- / Image Selector -->
		<section id="score"><!-- Score -->
			<p>Moves made:</p>
			<p class="score">0</p>
		</section><!-- / Score -->
		<section id="game-area"><!-- Game Area -->
			<section id="game-board"><!-- Game Board -->
				<div class="game-tile one" data-tile="1"></div>
				<div class="game-tile two" data-tile="2"></div>
				<div class="game-tile three" data-tile="3"></div>
				<div class="game-tile four" data-tile="4"></div>
				<div class="game-tile five" data-tile="5"></div>
				<div class="game-tile six" data-tile="6"></div>
				<div class="game-tile seven" data-tile="7"></div>
				<div class="game-tile eight" data-tile="8"></div>
			</section><!-- / Game Board -->
			<section id="game-target">
			</section>
		</section><!-- /Game Area -->
		<!-- Reset Button -->
		<p id="reset">Reset Game</p>
	</section><!-- / Content Container -->
	<!-- JScripts -->
	<script src="js/JSSliderPuzzle.js"></script>
</body>
</html>