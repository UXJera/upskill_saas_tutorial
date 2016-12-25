/* global $, Stripe */

// Document Ready (wait until document is fully loaded)

$(document).on('turbolinks:load', function(){
  var theForm   = $('#pro_form');
  var submitBtn = $('#form-submit-btn');
  
  // Set Stripe public key - needed to be done before it is sent to Stripe
  Stripe.setPublishableKey( $('meta[name="stripe-key"]').attr('content') );
  
  // When user clicks 'form submit'
  submitBtn.click(function(event){
    //  We will prevent the default submission behavior
    event.preventDefault();
    
    // Collect Credit Card fields
    var ccNum     = $('#card_number').val(),
        cvcNum    = $('#card_code').val(),
        expMonth  = $('#card_month').val(),
        expYear   = $('#card_year').val();
        
    // Send card information to Stripe
    Stripe.createToken({
        number:     ccNum,
        cvc:        cvcNum,
        exp_month:  expMonth,
        exp_year:   expYear
      }, stripeResponseHandler);
    });
  
  

  // Stripe will return a card token
  // Inject card token as hidden field in the form
  // Submit form to our Rails App
})