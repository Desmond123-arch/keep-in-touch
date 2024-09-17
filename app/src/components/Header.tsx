import { GoPeople } from "react-icons/go";
import { BsChat } from "react-icons/bs";
import { IoPersonSharp } from "react-icons/io5";

function Header(){
    return (
      <div className="w-full md:w-[5%] border-r-2 border-black p-2">
        <nav className="flex flex-row md:flex-col gap-3 justify-between items-center md:justify-center">
          <div className="mb-3">
          <BsChat size={20}/>
          </div>
          <div className="mb-3">
          <GoPeople size={20} />
          </div>
          <div className="md:absolute md:bottom-0 p-3">
          <IoPersonSharp size={20} />
          </div>
        </nav>
      </div>
    );
}
export default Header;