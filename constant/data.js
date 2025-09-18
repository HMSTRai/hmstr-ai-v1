// ✅ UPDATED FULL data.js FILE

export const menuItems = [
  {
    title: "Dashboard",
    icon: "heroicons-outline:home",
    child: [
      {
        childtitle: "QLead Summary",
        childlink: "/qlead-summary",
        childicon: "heroicons:presentation-chart-line",
      },
      {
        childtitle: "QLead Table",
        childlink: "/qlead-table",
        childicon: "heroicons:briefcase",
      },
      {
        childtitle: "Google Ads QLead Metrics",
        childlink: "/googleads_qleads",
        childicon: "heroicons:chart-bar",
      },
    ],
  },
  {
    title: "App",
    icon: "heroicons-outline:chip",
    child: [
      {
        childtitle: "Calendar",
        childlink: "/calender",
        childicon: "heroicons-outline:calendar",
      },
      {
        childtitle: "Kanban",
        childlink: "/kanban",
        childicon: "heroicons-outline:view-boards",
      },
      {
        childtitle: "Todo",
        childlink: "/todo",
        childicon: "heroicons-outline:clipboard-check",
      },
      {
        childtitle: "Projects",
        childlink: "/projects",
        childicon: "heroicons-outline:document",
      },
    ],
  },
  {
    title: "Pages",
    icon: "heroicons-outline:view-boards",
    child: [
      {
        childtitle: "Authentication",
        childicon: "heroicons-outline:user",
        multi_menu: [
          { multi_title: "Signin One", multi_link: "/" },
          { multi_title: "Signin Two", multi_link: "/login" },
        ],
      },
      {
        childtitle: "Components",
        childicon: "heroicons-outline:user",
        multi_menu: [
          { multi_title: "typography", multi_link: "/typography" },
          { multi_title: "colors", multi_link: "/colors" },
          { multi_title: "alert", multi_link: "/alert" },
          { multi_title: "button", multi_link: "/button" },
          { multi_title: "card", multi_link: "/card" },
          { multi_title: "carousel", multi_link: "/carousel" },
          { multi_title: "dropdown", multi_link: "/dropdown" },
          { multi_title: "image", multi_link: "/image" },
          { multi_title: "modal", multi_link: "/modal" },
          { multi_title: "Progress bar", multi_link: "/progress-bar" },
          { multi_title: "Placeholder", multi_link: "/placeholder" },
          { multi_title: "Tab & Accordion", multi_link: "/tab-accordion" },
        ],
      },
      {
        childtitle: "Forms",
        childicon: "heroicons-outline:user",
        multi_menu: [
          { multi_title: "Input", multi_link: "/input" },
          { multi_title: "Input group", multi_link: "/input-group" },
          { multi_title: "Input layout", multi_link: "/input-layout" },
          { multi_title: "Form validation", multi_link: "/form-validation" },
          { multi_title: "Wizard", multi_link: "/form-wizard" },
          { multi_title: "Input mask", multi_link: "/input-mask" },
          { multi_title: "File input", multi_link: "/file-input" },
          { multi_title: "Form repeater", multi_link: "/form-repeater" },
          { multi_title: "Textarea", multi_link: "/textarea" },
          { multi_title: "Checkbox", multi_link: "/checkbox" },
          { multi_title: "Radio button", multi_link: "/radio-button" },
          { multi_title: "Switch", multi_link: "/switch" },
        ],
      },
      {
        childtitle: "Utility",
        childicon: "heroicons-outline:user",
        multi_menu: [
          { multi_title: "Invoice", multi_link: "/invoice" },
          { multi_title: "Pricing", multi_link: "/pricing" },
          { multi_title: "FAQ", multi_link: "/faq" },
          { multi_title: "Blank page", multi_link: "/blank-page" },
          { multi_title: "Blog", multi_link: "/blog" },
          { multi_title: "404 page", multi_link: "/error-page" },
          { multi_title: "Coming Soon", multi_link: "/coming-soon" },
          { multi_title: "Under Maintanance page", multi_link: "/under-construction" },
        ],
      },
    ],
  },
  {
    title: "Widgets",
    icon: "heroicons-outline:view-grid-add",
    child: [
      {
        childtitle: "Basic",
        childlink: "/basic",
        childicon: "heroicons-outline:document-text",
      },
      {
        childtitle: "Statistic",
        childlink: "/statistic",
        childicon: "heroicons-outline:document-text",
      },
    ],
  },
  {
    title: "Extra",
    icon: "heroicons-outline:template",
    child: [
      { childtitle: "Basic Table", childlink: "/table-basic", childicon: "heroicons-outline:table" },
      { childtitle: "Advanced table", childlink: "/table-advanced", childicon: "heroicons-outline:table" },
      { childtitle: "Apex chart", childlink: "/appex-chart", childicon: "heroicons-outline:chart-bar" },
      { childtitle: "Chart js", childlink: "/chartjs", childicon: "heroicons-outline:chart-bar" },
      { childtitle: "Map", childlink: "/map", childicon: "heroicons-outline:map" },
    ],
  },
];

export const topMenu = [
  // Your original topMenu array can stay here unchanged for horizontal layout support
  {
    title: "Dashboard",
    icon: "heroicons-outline:home",
    link: "/app/home",
    child: [
      {
        childtitle: "QLead Summary",
        childlink: "/qlead-summary",
        childicon: "heroicons:presentation-chart-line",
      },
      {
        childtitle: "QLead Table",
        childlink: "/qlead-table",
        childicon: "heroicons:briefcase",
      },
      {
        childtitle: "Google Ads QLead Metrics",
        childlink: "/googleads_qleads",
      },
      {
        childtitle: "QLead Bed Bug Composit",
        childlink: "/qlead_bedbug_composit",
      },
    ],
  },
];