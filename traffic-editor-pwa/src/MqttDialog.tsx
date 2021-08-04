import React, { useRef } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';

import { useStore, RobotTelemetry } from './Store';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme } from '@material-ui/core/styles';
import mqtt from 'mqtt';

const useStyles = makeStyles((theme: Theme) => ({
  dialog: {
    backgroundColor: theme.palette.background.paper,
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

type MqttDialogProps = {
  open: boolean;
  close: () => void;
};

export default function NewDialog(props: MqttDialogProps): JSX.Element {
  const classes = useStyles(props);
  const broker_host = useRef<HTMLInputElement>();
  const broker_port = useRef<HTMLInputElement>();

  const onOK = () => {
    // todo: use host/port strings
    const client = mqtt.connect("ws://localhost:9001");
    client.on('connect', () => {
      console.log('MQTT connected!');
      client.subscribe('/robots/#');
    });
    client.on('message', (topic, payload, packet) => {
      //if (top
      console.log('topic: ' + topic + '   payload: ' + payload);
      const topic_tokens = topic.split('/');
      if (topic_tokens.length === 4 &&
        topic_tokens[1] === "robots" &&
        topic_tokens[3] === "state") {
        const robot_name = topic_tokens[2];
        console.log('robot name: ' + robot_name);
        let telemetry_payload = {};
        try {
          telemetry_payload = JSON.parse(payload.toString());
        }
        catch (e) {
          console.log('unable to parse: ' + payload.toString());
        }
        if ('latitude' in telemetry_payload &&
          'longitude' in telemetry_payload) {

          // a bit of trig to convert lat/lon to web mercator
          // the extra 1000 scale is needed to make the drag-threshold
          // detection work nicely in OrbitControls
          const lat_webm = 256000 * (telemetry_payload['longitude'] + 180) / 360;
          const lat_radians = telemetry_payload['latitude'] * Math.PI / 180;
          const lon_webm = -(128000 - 256000 * Math.log(Math.tan(Math.PI / 4 + lat_radians / 2)) / (2 * Math.PI));
          console.log(`telemetry: (${telemetry_payload['latitude']}, ${telemetry_payload['longitude']}) -> (${lat_webm}, ${lon_webm})`);

          // deal with heading
          let heading = 0;
          if ('heading' in telemetry_payload) {
            heading = telemetry_payload['heading'];  // todo: radians?
          }

          let robots = useStore.getState().mqtt_robot_telemetry;
          let found_robot = false;
          robots = robots.map(robot => {
            if (robot.name === robot_name) {
              let updated_robot: RobotTelemetry = {
                name: robot.name,
                x: lat_webm,
                y: lon_webm,
                z: 0,
                heading: heading,
              };
              found_robot = true;
              return updated_robot;
            }
            else {
              return robot;
            }
          });
          if (!found_robot) {
            const robot_telemetry = {
              name: robot_name,
              x: lat_webm,
              y: lon_webm,
              z: 0,
              heading: heading,
            };
            robots = [...robots, robot_telemetry];
          }
          useStore.setState({ mqtt_robot_telemetry: robots });
        }
      }
    });
    useStore.setState({ mqtt_client: client });
    props.close();
  }
  /*
  useStore.setState({
    site: site,
    selection: null,
    cameraInitialPose: cameraInitialPose,
  });
  props.close();
  */

  return (
    <Dialog open={props.open} onClose={props.close}>
      <DialogTitle>MQTT Connection</DialogTitle>
      <DialogContent className={classes.dialog}>
        <div>
          <TextField
            id="broker-host"
            inputRef={broker_host}
            variant="outlined"
            label="Broker Host"
            defaultValue="localhost" />
        </div>
        <div>
          <TextField
            id="broker-port"
            inputRef={broker_port}
            type="number"
            variant="outlined"
            label="Broker Port"
            defaultValue="9001" />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onOK} color="primary">
          OK
        </Button>
        <Button onClick={props.close} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
