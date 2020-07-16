import React from "react";
import { render, fireEvent, getByLabelText } from "@testing-library/react";
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import Register from "../components/pages/Register";

//const handleChange = require('../pages/Register/handleChange');

test('handleChange works correctly for Username', () => {
  const div = document.createElement('div');
  const utils =  render(<BrowserRouter>
    <Register />
  </BrowserRouter>, div);
  const input = utils.getByLabelText('Username')
  fireEvent.change(input, { target: { value: 'traveljunkie' } })
  expect(utils.getByTestId('usernameError').textContent).toEqual("");
  });

test('handleChange works correctly and sends error message for wrong Username', () => {
  const div = document.createElement('div');
  const utils =  render(<BrowserRouter>
    <Register />
  </BrowserRouter>, div);
  const input = utils.getByLabelText('Username')
  fireEvent.change(input, { target: { value: 't' } })
  expect(utils.getByTestId('usernameError').textContent).toEqual("usernames have to be 3-20 characters ");
  });

test('handleChange works correctly for Email', () => {
  const div = document.createElement('div');
  const utils =  render(<BrowserRouter>
    <Register />
  </BrowserRouter>, div);
  const input = utils.getByLabelText('E-Mail')
  fireEvent.change(input, { target: { value: 'max@web.de' } })
  expect(utils.getByTestId('emailError').textContent).toEqual("");
  });

//does not work: evtl weil const email regex nicht in register klasse und mit rendern test error
test('handleChange works correctly and sends error message for wrong Email', () => {
  const div = document.createElement('div');
  const utils =  render(<BrowserRouter>
    <Register />
  </BrowserRouter>, div);
  const input = utils.getByLabelText('Username')
  fireEvent.change(input, { target: { value: 'z' } })
  expect(utils.getByTestId('emailError').textContent).toEqual("invalid email");
  });

test('handleChange works correctly for name', () => {
  const div = document.createElement('div');
  const utils =  render(<BrowserRouter>
    <Register />
  </BrowserRouter>, div);
  const input = utils.getByLabelText('name')
  fireEvent.change(input, { target: { value: 'max' } })
  expect(utils.getByTestId('usernameError').textContent).toEqual("");
  });

test('handleChange works correctly and sends error message for wrong name', () => {
  const div = document.createElement('div');
  const utils =  render(<BrowserRouter>
    <Register />
  </BrowserRouter>, div);
  const input = utils.getByLabelText('name')
  fireEvent.change(input, { target: { value: 'm' } })
  expect(utils.getByTestId('nameError').textContent).toEqual("2-50 characters allowed");
  });

test('handleChange works correctly for surname', () => {
  const div = document.createElement('div');
  const utils =  render(<BrowserRouter>
    <Register />
  </BrowserRouter>, div);
  const input = utils.getByLabelText('name')
  fireEvent.change(input, { target: { value: 'muster' } })
  expect(utils.getByTestId('usernameError').textContent).toEqual("");
  });

test('handleChange works correctly and sends error message for wrong surname', () => {
  const div = document.createElement('div');
  const utils =  render(<BrowserRouter>
    <Register />
  </BrowserRouter>, div);
  const input = utils.getByLabelText('name')
  fireEvent.change(input, { target: { value: 'm' } })
  expect(utils.getByTestId('nameError').textContent).toEqual("2-50 characters allowed");
  });