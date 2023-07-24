import store from '../../services/store';
import ApiService from '../../services/api';
import { changeCarColor } from '../car';
import { SortBy, SortOrder } from '../../shared/driving';
import { WinnerCar, WinnersInfo } from '../../shared/model';
import DrivingService from '../../shared/driving';

class Winners {
  private drivingService: DrivingService;
  private apiService: ApiService;
  constructor() {
    this.drivingService = new DrivingService();
    this.apiService = new ApiService();
  }

  updateWinners = async (): Promise<void> => {
    const { items, count }: WinnersInfo = await this.apiService.getWinners({
      page: store.winnersPage,
      sort: store.sortBy,
      order: store.sortOrder,
    }) as WinnersInfo;
    const winnersCars: WinnerCar[] = [...items];
    store.winners = Object.create(winnersCars);
    store.winnersCount = count as number;

    const nextBtn = document.getElementById('next') as HTMLButtonElement;
    nextBtn.disabled = store.winnersPage * 10 >= Number(store.winnersCount);

    const prevBtn = document.getElementById('prev') as HTMLButtonElement;
    prevBtn.disabled = store.winnersPage <= 1;
  };

  setSortOrder = async (sortBy: string): Promise<void> => {
    store.sortOrder =
      store.sortOrder === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc;
    store.sortBy = sortBy;

    await this.updateWinners();
    const winnersPage = document.getElementById('winners-page') as HTMLDivElement;
    winnersPage.innerHTML = renderWinners();
  };
}

export default Winners;

export const renderWinners = (): string => `
  <h2>Winners (${store.winnersCount})</h2>
  <p>Page #${store.winnersPage}</p>
<table>
<tr>
  <th>№</th>
  <th>Car</th>
  <th>Model</th>
      <th class="table-button table-wins ${store.sortBy === SortBy.Wins ? store.sortOrder : ''
  }	id="sort-by-wins">Wins</th>
      <th class="table-button table-time ${store.sortBy === SortBy.Time ? store.sortOrder : ''
  }	id="sort-by-time">Best time (sec)</th>
  </tr>
        ${store.winners
    .map(
      (
        winner: {
          car: { name: string; color: string };
          wins: number;
          time: number;
        },
        index,
      ) => `
        <tr>
          <td>${index + 1}</td>
          <td>${changeCarColor(winner.car.color)}</td>
          <td>${winner.car.name}</td>
          <td>${winner.wins}</td>
          <td>${winner.time}</td>
        </tr>
      `,
    )
    .join('')}

</table>`;


