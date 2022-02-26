import {Link} from "react-router-dom"

const Navbar = () => {
    return (
        <div id="Navbar" > 
            <Link to="/" className="Nav">Main  </Link>
            
            <Link to="/Account" className="Nav">Personal Account  </Link>
            
            <Link to="/Management" className="Nav">Lottery Management  </Link>
        </div>
    )
}

export default Navbar
