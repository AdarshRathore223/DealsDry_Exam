import fetchMock from 'jest-fetch-mock'

// Enable the mock for fetch
fetchMock.enableMocks()

// Optional: Clear all fetch mocks between tests
afterEach(() => {
  fetchMock.mockClear()
})
