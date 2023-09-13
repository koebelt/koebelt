import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import './index.css';
import CustomCursor from './components/CustomCursor';
import Contact from './ Contact';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/contact",
        element: <Contact />,
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <body>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter">            
        </link>
         {/* link satoshi font */}
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Satoshi"></link>

      </head>
    <RouterProvider router={router} />
        <CustomCursor />
    </body>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
