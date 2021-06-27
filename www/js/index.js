$(function () {
  document.addEventListener("deviceready", function () {
    console.log("Device is ready now.");
    app.initialize();
  });
});

var app = {
  // Application Constructor
  initialize: function () {
    screen.orientation.lock('portrait');
    $.ajax({
      type: "get",
      url: "title.html",
      success: function (data) {
        $("#index-content").html(data);
        $("#index-loading").fadeOut();
      },
      error: function () {
        console.log("Error when loading title.html");
      }
    });



  }


};
