let app = {
  initialize: function () {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false)
  },
  onDeviceReady: function () {
    this.receivedEvent('deviceready')
  },

  receivedEvent: function (id) {
    let parentElement = document.getElementById(id)
    let listeningElement = parentElement.querySelector('.listening')
    let receivedElement = parentElement.querySelector('.received')

    listeningElement.setAttribute('style', 'display:none')
    receivedElement.setAttribute('style', 'display:block')

    console.log('Received Event: ' + id)
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
    let title = $('#title').val()
    let description = $('#description').val()
    let selectedDate = $('#datetimepicker').data('DateTimePicker').date()
    let lng = $('#lng').val()
    let lat = $('#lat').val()

    let isValid = true
    // validate form
    if (title === '') {
      $('#title_error').text('title is required')
      isValid = false
    } else {
      $('#title').text('')
    }

    if (description === '') {
      $('#description_error').text('description is required')
      isValid = false
    } else {
      $('#description').text('')
    }

    if (selectedDate === '') {
      $('#datepicker_error').text('date is is required')
      isValid = false
    } else {
      $('#datepicker').text('')
    }
    // submit new event
    if (isValid) {
      selectedDate = moment(selectedDate).format()
      $.ajax({
        url: 'https://polar-gorge-30507.herokuapp.com/api/v1/events',
        type: 'post',
        data: JSON.stringify({
          title: title,
          description: description,
          date: selectedDate,
          lng: lng,
          lat: lat
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        dataType: 'json',
        success: function (data) {
          console.log(data.event)

          let position = new google.maps.LatLng(data.event.lat, data.event.lng)

          let marker = new google.maps.Marker({
            position: position,
            title: 'Hello World!'
          })

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

          $('#form').hide()
          $('#map').show()
          $('#title').val('')
          $('#description').val('')
          $('#datepicker').val('')
        }
      })
    }
  })
  $('#cancel').click(function () {
    $('#form').hide()
    $('#map').show()
  })
}

app.initialize()
