module.exports = {
    testEnvironment: 'jsdom',

    setupFilesAfterEnv: [
        '<rootDir>/src/setupTests.js',
    ],

    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
    },

    testMatch: [
        '**/__tests__/**/*.test.js',
        '**/__tests__/**/*.test.jsx',
    ],

    moduleFileExtensions: [
        'js',
        'jsx',
    ],

    clearMocks: true,
};