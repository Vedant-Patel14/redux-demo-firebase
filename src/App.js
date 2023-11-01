import { BrowserRouter, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Box, CircularProgress } from "@mui/material";

const Routing = lazy(() => import("./routes/index"));

const App = () => {
  return (
      <div className="app-container">
        <Suspense
          fallback={
            <h1 style={{ display: "flex", justifyContent: "center" }}>
              Loading...
            </h1>
          }
        >
          <Routing />
        </Suspense>
      </div>
  );
};

export default App;
