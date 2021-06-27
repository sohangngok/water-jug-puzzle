var gameJS = {
  code: undefined,
  maxJugHeightPercent: 30,
  targets: [[]],
  jugs: [],
  records: undefined, //e.g. {"1": 6, "3": 4} stage code as property name and value as no. of steps

  init: function () {
    console.log("game init");
    gameJS.setup();
  },

  setup: function () {
    //back button
    $("#back").on("click", function () {
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
            console.log("Error when loading stages.html");
          }
        });
      });
    });

    //reset button
    $("#reset").on("click", function () {
      gameJS.resetGame();

    });

    //init the jugs
    gameJS.initGame();
  },

  stayOnWhichJug: function (e, jug) {
    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    var x = touch.pageX;
    var y = touch.pageY;


    for (var i = 0; i < gameJS.jugs.length; i++) {
      var anotherJug = $("#jug" + i);
      if (anotherJug.attr("id") != jug.attr("id")) {
        var top2 = anotherJug.position().top;
        var bottom2 = top2 + anotherJug.height();
        var left2 = anotherJug.position().left;
        var right2 = left2 + anotherJug.width();

        if (y < bottom2 && x > left2 && x < right2) {
          console.log(jug.attr("id")+" staying on jug"+ i);
          return i;
        }
      }
    }
    console.log(jug.attr("id")+" not staying on any jug");
    return null;
  },


  updateVolume: function() {
    for (let i = 0; i < gameJS.jugs.length; i++) {
      $("#water"+i).css("height", this.jugs[i].current / this.jugs[i].volume * 100 + "%");
      $("#jug"+i+"text").html(this.jugs[i].current + "/" + this.jugs[i].volume + "L");
    }
  },
  
  initGame: function() {
    gameJS.code = localStorage.getItem("stage-code");
    var url = "stages/stage"+gameJS.code+".json";
    $.getJSON(url, function(data) {
      console.log(data);
      gameJS.targets = JSON.parse(JSON.stringify(data.targets));

      //target message
      $("#target-text").html(data.target_message);

      //create jugs
      const numberOfJugs = data.jugs.length;
      const x = 100 / (3*numberOfJugs + 1);
      for(let i = 0; i < numberOfJugs; i++){
        gameJS.jugs.push({});
        gameJS.jugs[i].startVolume = parseInt(data.jugs[i].volume);
        gameJS.jugs[i].startCurrent = parseInt(data.jugs[i].current);
        gameJS.jugs[i].volume = parseInt(data.jugs[i].volume);
        gameJS.jugs[i].current = parseInt(data.jugs[i].current);
        //add the jug to html
        $("#waterjugs").append('<div id="jug'+i+'" class="jug" data-number="'+i+'"><div id="water'+i+'" class="water"></div></div>');
        $("#jug"+i).css("left", x + 3*x*i + "%");
        $("#jug"+i).css("width", x*2 + "%");
      }

      //set height of jugs
      $("#jug0").css("height", gameJS.maxJugHeightPercent +"%");
      for (let i = 1; i < numberOfJugs; i++) {
        $("#jug"+i).css("height", gameJS.maxJugHeightPercent / gameJS.jugs[0].volume * gameJS.jugs[i].volume +"%");
      }

      //current volume text
      for (let i = 0; i < numberOfJugs; i++) {
        $("#waterjugs").append('<div id="jug'+i+'text" class="jugtext"> / L</div>');
        $("#jug"+i+"text").css("left", x + 3*x*i + "%");
      }


      gameJS.updateVolume();
      gameJS.setClickFunction();
    });
    
    gameJS.records = JSON.parse(localStorage.getItem("records")) || {};
    if (!(gameJS.code in gameJS.records)) {
      gameJS.records[gameJS.code] = null;
    }
    
  },

  setClickFunction: function(){
    //touch start
    $(".jug").on("touchstart", function (e) {
      e.preventDefault();
      $(this).css("z-index", "600");
      $(this).attr("top", $(this).position().top);
      $(this).attr("left", $(this).position().left);
      var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
      $(this).attr("pageX", touch.pageX);
      $(this).attr("pageY", touch.pageY);
    });

    // dragging an item
    $(".jug").on("touchmove", function (e) {
      e.preventDefault();
      var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
      var offSetPageX = touch.pageX - parseFloat($(this).attr("pageX"));
      var offSetPageY = touch.pageY - parseFloat($(this).attr("pageY"));

      var left = parseFloat($(this).attr("left")) + offSetPageX;
      var top = parseFloat($(this).attr("top")) + offSetPageY;

      $(this).css({ "top": top + "px", "left": left + "px" });
    });

    // finish touching an item
    $(".jug").on("touchend", function (e) {
      e.preventDefault();

      $(this).css("z-index", "580");
      var from = $(this).data("number"); //the code of the jug
      var to = gameJS.stayOnWhichJug(e, $(this)); //the code of the jug
      if (to != null) {
        //pour water
        console.log($(this).data("number") +" to "+ to);
        var waterTransfer;
        if(gameJS.jugs[from].current <= gameJS.jugs[to].volume - gameJS.jugs[to].current){
          waterTransfer = gameJS.jugs[from].current;
        }else{
          waterTransfer = gameJS.jugs[to].volume - gameJS.jugs[to].current;
        }
        gameJS.jugs[from].current = gameJS.jugs[from].current - waterTransfer;
        gameJS.jugs[to].current = gameJS.jugs[to].current + waterTransfer;
        gameJS.updateVolume();
        gameJS.addStep();

      }

      // reset
      var left = $(this).attr("left");
      var top = $(this).attr("top");
      $(this).css({ "z-index": 550, "top": top + "px", "left": left + "px" });

      gameJS.checkForCompletion();
    });
  },

  addStep: function() {
    var count = parseInt($("#step-count").html(), 10) + 1;
    $("#step-count").html(count);
  },

  checkForCompletion: function() {
    let completed = false;
    for (let i = 0; i < gameJS.targets.length; i++) {
      const target = gameJS.targets[i];
      let completedThisTarget = true;
      for (let i = 0; i < gameJS.jugs.length; i++) {
        if (!(gameJS.jugs[i].current == target[i] || target[i] == null)) {
          completedThisTarget = false;
          break;
        }
      }
      if (completedThisTarget) {
        completed = true;
        break;
      }
    }

    if(completed){
      console.log("game end");
      const steps = $("#step-count").html();
      let message = "";
      console.log('steps', steps, 'gameJS.records[gameJS.code]', gameJS.records[gameJS.code]);
      console.log('steps < gameJS.records[gameJS.code]', steps < gameJS.records[gameJS.code]); 
      if (gameJS.records[gameJS.code] === null || steps < parseInt(gameJS.records[gameJS.code])) {
        gameJS.records[gameJS.code] = steps;
        console.log(steps, gameJS.records[gameJS.code]);
        message += "NEW RECORD!<br><br>";
      }
      message += "You completed in <br>" + steps + " steps!<br><br>Record:<br>" + gameJS.records[gameJS.code] + " steps";
      $("#game-message").html(message);
      $("#game-end").show().animate({opacity:1}, 500);
      
      $("#game-end").on("touchend", function (e) {
        e.preventDefault();

        //show title page
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


      //upload record to local storage
      //record as a string
      // if(localStorage.getItem("record")){
      //   localStorage.setItem("record",  "Stage " + gameJS.code + " completed in " + steps + " steps.<br>" + localStorage.getItem("record"));
      // }else{
      //   localStorage.setItem("record", "Stage " + gameJS.code + " completed in " + steps + " steps.");
      // }

      //record as an object and only best records are stored
      localStorage.setItem("records", JSON.stringify(gameJS.records));
      

      //upload record to server
      // $.ajax({
      //   type: "POST",
      //   data: {"stage":this.code, "steps":steps},
      //   url: "https://seem4570.000webhostapp.com/upload_score.php",
      //   success: function(data){
      //     console.log("Score is sent to the server. " + data);
      //   },
      //   error: function(){
      //     console.log("Error when sending the score to the server.");
      //   }
      // });

    }
  },

  resetGame: function() {
    for(let i = 0; i < gameJS.jugs.length; i++){
      gameJS.jugs[i].volume = gameJS.jugs[i].startVolume;
      gameJS.jugs[i].current = gameJS.jugs[i].startCurrent;
    }
    $("#step-count").html(0);
    gameJS.updateVolume();
  }

};

gameJS.init();
