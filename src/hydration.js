class Hydration {
  constructor(data, id) {
    this.data = data;
    this.id = id;
  } 

  returnDailyAverage() {
    console.log(this.data)
    let dayIntake = this.data.filter(user => user.userID === this.id);
    let unparsedDailyAverage = dayIntake.reduce((acc, day) => {
      return acc += day.numOunces
    }, 0) / dayIntake.length;
    return parseInt(unparsedDailyAverage);
  };

  returnIntakeByDay(date) {
    return this.data.find(day => day.date === date).numOunces;
  };

  returnWeekIntake() {
    return this.data.filter(user => user.userID === this.id).slice(-7)
  }
};

module.exports = Hydration;