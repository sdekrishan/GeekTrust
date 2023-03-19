const {proMemeberShipDiscount} = require("../Membership/PromembershipDiscount")

function couponDiscount(amount,obj, couponData,proMembership) {

    let courseCount = 0;
    let d20pro_applicable_amount = 10000;
    let default_degree_fee = 5000;
    let default_certificate_fee = 3000;
    let default_diploma_fee = 2500;
    
    let {d20pro,d5pro,b4pro} = proMemeberShipDiscount(obj, proMembership)
    for (let key in obj) {
      courseCount += obj[key];
    }
  
    if (courseCount >= 4) {
      if (obj["DIPLOMA"] !== undefined) {
        return `B4G1 ${(default_diploma_fee - (d5pro/obj['DIPLOMA'])).toFixed(2)}`;
      } else if (obj["CERTIFICATION"] !== undefined) {
        return `B4G1 ${(default_certificate_fee - (d20pro / obj['CERTIFICATION'])).toFixed(2)}`;
      } else {
        return `B4G1 ${(default_degree_fee - (b4pro/obj['DEGREE'])).toFixed(2)}`;
      }
    } else if (
      amount >= d20pro_applicable_amount &&
      couponData.has("DEAL_G20") &&
      couponData.has("DEAL_G5")
    ) {
      return `DEAL_G20 ${((amount * 20) / 100).toFixed(2)}`;
    } else if (amount >= d20pro_applicable_amount && couponData.has("DEAL_G20")) {
      return `DEAL_G20 ${((amount * 20) / 100).toFixed(2)}`;
    } else if (courseCount >= 2 && couponData.has("DEAL_G5")) {
      return `DEAL_G5 ${((amount * 5) / 100).toFixed(2)}`;
    } else {
      return `DISCOUNT NONE 0`;
    }
  }
  module.exports = {couponDiscount}