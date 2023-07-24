import { Car, Race, DrivingStatus } from '../model';
import store from '../../services/store';

export const raceAll = async (
  promises: Array<Promise<DrivingStatus>>,
  ids: number[],
): Promise<Race> => {
  const results = await Promise.allSettled(promises);
  const successfulResult = results.find(
    (result): result is PromiseFulfilledResult<DrivingStatus> =>
      result.status === 'fulfilled'
  );

  if (!successfulResult) {
    const failedIndex = results.findIndex(
      (result) => result.status === 'rejected'
    );
    const restPromises = promises.filter((_, index) => index !== failedIndex);
    const restIds = ids.filter((_, index) => index !== failedIndex);
    return raceAll(restPromises, restIds);
  }

  const winner: Car = store.cars.find(
    (car: Car) => car.id === successfulResult.value.id
  ) || store.cars[0];

  return {
    ...winner,
    time: successfulResult.value.time / 1000, 
  };
};

export const race = async (action: {
  (id: number): Promise<DrivingStatus>;
}): Promise<Race> => {
  const promises = store.cars.map(({ id }) => action(id));
  const winner = await raceAll(promises, store.cars.map((car: Car) => car.id));

  return winner;
};

export default race;