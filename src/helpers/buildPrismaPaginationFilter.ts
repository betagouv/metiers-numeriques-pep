import { handleError } from './handleError'

const MAX_PER_PAGE = 100

/**
 * @see  https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination
 */
export function buildPrismaPaginationFilter(
  perPage: number,
  pageIndex: number,
): {
  skip?: number
  take: number
} {
  try {
    const safePerPage = Number.isInteger(perPage) && perPage >= 1 && perPage <= MAX_PER_PAGE ? perPage : 1
    const safePageIndex = Number.isInteger(pageIndex) && pageIndex >= 0 && Number.isFinite(pageIndex) ? pageIndex : 0
    const skip = safePageIndex * safePerPage

    return {
      skip,
      take: safePerPage,
    }
  } catch (err) {
    handleError(err, 'helpers/buildPrismaPaginationFilter()')

    return {
      take: 1,
    }
  }
}
