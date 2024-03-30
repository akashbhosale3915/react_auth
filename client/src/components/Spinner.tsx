import { BeatLoader } from "react-spinners";

type SpinnerProps = {
  size?: number;
};

const Spinner = ({ size }: SpinnerProps) => {
  return <BeatLoader color="#36d7b7" size={size} />;
};

export default Spinner;
