import React, { useState } from "react";
import { Collapse } from "react-collapse";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Multilevel from "./Multi";

const Submenu = ({ activeSubmenu, item, i, locationName }) => {
  const [activeMultiMenu, setMultiMenu] = useState(null);
  const toggleMultiMenu = (j) => {
    setMultiMenu(activeMultiMenu === j ? null : j);
  };

  return (
    <Collapse isOpened={activeSubmenu === i}>
      <ul className="sub-menu space-y-4">
        {item.child?.map((subItem, j) => {
          const isActive = locationName.includes(
            subItem.childlink.replace(/^\//, "")
          );

          return (
            <li key={j} className="block pl-4 pr-1 first:pt-4 last:pb-4">
              {subItem?.multi_menu ? (
                <div>
                  <div
                    onClick={() => toggleMultiMenu(j)}
                    className={`${
                      activeMultiMenu
                        ? "text-[#f36622] font-medium"
                        : "text-slate-600 dark:text-slate-300"
                    } text-sm flex space-x-3 items-center transition-all duration-150 cursor-pointer`}
                  >
                    <span
                      className={`${
                        activeMultiMenu
                          ? "bg-[#f36622] ring-4 ring-[#f36622]/30"
                          : "border-slate-600 dark:border-white"
                      } h-2 w-2 rounded-full border inline-block flex-none`}
                    ></span>
                    <span className="flex-1">{subItem.childtitle}</span>
                    <span className="flex-none">
                      <span
                        className={`menu-arrow transform transition-all duration-300 ${
                          activeMultiMenu === j ? "rotate-90" : ""
                        }`}
                      >
                        <Icon icon="ph:caret-right" />
                      </span>
                    </span>
                  </div>
                  <Multilevel
                    activeMultiMenu={activeMultiMenu}
                    j={j}
                    subItem={subItem}
                    locationName={locationName}
                  />
                </div>
              ) : (
                <Link href={subItem.childlink}>
                  <span
                    className={`${
                      isActive
                        ? "text-[#f36622] font-medium"
                        : "text-slate-600 dark:text-slate-300"
                    } text-sm flex space-x-3 items-center transition-all duration-150`}
                  >
                    <span
                      className={`${
                        isActive
                          ? "bg-[#f36622] ring-3 ring-[#f36622]/20"
                          : "border-slate-600 dark:border-white"
                      } h-2 w-2 rounded-full border inline-block flex-none`}
                    ></span>
                    <span className="flex-1">{subItem.childtitle}</span>
                  </span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </Collapse>
  );
};

export default Submenu;