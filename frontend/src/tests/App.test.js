/* eslint no-undef: 0 */  // --> OFF

import React from "react";
import { render } from "@testing-library/react";
import ReactDOM from 'react-dom';
import App from "../App";

/*test("renders learn react link", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});*/

// tests that the App component can render without crashing
test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});