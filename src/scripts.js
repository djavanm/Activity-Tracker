const globalRepo = new UserRepository(userData);
let currentUser = new User(globalRepo.returnUser(getRandomNumber()));
let currentHydration = new Hydration(hydrationData, currentUser.id);
let currentSleep = new Sleep(sleepData, currentUser.id);
let sleepRepo = new SleepRepository(sleepData)
let today = setDateString();
let activity = new Activity(activityData, getRandomNumber());
let activityDay = activity.returnDay(today);
let activityRepo = new ActivityRepository(activityData)

$(document).ready(function() {

  var $grid = $('.grid').packery({
    itemSelector: '.grid-item',
    columnWidth: 50,
    rowHeight: 40,
    gutter: 0,
  });

  var $draggables = $('.grid-item').draggabilly({
    containment: true
  });

  $grid.find('.grid-item').each( function( i, gridItem ) {
    var draggie = new Draggabilly( gridItem );
    $grid.packery( 'bindDraggabillyEvents', draggie );
  });

  $(".user-name").text(currentUser.returnFirstName())
  $(".user-steps").text(currentUser.dailyStepGoal)
  $(".user-email").eq(0).text(currentUser.email)
  $(".main__section--friends--challenge").html(friendsStepChallenge())
  $('.main__section--daily-intake').text(currentHydration.returnIntakeByDay(today))
  $('.main__section--average-intake').text(currentHydration.returnDailyAverage())
  $('.main__section--hydration-canvas').text(currentHydration.returnWeekIntake(today))
  $('.main__section--daily-sleep-hours').text(currentSleep.returnDayHours(today))
  $('.main__section--daily-sleep-quality').text(currentSleep.returnDayQual(today))
  $('.main__section--week-sleep-hours').text(currentSleep.returnWeekHours(today))
  $('.main__section--week-sleep-quality').text(currentSleep.returnWeekHours(today))
  $('.main__section--average-sleep-hours').text(currentSleep.returnAllTimeAvgHours())
  $('.main__section--average-sleep-quality').text(currentSleep.returnAllTimeAvgQual())
  $('.main__section--activity--steps span').text(activityDay.numSteps.toLocaleString())
  $('.main__section--activity--miles span').text(activity.returnDailyMiles(today))
  $('.main__section--activity--minutes span').text(activityDay.minutesActive)
  $('.main__section--activity--flights span').text(activityDay.flightsOfStairs)
  $('.main__section--activity--empire span').text(activity.returnEmpireCount())
  $('.main__section--sleep--last-night span').first().text(currentSleep.returnDayHours(today))
  $('.main__section--sleep--last-night span').eq(1).text(currentSleep.returnDayQual(today))
  $('.main__section--sleep--averages span').first().text(currentSleep.returnAllTimeAvgHours())
  $('.main__section--sleep--averages span').eq(1).text(currentSleep.returnAllTimeAvgQual())
  $('.main__section--activity--world table tr td').eq(1).text(activityDay.numSteps.toLocaleString())
  $('.main__section--activity--world table tr td').eq(2).text(activityRepo.returnAvgSteps(today).toLocaleString())
  $('.main__section--activity--world table tr td').eq(4).text(currentUser.dailyStepGoal)
  $('.main__section--activity--world table tr td').eq(5).text(globalRepo.returnAvgStepGoal())
  $('.main__section--activity--world table tr td').eq(7).text(activityDay.minutesActive)
  $('.main__section--activity--world table tr td').eq(8).text(activityRepo.returnAvgMins(today))
  $('.main__section--activity--world table tr td').eq(10).text(activityDay.flightsOfStairs)
  $('.main__section--activity--world table tr td').eq(11).text(activityRepo.returnAvgStairs(today))
  $('.main__section--sleep--worst span').first().text(currentSleep.returnWorstDay(today).date)
  $('.main__section--sleep--worst span').eq(1).text(currentSleep.returnWorstDay(today).sleepQuality)
  $('.main__section--hydration--today span').text(currentHydration.returnIntakeByDay(today))
  $('.main__section--activity--trends span').eq(0).text(activity.returnIncreasedStepDays(today).pop().date)
  $('.main__section--activity--trends span').eq(1).text(activity.returnIncreasedStairDays(today).pop().date)
});

function getRandomNumber() {
  let randNum = (Math.random() * 50) + 1;
  randNum = Math.floor(randNum);
  return randNum;
}

function friendsStepChallenge() {
  let friends = currentUser.friends;
  friends.push(currentUser.id);
  friends = friends.map(friend => {
    return friend = new Activity(activityData, friend);
  }).map(friend => {
    return friend = {
      'id': friend.id, 
      'weeklySteps': friend.returnWeeklySteps(today),
      'name': globalRepo.returnUser(friend.id).name
    }
  })
  friends.sort((a, b) => {
    return b.weeklySteps - a.weeklySteps;
  })
  return generateFriendsElements(friends);
} 

function generateFriendsElements(users) {
  let friendsList = '<ol class="main__section--friends--challenge">'
  users.forEach(user => {
    friendsList += `<li><p>${user.name}: </p><p>${user.weeklySteps} steps</p></li>`
  })
  friendsList += '</ol>'
  return friendsList
}

function setDateString() {
  let date = Date().split(' ')
  let returnDate = [2, 0, 1, 9, '/', 0];
  if (date[1] === 'Jul') {
    returnDate.push(7);
    returnDate.push('/');
    returnDate.push(date[2]);
    return returnDate.join('');
  } else if (date[1] === 'Aug') {
    returnDate.push(8)
    returnDate.push('/');
    returnDate.push(date[2]);
    return returnDate.join('');
  } else if (date[1] === 'Sep') {
    returnDate.push(9)
    returnDate.push('/');
    returnDate.push(date[2]);
    return returnDate.join('');
  } else {
    return '2019/09/21'
  }
}

// Chart  Section //

Chart.defaults.global.defaultFontColor = 'white';
Chart.defaults.global.defaultFontSize = 16;
Chart.defaults.scale.ticks.beginAtZero = true;

let hydrationWeekData = currentHydration.returnWeekIntake(today);
let hydrationDays = hydrationWeekData.reduce((acc, day) => {
  let today = day;
  let newDate = today.date.split('/').filter(index => index.length !== 4).join('/');
  acc.push(newDate);
  return acc;
}, []);

const ctx = $('#hydration-chart')
const chart = new Chart(ctx, {
  type: 'line', 
  data: {
    labels: [`${hydrationDays[0]}`, `${hydrationDays[1]}`, `${hydrationDays[2]}`, `${hydrationDays[3]}`, `${hydrationDays[4]}`, `${hydrationDays[5]}`, `${hydrationDays[6]}`],
    datasets: [{
      label: 'My Last Week of Hydration in Ounces',
      backgroundColor: '#0d6aff',
      borderColor: 'black',
      borderWidth: 2,
      data: [`${hydrationWeekData[0].numOunces}`, `${hydrationWeekData[1].numOunces}`, `${hydrationWeekData[2].numOunces}`, `${hydrationWeekData[3].numOunces}`, `${hydrationWeekData[4].numOunces}`, `${hydrationWeekData[5].numOunces}`, `${hydrationWeekData[6].numOunces}`]
    }]
  },
  options: {
    title: {
      display: true,
      text: 'Water Intake This Week'
    },
    legend: {
      display: false
    }
  }
});

let sleepWeek = currentSleep.returnWeekHours(today);
let sleepDays = sleepWeek.reduce((acc, day) => {
  let today = day;
  let newDate = today.date.split('/').filter(index => index.length !== 4).join('/');
  acc.push(newDate);
  return acc;
}, []);

const ctx2 = $('#sleep-hours-chart')
const chart2 = new Chart(ctx2, {
  type: 'horizontalBar',
  data: {
    labels: [`${sleepDays[0]}`, `${sleepDays[1]}`, `${sleepDays[2]}`, `${sleepDays[3]}`, `${sleepDays[4]}`, `${sleepDays[5]}`, `${sleepDays[6]}`],
    datasets: [{
      label: 'Hours Slept',
      backgroundColor: '#7924b3',
      borderColor: '#000000',
      borderWidth: 1,
      data: [`${sleepWeek[0].hoursSlept}`, `${sleepWeek[1].hoursSlept}`, `${sleepWeek[2].hoursSlept}`, `${sleepWeek[3].hoursSlept}`, `${sleepWeek[4].hoursSlept}`, `${sleepWeek[5].hoursSlept}`, `${sleepWeek[6].hoursSlept}`]
    }]
  },
  options: {
    title: {
      display: true,
      text: 'Hours Slept this Week'
    },
    legend: {
      display: false
    }
  }
});

const ctx5 = $('#sleep-quality-chart')
const chart5 = new Chart(ctx5, {
  type: 'horizontalBar',
  data: {
    labels: [`${sleepDays[0]}`, `${sleepDays[1]}`, `${sleepDays[2]}`, `${sleepDays[3]}`, `${sleepDays[4]}`, `${sleepDays[5]}`, `${sleepDays[6]}`],
    datasets: [{
      label: 'Sleep Quality',
      backgroundColor: '#7924b3',
      borderColor: '#000000',
      borderWidth: 1,
      data: [`${sleepWeek[0].sleepQuality}`, `${sleepWeek[1].sleepQuality}`, `${sleepWeek[2].sleepQuality}`, `${sleepWeek[3].sleepQuality}`, `${sleepWeek[4].sleepQuality}`, `${sleepWeek[5].sleepQuality}`, `${sleepWeek[6].sleepQuality}`]
    }]
  },
  options: {
    title: {
      display: true,
      text: 'Sleep Quality this Week'
    },
    legend: {
      display: false
    }
  }
});

let activityWeek = activity.returnWeekInfo(today);
let activityDays = activityWeek.reduce((acc, day) => {
  let today = day;
  let newDate = today.date.split('/').filter(index => index.length !== 4).join('/');
  acc.push(newDate);
  return acc;
}, []);

const ctx7 = $('#activity-minutes-chart');
const chart7 = new Chart(ctx7, {
  type: 'line', 
  data: {
    labels: [`${activityDays[0]}`, `${activityDays[1]}`, `${activityDays[2]}`, `${activityDays[3]}`, `${activityDays[4]}`, `${activityDays[5]}`, `${activityDays[6]}`],
    datasets: [{
      label: 'Activity Per Day',
      backgroundColor: '#FFE400',
      borderColor: '#000000',
      borderWidth: 1,
      data: [`${activityWeek[0].minutesActive}`, `${activityWeek[1].minutesActive}`, `${activityWeek[2].minutesActive}`, `${activityWeek[3].minutesActive}`, `${activityWeek[4].minutesActive}`, `${activityWeek[5].minutesActive}`, `${activityWeek[6].minutesActive}`]
    }]
  },
  options: {
    scales: {
      yAxes: [{
        barPercentage: 0.5,
        barThickness: 1000,
        maxBarThickness: 8,
        minBarLength: 20,
        gridLines: {
          offsetGridLines: true
        }
      }]
    },
    title: {
      display: true,
      text: 'Active Minutes this Week'
    },
    legend: {
      display: false
    }
  }
});

const ctx8 = $('#activity-stairs-chart');
const chart8 = new Chart(ctx8, {
  type: 'line', 
  data: {
    labels: [`${activityDays[0]}`, `${activityDays[1]}`, `${activityDays[2]}`, `${activityDays[3]}`, `${activityDays[4]}`, `${activityDays[5]}`, `${activityDays[6]}`],
    datasets: [{
      label: 'Activity Per Day',
      backgroundColor: '#FFE400',
      borderColor: '#000000',
      borderWidth: 1,
      data: [`${activityWeek[0].flightsOfStairs}`, `${activityWeek[1].flightsOfStairs}`, `${activityWeek[2].flightsOfStairs}`, `${activityWeek[3].flightsOfStairs}`, `${activityWeek[4].flightsOfStairs}`, `${activityWeek[5].flightsOfStairs}`, `${activityWeek[6].flightsOfStairs}`]
    }]
  },
  options: {
    scales: {
      yAxes: [{
        barPercentage: 0.5,
        barThickness: 1000,
        maxBarThickness: 8,
        minBarLength: 20,
        gridLines: {
          offsetGridLines: true
        }
      }]
    },
    title: {
      display: true,
      text: 'Flights of Stairs Climbed this Week'
    },
    legend: {
      display: false
    }
  }
});


const ctx9 = $('#activity-steps-chart');
const chart9 = new Chart(ctx9, {
  type: 'line', 
  data: {
    labels: [`${activityDays[0]}`, `${activityDays[1]}`, `${activityDays[2]}`, `${activityDays[3]}`, `${activityDays[4]}`, `${activityDays[5]}`, `${activityDays[6]}`],
    datasets: [{
      label: 'Activity Per Day',
      backgroundColor: '#FFE400',
      borderColor: '#000000',
      borderWidth: 1,
      data: [`${activityWeek[0].numSteps}`, `${activityWeek[1].numSteps}`, `${activityWeek[2].numSteps}`, `${activityWeek[3].numSteps}`, `${activityWeek[4].numSteps}`, `${activityWeek[5].numSteps}`, `${activityWeek[6].numSteps}`]
    }]
  },
  options: {
    scales: {
      yAxes: [{
        barPercentage: 0.5,
        barThickness: 1000,
        maxBarThickness: 8,
        minBarLength: 20,
        gridLines: {
          offsetGridLines: true
        }
      }]
    },
    title: {
      display: true,
      text: 'Flights of Stairs Climbed this Week'
    },
    legend: {
      display: false
    }
  }
});