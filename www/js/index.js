let app = {
  initialize: function () {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false)
  },
  onDeviceReady: function () {
    this.receivedEvent('deviceready')
  },

  receivedEvent: function (id) {
      let appElements = {
          parentElement: document.getElementById(id),
          listeningElement: this.parentElement.querySelector('.listening'),
          receivedElement: this.parentElement.querySelector('.received')
      }
      appElements.listeningElement.setAttribute('style', 'display:none')
      appElements.receivedElement.setAttribute('style', 'display:block')
  }
}

// map initialization
function initMap () {
  let myLatlng = {lat: 49.445, lng: 32.061}
  // zoom map to the target area
  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: myLatlng
  })
  $('#map').css('height', $(window).height())

  // get list of the events
  $.ajax({
    url: 'https://polar-gorge-30507.herokuapp.com/api/v1/events',
    type: 'get',
    success: function (data) {
      data.events.forEach(item => {
        let position = new google.maps.LatLng(item.lat, item.lng)

        let marker = new google.maps.Marker({
          position: position,
          title: 'Hello World!'
        })
        // generate tooltip content
        let contentString =
                    `<div>
                         <strong>Event name:</strong>
                         <p>${item.title}</p><br/>
                         <strong>Description:</strong>
                         <p>${item.description}</p><br/>
                         <strong>At:</strong>
                         <p>${item.date}</p>
                    </div>`

        let infowindow = new google.maps.InfoWindow({
          content: contentString
        })
        marker.addListener('click', function () {
          infowindow.open(map, marker)
        })
        marker.setMap(map)
      })
    }
  })

  // get coordinates by clicking on map
  google.maps.event.addListener(map, 'click', function (event) {
    $('#form').show()
    $('#map').hide()
    $('#lat').val(event.latLng.lat())
    $('#lng').val(event.latLng.lng())
  })

  $('#submit').click(function () {
    let event = {
        title: $('#title').val(),
        description: $('#description').val(),
        date: $('#datetimepicker').data('DateTimePicker').date(),
        lng: $('#lng').val(),
        lat: $('#lat').val(),
        isValid: true
    }

    // validate form
    if (event.title === '') {
      $('#title_error').text('title is required')
      isValid = false
    } else {
      $('#title').text('')
    }

    if (event.description === '') {
      $('#description_error').text('description is required')
        event.isValid = false
    } else {
      $('#description').text('')
    }

    if (event.date === '') {
      $('#datepicker_error').text('date is is required')
        event.isValid = false
    } else {
      $('#datepicker').text('')
    }
    // submit new event
    if (event.isValid) {
        event.date = moment(event.date).format()
      $.ajax({
        url: 'https://polar-gorge-30507.herokuapp.com/api/v1/events',
        type: 'post',
        data: JSON.stringify(event),
        headers: {
          'Content-Type': 'application/json'
        },
        dataType: 'json',
        success: function (data) {
          let position = new google.maps.LatLng(data.event.lat, data.event.lng)
          let marker = new google.maps.Marker({
            position: position,
            title: 'Hello World!'
          })

            //generate tooltip content
          let contentString =
                        `<div>
                         <strong>Event name:</strong>
                         <p>${data.event.title}</p><br/>
                         <strong>Description:</strong>
                         <p>${data.event.description}</p><br/>
                         <strong>At:</strong>
                         <p>${data.event.date}</p>
                    </div>`

          let infowindow = new google.maps.InfoWindow({
            content: contentString
          })
          marker.addListener('click', function () {
            infowindow.open(map, marker)
          })
          marker.setMap(map)

            //back to map view
          $('#form').hide()
          $('#map').show()
            //clean up fields
          $('#title').val('')
          $('#description').val('')
          $('#datepicker').val('')
        }
      })
    }
  })
  $('#cancel').click(function () {
    //back to map view on event creation cancel
    $('#form').hide()
    $('#map').show()
  })
}

app.initialize()
