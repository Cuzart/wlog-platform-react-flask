import React from "react";
import { render } from "@testing-library/react";
import ReactDOM from 'react-dom';
import App from "../pages/Register";

const handleChange = require('../pages/Register/handleChange');
 

test('handleChange works correctly', () => {
    const utils = render(<Register />);
    const input = utils.getByLabelText('Username');
    //const { getByTestId } = render(<Register />);
    fireEvent.change(input, { target: { value: 'traveljunkie' } })
    expect(formErrors.username).toEqual("");
    expect(input.value).toBe('$23')
    const name = "username";
    const val = "traveljunkie";
    expect(data).toEqual({one: 1, two: 2});
  });