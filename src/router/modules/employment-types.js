
export const employmentTypesRoutes = {
  path: "/employment-types",
  component: () => import("@/views/employment-types/index.vue"),
  meta: {
    layout: "DefaultLayout", // TODO: Create a layout for this in layouts
  },
  children: [
    {
      path: "",  
      name: "employment-types-table",
      component: () => import("@/views/employment-types/records/index.vue"),
      meta:{
        heading:{
          key: true,
          title: 'drawer.employmentTypes' 
        },
        breadcrumb: "pages.employmentTypes",
      }
    },
    {
      path: "add",
      name: "employment-types-create",
      component: () => import("@/views/employment-types/actions/index.vue"),
       meta:{
        heading:{
          key: false,
          title: 'common.create' 
        }
      }
    },
    {
      path: ":id/edit",
      name: "employment-types-edit",
      component: () => import("@/views/employment-types/actions/index.vue"),
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
