import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
// @ts-ignore
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import {BrowserRouter} from "react-router-dom";
import App from "./App";
import leagueStore from "./poker/league/redux/leagueStore";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ReduxProvider store={leagueStore}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </ReduxProvider>
);
