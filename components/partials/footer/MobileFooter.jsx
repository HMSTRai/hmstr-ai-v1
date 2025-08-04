"use client";

import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs"; // Keep for profile/settings/logout

const MobileFooter = () => {
  const router = useRouter();
  return (
    <div className="bg-white bg-no-repeat custom-dropshadow footer-bg dark:bg-slate-700 flex justify-center items-center backdrop-filter backdrop-blur-[40px] fixed left-0 w-full z-[9999] bottom-0 py-[12px] px-4"> {/* Changed justify-around to justify-center for single item */}
      {/* Removed Messages and Notifications links */}
      {/* Only keep the profile/UserButton */}
      <div
        className="relative bg-no-repeat backdrop-filter rounded-full footer-bg dark:bg-slate-700 h-[65px] w-[65px] z-[-1] -mt-[40px] flex justify-center items-center"
      >
        <div className="h-[50px] w-[50px] rounded-full relative left-[0px] top-[0px] custom-dropshadow">
          <UserButton 
            afterSignOutUrl="/lock-screen" 
            appearance={{
              elements: {
                userButtonAvatarBox: "w-full h-full", // Make avatar fill the container
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileFooter;