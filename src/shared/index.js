import app from "@/myApp";

import Password from "@/components/shared/Inputs/Password/index.vue";
import Select from "@/components/shared/Inputs/Select/index.vue";
import Text from "@/components/shared/Inputs/Text/index.vue";
import Phone from "@/components/shared/Inputs/Phone/index.vue";
import Toggle from "@/components/shared/Inputs/Toggle/index.vue";
import Range from "@/components/shared/Inputs/Range/index.vue";
import Textarea from "@/components/shared/Inputs/Textarea/index.vue";
import Checkbox from "@/components/shared/Inputs/Checkbox/index.vue"

import Button from "@/components/shared/Buttons/Default/index.vue";
import Edit from "@/components/shared/Buttons/Edit/index.vue";

import Header from "@/components/shared/Layout/Header/index.vue";
import Drawer from "@/components/shared/Layout/Drawer/index.vue";

import Breadcrumb from "@/components/shared/Breadcrumb/index.vue";
import Notification from "@/components/shared/Notification/index.vue";
import LocaleSelector from "@/components/shared/LocaleSelector/index.vue";
import Image from "@/components/shared/Image/index.vue";
import Show from "@/components/shared/Show/index.vue";
import Destroy from "@/components/shared/Destroy/index.vue";
import Countries from "@/components/shared/Countries/index.vue";
import Pagination from "@/components/shared/Pagination/index.vue";
import MyTable from "@/components/shared/Table/index.vue";
import DateInput from "@/components/shared/Inputs/DateInput/index.vue";



// Direct registration - Components are registered directly to the app instance
app.component("LocaleSelector", LocaleSelector);
app.component("Password", Password);
app.component("Select", Select);
app.component("Text", Text);
app.component("Phone", Phone);
app.component("Button", Button);
app.component("Header", Header);
app.component("Drawer", Drawer);
app.component("Breadcrumb", Breadcrumb);
app.component("MyTable", MyTable);
app.component("Toggle", Toggle);
app.component("Edit", Edit);
app.component("Destroy", Destroy);
app.component("Pagination", Pagination);
app.component("Show", Show);
app.component("Countries", Countries);
app.component("Image", Image);
app.component("Notification", Notification);
app.component('Textarea', Textarea);
app.component('Checkbox', Checkbox);
app.component('Range', Range);
app.component('DateInput', DateInput);




export default app;
