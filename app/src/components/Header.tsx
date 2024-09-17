import { GoPeople } from "react-icons/go";
import { BsChat } from "react-icons/bs";
import { IoPersonSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

function Header(){
    return (
      <div className="w-full md:w-[5%] border-r-2 border-black p-2">
        <nav className="flex flex-row md:flex-col gap-3 justify-between items-center md:justify-center">
          <Link to='/home' className="mb-3">
          <BsChat size={20}/>
          </Link>
          <Link to='/search' className="mb-3">
          <GoPeople size={20} />
          </Link>
          <Link to='/profile' className="md:absolute md:bottom-0 p-3">
          <IoPersonSharp size={20} />
          </Link>
        </nav>
      </div>
    );
}
export default Header;