const { format } = require('date-fns');

module.exports = {
  formatDate: (timestamp) => {
    return format(new Date(timestamp), 'MMMM dd, yyyy'); // Định dạng ngày thành "Tháng Ngày, Năm"
  },
  range: (start, end) => {
    let array = [];
    for (let i = start; i <= end; i++) {
      array.push(i);
    }
    return array;
  },
  eq: (a, b) => {
    return a === b;
  },
  gt: (a, b) => {
    return a > b;
  },
  lt: (a, b) => {
    return a < b;
  },
  add: (a, b) => {
    return a + b;
  },
  subtract: (a, b) => {
    return a - b;
  }
};