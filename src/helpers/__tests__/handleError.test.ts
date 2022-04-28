/* eslint-disable max-classes-per-file, no-console */

import { jest } from '@jest/globals'
import { B } from 'bhala'

import { ApiError } from '../../libs/ApiError'

import type { Context } from 'koa'

// jest.unmock('../handleError')

// eslint-disable-next-line import/first, import/order
import { handleError } from '../handleError'

describe('common/helpers/handleError()', () => {
  const originalProcessEnv = process.env

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mockedProcessExit = jest.spyOn(process, 'exit').mockImplementation((code?: number) => undefined as never)

  const fakeCtx = {
    throw: () => fakeCtx,
  }

  const spiedFakeCtxThrow = jest.spyOn(fakeCtx, 'throw')

  beforeAll(() => {
    process.env = {
      ...originalProcessEnv,
      CI: undefined,
      NODE_ENV: 'production',
    }
  })

  afterAll(() => {
    process.env = originalProcessEnv

    mockedProcessExit.mockRestore()
  })

  test('with a string error', () => {
    const error = 'A string error.'

    handleError(error, `a/path`)

    expect(B.error).toHaveBeenCalledTimes(1)
    expect(B.error).toHaveBeenCalledWith('[a/path] A string error.')
  })

  test('with an instance of Error error', () => {
    const error = new Error(`An Error message.`)

    handleError(error, `a/path`)

    expect(B.error).toHaveBeenCalledTimes(1)
    expect(B.error).toHaveBeenCalledWith('[a/path] An Error message.')
  })

  test('with an CustomError error', () => {
    class CustomError extends Error {}

    const error = new CustomError(`A CustomError message.`)
    handleError(error, `a/path`)

    expect(B.error).toHaveBeenCalledTimes(1)
    expect(B.error).toHaveBeenCalledWith('[a/path] A CustomError message.')
  })

  test('with a TooCustomError error', () => {
    class TooCustomError {}

    const error = new TooCustomError()
    handleError(error, `a/path`)

    expect(B.error).toHaveBeenCalledTimes(4)
    expect(B.error).toHaveBeenNthCalledWith(
      1,
      '[common/helpers/handleError()] This type of error cannot be processed. This should never happen.',
    )
    expect(B.error).toHaveBeenNthCalledWith(2, '[common/helpers/handleError()] Error Type: object')
    expect(B.error).toHaveBeenNthCalledWith(3, '[common/helpers/handleError()] Error Constructor: TooCustomError')
    expect(B.error).toHaveBeenNthCalledWith(4, '[a/path] [object Object]')
  })

  test('with an undefined error', () => {
    handleError(undefined, `a/path`)

    expect(B.error).toHaveBeenCalledTimes(4)
    expect(B.error).toHaveBeenNthCalledWith(
      1,
      '[common/helpers/handleError()] This type of error cannot be processed. This should never happen.',
    )
    expect(B.error).toHaveBeenNthCalledWith(2, '[common/helpers/handleError()] Error Type: undefined')
    expect(B.error).toHaveBeenNthCalledWith(3, '[common/helpers/handleError()] Error Constructor: undefined')
    expect(B.error).toHaveBeenNthCalledWith(4, '[a/path] undefined')
  })

  test('with <isFinal>=false', () => {
    handleError('An error.', `a/path`, false)

    expect(mockedProcessExit).not.toHaveBeenCalled()
  })

  test('with <isFinal>=true', () => {
    handleError('An error.', `a/path`, true) as undefined

    expect(mockedProcessExit).toHaveBeenCalledTimes(1)
    expect(mockedProcessExit).toHaveBeenCalledWith(1)
  })

  test('with a non-ApiError and <ctx> [NON-PRODUCTION]', () => {
    process.env = {
      ...originalProcessEnv,
      CI: undefined,
      NODE_ENV: 'development',
    }

    handleError('An error.', `a/path`, fakeCtx as unknown as Context) as undefined

    expect(spiedFakeCtxThrow).toHaveBeenCalledWith(500, {
      code: 500,
      hasError: true,
      message: 'An error.',
      path: 'a/path',
    })
  })

  test('with a non-exposed 500 ApiError and <ctx> [NON-PRODUCTION]', () => {
    process.env = {
      ...originalProcessEnv,
      CI: undefined,
      NODE_ENV: 'development',
    }

    handleError(new ApiError('An error.', 500), `a/path`, fakeCtx as unknown as Context) as undefined

    expect(spiedFakeCtxThrow).toHaveBeenCalledWith(500, {
      code: 500,
      hasError: true,
      message: 'An error.',
      path: 'a/path',
    })
  })

  test('with an exposed 400 ApiError and <ctx> [NON-PRODUCTION]', () => {
    process.env = {
      ...originalProcessEnv,
      CI: undefined,
      NODE_ENV: 'development',
    }

    handleError(new ApiError('An error.', 400, true), `a/path`, fakeCtx as unknown as Context) as undefined

    expect(spiedFakeCtxThrow).toHaveBeenCalledWith(400, {
      code: 400,
      hasError: true,
      message: 'An error.',
      path: 'a/path',
    })
  })

  test('with a non-ApiError and <ctx> [PRODUCTION]', () => {
    process.env = {
      ...originalProcessEnv,
      CI: undefined,
      NODE_ENV: 'production',
    }

    handleError('An error.', `a/path`, fakeCtx as unknown as Context) as undefined

    expect(spiedFakeCtxThrow).toHaveBeenCalledWith(400, {
      code: 400,
      hasError: true,
      message: 'Something went wrong.',
    })
  })

  test('with a non-exposed 500 ApiError and <ctx> [PRODUCTION]', () => {
    process.env = {
      ...originalProcessEnv,
      CI: undefined,
      NODE_ENV: 'production',
    }

    handleError(new ApiError('An error.', 500), `a/path`, fakeCtx as unknown as Context) as undefined

    expect(spiedFakeCtxThrow).toHaveBeenCalledWith(400, {
      code: 400,
      hasError: true,
      message: 'Something went wrong.',
    })
  })

  test('with an exposed 400 ApiError and <ctx> [PRODUCTION]', () => {
    process.env = {
      ...originalProcessEnv,
      CI: undefined,
      NODE_ENV: 'production',
    }

    handleError(new ApiError('An error.', 400, true), `a/path`, fakeCtx as unknown as Context) as undefined

    expect(spiedFakeCtxThrow).toHaveBeenCalledWith(400, {
      code: 400,
      hasError: true,
      message: 'An error.',
    })
  })
})
