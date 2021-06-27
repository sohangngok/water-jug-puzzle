const numberOfStages = 10;
var recordsJS = {
  init: function () {

    $("#back").on("click", function () {
      $("#index-loading").show().animate({ opacity: 1 }, 300, function () {
        $.ajax({
          type: "get",
          url: "title.html",
          success: function (data) {
            $("#index-content").html(data);
            $("#index-loading").animate({ opacity: 0 }, 300, function () {
              $("#index-loading").hide();
            });
          },

          error: function () {
            console.log("Error when loading title.html");
          }
        });
      });
    });

    //get records from database
    // var recordString = "";
    // $.ajax({
    //   type: 'GET',
    //   dataType: 'json',
    //   url: "https://seem4570.000webhostapp.com/get_score.php",
    //   success: function (data) {
    //     console.log(data);
    //     for (var i = 0; i < data.length; i++) {
    //       recordString = recordString + "Stage " + data[i]["stage"] + " completed in " + data[i]["steps"] + " steps.<br>";
    //       $("#records-content").html(recordString);
    //     }
    //   },
    //   error: function () {
    //     console.log("Error when getting score");
    //     $("#records-content").html("No connection to the internet.");
    //   }
    // });

    //get records from local storage
    // var records = JSON.parse(localStorage.getItem("records"));
    // console.log(records);

    // var requests = [];
    // var recordHTML = [];
    // for (let i = 1; i <= numberOfStages; i++) {
    //   var url = "stages/stage" + i + ".json";
    //   requests.push($.getJSON(url, function(data) {
    //     if (records === null || !records[data.code]) {
    //       recordHTML[i] = `<tr><td>${data.title}</td><td></td></tr>`;
    //     } else {
    //       recordHTML[i] = `<tr><td>${data.title}</td><td>${records[data.code]}</td></tr>`;
    //     }
    //   }));
    // }
    // $.when.apply($, requests).then(function() {
    //   console.log(recordHTML);
    //   for (var i = 1; i <= numberOfStages; i++) {
    //     $("#records-content").append(recordHTML[i]);
    //   }
    // });

    //using Promise.all
    const records = JSON.parse(localStorage.getItem("records"));
    const makeRecordHTML = (records, stageJson) => {
      if (records === null || !records[stageJson.code]) {
        return `<tr><td>${stageJson.title}</td><td></td></tr>`;
      } else {
        return `<tr><td>${stageJson.title}</td><td>${records[stageJson.code]}</td></tr>`;
      }
    };
    const recordHTML = [];
    const request = stageCode => {
      const url = "stages/stage" + stageCode + ".json";
      return $.getJSON(url, data => {
        recordHTML[stageCode] = makeRecordHTML(records, data);
      });
    }
    const requests = [];
    for (let i = 1; i <= numberOfStages; i++) {
      requests[i] = request(i);
    }
    Promise.all(requests).then(() => {
      for (var i = 1; i <= numberOfStages; i++) {
        $("#records-content").append(recordHTML[i]);
      }
    });

    // for (var i = 1; i <= numberOfStages; i++) {
    //   var url = "stages/stage" + i + ".json";
    //   calls.push($.getJSON(url, function(data) {
    //     $("#stage-list").append(`<div class="stage-button" data-stage-code="${data.code}">${data.title}</div>`);
    //   }));
      
    // }
    // $.when.apply($,calls).then(function() {
    //   $(".stage-button").on("click", stagesJS.onclickStageButton);
    // });
  }
};

recordsJS.init();
