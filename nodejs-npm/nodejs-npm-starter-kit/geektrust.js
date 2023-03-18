const fs = require("fs");
const filename = process.argv[2];

fs.readFile(filename, "utf8", (err, data) => {
  //we extract the data and store it in array so that we can divide our data into desired fields
  const allData = data.trim().split("\r");

  //extract all data related to our programmes
  const programmes = allData
    .filter((el) => el.includes("ADD_PROGRAMME"))
    .map((el) => el.split(" ").slice(1));

  //extract all data related to coupons
  const couponData = allData
    .filter((el) => el.includes("APPLY_COUPON"))
    .map((el) => el.split(" ").slice(1).join(""));

  // extract data of pro membership so that we can define we acquire pro membership or not
  const proMembership = allData.filter((el) =>
    el.includes("ADD_PRO_MEMBERSHIP")
  );

  // we made an object because it is easy to identify which course has how many quantity;
  let programObj = {};

  //setting our object
  programmes.forEach((el) => (programObj[el[0]] = Number(el[1])));

  // with the help of subtotal function we get our subtotol Amount
  const subTotalAmt = subTotal(programObj);

  // we creating a set here so that we can check how many unique coupon we have
  let couponSet = new Set(couponData);

  // pro membership discount
  let proDiscount = proMemeberShipDiscount(programObj, proMembership);

  //pro membership fees
  let proMembershipFee = proMembershipFees(proMembership).toFixed(2);

  // coupon discount
  const coupon_discount = couponDiscount(programObj, couponSet);
  let coupondis = coupon_discount.split(" ")[1];

  // calculatin the total amt here
  let total = subTotalAmt - coupondis - proDiscount;

  // calculation enrollment fees amt here
  let enrollment_fees = total < 6666 ? 500 : 0;

  // putting our ans in an array so that we can print them easily
  let output = [
    `SUB_TOTAL ${subTotalAmt.toFixed(2)}`,
    `COUPON_DISCOUNT ${coupon_discount}`,
    `TOTAL_PRO_DISCOUNT ${proDiscount}`,
    `PRO_MEMBERSHIP_FEE ${proMembershipFee}`,
    `ENROLLMENT_FEE ${enrollment_fees.toFixed(2)}`,
    `TOTAL ${(total - enrollment_fees).toFixed(2)}`,
  ];

  // printing the output
  console.log(output.join("\n"));
});

function subTotal(obj) {
  let amount = 0;

  for (let key in obj) {
    if (key === "DEGREE") {
      amount += 5000 * obj[key];
    } else if (key === "CERTIFICATION") {
      amount += 3000 * obj[key];
    } else {
      amount += 2500 * obj[key];
    }
  }
  return amount;
}

function couponDiscount(obj, couponData) {
  let amount = subTotal(obj);
  let courseCount = 0;

  for (let key in obj) {
    courseCount += obj[key];
  }

  if (courseCount >= 4) {
    if (obj["DIPLOMA"] !== undefined) {
      return `B4G1 ${(2500).toFixed(2)}`;
    } else if (obj["CERTIFICATION"] !== undefined) {
      return `B4G1 ${(3000).toFixed(2)}`;
    } else {
      return `B4G1 ${(5000).toFixed(2)}`;
    }
  } else if (
    amount >= 10000 &&
    couponData.has("DEAL_G20") &&
    couponData.has("DEAL_G5")
  ) {
    return `DEAL_G20 ${((amount * 20) / 100).toFixed(2)}`;
  } else if (amount >= 10000 && couponData.has("DEAL_G20")) {
    return `DEAL_G20 ${((amount * 20) / 100).toFixed(2)}`;
  } else if (courseCount >= 2 && couponData.has("DEAL_G5")) {
    return `DEAL_G5 ${((amount * 5) / 100).toFixed(2)}`;
  } else {
    return `DISCOUNT NONE 0`;
  }
}

function proMemeberShipDiscount(obj, proMembership) {
  let b4Discount = b4G1Discount(obj);
  let deal20Discount = deal_20Discount(obj);
  let deal5Discount = deal_5Discount(obj);
  let proDiscount = 0;
  if (proMembership.length > 0) {
    if (
      obj["DEGREE"] !== undefined &&
      obj["CERTIFICATION"] !== undefined &&
      obj["DIPLOMA"] !== undefined
    ) {
      proDiscount +=
        (b4Discount * 3) / 100 +
        (deal20Discount * 2) / 100 +
        (deal5Discount * 1) / 100;
    } else if (
      obj["DEGREE"] !== undefined &&
      obj["CERTIFICATION"] !== undefined
    ) {
      proDiscount += (b4Discount * 3) / 100 + (deal5Discount * 1) / 100;
    } else if (
      obj["CERTIFICATION"] !== undefined &&
      obj["DIPLOMA"] !== undefined
    ) {
      proDiscount += (deal20Discount * 2) / 100 + (deal5Discount * 1) / 100;
    } else if (obj["DEGREE"] !== undefined && obj["DIPLOMA"] !== undefined) {
      proDiscount += (b4Discount * 3) / 100 + (deal5Discount * 1) / 100;
    } else if (obj["DEGREE"] !== undefined) {
      proDiscount += (b4Discount * 3) / 100;
    } else if (obj["CERTIFICATION"] !== undefined) {
      proDiscount += (deal20Discount * 2) / 100;
    } else {
      proDiscount += (deal5Discount * 1) / 100;
    }
  }

  return proDiscount.toFixed(2);
}

function proMembershipFees(proMembership) {
  if (proMembership.length > 0) {
    return 200;
  } else {
    return 0;
  }
}

function b4G1Discount(obj) {
  let sum = 0;
  if (obj["DEGREE"] !== undefined) {
    for (let key in obj) {
      if (key === "DEGREE") {
        sum += obj[key] * 5000;
      }
    }
  }
  return sum;
}

function deal_20Discount(obj) {
  let sum = 0;
  if (obj["CERTIFICATION"] !== undefined) {
    for (let key in obj) {
      if (key === "CERTIFICATION") {
        sum += obj[key] * 3000;
      }
    }
  }
  return sum;
}

function deal_5Discount(obj) {
  let sum = 0;
  if (obj["DIPLOMA"] !== undefined) {
    for (let key in obj) {
      if (key === "DIPLOMA") {
        sum += obj[key] * 2500;
      }
    }
  }
  return sum;
}
