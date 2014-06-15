var ridesRef = new Firebase('https://coriders.firebaseio.com/rides');
var groupsRef = new Firebase('https://coriders.firebaseio.com/groups');
var usersRef = new Firebase('https://coriders.firebaseio.com/users');
var trip_type = "home";
var token = "9d05de7595e7be94c4d099d5d5b62cfaf44cbe9f";
var vehicleId = "536e697ee4b0dd9485cd972a";
$(document).ready(function() {
});


function locateVehicle() {

	var apiUrl = "https://api.automatic.com/v1/dudewheresmycar/" + vehicleId;

    $.ajax({
    	beforeSend: function (xhr) {
	    	xhr.setRequestHeader ("Authorization", "Basic ");
		},
	    url: apiUrl,
	    type: 'GET',
	    dataType: 'json',
	    success: function(data) {
			console.log("Success: connecting to Vehicle Location" + data + ".");
			console.log("location " + data.location.lat + ", " + data.location.lon);
	      	return true;
	    },
	    error: function (error) {
	      	alert("Error connecting to Automatic API. Error: " + error);
	      	return false;
    }});
}

function createRide() {

	var apiUrl = "https://api.automatic.com/v1/dudewheresmycar/" + vehicleId;

    $.ajax({
    	beforeSend: function (xhr) {
	    	xhr.setRequestHeader ("Authorization", "Basic ");
		},
	    url: apiUrl,
	    type: 'GET',
	    dataType: 'json',
	    success: function(data) {
			console.log("Success: connecting to Vehicle Location" + data + ".");
			console.log("")
	      	return true;
	    },
	    error: function (error) {
	      	alert("Error connecting to Automatic API. Error: " + error);
	      	return false;
    }});




	ridesRef.once('value', function(snapshot) {
		var ridecount = snapshot.numChildren();
		var dept_time_value = $('#departure_time').val();
		var destination_value = $('#destination').val();
		var type_value = $('#type').val();
		var max_passengers_value = $('#max_passengers').val();
		var driver_value = $('#driver').val();
		var meetup_location_value = $('#meetup_location').val();
		var group_value = $('#group').val();


		var rRef = new Firebase('https://coriders.firebaseio.com/rides/' + ridecount);
		rRef.set({
			departure_time : dept_time_value,
			destination : destination_value,
			type : trip_type,
			max_passengers: max_passengers_value,
			driver: username_value,
			meetup_location: meetup_location_value,
			group : group_value,
			create_time: new Date()
		});
	});
}

function joinRide(rideNdx, username) {
	var passengersRef = new Firebase('https://coriders.firebaseio.com/rides/' + rideNdx + '/passengers');
	passengersRef.once('value', function (snapshot) {
		var pcount = snapshot.numChildren();

		var pRef = new Firebase('https://coriders.firebaseio.com/rides/' + rideNdx + '/passengers/' + pcount);
		pRef.set({name : username});
	});

}


function activateTypePage() {
	$(".page").addClass("disable");
	$("#type_page").removeClass("disable");
}

function activateCreateTrip() {
	$(".page").addClass("disable");
	$("#createtrip_page").removeClass("disable");
}

function activateViewTrips(tripType) {
	$(".page").addClass("disable");
	$("#view_page").removeClass("disable");
	trip_type = tripType;

}


