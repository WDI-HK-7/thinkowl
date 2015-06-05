var child = Session.get("child");

var buildStatsChart = function(title, data) {

  $('#game-stats-chart').highcharts({
      
    chart: {
      type: 'spline',
      backgroundColor: null
    },
    
    title: {
      text: title
    },
    
    credits: {
      enabled: false
    },
    
    subtitle: {
      text: 'recent scores'
    },
    
    legend: {
      enabled: false
    },

    xAxis: {
      lineColor: 'black',
      tickColor: 'black',
      labels: {
        enabled: false
      },
      title: {
        text: 'Time'
      }
    },
    
    yAxis: {
      max: 105,
      gridLineWidth: 0,
      title: {
        text: 'score'
      },
      labels: {
        enabled: false
      }
    },
    
    tooltip: {
      formatter: function () {
        return '<b>' + child.name + '</b>' + ' scored <b>' + this.point.y + '%</b><br/>at ' + this.point.time;
      }
    },
    
    plotOptions: {
      spline: {
        lineWidth: 8,
        states: {
          hover: {
            lineWidth: 9
          }
        },
        marker: {
          enabled: false,
          symbol: 'circle',
          radius: 3,
          states: {
            hover: {
              enabled: true
            }
          }
        }
      }
    },
    
    series: [data]
  });
}

var buildAvgCompareChart = function(title, data) {

  $('#game-avg-comparison').highcharts({
      
    chart: {
      type: 'column',
      backgroundColor: null
    },
    
    title: {
      text: title
    },
    
    credits: {
      enabled: false
    },
    
    subtitle: {
      text: 'your averge vs. other kids at your age'
    },
    
    legend: {
      align: 'right',
      enabled: true
    },

    xAxis: {
      lineColor: 'black',
      tickColor: 'black',
      labels: {
        enabled: false
      }
    },
    
    yAxis: {
      max: 105,
      gridLineWidth: 0,
      title: {
        text: 'score'
      },
      labels: {
        enabled: false
      }
    },
    
    tooltip: {
      formatter: function () {
        return "<b>" + this.series.name + "'s</b> average score <b> " + this.point.y + "%";
      }
    },
    
    // plotOptions: {
    //   column: {
    //     pointPadding: 0.2,
    //     borderWidth: 0
    //   }
    // },
    
    series: data
  });
}

var getScoreAvg = function (database, params) {
  var sum = 0;
  var count = database.find(params).count();
  var gameData = database.find(params);
  gameData.map(function(obj){
    sum += obj.score;
  });
  return Math.floor(sum/count);
};

/*
 * Call the function to built the chart when the template is rendered
 */
// Template.childProfile.rendered = function() {    
//     builtArea();
// }


Template.childProfile.helpers({

  childInfo: function() {
    var childInfo = Children.findOne({_id: child.id});
    return childInfo;
  },

  mathsGameStats: function() {
    return getScoreAvg(MathsGame, {child_id: child.id});
  },

  coloursGameStats: function() {
    return getScoreAvg(ColoursGame, {child_id: child.id});
  }

});

var getGameData = function(database, params) {
  var gameData = database.find(params, {createdaAt: -1});
  var chartData = gameData.map(function(obj){
    return {time: obj.createdAt, y: obj.score};
  });
  return chartData;
}

Template.childProfile.events({
  "click #maths-game-chart": function() {
    var chartData = getGameData(MathsGame, {child_id: child.id});
    var gameScoreSeries = {
      name: "Maths Game",
      data: chartData
    }
    var childAvg = getScoreAvg(MathsGame, {child_id: child.id});
    var ageAvg = getScoreAvg(MathsGame, {child_age: child.age});
    var avgSeries = [
      {name: child.name, data: [childAvg]},
      {name: child.age + "yr olds", data: [ageAvg]}
    ];
    $('#game-stats-container').show();
    if (chartData.length > 1) {
      buildStatsChart('Maths Game', gameScoreSeries);
      buildAvgCompareChart('Maths Game', avgSeries);
    } else {
      $('#game-stats-chart').html("<h1>You haven't played enough, play more!</h1>");
      $('#game-avg-comparison').html('');
    }
  },

  "click #colours-game-chart": function() {
    var chartData = getGameData(ColoursGame, {child_id: child.id});
    var gameScoreSeries = {
      name: "Colours Game",
      data: chartData
    }
    var childAvg = getScoreAvg(ColoursGame, {child_id: child.id});
    var ageAvg = getScoreAvg(ColoursGame, {child_age: child.age});
    var avgSeries = [
      {name: child.name, data: [childAvg]},
      {name: child.age + "yr olds", data: [ageAvg]}
    ];
    $('#game-stats-container').show();
    if (chartData.length > 1) {
      buildStatsChart('Colours Game', gameScoreSeries);
      buildAvgCompareChart('Colours Game', avgSeries);
    } else {
      $('#game-stats-chart').html("<h1>You haven't played enough, play more!</h1>");
    }
  },

  "click .maths-game": function(event, template) {
    Router.go('/mathGame');
  },
  
  "click .colours-game": function(event, template) {
    Router.go('/colours');
  },

  "click .game-three": function(event, template) {
    Router.go('/game/3');
  },

  "click .game-four": function(event, template) {
    Router.go('/game/4');
  }

});