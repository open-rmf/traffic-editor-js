import React, { useRef } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import * as THREE from 'three';

import { useStore } from './Store';
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
        try {
          const telemetry_payload = JSON.parse(payload.toString());
          console.log('parsed telemetry ok');
          console.log(telemetry_payload);
          if (telemetry_payload['latitude'] &&
            telemetry_payload['longitude']) {
            let robots = useStore.getState().mqtt_robot_telemetry;
            let found_robot = false;
            robots = robots.map(robot => {
              if (robot.name === robot_name) {
                robot.position.x = telemetry_payload['latitude'];
                robot.position.y = telemetry_payload['longitude'];
                found_robot = true;
              }
              return robot;
            });
            if (!found_robot) {
              const robot_telemetry = {
                name: robot_name,
                position: new THREE.Vector3(
                  telemetry_payload['latitude'],
                  telemetry_payload['longitude'],
                  0),
                heading: 0,
              };
              robots = [...robots, robot_telemetry];
            }
            console.log(robots);
            useStore.setState({ mqtt_robot_telemetry: robots });
          }
        }
        catch (e) {
          console.log('unable to parse: ' + payload.toString());
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
          <TextField id="broker-host" inputRef={broker_host} variant="outlined" label="Broker Host" />
        </div>
        <div>
          <TextField id="broker-port" inputRef={broker_port} variant="outlined" label="Broker Port" />
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
