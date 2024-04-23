# Meshtastic To APRS
This application can be used to send location updates received from a Meshtastic node to APRS-IS.

## How to run
- Set up the Meshtastic device
- Enable MQTT and make sure to enable the JSON option
- Create a copy of `config.example.json` named `config.json`
- Fill in your Meshtastic and APRS details
  - The node_id is a numeric ID and can be found in the Meshtastic app
- Run `docker-compose up`
