import refs from './model';
import store from '../services/store';
import { getDistanceBtwElements, animateCar } from './utils/animation';
import { Engine, DrivingStatus } from './model';
import ApiService from '../services/api';
import { AnimationState } from './utils/animation';
class DrivingService {
  private apiService: ApiService;
  constructor() {
    this.apiService = new ApiService();
  }
  startDriving = async (id: number): Promise<DrivingStatus> => {
    const startBtn = refs.getStartBtn(id);
    startBtn.disabled = true;
    startBtn.classList.toggle('enabling', true);
    const { velocity, distance }: Engine = await this.apiService.getStartEngine(id);
  
    const time = Math.round(distance / velocity);
  
    startBtn.classList.toggle('enabling', false);
  
    const stopBtn = refs.getStopBtn(id);
    stopBtn.disabled = false;
  
    const car = refs.getCarElem(id);
    const finish = refs.getFinishElem(id);
    const distanceBtwElem = Math.floor(getDistanceBtwElements(car, finish)) + 100;
  
    store.animateCar[id] = await animateCar(car, distanceBtwElem, time) as AnimationState;
  
    const { success } = await this.apiService.getDriveStatus(id);
    if (!success) window.cancelAnimationFrame(store.animateCar[id].id);
  
    return { success, id, time };
  };
  
  stopDriving = async (id: number): Promise<void> => {
    const stopBtn = refs.getStopBtn(id);
    stopBtn.disabled = true;
    stopBtn.classList.toggle('enabling', true);
  
    await this.apiService.getStopEngine(id);
  
    stopBtn.classList.toggle('enabling', false);
  
    const startBtn = refs.getStartBtn(id);
    startBtn.disabled = false;
  
    const car = refs.getCarElem(id);
    car.style.transform = 'translateX(0) translateY(52px)';
    if (store.animateCar[id]) window.cancelAnimationFrame(store.animateCar[id].id);
  };
  
}

export default DrivingService;

export enum SortBy {
  Time = 'time',
  Wins = 'wins',
}

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export enum View {
  Garage = 'garage',
  Winners = 'winners',
}
