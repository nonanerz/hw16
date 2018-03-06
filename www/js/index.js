/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License") you may not use this file except in compliance
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
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false)
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready')
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id)
        var listeningElement = parentElement.querySelector('.listening')
        var receivedElement = parentElement.querySelector('.received')

        listeningElement.setAttribute('style', 'display:none')
        receivedElement.setAttribute('style', 'display:block')

        console.log('Received Event: ' + id)
    }
}

function initMap() {
    var myLatlng = {lat: 49.445, lng: 32.061}

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: myLatlng
    })


    $.ajax({
        url: 'https://polar-gorge-30507.herokuapp.com/api/v1/events',
        type: 'get',
        success: function (data) {
            data.events.forEach(item => {

                var position = new google.maps.LatLng(item.lat, item.lng);

                var marker = new google.maps.Marker({
                    position: position,
                    title: "Hello World!"
                });

                var contentString =
                    `<div>
                         <strong>Event name:</strong>
                         <p>${item.title}</p><br/>
                         <strong>Description:</strong>
                         <p>${item.description}</p><br/>
                         <strong>At:</strong>
                         <p>${item.date}</p>
                    </div>`;

                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });
                marker.addListener('click', function () {
                    infowindow.open(map, marker);
                });
                marker.setMap(map);

            })
        }


    });


    google.maps.event.addListener(map, 'click', function (event) {
        $('#form').show()
        $('#lat').val(event.latLng.lat())
        $('#lng').val(event.latLng.lng())
    })

    $("#submit").click(function () {
        var title = $("#title").val()
        var description = $("#description").val()
        var selectedDate = $('#datetimepicker').data("DateTimePicker").date()
        var lng = $('#lng').val()
        var lat = $('#lat').val()

        var isValid = true

        if (title === "") {
            $("#title_error").text("title is required")
            isValid = false
        } else {
            $("#title").text("")
        }

        if (description === "") {
            $("#description_error").text("description is required")
            isValid = false
        } else {
            $("#description").text("")
        }

        if (selectedDate === "") {
            $("#datepicker_error").text("date is is required")
            isValid = false
        } else {
            $("#datepicker").text("")
        }

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
                    "Content-Type": "application/json"
                },
                dataType: 'json',
                success: function (data) {
                    console.log(data.event)

                    var position = new google.maps.LatLng(data.event.lat, data.event.lng);

                    var marker = new google.maps.Marker({
                        position: position,
                        title: "Hello World!"
                    });

                    var contentString =
                        `<div>
                         <strong>Event name:</strong>
                         <p>${data.event.title}</p><br/>
                         <strong>Description:</strong>
                         <p>${data.event.description}</p><br/>
                         <strong>At:</strong>
                         <p>${data.event.date}</p>
                    </div>`;

                    var infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });
                    marker.addListener('click', function () {
                        infowindow.open(map, marker);
                    });
                    marker.setMap(map);

                    $('#form').hide()
                    $("#title").val('')
                    $("#description").val('')
                    $('#datepicker').val('')
                }
            });
        }
    })

}



app.initialize()
