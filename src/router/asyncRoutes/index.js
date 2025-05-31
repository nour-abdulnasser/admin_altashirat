import { titleRoutes } from "../modules/titles";
import { userRoutes } from "../modules/users";
import { countriesRoutes } from "../modules/countries";
import { profileRoutes } from "../modules/edit-profile";
import { settingsRoutes } from "../modules/settings";
import { visaRoutes } from "../modules/visa-types";
import { tourismVisasRoutes } from "../modules/tourism-visas.js";
import { employmentTypesRoutes } from "../modules/employment-types";

export const asyncRoutes = [
  userRoutes,
  titleRoutes,
  countriesRoutes,
  settingsRoutes,
  profileRoutes,
  visaRoutes,
  employmentTypesRoutes,
  tourismVisasRoutes
];
