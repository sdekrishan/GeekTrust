function proMembershipFees(proMembership) {
  let defaultFee = 0;
    if (proMembership.length > 0) {
      defaultFee = 200
    } 
    return defaultFee 
  }

  module.exports = {proMembershipFees}