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
      {
        childtitle: "Banking Dashboard",
        childlink: "/banking",
        childicon: "heroicons:credit-card",
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
          { multi_title: "Signin Two", multi_link: "/login2" },
          { multi_title: "Signin Three", multi_link: "/login3" },
          { multi_title: "Signup One", multi_link: "/register" },
          { multi_title: "Signup Two", multi_link: "/register/register2" },
          { multi_title: "Signup Three", multi_link: "/register/register3" },
          { multi_title: "Forget Password One", multi_link: "/forgot-password" },
          { multi_title: "Forget Password Two", multi_link: "/forgot-password2" },
          { multi_title: "Forget Password Three", multi_link: "/forgot-password3" },
          { multi_title: "Lock Screen One", multi_link: "/lock-screen" },
          { multi_title: "Lock Screen Two", multi_link: "/lock-screen2" },
          { multi_title: "Lock Screen Three", multi_link: "/lock-screen3" },
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
        childtitle: "Banking Dashboard",
        childlink: "/banking",
      },
    ],
  },
  {
    title: "App",
    icon: "heroicons-outline:chip",
    link: "/app/home",
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
    link: "/app/home",
    megamenu: [
      {
        megamenutitle: "Authentication",
        megamenuicon: "heroicons-outline:user",
        singleMegamenu: [
          { m_childtitle: "Signin One", m_childlink: "/" },
          { m_childtitle: "Signin Two", m_childlink: "/login2" },
          { m_childtitle: "Signin Three", m_childlink: "/login3" },
          { m_childtitle: "Signup One", m_childlink: "/register" },
          { m_childtitle: "Signup Two", m_childlink: "/register/register2" },
          { m_childtitle: "Signup Three", m_childlink: "/register/register3" },
          { m_childtitle: "Forget Password One", m_childlink: "/forgot-password" },
          { m_childtitle: "Forget Password Two", m_childlink: "/forgot-password2" },
          { m_childtitle: "Forget Password Three", m_childlink: "/forgot-password3" },
          { m_childtitle: "Lock Screen One", m_childlink: "/lock-screen" },
          { m_childtitle: "Lock Screen Two", m_childlink: "/lock-screen2" },
          { m_childtitle: "Lock Screen Three", m_childlink: "/lock-screen3" },
        ],
      },
      {
        megamenutitle: "Components",
        megamenuicon: "heroicons-outline:user",
        singleMegamenu: [
          { m_childtitle: "typography", m_childlink: "/typography" },
          { m_childtitle: "colors", m_childlink: "/colors" },
          { m_childtitle: "alert", m_childlink: "/alert" },
          { m_childtitle: "button", m_childlink: "/button" },
          { m_childtitle: "card", m_childlink: "/card" },
          { m_childtitle: "carousel", m_childlink: "/carousel" },
          { m_childtitle: "dropdown", m_childlink: "/dropdown" },
          { m_childtitle: "image", m_childlink: "/image" },
          { m_childtitle: "modal", m_childlink: "/modal" },
          { m_childtitle: "Progress bar", m_childlink: "/progress-bar" },
          { m_childtitle: "Placeholder", m_childlink: "/placeholder" },
          { m_childtitle: "Tab & Accordion", m_childlink: "/tab-accordion" },
        ],
      },
      {
        megamenutitle: "Forms",
        megamenuicon: "heroicons-outline:user",
        singleMegamenu: [
          { m_childtitle: "Input", m_childlink: "/input" },
          { m_childtitle: "Input group", m_childlink: "/input-group" },
          { m_childtitle: "Input layout", m_childlink: "/input-layout" },
          { m_childtitle: "Form validation", m_childlink: "/form-validation" },
          { m_childtitle: "Wizard", m_childlink: "/form-wizard" },
          { m_childtitle: "Input mask", m_childlink: "/input-mask" },
          { m_childtitle: "File input", m_childlink: "/file-input" },
          { m_childtitle: "Form repeater", m_childlink: "/form-repeater" },
          { m_childtitle: "Textarea", m_childlink: "/textarea" },
          { m_childtitle: "Checkbox", m_childlink: "/checkbox" },
          { m_childtitle: "Radio button", m_childlink: "/radio-button" },
          { m_childtitle: "Switch", m_childlink: "/switch" },
        ],
      },
      {
        megamenutitle: "Utility",
        megamenuicon: "heroicons-outline:user",
        singleMegamenu: [
          { m_childtitle: "Invoice", m_childlink: "/invoice" },
          { m_childtitle: "Pricing", m_childlink: "/pricing" },
          { m_childtitle: "FAQ", m_childlink: "/faq" },
          { m_childtitle: "Blank page", m_childlink: "/blank-page" },
          { m_childtitle: "Blog", m_childlink: "/blog" },
          { m_childtitle: "404 page", m_childlink: "/error-page" },
          { m_childtitle: "Coming Soon", m_childlink: "/coming-soon" },
          { m_childtitle: "Under Maintanance page", m_childlink: "/under-construction" },
        ],
      },
    ],
  },
  {
    title: "Widgets",
    icon: "heroicons-outline:view-grid-add",
    link: "form-elements",
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