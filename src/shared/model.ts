export type Car = {
  name: string;
  color: string;
  id: number;
};

export type Cars = {
  items: [];
  count: number | null;
};

export type SimpleCar = {
  name: string;
  color: string;
};

export type Engine = { velocity: number; distance: number };

export type DrivingStatus = {
  success: boolean;
  id: number;
  time: number;
};

export type Race = {
  name: string;
  color: string;
  id: number;
  time: number;
};


export type Winner = {
  id: number;
  time: number;
  wins: number;
};

export type WinnersInfo = {
  items: WinnerCar[];
  count: number | null;
};

export type WinnerCar = {
  car: Car;
  id: number;
  time: number;
  wins: number;
}



