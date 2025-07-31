import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { toggleActiveChat } from "@/components/partials/app/chat/store";
import { useDispatch } from "react-redux";
import useMobileMenu from "@/hooks/useMobileMenu";
import Submenu from "./Submenu";

const Navmenu = ({ menus }) => {
  const router = useRouter();
  const location = usePathname(); // Full path, like /dashboard/google-ads-qlead-metrics

  const dashboardIndex = menus.findIndex((item) => item.title === "Dashboard");
  const [activeSubmenu, setActiveSubmenu] = useState(
    dashboardIndex !== -1 ? dashboardIndex : null
  );
  const [isDashboardToggled, setIsDashboardToggled] = useState(true);

  const [mobileMenu, setMobileMenu] = useMobileMenu();
  const dispatch = useDispatch();

  const toggleSubmenu = (i) => {
    if (i === dashboardIndex) {
      setIsDashboardToggled((prev) => !prev);
      setActiveSubmenu((prev) => (prev === i ? null : i));
    } else {
      setActiveSubmenu((prev) => (prev === i ? null : i));
    }
  };

  useEffect(() => {
    let submenuIndex = null;

    menus.map((item, i) => {
      if (!item.child) return;
      const ciIndex = item.child.findIndex(
        (ci) => location.includes(ci.childlink.replace(/^\//, ""))
      );
      if (ciIndex !== -1) {
        submenuIndex = i;
      }
    });

    if (submenuIndex !== dashboardIndex) {
      setActiveSubmenu(submenuIndex);
    }

    dispatch(toggleActiveChat(false));
    if (mobileMenu) {
      setMobileMenu(false);
    }
  }, [router, location]);

  return (
    <>
      <ul>
        {menus.map((item, i) => (
          <li
            key={i}
            className={`single-sidebar-menu 
              ${item.child ? "item-has-children" : ""}
              ${
                i === dashboardIndex
                  ? isDashboardToggled
                    ? "open"
                    : ""
                  : activeSubmenu === i
                  ? "open"
                  : ""
              }`}
          >
            {!item.child && !item.isHeadr && (
              <Link className="menu-link" href={item.link}>
                <span className="menu-icon flex-grow-0">
                  <Icon icon={item.icon} />
                </span>
                <div className="text-box flex-grow">{item.title}</div>
                {item.badge && <span className="menu-badge">{item.badge}</span>}
              </Link>
            )}

            {item.isHeadr && !item.child && (
              <div className="menulabel">{item.title}</div>
            )}

            {item.child && (
              <div
                className={`menu-link ${
                  (i === dashboardIndex && isDashboardToggled) ||
                  activeSubmenu === i
                    ? "parent_active not-collapsed"
                    : "collapsed"
                }`}
                onClick={() => toggleSubmenu(i)}
              >
                <div className="flex-1 flex items-start">
                  <span className="menu-icon">
                    <Icon icon={item.icon} />
                  </span>
                  <div className="text-box">{item.title}</div>
                </div>
                <div className="flex-0">
                  <div
                    className={`menu-arrow transform transition-all duration-300 ${
                      (i === dashboardIndex && isDashboardToggled) ||
                      activeSubmenu === i
                        ? "rotate-90"
                        : ""
                    }`}
                  >
                    <Icon icon="heroicons-outline:chevron-right" />
                  </div>
                </div>
              </div>
            )}

            <Submenu
              activeSubmenu={
                i === dashboardIndex
                  ? isDashboardToggled
                    ? i
                    : null
                  : activeSubmenu
              }
              item={item}
              i={i}
              locationName={location}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default Navmenu;
