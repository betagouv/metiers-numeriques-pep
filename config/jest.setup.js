import { jest } from '@jest/globals'
import { B } from 'bhala'

jest.mock('../src/helpers/handleError')

// eslint-disable-next-line no-console
console.debug = jest.fn()
// eslint-disable-next-line no-console
console.error = jest.fn()
B.error = jest.fn()
