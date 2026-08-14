import { Menu, Search } from "lucide-react";
import icon from "../../icon.png";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="bg-[#F8F8F8] p-6 flex flex-row justify-around">
      <div className="flex flex-row gap-x-2"></div>
      <div>
        <Image height={"50"} src={icon} alt="" />
      </div>
      <div className="flex flex-row gap-x-2"></div>
    </div>
  );
};

export default Navbar;
