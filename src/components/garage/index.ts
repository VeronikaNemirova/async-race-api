import refs from '../../shared/refs';
import store from '../../services/store';
import { renderCar } from '../car';
import DrivingService from '../../shared/driving';
import ApiService from '../../services/api';
import './style.css';

class Garage {
  private drivingService: DrivingService;
  private apiService: ApiService;
  constructor() {
    this.drivingService = new DrivingService();
    this.apiService = new ApiService();
    refs.root.addEventListener('click', this.handleButtonClick);
  }

  handleButtonClick = async (event: MouseEvent): Promise<void> => {
    const target = <HTMLElement>event.target;
    if (target.classList.contains('start-engine-btn')) {
      const id = Number(target.id.split('start-engine-car-')[1]);
      this.drivingService.startDriving(id);
    }

    if (target.classList.contains('stop-engine-btn')) {
      const id = Number(target.id.split('stop-engine-car-')[1]);
      this.drivingService.stopDriving(id);
    }
  };

  updateGarage = async (): Promise<void> => {
    const { items, count } = await this.apiService.getCars(store.carsPage);
    store.cars = items;
    store.carsCount = count as number;

    const nextBtn = document.getElementById('next') as HTMLButtonElement;
    nextBtn.disabled = store.carsPage * 7 >= Number(store.carsCount);

    const prevBtn = document.getElementById('prev') as HTMLButtonElement;
    prevBtn.disabled = store.carsPage <= 1;
  };
}

export default Garage;

export const renderGarage = (): string => `
<h2 class="title">Garage (${store.carsCount} cars)</h2>
<p class="text">Page #${store.carsPage}</p>
<ul class="cars">
  ${store.cars.map(car => `<li>${renderCar(car)}</li>`).join('')}
</ul>
`;
