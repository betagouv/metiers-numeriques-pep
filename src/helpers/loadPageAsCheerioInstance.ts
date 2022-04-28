import { load } from 'cheerio'
import got, { TimeoutError } from 'got'

import type { CheerioAPI } from 'cheerio'

const MAX_RETRIES_COUNT = 5

export async function loadPageAsCheerioInstance(path: string, retriesCount = 1): Promise<CheerioAPI> {
  try {
    const response = await got.get(path, {
      retry: {
        limit: MAX_RETRIES_COUNT,
      },
    })
    const sourceAsHtml = response.body
    const $root = load(sourceAsHtml)

    return $root
  } catch (err) {
    if (err instanceof TimeoutError) {
      if (retriesCount === MAX_RETRIES_COUNT) {
        throw err
      }

      return loadPageAsCheerioInstance(path, retriesCount + 1)
    }

    return undefined as never
  }
}
