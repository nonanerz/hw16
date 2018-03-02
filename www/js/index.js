/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

function initMap() {
    var myLatlng = {lat: 49.445, lng: 32.061};

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: myLatlng
    });
    google.maps.event.addListener(map, 'click', function(event) {
        $('#form').show();
        $('#lat').val(event.latLng.lat());
        $('#lng').val(event.latLng.lng());
    });

}

$(document).ready(function () {
  if ($('form').exists()) {
    // Enable jQuery Validation for the form
    $('form').validate({ onkeyup: false });

    // Add validation rules to the Address field
    $("#Address").rules("add", {
      fulladdress: true,
      required: true,
      messages: {
        fulladdress: "Google cannot locate this address."
      }
    });

    // This function will be executed when the form is submitted
    function FormSubmit() {
      $.submitForm = true;
      if (!$('form').valid()) {
        return false;
      } else {
        if ($("#Address").data("IsChecking") === true) {
          $("#Address").data("SubmitForm", true);
          return false;
        }
        return false;     // Supress the form submission for test purpose.
      }
    }

    // Attach the FormSubmit function to the Submit button
    if ($('#Submit').exists()) {
      $("#Submit").click(FormSubmit);
    }
    // Execute the ForumSubmit function when the form is submitted
    $('form').submit(FormSubmit);
  }
});

// Create a jQuery exists method
jQuery.fn.exists = function () {
  return jQuery(this).length > 0;
}

// Address jQuery Validator
function AddressValidator(value, element, paras) {
  // Convert the value variable into something a bit more descriptive
  var CurrentAddress = value;
  if (value.length === 0) {
    return true;
  }
  if ($(element).data("LastAddressValidated") == CurrentAddress) {
    return $(element).data("IsValid");
  }

  $(element).data("IsChecking", true);
  $(element).data("LastAddressValidated", CurrentAddress);

  /* Google Maps doesn't like line-breaks, remove them */
  CurrentAddress = CurrentAddress.replace(/\n/g, "");

  /* Create a new Google geocoder */
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'address': CurrentAddress }, function (results, status) {

    // Google reported a valid geocoded address
    if (status == google.maps.GeocoderStatus.OK) {

      // Get the formatted Google result
      var address = results[0].formatted_address;

      /* Count the commas in the fomatted address. This doesn't look great, but it helps us understand how specific the geocoded address is.  For example, "CA" will geocde to "California, USA". */
      numCommas = address.match(/,/g).length;

      /* A full street address will have at least 3 commas.  Alternate techniques involve fetching the address_components returned by Google Maps. That code looked even more ugly. */
      if (numCommas >= 3) {
        address = address.replace(/, /, "\n");
        $(element).val(address);
        $(element).data("LastAddressValidated", address);
        $(element).data("IsValid", true);
      } else {
        /* Google Maps was able to geocode the address, but it wasn't specific enough (not enough commas) to be a valid street address. */
        $(element).data("IsValid", false);
      }
    } else {
      $(element).data("IsValid", false);
    }
    $(element).data("IsChecking", false);

    // Get the parent form element for this address field
    var form = $(element).parents('form:first');

    if ($(element).data("SubmitForm") === true) {
      form.submit();
    } else {
      form.validate().element(element);
    }
  });
  /* The Address validator always returns 'true' when initially called. The true result will be return later by the geocode function (above) */
  return true;
}
// Define a new jQuery Validator method
$.validator.addMethod("fulladdress", AddressValidator);


app.initialize();
