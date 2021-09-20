import MainDashboard from '../Components/User/MainDashboard';


const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    component: MainDashboard,
    layout: "/admin",
  },
];

export const useRouteName = () => {
  let name = "";
  dashboardRoutes.forEach((route) => {
    if (window.location.href.indexOf(route.layout + route.path) !== -1) {
      name = dashboardRoutes.rtlActive ? route.rtlName : route.name;
    }
  });
  return name;
};
