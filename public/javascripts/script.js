function addToCart(proId){
   
    $.ajax({
        url:'/add-to-cart/'+proId,
        method:'get',
        success:(response)=>{
            if(response.status){
                let count=$('#cart-count').html()
                count=parseInt(count)+1
                $("#cart-count").html()
            }
            alert(response)
        }
    })
}


function placeOrder(){
    let first_name = document.myform.first_name.value;
    let last_name = document.myform.last_name.value;
    let country = document.myform.country.value;
    let state = document.myform.state.value;
    let address = document.myform.address.value;
    let city=document.myform.city.value;
    let zipCode = document.myform.zipCode.value;
    let phone = document.myform.phone.value;
    let email = document.myform.email.value;

    let nameRegx=/^([A-Za-z]){3,20}$/gm
    let streetRegx=/^([A-Za-z]){3,20}$/gm
    let streetRegx1=/^([A-Za-z]){3,20}$/gm
    let stateRegx=/^([A-Za-z ]){3,20}$/gm
    let countryRegx=/^([A-Za-z]){3,20}$/gm
    let lnameRegx=/^([A-Za-z]){1,20}$/gm
    let zipRegx=/^([0-9]){6}$/gm 
    let phoneRegx=/^([0-9]){10}$/gm
    let emailRegx=/^(\w){3,16}@([A-Za-z]){5,8}.([A-Za-z]){2,3}$/gm

    if(first_name == ''){
      document.getElementById('err').innerHTML="Firstname field required";
        return false;
    }
    else if(nameRegx.test(first_name) == false){
      document.getElementById('err').innerHTML = "Firstname should be characters and should atleast have 4 characters";
        return false;
    }
    else if(last_name == ''){
      document.getElementById('err').innerHTML="Lastname field required";
        return false;
    }
    else if(lnameRegx.test(last_name) == false){
      document.getElementById('err').innerHTML = "Lastname should be characters";
        return false;
    }
    else if(address == ''){
      document.getElementById('err').innerHTML="Street name required";
        return false;
    }
    // else if(streetRegx1.test(address) == false){
    //   document.getElementById('err').innerHTML = "Street name should atleast have 4 characters";
    //     return false;
    // }
    else if(state == ''){
      document.getElementById('err').innerHTML="State name required";
        return false;
    }
    else if(stateRegx.test(state) == false){
      document.getElementById('err').innerHTML = "State name should atleast have 4 characters";
        return false;
    }
    else if(country == ''){
      document.getElementById('err').innerHTML="Town name required";
        return false;
    }
    else if(city == ''){
        document.getElementById('err').innerHTML="Street name required";
          return false;
      }
    else if(countryRegx.test(city) == false){
      document.getElementById('err').innerHTML = "Town name should atleast have 4 characters";
        return false;
    }
    else if(zipCode == ''){
      document.getElementById('err').innerHTML="Zip code required";
        return false;
    }
    else if(zipRegx.test(zipCode) == false){
      document.getElementById('err').innerHTML = "zip code should have 6 digits";
        return false;
    }
    else if(phone == ''){
      document.getElementById('err').innerHTML="Phone number required";
        return false;
    }
    // else if(streetRegx.test(city) == false){
    //     document.getElementById('err').innerHTML = "Street name should atleast have 4 characters";
    //       return false;
    //   }
    else if(phoneRegx.test(phone) == false){
      document.getElementById('err').innerHTML = "Phone number should have 10 digits";
        return false;
    }
    else if(email == ''){
      document.getElementById('err').innerHTML="Email id required";
        return false;
    }
    else if(emailRegx.test(email) == false){
      document.getElementById('err').innerHTML = "Enter valid email id";
        return false;
    }
  }
  function checkCoupon(){
    let coupon = document.couponForm.name.value;
    let expiryDate = document.couponForm.date.value;
    let minItems = document.couponForm.items.value;
    let minAmount = document.couponForm.amount.value;
    let discount = document.couponForm.discount.value;

    let couponRegex=/^([A-Za-z0-9]){3,20}$/gm;
    let itemRegex=/^([0-9]){1,6}$/gm;
    let amountRegex=/^([0-9]){1,6}$/gm;
    let discountRegex=/^([0-9]){1,6}$/gm;
    console.log(coupon);
    console.log(expiryDate);
    console.log(minItems);

    if(coupon == ''){
      document.getElementById('errMsg').innerHTML="Coupon field required";
        return false;
    }
    else if(couponRegex.test(coupon) == false){
      document.getElementById('errMsg').innerHTML="Invalid coupon code";
        return false;
    }
    else if(expiryDate == ''){
      document.getElementById('errMsg').innerHTML="Date field required";
        return false;
    }
    else if(minItems == ''){
      document.getElementById('errMsg').innerHTML="Minimum items field required";
        return false;
    }
    else if(itemRegex.test(minItems) == false){
      document.getElementById('errMsg').innerHTML="Minimum items should be a number";
        return false;
    }
    else if(minAmount == ''){
      document.getElementById('errMsg').innerHTML="Minimum amount field required";
        return false;
    }
    else if(amountRegex.test(minAmount) == false){
      document.getElementById('errMsg').innerHTML="Minimum amount should be a number";
        return false;
    }
    else if(discount == ''){
      document.getElementById('errMsg').innerHTML="Discount field required";
        return false;
    }
    else if(discountRegex.test(discount) == false){
      document.getElementById('errMsg').innerHTML="Discount should be a number";
        return false;
    }

  } 