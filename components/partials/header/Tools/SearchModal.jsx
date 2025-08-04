import React, { Fragment, useState } from "react";
import { Dialog, Transition, Combobox } from "@headlessui/react";
import Icon from "@/components/ui/Icon";

const SearchModal = () => {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const [query, setQuery] = useState("");
  const searchList = [
    {
      id: 1,
      name: "Dashboard",
      url: "/",
    },
    {
      id: 2,
      name: "QLead Summary",
      url: "/qlead-summary",
    },
    {
      id: 3,
      name: "QLead Table",
      url: "/qlead-table",
    },
    {
      id: 4,
      name: "Google Ads QLead Metrics",
      url: "/googleads_qleads",
    },
    {
      id: 5,
      name: "Qualified Leads",
      url: "/qlead-summary",
    },
    {
      id: 6,
      name: "PPC Leads",
      url: "/qlead-summary",
    },
    {
      id: 7,
      name: "LSA Leads",
      url: "/qlead-summary",
    },
    {
      id: 8,
      name: "SEO Leads",
      url: "/qlead-summary",
    },
    {
      id: 9,
      name: "Total Spend",
      url: "/qlead-summary",
    },
    {
      id: 10,
      name: "CPQL Total",
      url: "/qlead-summary",
    },
    {
      id: 11,
      name: "Call Engagement Metrics",
      url: "/qlead-summary",
    },
    {
      id: 12,
      name: "Human Engagement Rate",
      url: "/qlead-summary",
    },
    {
      id: 13,
      name: "AI Forward Rate",
      url: "/qlead-summary",
    },
    {
      id: 14,
      name: "Qualified Leads Volume by Period",
      url: "/qlead-summary",
    },
    {
      id: 15,
      name: "Cost Per Lead by Period",
      url: "/qlead-summary",
    },
    {
      id: 16,
      name: "Qualified Leads Table",
      url: "/qlead-table",
    },
    {
      id: 17,
      name: "First Contact Date",
      url: "/qlead-table",
    },
    {
      id: 18,
      name: "Customer Phone Number",
      url: "/qlead-table",
    },
    {
      id: 19,
      name: "Customer Name",
      url: "/qlead-table",
    },
    {
      id: 20,
      name: "Customer City",
      url: "/qlead-table",
    },
    {
      id: 21,
      name: "Customer State",
      url: "/qlead-table",
    },
    {
      id: 22,
      name: "Service Inquired",
      url: "/qlead-table",
    },
    {
      id: 23,
      name: "Lead Score",
      url: "/qlead-table",
    },
    {
      id: 24,
      name: "Close Score",
      url: "/qlead-table",
    },
    {
      id: 25,
      name: "Human Engaged",
      url: "/qlead-table",
    },
    {
      id: 26,
      name: "First Source",
      url: "/qlead-table",
    },
    {
      id: 27,
      name: "Google Ads QLead Metrics by Campaign",
      url: "/googleads_qleads",
    },
    {
      id: 28,
      name: "Campaign",
      url: "/googleads_qleads",
    },
    {
      id: 29,
      name: "Spend",
      url: "/googleads_qleads",
    },
    {
      id: 30,
      name: "QLeads",
      url: "/googleads_qleads",
    },
    {
      id: 31,
      name: "CPQL",
      url: "/googleads_qleads",
    },
    {
      id: 32,
      name: "Avg Lead Score",
      url: "/googleads_qleads",
    },
    {
      id: 33,
      name: "Avg Close Score",
      url: "/googleads_qleads",
    },
  ];

  const filteredsearchList = searchList.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div>
        <button
          className="flex items-center xl:text-sm text-lg xl:text-slate-400 text-slate-800 dark:text-slate-300 px-1 space-x-3 rtl:space-x-reverse"
          onClick={openModal}
        >
          <Icon icon="heroicons-outline:search" />
          <span className="xl:inline-block hidden">Search... </span>
        </button>
      </div>

      <Transition show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-[9999] overflow-y-auto p-4 md:pt-[25vh] pt-20"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/60 backdrop-filter backdrop-blur-sm backdrop-brightness-10" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel>
              <Combobox onChange={(item) => {
                if (item?.url) {
                  window.location.href = item.url;
                  closeModal();
                }
              }}>
                <div className="relative">
                  <div className="relative mx-auto max-w-xl rounded-md bg-white dark:bg-slate-800 shadow-2xl ring-1 ring-gray-500-500 dark:ring-light divide-y divide-gray-500-300 dark:divide-light">
                    <div className="flex bg-white dark:bg-slate-800 px-3 rounded-md py-3 items-center">
                      <div className="flex-0 text-slate-700 dark:text-slate-300 ltr:pr-2 rtl:pl-2 text-lg">
                        <Icon icon="heroicons-outline:search" />
                      </div>
                      <Combobox.Input
                        className="bg-transparent outline-none focus:outline-none border-none w-full flex-1 dark:placeholder:text-slate-300 dark:text-slate-200"
                        placeholder="Search..."
                        onChange={(event) => setQuery(event.target.value)}
                        displayValue={(item) => item?.name || ""}
                      />
                    </div>
                    <Transition
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Combobox.Options className="max-h-40 overflow-y-auto text-sm py-2">
                        {filteredsearchList.length === 0 && query !== "" ? (
                          <div className="text-base py-2 px-4">
                            <p className="text-slate-500 text-base dark:text-white">
                              No result found
                            </p>
                          </div>
                        ) : (
                          filteredsearchList.map((item) => (
                            <Combobox.Option
                              key={item.id}
                              value={item}
                              className={({ active }) =>
                                `px-4 text-[15px] font-normal capitalize py-2 cursor-pointer ${
                                  active
                                    ? "bg-slate-900 dark:bg-slate-600 dark:bg-opacity-60 text-white"
                                    : "text-slate-900 dark:text-white"
                                }`
                              }
                            >
                              {item.name}
                            </Combobox.Option>
                          ))
                        )}
                      </Combobox.Options>
                    </Transition>
                  </div>
                </div>
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default SearchModal;