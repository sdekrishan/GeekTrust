// const {deal_20Discount,deal_5Discount,b4G1Discount} = require("../Coupon/Coupon")


function b4G1Discount(obj) {
  let degreeFee = 5000;
    let sum = 0;
    if (obj["DEGREE"] !== undefined) {
      for (let key in obj) {
        if (key === "DEGREE") {
          sum += obj[key] * degreeFee;
        }
      }
    }
    return sum;
  }
  
  function deal_20Discount(obj) {
    let sum = 0;
  let certificateFee = 3000;

    if (obj["CERTIFICATION"] !== undefined) {
      for (let key in obj) {
        if (key === "CERTIFICATION") {
          sum += obj[key] * certificateFee;
        }
      }
    }
    return sum;
  }
  
  function deal_5Discount(obj) {
    let sum = 0;
  let diplomaFee = 2500

    if (obj["DIPLOMA"] !== undefined) {
      for (let key in obj) {
        if (key === "DIPLOMA") {
          sum += obj[key] * diplomaFee;
        }
      }
    }
    return sum;
  }

  

function proMemeberShipDiscount(obj, proMembership) {
    let b4Discount = b4G1Discount(obj);
    let deal20Discount = deal_20Discount(obj);
    let deal5Discount = deal_5Discount(obj);
    let proDiscount = 0;
    let b4pro = 0;
    let d20pro = 0;
    let d5pro = 0;
    let b4discountRate = .03;
    let d20discountRate = .02;
    let d5discountRate = .01
  
    if (proMembership.length > 0) {
      if (
        obj["DEGREE"] !== undefined &&
        obj["CERTIFICATION"] !== undefined &&
        obj["DIPLOMA"] !== undefined
      ) {
          b4pro = (b4Discount * b4discountRate) ;
          d20pro = (deal20Discount * d20discountRate) 
          d5pro = (deal5Discount * d5discountRate)  ;
        proDiscount += b4pro + d20pro+d5pro
          
      } else if (
        obj["DEGREE"] !== undefined &&
        obj["CERTIFICATION"] !== undefined
      ) {
          b4pro = (b4Discount * b4discountRate)
          d20pro = (deal20Discount * d20discountRate)
        proDiscount += b4pro + d20pro
        
      } else if (
        obj["CERTIFICATION"] !== undefined &&
        obj["DIPLOMA"] !== undefined
      ) {
          
          d20pro = (deal20Discount * d20discountRate)
          d5pro = (deal5Discount * d5discountRate)
        proDiscount +=  d20pro+d5pro
      } else if (obj["DEGREE"] !== undefined && obj["DIPLOMA"] !== undefined) {
          b4pro = (b4Discount * b4discountRate)
          d5pro = (deal5Discount * d5discountRate)
        proDiscount += b4pro + d5pro
  
      } else if (obj["DEGREE"] !== undefined) {
          b4pro = (b4Discount * b4discountRate) 
          proDiscount += b4pro
      } else if (obj["CERTIFICATION"] !== undefined) {
          d20pro = (deal20Discount * d20discountRate)
        proDiscount += d20pro
      } else {
          d5pro = (deal5Discount * d5discountRate)
        proDiscount += d5pro
      }
    }
  
    return {proDiscount, b4pro,d20pro,d5pro}
  }

  module.exports = {proMemeberShipDiscount}