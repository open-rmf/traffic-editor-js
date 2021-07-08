import * as THREE from 'three'
import React from 'react';
//import { useStore } from './Store';
import { useThree } from '@react-three/fiber';
import { SceneMapTile } from './SceneMapTile';

type SceneMapProps = {
}

function r(value: number): string {
  return (value >= 0 ? '+' : '') + (Math.round(value * 10000) / 10000).toFixed(4);
}

/*
function printMatrix(name: string, m: THREE.Matrix4) {
  console.log(name);
  const e = m.elements;
  // it's stored column-major...
  console.log(`${r(e[0])} ${r(e[4])} ${r(e[8])} ${r(e[12])}`);
  console.log(`${r(e[1])} ${r(e[5])} ${r(e[9])} ${r(e[13])}`);
  console.log(`${r(e[2])} ${r(e[6])} ${r(e[10])} ${r(e[14])}`);
  console.log(`${r(e[3])} ${r(e[7])} ${r(e[11])} ${r(e[15])}`);
}

function printVector(name: string, v: THREE.Vector4) {
  console.log(`${name}: ${r(v.x)} ${r(v.y)} ${r(v.z)} ${r(v.w)}`);
}
*/

function clamp(v: number, v_min: number, v_max: number): number {
  if (v < v_min)
    return v_min;
  else if (v > v_max)
    return v_max;
  return v;
}

type TileDescription = {
  x: number,
  y: number,
  zoom: number,
}

export function SceneMap(props: SceneMapProps): JSX.Element {
  const [tileCache, setTileCache] = React.useState(new Map<TileDescription, JSX.Element>());
  const [tiles, setTiles] = React.useState<TileDescription[]>([]);
  const viewport = useThree(state => state.viewport);
  const camera = useThree(state => state.camera);
  const canvasSize = useThree(state => state.size);
  const currentPerformance = useThree(state => state.performance.current);

  React.useEffect(() => {
    // recalculate visible tiles after camera-control motion is completed
    // in the future, could also have a useFrame() handler checking if 
    // currentPerformance is <1 to have the tiles recalculate while the
    // motion is in-flight
    if (currentPerformance === 1) {
      //console.log('recalculate tiles');
      if (camera.constructor.name === 'OrthographicCamera') {
        const c: THREE.OrthographicCamera = camera as THREE.OrthographicCamera;
        /*
        console.log(`orthographic camera: ${c.left} ${c.right}, ${c.top}, ${c.bottom}, ${c.zoom}`);
        console.log(`  viewport: ${viewport.width}, ${viewport.height}`);
        console.log(`  dpr: ${viewport.dpr}`);
        console.log(`  aspect: ${viewport.aspect}`);
        console.log(`  canvas size: ${canvasSize.width}, ${canvasSize.height}`);
        printMatrix('projection', camera.projectionMatrix);
        printMatrix('projectionMatrixInverse', camera.projectionMatrixInverse);
        printMatrix('matrixWorld', camera.matrixWorld);
        printMatrix('matrixWorldInverse', camera.matrixWorldInverse);
         */
        // find world-coordinate bounds of the viewport: web mercator (0, 0) => (256, -256)
        const scale = 1000;

        const center_x = camera.matrixWorld.elements[12];
        const center_y = camera.matrixWorld.elements[13];
        const right_x = (center_x + c.right / c.zoom);
        const left_x = (center_x + c.left / c.zoom);
        const top_y = -(center_y + c.top / c.zoom);
        const bottom_y = -(center_y + c.bottom / c.zoom);
        console.log(`extents: (${r(left_x)}, ${r(top_y)}) - (${r(right_x)}, ${r(bottom_y)})`);

        // calculate web mercator zoom level do put a few tiles on the screen
        // todo: incorporate the number of pixels in the canvas; small resolutions don't need as many.
        let zoom_level = Math.ceil(1.5 + Math.log(scale * 256 / (right_x - left_x)) / Math.log(2));
        const MAX_ZOOM = 18;
        if (zoom_level < 0)
          zoom_level = 0;
        else if (zoom_level > MAX_ZOOM)
          zoom_level = MAX_ZOOM;
        console.log(`  zoom: ${zoom_level}`);

        let left_x_grid_idx = Math.floor(left_x / (256 * scale) * Math.pow(2, zoom_level));
        let right_x_grid_idx = Math.floor(right_x / (256 * scale) * Math.pow(2, zoom_level));
        // invert Y since we're operating in 4th quadrant to keep +z = "up"
        let top_y_grid_idx = Math.floor(top_y / (256 * scale) * Math.pow(2, zoom_level));
        let bottom_y_grid_idx = Math.floor(bottom_y / (256 * scale) * Math.pow(2, zoom_level));
        console.log(`  grid: (${left_x_grid_idx}, ${top_y_grid_idx}) - (${right_x_grid_idx}, ${bottom_y_grid_idx})`);


        //const PHI_MAX = 85.05112877980659;  // web mercator... 2*atan(e^pi) - pi/2
        //let top_y_grid_idx = Math.pow(2, zoom_level) - 1 - Math.floor(1 / (2 * PHI_MAX) * Math.pow(2, zoom_level) * (top_y + PHI_MAX));
        //let bottom_y_grid_idx = Math.pow(2, zoom_level) - 1 - Math.ceil(1 / (2 * PHI_MAX) * Math.pow(2, zoom_level) * (bottom_y + PHI_MAX));
        //const bottom_y_grid_idx = Math.floor(1 / 360 * Math.pow(2, zoom_level) * (right_x + 180));

        const max_cell = Math.pow(2, zoom_level) - 1;
        left_x_grid_idx = clamp(left_x_grid_idx, 0, max_cell);
        right_x_grid_idx = clamp(right_x_grid_idx, 0, max_cell);
        top_y_grid_idx = clamp(top_y_grid_idx, 0, max_cell);
        bottom_y_grid_idx = clamp(bottom_y_grid_idx, 0, max_cell);

        /*
        console.log(`horizontal ${left_x},${right_x} => ${left_x_grid_idx},${right_x_grid_idx}`);
        console.log(`vertical ${bottom_y},${top_y} => ${bottom_y_grid_idx},${top_y_grid_idx}`);
         */

        let next_tiles = Array<TileDescription>();
        for (let y_idx = top_y_grid_idx; y_idx <= bottom_y_grid_idx; y_idx++) {
          for (let x_idx = left_x_grid_idx; x_idx <= right_x_grid_idx; x_idx++) {
            //console.log(`looking for tile (${x_idx}, ${y_idx}, ${zoom_level})`);
            //const tile_str = `${x_idx}_${y_idx}_${zoom_level}`;
            const tile_desc = { x: x_idx, y: y_idx, zoom: zoom_level };
            next_tiles.push(tile_desc);
          }
        }
        setTiles(next_tiles);

        /*
        const upper_left = new THREE.Vector4(c.left, c.top, 0, 1);
        upper_left.applyMatrix4(camera.projectionMatrix);
        upper_left.applyMatrix4(camera.matrixWorld);
        //const upper_left_cast: THREE.Vector4 = camera.matrixWorld * camera.projectionMatrix * upper_left;
        printVector('upper_left', upper_left);
         */
      }
      else {
        console.log('todo: calculate tiles for perspective camera');
      }
      
    }
  }, [currentPerformance, camera, viewport, canvasSize]);

  React.useMemo(() => {
    // spin through the requested tiles and add them to the tile cache if they're not already there.
    // todo: might as well put this block in the useEffect() block above
    tiles.map(tile_desc => {
      if (!(tileCache.has(tile_desc))) {
        setTileCache(prevCache => new Map<TileDescription, JSX.Element>(prevCache).set(tile_desc, <SceneMapTile x={tile_desc.x} y={tile_desc.y} zoom={tile_desc.zoom} />));
      }
      return 42;  // todo: not this...
    });
  }, [tiles, tileCache]);

  /*
  useFrame(state => {
    //console.log(`viewport: ${state.viewport.width}, ${state.viewport.height}, ${state.viewport.factor}`);
    //console.log(`camera: ${state.camera.projectionMatrix.elements}  ${state.camera.matrixWorld.elements}`);
    //console.log(`viewport: ${state.viewport.width}, ${state.viewport.height}, ${state.viewport.factor}`);
    //console.log(`camera class: ${typeof state.camera.constructor.name}`);

  });
  */

  //console.log(`viewport: ${viewport.width}, ${viewport.height}, ${viewport.factor}`);
  // compute which tiles are in the viewport
  //

  return (
    <group>
      {tiles.map(tile_desc => tileCache.get(tile_desc))}
    </group>
  );
}
