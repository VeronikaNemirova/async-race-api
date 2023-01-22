const { items: cars, count: carsCount } = {items: [], count: 0};
const { items: winners, count: winnersCount } = {items: [], count: 0};

const animation: { [key: number]: { id: number } } = {};

export default {
  carsPage: 1,
  winnersPage: 1,
  cars,
  carsCount,
  winners,
  winnersCount,
  animation,
  view: 'garage',
  sortBy: '',
  sortOrder: '',
};
