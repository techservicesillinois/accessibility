<!DOCTYPE HTML>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>SVG Demo: Armory - First Floor Plan</title>
<link rel="stylesheet" type="text/css" href="ada/bootstrap/3.3.4/css/bootstrap.min.css"/>
<link rel="stylesheet" type="text/css" href="./map.css"/>
<script src="ada/jquery.js" type="text/javascript"></script>
<script src="./map.js" type="text/javascript"></script>
</head>
<body>
<div class="container" role="main">
<h1>SVG Demo: Armory - First Floor Plan</h1>
<fieldset>
<legend>Highlight Features</legend>
<p>
<button id="elevators-toggle" type="button" class="btn btn-default toggle-button">Elevators</button>
<button id="restrooms-toggle" type="button" class="btn btn-default toggle-button">Restrooms</button>
<button id="wheelchair-toggle" type="button" class="btn btn-default toggle-button">Wheelchair Access</button>
</p>
</fieldset>
<fieldset>
<legend>View Controls</legend>
<p>
<button id="zoom-in" type="button" class="btn btn-default toggle-button"><span aria-hidden="true">+</span><span class="sr-only">Zoom in</span></button>
<button id="zoom-out" type="button" class="btn btn-default toggle-button"><span aria-hidden="true">-</span><span class="sr-only">Zoom out</span></button>
<button id="pan-left" type="button" class="btn btn-default toggle-button">Left</button>
<button id="pan-right" type="button" class="btn btn-default toggle-button">Right</button>
<button id="pan-up" type="button" class="btn btn-default toggle-button">Up</button>
<button id="pan-down" type="button" class="btn btn-default toggle-button">Down</button>
<button id="view-reset" type="button" class="btn btn-default toggle-button">Reset</button>
</p>
</fieldset>
<div class="svg-container">
<div class="info-box"> </div>
<?php include './armory-floorplan-1-full.svg'; ?>
</div>
</div>
<script src="ada/bootstrap/3.3.4/js/bootstrap.min.js"></script>
</body>
</html>
