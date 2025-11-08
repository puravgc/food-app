import { CircularProgress } from "@mui/material";

const Loader = ({ size = 18, color = "white" }) => {
  return (
    <div>
      <CircularProgress size={size} sx={{ color }} />
    </div>
  );
};

export default Loader;
