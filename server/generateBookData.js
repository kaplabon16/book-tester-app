import { Faker, en, de, fr, ja } from '@faker-js/faker'
import seedrandom from 'seedrandom'

const localeMap = {
  en_US: en,
  de_DE: de,
  fr_FR: fr,
  ja_JP: ja
}

export function generateBooks({ region, seed, avgLikes, avgReviews, page }) {
  const faker = new Faker({ locale: localeMap[region] || en })
  faker.seed(seedrandom(seed)())

  const books = []
  const pageSize = 20
  const start = (page - 1) * pageSize

  for (let i = start; i < start + pageSize; i++) {
    const title = faker.lorem.sentence().slice(0, -1)
    const author = faker.person.fullName()
    const cover = faker.image.urlPicsumPhotos({ width: 100, height: 150 })
    const likes = Math.floor(avgLikes * 10 + faker.number.int({ min: 0, max: 20 }))
    const reviews = Array.from({ length: Math.floor(avgReviews) }, () => faker.lorem.sentences(1))

    books.push({ id: i + 1, title, author, cover, likes, reviews })
  }

  return books
}
