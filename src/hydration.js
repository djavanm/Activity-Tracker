class Hydration {
  constructor(data, id) {
    this.data = data.filter(user => user.userID === id);
    this.id = id;
  } 

  returnDailyAverage() {
    let dayIntake = this.data.filter(user => user.userID === this.id);
    let unparsedDailyAverage = dayIntake.reduce((acc, day) => {
      return acc += day.numOunces
    }, 0) / dayIntake.length;
    return parseInt(unparsedDailyAverage);
  };

  returnIntakeByDay(date) {
    return this.data.find(day => day.date === date).numOunces;
  };

  returnWeekIntake(date) {
    let index = this.data.findIndex(day => day.date === date);
    return this.data.slice(index-6, index+1)
  }
};

if (typeof module !== 'undefined') {
  module.exports = Hydration;
}