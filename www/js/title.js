var titleJS = {
  init: function () {

    $("#title-play_button").on("click", function () {
      $("#index-loading").show().animate({ opacity: 1 }, 300, function () {
        $.ajax({
          type: "get",
          url: "stages.html",
          success: function (data) {
            $("#index-content").html(data);
            $("#index-loading").animate({ opacity: 0 }, 300, function () {
              $("#index-loading").hide();
            });
          },
          error: function () {
            console.log("Error when loading game.html");
          }
        });
      });
    });

    $("#title-records_button").on("click", function () {
      $("#index-loading").show().animate({ opacity: 1 }, 300, function () {
        $.ajax({
          type: "get",
          url: "records.html",
          success: function (data) {
            $("#index-content").html(data);
            $("#index-loading").animate({ opacity: 0 }, 300, function () {
              $("#index-loading").hide();
            });
          },
          error: function () {
            console.log("Error when loading about.html");
          }
        });
      });
    });

    $("#title-about_button").on("click", function () {
      $("#index-loading").show().animate({ opacity: 1 }, 300, function () {
        $.ajax({
          type: "get",
          url: "about.html",
          success: function (data) {
            $("#index-content").html(data);
            $("#index-loading").animate({ opacity: 0 }, 300, function () {
              $("#index-loading").hide();
            });
          },
          error: function () {
            console.log("Error when loading about.html");
          }
        });
      });
    });

  }
};

titleJS.init();
