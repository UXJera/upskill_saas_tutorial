/* global $, Stripe */

// Document Ready (wait until document is fully loaded)

$(document).on('turbolinks:load', function(){
  var theForm   = $('#pro_form'),
      submitBtn = $('#form-submit-btn');
  // Set Stripe public key - needed to be done before it is sent to Stripe
  Stripe.setPublishableKey( $('meta[name="stripe-key"]').attr('content') );
  // When user clicks 'form submit'
  submitBtn.click(function(event){
    //  We will prevent the default submission behavior
    event.preventDefault();
    submitBtn.val("Processing").prop('disabled', true);
    // Collect Credit Card fields
    var ccNum     = $('#card_number').val(),
        cvcNum    = $('#card_code').val(),
        expMonth  = $('#card_month').val(),
        expYear   = $('#card_year').val();
    // Use Stripe JS library to check for card errors
    var error     = false;
    
    // Validate card number
    if(!Stripe.card.validateCardNumber(ccNum)) {
      error = true;
      alert('The credit card number appears to be invalid.');
    }
    // Validate CVC number
    if(!Stripe.card.validateCVC(cvcNum)) {
      error = true;
      alert('The CVC number appears to be invalid.');
    }
    // Validate expiration date number
    if(!Stripe.card.validateExpiry(expMonth, expYear)) {
      error = true;
      alert('The expiration date appears to be invalid.');
    }
    if (error) {
      // If there are card errors, don't send to Stripe
      // We also want the button to revert so that it can be sent again
      submitBtn.prop('disabled', false).val("Sign Up");
    } else {
      // Otherwise, Send card information to Stripe
      Stripe.createToken({
        number:     ccNum,
        cvc:        cvcNum,
        exp_month:  expMonth,
        exp_year:   expYear
      }, stripeResponseHandler);
    }
      // This helps exit out of the function
      return false;
    });
    // Stripe will return a card token
    function stripeResponseHandler(status, response) {
      // Get the token from the response
      var token = response.id;
      //Inject the card token in a hidden field
      theForm.append($('<input type="hidden" name="user[stripe_card_token]">').val(token));
      // Submit form to our Rails App
      theForm.get(0).submit();
    };
})