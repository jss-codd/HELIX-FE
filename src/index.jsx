/* eslint-disable no-undef */
// recommended by webpacker
import "core-js/stable";
import "regenerator-runtime/runtime";

// Import dependencies
import React from "react";
import { render } from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from "./app";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./index.scss";
import "./index.less";

const version = "1.0.24"

/* 
Version : 1.0.0,
Author: Aniket Pandey ,
Date: 11 july 2022,
changes: fix download certificate issue.

Version : 1.0.1,
Author: Aniket Pandey ,
Date: 12 july 2022,
changes: change keycloak.

Version : 1.0.2,
Author: Aniket Pandey ,
Date: 13 july 2022,
changes: add washroom and update washroom [done].

Version : 1.0.3,
Author: Aniket Pandey ,
Date: 14 july 2022,
changes: washroom [done] . 

Version : 1.0.5,
Author: Aniket Pandey ,
Date: 16 july 2022,
changes: fix issue in gateway infra update .

Version : 1.0.6,
Author: Aniket Pandey,
Date: 16 july 2022,
changes: fix issue of description on update sensor .

Version : 1.0.7,
Author: Aniket Pandey,
Date: 21 july 2022,
changes: fix issue multitab mutli sensor.

Version : 1.0.8,
Author: Aniket Pandey,
Date: 26 july 2022,
changes: fix jira issues.

Version : 1.0.9,
Author: Aniket Pandey,
Date: 27 july 2022,
changes: fix add logo .

Version : 1.0.10,
Author: Aniket Pandey,
Date: 28 july 2022,
changes: fix add logo(revert issue) .

Version : 1.0.11,
Author: Aniket Pandey,
Date: 6 aug 2022,
changes: add pagination and remove scroll on table .

Version : 1.0.12,
Author: Aniket Pandey,
Date: 6 aug 2022,
changes: issue : show integer value as float (fix) .

Version : 1.0.13,
Author: Aniket Pandey,
Date: 8 aug 2022,
changes: issue : table column undefine and table view is not working [done].

Version : 1.0.14,
Author: Aniket Pandey,
Date: 17 aug 2022,
changes: dyanmic application implementation.

Version : 1.0.15,
Author: Aniket Pandey,
Date: 19 aug 2022,
changes: fix issue related to application .

Version : 1.0.16,
Author: Aniket Pandey,
Date: 20 aug 2022,
changes: fix issue 404 no found  .

Version : 1.0.17,
Author: Aniket Pandey,
Date: 24 aug 2022,
changes: Hel-44 reappear legend issue.

Version : 1.0.18,
Author: Aniket Pandey,
Date: 26 aug 2022,
changes: kafka implemetation.

Version : 1.0.19,
Author: Aniket Pandey,
Date: 29 aug 2022,
changes: Chart Dashboard New UI.

Version : 1.0.20,
Author: Aniket Pandey,
Date: 29 aug 2022,
changes: Chart Dashboard Widgets text width issue .

Version : 1.0.21,
Author: Aniket Pandey,
Date: 30 aug 2022,
changes: fix chart date , add typo in add sensor and Sensor Provisioning page .
*/

//redux
import { Provider } from "react-redux";
import configureStore from "./store";

// mocking api
import "./app/util/axios/fakeApi/index";

// Import media
require.context("./app/images", true);

const store = configureStore();

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("react-container");

  render(
    <Provider store={store}>

      <Router>

        <App version={version} />

      </Router>
    </Provider>,

    container
  );
});

serviceWorker.unregister();
