import { Link } from "react-router-dom";
import { Container, Box } from "@mui/material";
const Navbar = () => {
  return (
    <Box id="Navbar">
      <Link to="/" className="Nav">
        Main{" "}
      </Link>

      <Link to="/Management" className="Nav">
        Lottery Management{" "}
      </Link>
    </Box>
  );
};

export default Navbar;
