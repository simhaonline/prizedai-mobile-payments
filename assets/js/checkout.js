

var successCallback = function() {

	var checkout_form = jQuery( 'form.woocommerce-checkout' );

	// deactivate the tokenRequest function event
	checkout_form.off( 'checkout_place_order', paymentRequest );

	// submit the form now
	checkout_form.submit();

};

var paymentRequest = function() {


	var mpesaPhoneNumber = jQuery( '#prizedai-mpesa-number' ).val().trim().split(' ').join('');

	if( isNaN(mpesaPhoneNumber) || !mpesaPhoneNumber.length || mpesaPhoneNumber.length < 10 || mpesaPhoneNumber.length > 13 )
	{
		jQuery( '#prizedai-mpesa-number' ).css('border-bottom-color','#a94442');
		jQuery( '#prizedai-mpesa-number-helper' ).removeClass('hidden');
		return false;
	}
	else
	{
		jQuery( '#prizedai-mpesa-number-helper' ).addClass('hidden');
		jQuery( '#prizedai-mpesa-number' ).css('border-bottom','0');

	}

	prizedai_hide_submit( hide = true );
  jQuery.ajax({
        type: "POST",
        url:"/index.php?payment_action=1",
        data:{
            mpesaPhoneNumber:mpesaPhoneNumber,
        },
        success:function(data){
					if( data !== '0' )
					{
						jQuery( '#prizedai-mpesa-status-info' ).html( '<strong>Please enter MPESA you pin on your phone.</strong>' );
						transactionID = data;
					}
					else
						jQuery( '#prizedai-mpesa-status-info' ).html( '<strong>Failed. please try again</strong>' );
        }
    });
	return false;

};

jQuery(function($){

	var checkout_form = $( 'form.woocommerce-checkout' );
	checkout_form.on( 'checkout_place_order', paymentRequest );
	showLoader = false;
	transactionID = null;

	$("#billing_phone").keyup(function(){
	  $('#prizedai-mpesa-number').val( $("#billing_phone").val() );
	});

});


jQuery("input").change(function(){
  alert("The text has been changed.");
});

jQuery(document).ajaxStart(function(){
	if( showLoader )
	{
		jQuery('#peizedai-mpesa-loader').removeClass("prizedai-hidden");
		jQuery('#prizedai-mpesa-field-controls').addClass("prizedai-hidden");
	}
});

jQuery(document).ajaxStop(function(){
	if( showLoader )
	{
		jQuery('#peizedai-mpesa-loader').addClass("prizedai-hidden");
		jQuery('#prizedai-mpesa-field-controls').removeClass("prizedai-hidden");
	}


});

function prizedai_hide_submit( hide = true )
{
	jQuery('#place_order').attr('disabled',hide);
	showLoader = hide;

}

function prizedai_complete_mpesa()
{
	showLoader = true;
	jQuery.ajax({
        type: "POST",
        url:"/index.php?payment_status=1",
        data:{
            transactionID:transactionID,
        },
        success:function(data){
					if( data === '1' )
						successCallback();
					else
						jQuery( '#prizedai-mpesa-status-info' ).html( '<strong>Payment not received. Please wait.</strong>' );
        }
    });
}
