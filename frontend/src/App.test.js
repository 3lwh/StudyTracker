import { render, screen } from '@testing-library/react';
import App from './App';

// Mock Chart.js canvas rendering for React testing environment
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="mock-bar-chart" />,
}));

test('renders dashboard heading and form elements', () => {
  render(<App />);
  
  const headingElement = screen.getByText(/Task & Study Tracker/i);
  expect(headingElement).toBeInTheDocument();

  const addButton = screen.getByText(/Add Task/i);
  expect(addButton).toBeInTheDocument();
});