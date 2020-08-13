/* eslint no-undef: 0 */  // --> OFF

import React from "react";
import { render } from "@testing-library/react";
import ReactDOM from 'react-dom';
import App from "../App";

// tests that the App component can render without crashing
test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});