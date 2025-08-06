const { faker } = require('@faker-js/faker');

function getProbabilisticCount(avg) {
  const count = Math.floor(avg);
  const remainder = avg - count;
  return Math.random() < remainder ? count + 1 : count;
}

function createCoverImageUrl(title, author) {
  return `https://picsum.photos/200/300?random=${encodeURIComponent(title + author)}`;
}

function generateBooks(region, seed, avgLikes, avgReviews, page = 1, pageSize = 20) {
  try {
    faker.setLocale(region);
  } catch (e) {
    console.warn('Unsupported locale, falling back to en');
    faker.setLocale('en');
  }
  faker.seed(Number(seed) + page);

  const books = [];

  for (let i = 0; i < pageSize; i++) {
    const index = (page - 1) * pageSize + i + 1;

    const title = faker.lorem.words({ min: 2, max: 6 });
    const author = faker.person.fullName();
    const publisher = faker.company.name();
    const isbn = faker.string.numeric(13);

    const likes = getProbabilisticCount(avgLikes);
    const numReviews = getProbabilisticCount(avgReviews);

    const reviews = Array.from({ length: numReviews }).map(() => ({
      reviewer: faker.person.fullName(),
      text: faker.lorem.sentences({ min: 1, max: 3 }),
    }));

    books.push({
      index,
      title,
      author,
      publisher,
      isbn,
      likes,
      reviews,
      coverImage: createCoverImageUrl(title, author),
    });
  }

  return books;
}

module.exports = generateBooks;
