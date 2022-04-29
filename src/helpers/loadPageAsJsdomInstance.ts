import got, { TimeoutError } from 'got'
import { JSDOM } from 'jsdom'

const MAX_RETRIES_COUNT = 5

export async function loadPageAsJsdomInstance(path: string, retriesCount = 1): Promise<JSDOM> {
  try {
    const response = await got.get(path, {
      retry: {
        limit: MAX_RETRIES_COUNT,
      },
    })
    const sourceAsHtml = response.body
    const jsdom = new JSDOM(sourceAsHtml)

    return jsdom
  } catch (err) {
    if (err instanceof TimeoutError) {
      if (retriesCount === MAX_RETRIES_COUNT) {
        throw err
      }

      return loadPageAsJsdomInstance(path, retriesCount + 1)
    }

    return undefined as never
  }
}
