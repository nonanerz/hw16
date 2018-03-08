Homework 17

Cordova + jQuery + Express + Google maps = locator of events

## Instructions
1. Clone the repo: https://github.com/nonanerz/hw16.git
2. Add platform android: `cordova platform add android`
3. Install packages: `npm install` 
4. Run the emulator:`cordova emulate android`



# API 

## Events list
***GET***

`https://polar-gorge-30507.herokuapp.com/api/v1/events`

### Response

    {
        "events": [
            {
                "_id": "5a9f9112f16b1900144153ab",
                "title": "Yxyxyd",
                "description": "Qwert",
                "date": "2018-03-21T07:13:00.000Z",
                "lng": "25.71611093378681",
                "lat": "50.438981661348116",
                "__v": 0
            },
            {
                "_id": "5a9f9126f16b1900144153ac",
                "title": "Yee",
                "description": "Hdd",
                "date": "2018-03-29T06:13:00.000Z",
                "lng": "26.18584850118839",
                "lat": "49.43464898359957",
                "__v": 0
            }
        ]
    }
    
## Create event
***POST***

`https://polar-gorge-30507.herokuapp.com/api/v1/events`

### Request

    {
        "title": "test",
        "description": "asdad",
        "date": "2018-03-18T22:00:00-07:00",
        "lng":1,
        "lat":2
    }


### Response

    {
        "event": {
            "__v": 0,
            "title": "test",
            "description": "asdad",
            "date": "2018-03-19T05:00:00.000Z",
            "lng": "1",
            "lat": "2",
            "_id": "5aa195aad7341a0014227391"
        }
    }
    
#### Error 400

    {
        "error": {
            "errors": {
                "description": {
                    "message": "Path `description` is required.",
                    "name": "ValidatorError",
                    "properties": {
                        "type": "required",
                        "message": "Path `{PATH}` is required.",
                        "path": "description"
                    },
                    "kind": "required",
                    "path": "description",
                    "$isValidatorError": true
                },
                "date": {
                    "message": "Path `date` is required.",
                    "name": "ValidatorError",
                    "properties": {
                        "type": "required",
                        "message": "Path `{PATH}` is required.",
                        "path": "date"
                    },
                    "kind": "required",
                    "path": "date",
                    "$isValidatorError": true
                },
                "lng": {
                    "message": "Path `lng` is required.",
                    "name": "ValidatorError",
                    "properties": {
                        "type": "required",
                        "message": "Path `{PATH}` is required.",
                        "path": "lng"
                    },
                    "kind": "required",
                    "path": "lng",
                    "$isValidatorError": true
                },
                "title": {
                    "message": "Path `title` is required.",
                    "name": "ValidatorError",
                    "properties": {
                        "type": "required",
                        "message": "Path `{PATH}` is required.",
                        "path": "title"
                    },
                    "kind": "required",
                    "path": "title",
                    "$isValidatorError": true
                }
            },
            "_message": "Event validation failed",
            "message": "Event validation failed: description: Path `description` is required., date: Path `date` is required., lng: Path `lng` is required., title: Path `title` is required.",
            "name": "ValidationError"
        }
    }