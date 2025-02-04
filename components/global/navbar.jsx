import { navItems } from "@constants/index.js";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@components/ui/button";

export default function Navbar() {
  return (
    <nav className="px-8 py-10 bg-[#F4F8FE] flex justify-between items-center">
      <div>
        <Image
          src={"/logo.svg"}
          alt="squirrel-pilot-logo"
          width={200}
          height={200}
        />
      </div>
      <div className="hidden gap-10 lg:flex">
        {navItems.map((item, index) => (
          <Link href={item.path} key={index}>
            <li className="text-[#6B7280] text-md font-medium list-none hover:text-[#0C1E5B] ">
              {item.title}
            </li>
          </Link>
        ))}
      </div>
      <div className="md:block hidden">
        <Button className="border-2 border-[#0C1E5B] px-10 bg-white text-[#0C1E5B]  py-2 rounded-md hover:bg-[#0C1E5B] hover:text-white">
          <Link href="/auth/register">Get Started</Link>
        </Button>
      </div>
    </nav>
  );
}
