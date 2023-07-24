const { items: cars, count: carsCount } = {items: [], count: 0};
const { items: winners, count: winnersCount } = {items: [], count: 0};

const animateCar: { [key: number]: { id: number } } = {};

export default {
  carsPage: 1,
  winnersPage: 1,
  cars,
  carsCount,
  winners,
  winnersCount,
  animateCar,
  view: 'garage',
  sortBy: '',
  sortOrder: '',
};
