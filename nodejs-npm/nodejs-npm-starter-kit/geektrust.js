const fs = require("fs");
const {subTotal} = require('./Functions/subtotal/subtotal')
const {couponDiscount} = require("./Functions/Coupon/Coupon")
const {proMembershipFees} = require("./Functions/Membership/Promembership")
const {proMemeberShipDiscount} = require('./Functions/Membership/PromembershipDiscount');

function main(data){
const allData = data.trim().split("\r");
  const programmes = allData
  .filter((el) => el.includes("ADD_PROGRAMME"))
  .map((el) => el.split(" ").slice(1));

const couponData = allData
  .filter((el) => el.includes("APPLY_COUPON"))
  .map((el) => el.split(" ").slice(1).join(""));

const proMembership = allData.filter((el) =>
  el.includes("ADD_PRO_MEMBERSHIP")
);

let programObj = {};

programmes.forEach((el) => (programObj[el[0]] = Number(el[1])));

const subTotalAmt = subTotal(programObj);

let couponSet = new Set(couponData);

let {proDiscount} = proMemeberShipDiscount(programObj, proMembership);

let proMembershipFee = proMembershipFees(proMembership);

let disount_amt = subTotalAmt + proMembershipFee - proDiscount
const coupon_discount = couponDiscount(disount_amt,programObj, couponSet ,proMembership);
let coupondis = coupon_discount.split(" ")[1];
coupondis = coupondis === 'NONE' ? 0 : coupondis
let total = subTotalAmt + proMembershipFee - proDiscount - coupondis;
let applicable_enrollement_fee = 500;
let enrollment_fees_limit = 6666
let enrollment_fees = total < enrollment_fees_limit ? applicable_enrollement_fee : 0;

let output = [
  `SUB_TOTAL ${(subTotalAmt+proMembershipFee-proDiscount).toFixed(2)}`,
  `COUPON_DISCOUNT ${coupon_discount}`,
  `TOTAL_PRO_DISCOUNT ${proDiscount.toFixed(2)}`,
  `PRO_MEMBERSHIP_FEE ${proMembershipFee.toFixed(2)}`,
  `ENROLLMENT_FEE ${enrollment_fees.toFixed(2)}`,
  `TOTAL ${(total+enrollment_fees).toFixed(2)}`,
];

console.log(output.join("\n"));
// console.log(subTotalAmt,proMembershipFee,proDiscount);
}









let data = fs.readFileSync(process.argv[2]).toString()
main(data)
module.exports = {main}