(function( $ ){

	var form;

	var methods = {

		init: function(options){
			this.options = $.extend( {}, defaults, options);
			form = this;
			form.attr('novalidate','');
			console.log(this.attr('id'));
			this.bind('submit',function(){
				return form.options.validateForm();
			});
		},

		validateForm: function(forceFocus){
			var errors = "";
			forceFocus = typeof forceFocus !== 'undefined' ? forceFocus : true;
			
			var errorFields = jQuery.map( $(":input",form), function(el,i){ return form.options.validateField(el,form); } );

			//This will sort your array
			function domIndexSort(a, b){
				var aIndex = $(a).index();
				var bIndex = $(b).index();
				return ((aIndex < bIndex) ? -1 : ((aIndex > bIndex) ? 1 : 0));
			}

			errorFields = errorFields.sort(domIndexSort);

			$('.messages').empty();
			$(':input','.error').unbind('change');
			$('.error').removeClass('error');

			if(errorFields.length)
			{
				var firstField = errorFields[0];

				if(forceFocus) firstField.focus();

				for(var field in errorFields)
				{
					form.options.displayFieldErrorMessage(errorFields[field],undefined,form);
				}
				return false;
			}
			else
			{
				return true;
			}
		},


		displayFieldErrorMessage: function(field,customMessage,form){
			customMessage = typeof customMessage !== 'undefined' ? customMessage : null;
			
			var message = customMessage?customMessage:form.options.getValidationMessage(field);
			var element = $(field);
			var controlGroupElement = element.closest('.control-group').addClass('error');
			
			messageElement = $('.messages',controlGroupElement);
			messageElement.append("<div class='help-inline'>"+message+"</div>");
			
			element.bind('change',function(){ form.options.validateForm( form, false ); });
		},
		
		getValidationMessage: function(field, defaultMessage){
			field = $(field);
			if(field.attr('message') !== undefined){
				return field.attr('message') + '\n';
			} else if(field.attr('title') !== undefined){
				return field.attr('title') + '\n';
			} else {
				return "";
			}
			
			return;
		},

		// contains all validation rules
		validateField: function(field,form) {
			field = $(field);
			var value = field.val();
			var isRequired = field.attr('required')!==null&&field.attr('required')!='false';
			var validationType = field.attr('validate');
			var regex = field.attr('regex');
			
			if(isRequired && (!value || !value.length))
			{
				return field;
			}
			
			if(value) // only validate fields with values against rules
			{
				switch(validationType){
					case "regex":
					regex = new RegExp( regex );
					if(!value.match(regex)){
						return field;
					}
					break;
				case "match":
					var matchElement = $("#"+field.attr('matches'));
					if(value !== matchElement.val()){
						return field;
					}
				}
			}

			return null;
		}
	};

	var defaults = {
		validateForm:methods.validateForm,
		validateField:methods.validateField,
		displayFieldErrorMessage:methods.displayFieldErrorMessage,
		getValidationMessage:methods.getValidationMessage
	};

	$.fn.ezValidate = function(method){

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.ezValidate' );
		}
	};
	
})(jQuery);
