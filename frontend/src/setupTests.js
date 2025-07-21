import '@testing-library/jest-dom';

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  fetch.mockClear();
  fetch.mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  );
});
