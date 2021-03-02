import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders login', () => {
  render(<App />)
  expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument()
})
