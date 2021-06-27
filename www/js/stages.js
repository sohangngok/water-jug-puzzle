const numberOfStages = 10;
var stagesJS = {
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

    
    // setup the page (add stage buttons to html)
    // const calls = [];
    // const stageButtons = [];
    // for (let i = 1; i <= numberOfStages; i++) {
    //   const url = "stages/stage" + i + ".json";
    //   calls.push($.getJSON(url, function(data) {
    //     stageButtons[i] = `<div class="stage-button" data-stage-code="${data.code}">${data.title}</div>`;
    //   }));
    // }
    // $.when.apply($,calls).then(function() {
    //   for (let i = 1; i <= numberOfStages; i++) {
    //     $("#stage-list").append(stageButtons[i]);
    //   }
    //   $(".stage-button").on("click", stagesJS.onclickStageButton);
    // });

    //using Promise.all
    const stageButtons = [];
    const makeStageButton = stageCode => {
      const url = "stages/stage" + stageCode + ".json";
      return $.getJSON(url, function(data) {
        stageButtons[stageCode] = `<div class="stage-button" data-stage-code="${data.code}">${data.title}</div>`;
      });
    };
    const makeStageButtons = [];
    for (let i = 1; i <= numberOfStages; i++) {
      makeStageButtons[i] = makeStageButton(i);
    }
    Promise.all(makeStageButtons).then(() => {
      for (let i = 1; i <= numberOfStages; i++) {
        $("#stage-list").append(stageButtons[i]);
      }
      $(".stage-button").on("click", stagesJS.onclickStageButton);
    })
  },

  onclickStageButton: function() {
    var stageButton = $(this);
    $("#index-loading").show().animate({ opacity: 1 }, 300, function () {
      $.ajax({
        type: "get",
        url: "game.html",
        success: function (data) {
          localStorage.setItem("stage-code", stageButton.data("stage-code"));
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
  }
}

stagesJS.init();