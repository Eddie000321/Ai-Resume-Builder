import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Landing } from "../src/pages/Landing";

// 🔥 Mock NavBar to avoid router & external rendering issues
vi.mock("../src/components/NavBar", () => ({
  NavBar: () => <div>Mocked NavBar</div>,
}));

// 🔥 Mock ResumeDropzone to avoid context provider requirement
vi.mock("../src/features/resume/ResumeDropzone", () => ({
  ResumeDropzone: () => <div>Mocked Dropzone</div>,
}));

describe("Landing Page Component", () => {
  // Helper to wrap the component in router context
  function renderWithRouter(ui) {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  }

  test("renders feature label 'ATS ready in minutes'", () => {
    renderWithRouter(<Landing />);
    expect(screen.getByText(/ATS ready in minutes/i)).toBeInTheDocument();
  });

  test("renders headline about resume fit scores", () => {
    renderWithRouter(<Landing />);
    expect(
      screen.getByText(/get instant fit scores/i)
    ).toBeInTheDocument();
  });

  test("renders analysis paragraph", () => {
    renderWithRouter(<Landing />);
    expect(
      screen.getByText(/We analyze your PDF against any job description/i)
    ).toBeInTheDocument();
  });

  test("renders checklist items", () => {
    renderWithRouter(<Landing />);
    expect(screen.getByText(/Secure PDF parsing/i)).toBeInTheDocument();
    expect(screen.getByText(/Keyword & experience alignment/i)).toBeInTheDocument();
    expect(screen.getByText(/AI rewrite suggestions/i)).toBeInTheDocument();
  });

  test("renders dropzone helper text", () => {
    renderWithRouter(<Landing />);
    expect(
      screen.getByText(/No account yet\? Drop your résumé to start/i)
    ).toBeInTheDocument();
  });
});
