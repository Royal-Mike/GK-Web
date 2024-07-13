const { format } = require('date-fns');

module.exports = {
    roleName: (roleId) => {
        const roleMapping = {
            1: 'Manager',
            2: 'Developer',
            3: 'Tester'
        };
        return roleMapping[roleId] || 'Member';
    },
  formatDate: (timestamp) => {
        return format(new Date(timestamp), 'M/dd/yyyy, h:mm:ss a');
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
    },

  isNumericString(str) {
      for (var i = 0; i < str.length; i++) {
          if (!/^\d$/.test(str[i])) {
              return false;
          }
      }
      return true;
  }

};
