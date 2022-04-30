import got from 'got'

import { handleError } from './handleError'

/**
 * @see https://adresse.data.gouv.fr/api-doc/adresse
 * @see https://github.com/geocoders/geocodejson-spec/tree/master/draft
 */
interface GeocodeJson {
  attribution: string
  features: GeocodeJsonFeature[]
  licence: string
  limit: number
  query: string
  type: string
  version: string
}

/**
 * @see https://adresse.data.gouv.fr/api-doc/adresse
 * @see https://github.com/geocoders/geocodejson-spec/tree/master/draft
 * @see https://github.com/BaseAdresseNationale/adresse.data.gouv.fr/blob/master/components/api-doc/api-adresse/doc.js
 */
interface GeocodeJsonFeature {
  geometry: {
    coordinates: [number, number]
    type: 'Point'
  }
  properties: {
    city: string
    citycode: string
    context: string
    /** Nom de l’arrondissement (Paris / Lyon / Marseille) */
    district?: string
    /** Numéro avec indice de répétition éventuel (bis, ter, A, B) */
    housenumber?: string
    id: string
    importance: number
    /** Libellé complet de l’adresse */
    label: string
    /** Numéro éventuel et nom de voie ou lieu dit */
    name: string
    postcode: string
    score: number
    street?: string
    /**
     * @description
     * - `housenumber`: Numéro « à la plaque »
     * - `locality`: Lieu-dit
     * - `municipality`: Numéro « à la commune »
     * - `street`: Position « à la voie », placée approximativement au centre de celle-ci
     */
    type: 'housenumber' | 'locality' | 'municipality' | 'street'
    x: number
    y: number
  }
  type: 'Feature'
}

export async function getBanAddressFromPepAddress(pepAddress: string): Promise<GeocodeJsonFeature | undefined> {
  try {
    const searchParams = {
      q: pepAddress,
    }
    const url = `https://api-adresse.data.gouv.fr/search/`
    const res: GeocodeJson = await got
      .get(url, {
        searchParams,
      })
      .json()
    if (!Array.isArray(res.features)) {
      throw new Error(`Expected features to be an array, got ${res.features} instead.`)
    }
    if (res.features.length === 0) {
      throw new Error(`PEP Address "${pepAddress}" not found.`)
    }

    return res.features[0]
  } catch (err) {
    handleError(err, 'app/helpers/getAddressIdFromPepAddress()')
  }
}
