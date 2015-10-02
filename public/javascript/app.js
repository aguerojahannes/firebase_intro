var shows = [];

function getShows(){ // we put it inside a function, so it only fires when we call the function.
   var req = new XMLHttpRequest();
   req.open("GET", "https://tv-shows-amaj.firebaseio.com/.json"); // true not necessary
   req.onload = function(){
      if(200 <= this.status < 400){
         // if this.status is 200-399, return the respose parsed out so we can read it in javascript form (not in JSON form)
         var res = JSON.parse(this.response); // res is response. these  (req and res) are used pretty heavily with node
         var elemString = ""; // this is an empty string that we can add to using the variable more easily
         shows.length = 0; // added for Delete
         for(var prop in res){
            res[prop]._id = prop; // _id is an arbitrary name that we're creating.
            shows.push(res[prop]); // right now we're storing out object in an array.
            elemString += "<li>" + res[prop].title + ": " + res[prop].years + " | " + res[prop].rating + "  <button class='btn btn-xs btn-warning' onclick='startEdit("+ (shows.length - 1) +")'>Edit</button></li>"
         }
         document.getElementById("tvShows").innerHTML = elemString;

      } else {
            console.error(this.response)
         }
   }
   req.send(); // bc this is a GET method, we don't have anything to send inside the function
}

getShows();

function startEdit(index){
   $("#editTitle").val(shows[index].title);
   $("#editYears").val(shows[index].years);
   $("#editRating").val(shows[index].rating);
   $("#editSubmitButton").html("<button class='btn' onclick='saveEdit(" + index + ")'>SaveChanges</button>");
   $("#myModal").modal("toggle");
}

function saveEdit(index){
   var title = $("#editTitle").val();
   var years = $("#editYears").val();
   var rating = $("#editRating").val();
   var show = new TVShow(title, rating, years); // creating a new one, cuz its easier than modify an existing one
   $.ajax({ // EDIT method is like combo of deleting and posting
      url: 'https://tv-shows-amaj.firebaseio.com/' + shows[index]._id + '/.json',
      type: "PUT",
      data: JSON.stringify(show) // info we want to send in the body
   }).success(function(res){
      // res = this.response within function ()
      getShows();
   })
   // go into input field and get information

   $("#myModal").modal("toggle");
}

// constructor function

function TVShow (title, rating, years){ // takes in title, rating, years
   this.title = title; // spits out
   this.years = years;
   this.rating = rating;
}

function saveTVShow(){
   var title = document.getElementById("tvTitle").value;
   var rating = document.getElementById("tvRating").value;
   var years = document.getElementById("tvYears").value;

   var show = new TVShow (title, rating, years);

   var req = new XMLHttpRequest(); // create the request object
   req.open("POST", "https://tv-shows-amaj.firebaseio.com/.json"); // we want to save this to firebase
   req.onload = function(){
      getShows(); // this enables you to display the input once values are input, instead of having to refresh the page. it is referring the the function that we created above to GET the tvShows from the database and have them appear on the page.

   }
   req.send(JSON.stringify(show));  // show has all the parameters. when we send (show) we get error 400,
   }

function startDelete(){ // will go in, write everything we had before and insert checkboxes
   var elemString = "";
   for (var i = 0; i < shows.length; i++) {
      elemString += "<li class='form-inline'><input id='" + shows[i]._id + "' type='checkbox' value='false' class='form-control' style='display:inline-block;'/>" + shows[i].title + ": " + shows[i].years + " | " + shows[i].rating + "</li>"
   }
   $("#tvShows").html(elemString);  // "tvShows" is the ul id that the shows are being shown in
   $("#buttonsGoHere").html("<button class='btn btn-success' onclick='saveDelete()'>Save</button><button class='btn btn-success' onclick='cancel()'>Cancel</button>")
}

function cancel(){
   $("#buttonsGoHere").html(""); // clear out the buttons
   getShows(); // reshow on the page without the buttons of the checkboxes
}

var delCount, // making global variable that we'll be able to use in both functions. delCount = heres the index that we're on
      boxes; // our array of what we actually want to delete
function saveDelete(){
   // go in and finx all checkboxes and get the values from them
   delCount = 0;
   var boxes = $(":checkbox:checked"); //    console.log(boxes);
   boxesLength = boxes.length // variable to hold whatever the length is
   if(boxes.length > 0){
      deleteShow(boxes[0].id);
   // } else {
   //
   // }
   }

function deleteShow(id){
   $.ajax({
   url: "https://tv-shows-amaj.firebaseio.com/" + id + "/.json",
   type: "DELETE"
   }).success(function(){
      delCount += 1 ; // increment by 1 - very important in a recursive function
      if (delCount < boxes.length){ // very important in a recursive function
         deleteShow(boxes[delCount].id); // this is a recursive function. gonna call itself as long as it's true. gonan change the value each time.
      } else {
         getShows();
      }
   }) // this is a jquery DELETE method (before .success).  (after.success)
}
}
