import { B } from 'bhala'
import numeral from 'numeral'

export function logMemoryUsage(scope: string, step?: string) {
  const memoryUsage = process.memoryUsage()
  const usedMemory = numeral(memoryUsage.heapUsed).format('0b')
  const totalMemory = numeral(memoryUsage.heapTotal).format('0b')

  if (step === undefined) {
    B.debug(`[${scope}] ${usedMemory} / ${totalMemory}.`)

    return
  }

  B.debug(`[${scope}] ${step} : ${usedMemory} / ${totalMemory}.`)
}
