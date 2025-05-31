// TODO: Find a way to localize title 
export const visaRoutes = {
  path: "/visa-types",
  component: () => import("@/views/visa-types/index.vue"),
  meta: {
    layout: "DefaultLayout", // TODO: Create a layout for this in layouts
  },
  children: [
    {
      path: "",  
      name: "visa-table",
      component: () => import("@/views/visa-types/records/index.vue"),
      meta:{
        heading:{
          key: true,
          title: 'drawer.visatypes' 
        },
        breadcrumb: "pages.visaTypes",
      }
    },
    {
      path: "add",
      name: "visa-create",
      component: () => import("@/views/visa-types/actions/index.vue"),
       meta:{
        heading:{
          key: false,
          title: 'common.create' 
        }
      }
    },
    {
      path: ":id/edit",
      name: "visatypes-edit",
      component: () => import("@/views/visa-types/actions/index.vue"),
      props: false,
      meta:{
        heading:{
          key: false,
          title: 'common.edit' 
        }
      }
    },
  ],
};
