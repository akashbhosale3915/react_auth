import { BeatLoader } from "react-spinners";

type SpinnerProps = {
  size?: number;
  color?: string;
};

const Spinner = ({
  size,
  color = "#36d7b7",
}: SpinnerProps) => {
  return <BeatLoader color={color} size={size} />;
};

export default Spinner;
