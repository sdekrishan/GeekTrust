const fs = require("fs")
const filename = process.argv[2]

fs.readFile(filename, "utf8", (err, data) => {
 const allData = data.trim().split("\r");
 const programmes = allData.filter((el)=>el.includes('ADD_PROGRAMME')).map((el)=>el.split(" ").slice(1));
 const couponData = allData.filter((el)=>el.includes('APPLY_COUPON')).map((el)=>el.split(" ").slice(1).join(""));
 const proMembership = allData.filter((el)=>el.includes('ADD_PRO_MEMBERSHIP'));
 let programObj = {};
 
 programmes.forEach(el=>programObj[el[0]]=Number(el[1]))
 
 const subTotalAmt = subTotal(programObj);
 let couponSet = new Set(couponData);
 let proDiscount = proMemeberShipDiscount(programObj,proMembership)
 let proMembershipFee = proMembershipFees(proMembership).toFixed(2)
 const coupon_discount = couponDiscount(programObj,couponSet);
 let coupondis = coupon_discount.split(" ").map(Number)[1];
 let total = subTotalAmt - coupondis - proDiscount

 let enrollment_fees = total < 6666 ? 500 : 0;
 let ans = [`SUB_TOTAL ${subTotalAmt.toFixed(2)}`,`COUPON_DISCOUNT ${coupon_discount}`,`TOTAL_PRO_DISCOUNT ${proDiscount}`,`PRO_MEMBERSHIP_FEE ${proMembershipFee}`,`ENROLLMENT_FEE ${(enrollment_fees).toFixed(2)}` ,`TOTAL ${(total-enrollment_fees).toFixed(2)}`];

 console.log(ans.join("\n"));

})

function proMembershipFees (proMembership){
    if(proMembership.length > 0){
        return 200
    }
    else{
        return 0
    }
}

function subTotal(obj){
    let amount = 0;

    for(let key in obj){
        if(key === 'DEGREE'){
            amount += (5000*obj[key])
        }
        else if(key === 'CERTIFICATION'){
            amount += (3000 * obj[key])
        }
        else{
            amount += (2500 * obj[key])
        }
    }
    return amount
}

function couponDiscount(obj,couponData){
    let amount = subTotal(obj);
    let courseCount = 0;

    for(let key in obj){
        courseCount += obj[key]
    }
    
        if(courseCount >= 4){
            if(obj['DIPLOMA'] !== undefined){
                return `B4G1 ${(2500).toFixed(2)}`
            }
            else if(obj['CERTIFICATION'] !== undefined){
                return `B4G1 ${(3000).toFixed(2)}`
            }
            else{
                return `B4G1 ${(5000).toFixed(2)}`
            }
        }
        else if(amount >= 10000 && couponData.has('DEAL_G20') && couponData.has('DEAL_G5')){
            return `DEAL_G20 ${(amount*20/100).toFixed(2)}`
        }
        else if(amount >= 10000 && couponData.has('DEAL_G20')){
            return `DEAL_G20 ${(amount*20/100).toFixed(2)}`
        }
        else if(courseCount >=2 && couponData.has('DEAL_G5') ){
            return `DEAL_G5 ${(amount*5/100).toFixed(2)}`
        }
        else{
            return `DISCOUNT NONE 0`
        }
    

}

function proMemeberShipDiscount (obj,proMembership){
    let b4Discount = b4G1Discount(obj)
    let deal20Discount = deal_20Discount(obj)
    let deal5Discount = deal_5Discount(obj)
    let proDiscount = 0;
    if(proMembership.length > 0){
        if((obj['DEGREE']!== undefined) && (obj['CERTIFICATION']!== undefined) && (obj['DIPLOMA']!== undefined)){
            proDiscount += (b4Discount*3/100) + (deal20Discount * 2/100) + (deal5Discount * 1/100);
        }
        else if((obj['DEGREE']!== undefined) && (obj['CERTIFICATION']!== undefined)){
            proDiscount += (b4Discount*3/100) + (deal5Discount * 1/100);
        }
        else if((obj['CERTIFICATION']!== undefined) && (obj['DIPLOMA']!== undefined)){
            proDiscount += (deal20Discount * 2/100) + (deal5Discount * 1/100);
        }
        else if((obj['DEGREE']!== undefined) && (obj['DIPLOMA']!== undefined)){
            proDiscount += (b4Discount*3/100) + (deal5Discount * 1/100);
        }
        else if(obj['DEGREE']!== undefined){
            proDiscount += (b4Discount*3/100) 
        }
        else if(obj['CERTIFICATION']!== undefined){
            proDiscount += (deal20Discount * 2/100) 
        }
        else{
            proDiscount += (deal5Discount * 1/100);
        }
    }

    return proDiscount.toFixed(2)
}

function b4G1Discount (obj){
    let sum = 0
    if(obj['DEGREE'] !== undefined){
        for(let key in obj){
            if(key === 'DEGREE'){
                sum += obj[key]*5000
            }
        }
    }
    return sum
}

function deal_20Discount (obj){
    let sum = 0
    if(obj['CERTIFICATION'] !== undefined){
        for(let key in obj){
            if(key === 'CERTIFICATION'){
                sum += obj[key]*3000
            }
        }
    }
    return sum
}

function deal_5Discount (obj){
    let sum = 0
    if(obj['DIPLOMA'] !== undefined){
        for(let key in obj){
            if(key === 'DIPLOMA'){
                sum += obj[key]*2500
            }
        }
    }
    return sum
}
