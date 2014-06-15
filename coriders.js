var ridesRef = new Firebase('https://coriders.firebaseio.com/rides');
var groupsRef = new Firebase('https://coriders.firebaseio.com/groups');
var usersRef = new Firebase('https://coriders.firebaseio.com/users');
var trip_type = "home";
var token = "9d05de7595e7be94c4d099d5d5b62cfaf44cbe9f";
var vehicleId = "536e697ee4b0dd9485cd972a";
var trip_username = "sasilukr";
var users = [];
$(document).ready(function() {


});

function loadUserData() {
	var uRef = new Firebase('https://coriders.firebaseio.com/users' );

	uRef.once('value', function(driverSnapshot) {
	});
}

function locateVehicle() {

	var apiUrl = "https://api.automatic.com/v1/dudewheresmycar/" + vehicleId;

    $.ajax({
    	beforeSend: function (xhr) {
	    	xhr.setRequestHeader ("Authorization", "Basic " + token);
		},
	    url: apiUrl,
	    type: 'GET',
	    dataType: 'json',
	    success: function(data) {
			console.log("Success: connecting to Vehicle Location" + data + ".");
			console.log("location " + data.location.lat + ", " + data.location.lon);
			convertToAddress(data.location);
	      	return true;
	    },
	    error: function (error) {
	      	console.log("Error connecting to Automatic API. Error: " + JSON.stringify(error));
	      	return false;
    }});
}

function convertToAddress(location) {

	var apiUrl = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + location.lat 
	+ ","+ location.lon +"&sensor=true";

	$.ajax({
	    url: apiUrl,
	    type: 'GET',
	    dataType: 'json',
	    success: function(data) {
			console.log("Success: connecting to Google Maps" + data + ".");
			console.log("First Matched Address on Google Maps " + address);
			var address = data.results[0].formatted_address;
			$('#meetup_location').val(address);
	      	return true;
	    },
	    error: function (error) {
	      	console.log("Error connecting to Google Maps. Error: " + JSON.stringify(error));
	      	return false;
    }});
}

function createRide() {


	ridesRef.once('value', function(snapshot) {
		var ridecount = snapshot.numChildren();
		var dept_time_value = $('#departure_time').val();
		var destination_value = $('#destination').val();
		var type_value = trip_type;
		var max_passengers_value = $('#max_passengers').val();
		var driver_value = $('#driver').val();
		var meetup_location_value = $('#meetup_location').val();
		var group_value = $('#group').val();
		group_value = "cbsi";
		console.log("Creating Ride Type " + type_value);

		var rRef = new Firebase('https://coriders.firebaseio.com/rides/' + ridecount);
		rRef.set({
			departure_time : dept_time_value,
			destination : destination_value,
			type : type_value,
			max_passengers: max_passengers_value,
			driver: trip_username,
			meetup_location: meetup_location_value,
			group : group_value,
			create_time: new Date()
		});

		activateViewTrips(type_value);

	});
}

function joinRide(rideNdx, username) {
	console.log("Joining Ride NDX " + rideNdx + " from " + username);
	var passengersRef = new Firebase('https://coriders.firebaseio.com/rides/' + rideNdx + '/passengers');
	passengersRef.once('value', function (snapshot) {
		var pcount = snapshot.numChildren();

		var pRef = new Firebase('https://coriders.firebaseio.com/rides/' + rideNdx + '/passengers/' + pcount);
		pRef.set({name : username});
	});

}

function getRides() {
	$("#rides").empty();

	ridesRef.once('value', function(snapshot) {
		var ridecount = snapshot.numChildren();
		var i = 0;
		for ( var i = 0; i < ridecount ; i++ ) {
			var childSnapshot = snapshot.child(i);
		// snapshot.forEach(function(childSnapshot) {
			var driver_username = childSnapshot.child('driver').val();
			var dept_time = childSnapshot.child('departure_time').val();
			var type = childSnapshot.child('type').val();
			var destination = childSnapshot.child('destination').val();
			var max_passengers = childSnapshot.child('max_passengers').val();

			var uRef = new Firebase('https://coriders.firebaseio.com/users/' + driver_username );

			uRef.once('value', function(driverSnapshot) {
				var fname = driverSnapshot.child('firstname').val();
				var lname = driverSnapshot.child('lastname').val();
				var pic = driverSnapshot.child('picture').val();

				var ridecard = $("<div class='ride-card animation-target'>"
					+"<div class='driver-image'><img src='" + pic + "'/></div>"
					+"<h2 class='driver-name'>"+ fname + " " + lname + "</h2>"
					+"<div class='ride-data'><h3 class='ridetime'>About "+ dept_time +"</h3>"
					+"<p class='to-text'>to</p>"
					+"<h3 class='driver-destination'>"+ destination +"</h3></div>"
					+"<div class='ride-seats'>"
					+"<div class='ride-seats-remaining'>"+ max_passengers +" Seats</div>"
					+"<button class='btn-buckle' onclick='joinRide("+ i + ",\""+ trip_username +"\")'><img src='images/seatbuckle.png' width=60px/></button>"
					+"</div></div>");

				console.log("Child Snapshot " + childSnapshot.name());
				console.log("Driver " + JSON.stringify(driver_username));
				console.log("Driving to " + destination);
				console.log("Displaying Type " + type + ". Current Type " + trip_type);
				if ( type == trip_type ) {
					console.log("Adding Ride");
					$("#rides").append(ridecard);
				}
				i++;
			});
		}

		// });
	});

}

function displayRides() {
	// <div class="ride-card animation-target">
	// 	<div class="driver-image test-image"></div>
		
	// 	<h2 class="driver-name">Harvey Chan</h2>
		
	// 	<div class="ride-data">	
	// 		<h3 class="ridetime">About 7:00PM</h3>
	// 		<p class="to-text">to</p>
	// 		<h3 class="driver-destination">Glen Park</h3>
	// 	</div>

	// 	<div class="ride-seats">
	// 		<div class="ride-seats-remaining">4 Seats</div>
	// 		<button class="btn-buckle"><img src="images/seatbuckle.png" width=60px></button>
	// 	</div>
	// </div>
}

function activateTypePage() {
	$(".page").addClass("disable");
	$("#type_page").removeClass("disable");
}

function activateCreateTrip() {
	$(".page").addClass("disable");
	$("#createtrip_page").removeClass("disable");
	locateVehicle();
}

function activateViewTrips(tripType) {
	$(".page").addClass("disable");
	$("#view_page").removeClass("disable");
	trip_type = tripType;
	trip_username = $("#username").val();
	console.log("Log in as " + trip_username);
	getRides();

}


