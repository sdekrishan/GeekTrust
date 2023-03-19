function subTotal(obj) {
    let amount = 0;
  let DegreeFee = 5000;
  let CertificateFee = 3000;
  let DiplomaFee = 2500
    for (let key in obj) {
      switch(key){
        case('DEGREE'):{
        amount += DegreeFee * obj[key];
        break;
        }
        case('CERTIFICATION'):{
        amount += CertificateFee * obj[key];
        break
        }
         default: {
        amount += DiplomaFee * obj[key];
        break;
        }
      }
      
    }
    return amount;
  }

  module.exports = {subTotal}