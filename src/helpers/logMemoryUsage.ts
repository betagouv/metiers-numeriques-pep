import { B } from 'bhala'
import numeral from 'numeral'

const totalMemory = numeral(process.memoryUsage().heapTotal).format('0b')

export function logMemoryUsage(scope: string, step?: string) {
  const memoryUsage = process.memoryUsage()
  const usedMemory = numeral(memoryUsage.heapUsed).format('0b')

  if (step === undefined) {
    B.debug(`[${scope}] ${usedMemory} / ${totalMemory}.`)

    return
  }

  B.debug(`[${scope}] ${step} : ${usedMemory} / ${totalMemory}.`)
}
