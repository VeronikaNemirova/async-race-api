import { Cars, SimpleCar, Car, Engine, Winner, WinnersInfo, WinnerCar } from '../shared/model';


class ApiService {
  private readonly baseUrl: string = 'http://localhost:3000';

  getCars = async (page: number, limit = 7): Promise<Cars> => {
    const response = await fetch(
      `${this.baseUrl}/garage?_page=${page}&_limit=${limit}`,
    );
  
    return {
      items: await response.json(),
      count: +(response.headers.get('X-Total-Count') || 0),
    };
  };
  
  getCarById = async (id: string): Promise<Car> =>
    (await fetch(`${this.baseUrl}/garage/${id}`)).json();
  
  getCreateCar = async (car: {
    name: string;
    color: string;
  }): Promise<Response> =>
    (
      await fetch(`${this.baseUrl}/garage`, {
        method: 'POST',
        body: JSON.stringify(car),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
  
  getDeleteCarById = async (id: number): Promise<Car> =>
    (await fetch(`${this.baseUrl}/garage/${id}`, { method: 'DELETE' })).json();
  
  updateCar = async (id: number, body: SimpleCar): Promise<void> =>
    (
      await fetch(`${this.baseUrl}/garage/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
  
  getStartEngine = async (id: number): Promise<Engine> =>
    (await fetch(`${this.baseUrl}/engine?id=${id}&status=started`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    })).json();
  
  getStopEngine = async (id: number): Promise<Engine> =>
    (await fetch(`${this.baseUrl}/engine?id=${id}&status=stopped`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    })).json();
  
  getDriveStatus = async (
    id: number,
  ): Promise<{ success: boolean }> => {
    const res = await fetch(`${this.baseUrl}/engine?id=${id}&status=drive`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch();
    return res.status !== 200 ? { success: false } : { ...(await res.json()) };
  };

  
  getSortOrder = (sort?: string | null, order?: string | null) => {
    if (sort && order) return `&_sort=${sort}&_order=${order}`;
    return '';
  };
  
  getWinners = async ({
    page,
    limit = 10,
    sort,
    order,
  }: {
    page: number;
    limit?: number;
    sort?: string | null;
    order?: string | null;
  }): Promise<WinnersInfo> => {
    const response = await fetch(
      `${this.baseUrl}/winners?_page=${page}&_limit=${limit}${this.getSortOrder(
        sort,
        order,
      )}`,
    );
  
    const items = await response.json();
  
    return {
      items: await Promise.all(
        items.map(async (winner: Winner) => ({
          ...winner,
          car: await this.getCarById(winner.id.toString()),
        })) as WinnerCar[],
      ),
      count: +(response.headers.get('X-Total-Count') || 0),
    } as WinnersInfo;
  };
  
  getWinner = async (id: number): Promise<Winner> =>
    (await fetch(`${this.baseUrl}/winners/${id}`)).json();
  
  getWinnerStatus = async (id: number): Promise<number> =>
    (await fetch(`${this.baseUrl}/winners/${id}`)).status;
  
  createWinner = async (body: Winner): Promise<void> =>
    (
      await fetch(`${this.baseUrl}/winners`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
  
  deleteWinner = async (id: number): Promise<void> =>
    (await fetch(`${this.baseUrl}/winners/${id}`, { method: 'DELETE' })).json();
  
  updateWinner = async (id: number, body: Winner): Promise<void> =>
    (
      await fetch(`${this.baseUrl}/winners/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
  
  saveWinner = async ({
    id,
    time,
  }: {
    id: number;
    time: number;
  }): Promise<void> => {
    const winnerStatus = await this.getWinnerStatus(id);
  
    if (winnerStatus === 404) {
      await this.createWinner({
        id,
        wins: 1,
        time,
      });
    } else {
      const winner = await this.getWinner(id);
      await this.updateWinner(id, {
        id,
        wins: winner.wins + 1,
        time: time < winner.time ? time : winner.time,
      });
    }
  };
}

export default ApiService;