import Building from './Building';

type BuildingSummaryProps = {
  building: Building;
}

export default function BuildingSummary(props: BuildingSummaryProps): JSX.Element {
  return (
    <div>
      <h3>{props.building.filename}</h3>
      {props.building.xml}
    </div>
  );
}
