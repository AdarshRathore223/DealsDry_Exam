import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Form from "@/app/(page)/form/page";
import React, { act } from "react";
import "@testing-library/jest-dom";

jest.mock("next/router", () => require("next-router-mock")); // If you're using Next.js router

describe("Form Component", () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it("should render all input fields correctly", () => {
    render(<Form />);

    // Check if labels are correctly rendered
    expect(screen.getByLabelText(/Fund Source/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Expense Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Expense Head/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Paid To/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
  });

  it("should show error message if required fields are missing", async () => {
    render(<Form />);

    const submitButton = screen.getByText(/Submit/i);

    // Try to submit without filling any fields
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          /Error: Missing data for Fund Source, Expense Data, Category, Head, Paid to, Amount, Is Reimburseable/i
        )
      ).toBeInTheDocument();
    });
  });

  it("should display error message if submission fails", async () => {
    render(<Form />);

    // Mock the API responses
    const mockSubmit = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: "Submission failed" }),
    });

    global.fetch = mockSubmit;

    const submitButton = screen.getByText(/Submit/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    });
  });

  it("should handle missing file upload during submission", async () => {
    render(<Form />);

    // Simulate form submission with missing file
    const submitButton = screen.getByText(/Submit/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    });
  });

  it("should show validation error for Reimburseable Source when isReimburseable is 'yes' and other fields are missing", async () => {
    render(<Form />);

    // Set isReimburseable to "yes"
    const radioYes = screen.getByLabelText(/Yes/i);
    fireEvent.click(radioYes);

    const submitButton = screen.getByText(/Submit/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.getByText(/Error: Missing data for/i);
      expect(errorMessage.textContent).toContain("Reimburseable Source");
    });
  });

  it("should submit the form and handle a successful API response", async () => {
    // Mock the fetch API for form submission
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Data submitted successfully!" }),
    });

    render(<Form />);

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/Fund Source/i), {
      target: { value: "Test Fund" },
    });
    fireEvent.change(screen.getByLabelText(/Expense Date/i), {
      target: { value: "2024-11-15" },
    });
    fireEvent.change(screen.getByLabelText(/Category/i), {
      target: { value: "Travel" },
    });
    fireEvent.change(screen.getByLabelText(/Expense Head/i), {
      target: { value: "Lodging" },
    });
    fireEvent.change(screen.getByLabelText(/Paid To/i), {
      target: { value: "Vendor X" },
    });
    fireEvent.change(screen.getByLabelText(/Amount/i), {
      target: { value: "500" },
    });
    
    const radiono = screen.getByLabelText(/no/i);
    fireEvent.click(radiono);

    // Submit the form
    fireEvent.click(screen.getByText(/Submit/i));

    // // Check for success message
    // expect(
    //   screen.getByText(/Data submitted successfully!/i)
    // ).toBeInTheDocument();
  });

  it("should handle API errors correctly", async () => {
    // Mock the fetch API for form submission to return an error
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid data" }),
    });

    render(<Form />);

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/Fund Source/i), {
      target: { value: "Test Fund" },
    });
    fireEvent.change(screen.getByLabelText(/Expense Date/i), {
      target: { value: "2024-11-15" },
    });
    fireEvent.change(screen.getByLabelText(/Category/i), {
      target: { value: "Travel" },
    });
    fireEvent.change(screen.getByLabelText(/Expense Head/i), {
      target: { value: "Lodging" },
    });
    fireEvent.change(screen.getByLabelText(/Paid To/i), {
      target: { value: "Vendor X" },
    });
    fireEvent.change(screen.getByLabelText(/Amount/i), {
      target: { value: "500" },
    });

    const radiono = screen.getByLabelText(/no/i);
    act(() => {
      fireEvent.click(radiono);
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Submit/i));

    // Wait for the response
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith("/api/submit", expect.any(Object))
    );

    // Check for error message
    expect(screen.getByText(/Error: Invalid data/i)).toBeInTheDocument();
  });
});
