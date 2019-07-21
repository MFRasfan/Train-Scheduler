$(document).ready(function () {

    //GLOBAL VARIABLES
    //------------------------
    var trainName = "";
    var trainDestination = "";
    var timeInput = "";
    var trainFrequency = "";


    //FIREBASE DATABASE
    //------------------------
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyABaRJDJIVvfxyklIZQ0loaONbTRWe300k",
        authDomain: "uoft-mfr-class.firebaseapp.com",
        databaseURL: "https://uoft-mfr-class.firebaseio.com",
        projectId: "uoft-mfr-class",
        storageBucket: "uoft-mfr-class.appspot.com",
        messagingSenderId: "72424420546",
        appId: "1:72424420546:web:818efc42ad4285ef"
      };

    firebase.initializeApp(config);

    var database = firebase.database();


    //PROCESSES 
    //------------------------------

    //On click, storing user input value
    $("#addTrain").on("click", function () {


        trainName = $("#nameInput").val().trim();
        trainDestination = $("#destinationInput").val().trim();
        timeInput = $("#timeInput").val().trim();
        trainFrequency = $("#frequencyInput").val().trim();


        //military time
        var timeConverted = moment(timeInput, "HH:MM").subtract("1,years");
        console.log(timeConverted)
        var currentTime = moment();
        console.log("current military time:  " + currentTime.format("HH:MM"));

        //Difference current time - first train
        var diffTime = currentTime.diff(moment(timeConverted), "minutes");


        var trainRemainder = diffTime % trainFrequency;


        var minutesLeft = trainFrequency - trainRemainder;


        var nextTrain = moment().add(minutesLeft, "minutes").format("HH:MM a");


        //Creates local "temporary" object for holding data
        var newTrain = {
            trainName: trainName,
            trainDestination: trainDestination,
            timeInput: timeInput,
            trainFrequency: trainFrequency,
            minutesAway: minutesLeft,
            nextArrival: nextTrain
        }

        database.ref().push(newTrain);

        //clears form for next train 
        $("#nameInput").val("");
        $("#destinationInput").val("");
        $("#timeInput").val("");
        $("#frequencyInput").val("");


        return false;
    })


    database.ref().on("child_added", function (childSnap) {
        trainName = childSnap.val().trainName;
        trainDestination = childSnap.val().trainDestination;
        timeInput = childSnap.val().timeInput;
        trainFrequency = childSnap.val().trainFrequency;

        var minutesAway = childSnap.val().minutesAway;
        var nextArrival = childSnap.val().nextArrival;

        //appends to html table
        $("#train-table").append(
            "<tr><td>" + trainName + "</td>" +
            "<td>" + trainDestination + "</td>" +
            "<td>" + trainFrequency + "</td>" +
            "<td>" + nextArrival + "</td>" +
            "<td>" + minutesAway + "</td></tr>"
        )
    });

});