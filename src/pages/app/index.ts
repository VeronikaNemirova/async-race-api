import Page from '../../components/templates/page';
import MainPage from "../main";
import WinnersPage from '../winners';
import { renderPage } from '../../components/templates/page';
import Garage, { renderGarage } from '../../components/garage';
import store from '../../services/store';
import { SortBy, View } from '../../shared/enums';
import refs from '../../shared/refs';
import { race } from '../../shared/utils/race';
import { generateRandomCars } from '../../shared/utils/generateCars';
import { WinnerCar } from '../../shared/model';
import Winners, { renderWinners } from '../../components/winners';
import ApiService from '../../services/api';
import DrivingService from '../../shared/driving';

export const enum PageIds {
    MainPage = 'main-page',
    Winners = 'winners-page',
}

class App {
    private static container: HTMLElement = document.body;
    private static defaultPageId: string = 'current-page';
    private selectedCar: { name: string; color: string; id: number } = { name: '', color: '', id: -1 };
    private apiService: ApiService;
    private drivingService: DrivingService;
    private winners: Winners;
    private garage: Garage;

    static renderNewPage(idPage: string) {
        const currentPageHTML = document.querySelector(`#${App.defaultPageId}`);
        if (currentPageHTML) {
            currentPageHTML.remove();
        }

        let page: Page | null = null;

        if (idPage === PageIds.MainPage) {
            page = new MainPage(idPage);
        } else if (idPage === PageIds.Winners) {
            page = new WinnersPage(idPage);
        }

        if (page) {
            const pageHTML = page.render();
            pageHTML.id = App.defaultPageId;
            App.container.append(pageHTML);
            if (idPage === PageIds.MainPage) {
                const garage = new Garage();
                garage.updateGarage();
            } else if (idPage === PageIds.Winners) {
                const winners = new Winners();
                winners.updateWinners();
            }
        }
    }

    private enableRouteChange() {
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            App.renderNewPage(hash);
        })
    }

    constructor() {
        this.apiService = new ApiService();
        this.drivingService = new DrivingService();
        this.winners = new Winners();
        this.garage = new Garage();
    }

    async run() {
        this.enableRouteChange();
        await this.getCars();
        await this.getWinners();
        renderPage();
        App.renderNewPage(PageIds.MainPage);
        this.initListeners();
    }

    private async getWinners() {
        const { items, count } = await this.apiService.getWinners({
            page: store.winnersPage,
            sort: store.sortBy,
            order: store.sortOrder,
        });
        const winnersCars: WinnerCar[] = [...items];
        store.winners = Object.create(winnersCars);
        store.winnersCount = count as number;
    }

    private async getCars() {
        const { items, count } = await this.apiService.getCars(store.carsPage);
        store.cars = items;
        store.carsCount = count as number;
    }

    private initCreateFormListener() {
        const createForm = document.getElementById('create-form') as HTMLFormElement;
        createForm.addEventListener('submit', async event => {
            event.preventDefault();

            const garage = document.getElementById('garage') as HTMLDivElement;
            const nameInput = document.getElementById('create-name') as HTMLInputElement;
            const colorInput = document.getElementById(
                'create-color',
            ) as HTMLInputElement;

            const car = { name: nameInput.value, color: colorInput.value };

            await this.apiService.getCreateCar(car);
            await this.garage.updateGarage();

            garage.innerHTML = renderGarage();
            nameInput.value = '';
            colorInput.value = '';
        });
    }

    private initUpdateFormListener() {
        const updateForm = document.getElementById('update-form') as HTMLFormElement;
        updateForm.addEventListener('submit', async event => {
            event.preventDefault();

            const updateBtn = document.getElementById('update-btn') as HTMLButtonElement;
            const garage = document.getElementById('garage') as HTMLDivElement;
            const nameInput = document.getElementById('update-name') as HTMLInputElement;
            const colorInput = document.getElementById(
                'update-color',
            ) as HTMLInputElement;

            const car = { name: nameInput.value, color: colorInput.value };

            await this.apiService.updateCar(this.selectedCar.id, car);
            await this.garage.updateGarage();

            garage.innerHTML = renderGarage();
            nameInput.value = '';
            updateBtn.disabled = true;
            nameInput.disabled = true;
            colorInput.disabled = true;
            colorInput.value = '';
        });
    }

    onGenerateBtnClick = async (event: MouseEvent) => {
        const generateBtn = <HTMLButtonElement>event.target;
        generateBtn.disabled = true;

        const generatedCars = generateRandomCars();

        await Promise.all(generatedCars.map(async car => this.apiService.getCreateCar(car)));
        await this.garage.updateGarage();
        const garage = document.getElementById('garage') as HTMLDivElement;
        garage.innerHTML = renderGarage();
        generateBtn.disabled = false;
    };

    onRaceBtnClick = async (event: MouseEvent) => {
        const raceBtn = <HTMLButtonElement>event.target;
        const winMessage = document.getElementById('win-message') as HTMLElement;

        raceBtn.disabled = true;

        const resetBtn = document.getElementById('reset') as HTMLButtonElement;
        resetBtn.disabled = false;

        const winner = await race(this.drivingService.startDriving);
        winMessage.innerHTML = `${winner.name} win for ${winner.time} secs!`;
        winMessage.classList.remove('hidden');
        await this.apiService.saveWinner(winner);

        setTimeout(() => {
            winMessage.classList.add('hidden');
        }, 3000);
    };

    onResetBtnClick = async (event: MouseEvent) => {
        const resetBtn = <HTMLButtonElement>event.target;

        resetBtn.disabled = true;

        store.cars.map(({ id }) => this.drivingService.stopDriving(id));
        const winMessage = document.getElementById('win-message') as HTMLElement;
        winMessage.classList.add('hidden');
        const raceBtn = document.getElementById('race') as HTMLButtonElement;
        raceBtn.disabled = false;
    };

    onGarageBtnClick = async () => {
        const garagePage = document.getElementById('garage-page') as HTMLDivElement;
        const winnersPage = document.getElementById('winners-page') as HTMLDivElement;

        await this.garage.updateGarage();

        store.view = View.Garage;

        garagePage.style.display = 'block';
        winnersPage.style.display = 'none';
    };

    onWinnersBtnClick = async () => {
        const garagePage = document.getElementById('garage-page') as HTMLDivElement;
        const winnersPage = document.getElementById('winners-page') as HTMLDivElement;

        winnersPage.style.display = 'block';
        garagePage.style.display = 'none';
        await this.winners.updateWinners();

        store.view = View.Winners;

        winnersPage.innerHTML = renderWinners();
    };

    onPrevBtnClick = async () => {
        switch (store.view) {
            case View.Garage: {
                store.carsPage -= 1;
                await this.garage.updateGarage();

                const garage = document.getElementById('garage') as HTMLDivElement;
                garage.innerHTML = renderGarage();
                break;
            }
            case View.Winners: {
                store.winnersPage -= 1;
                await this.winners.updateWinners();

                const winners = document.getElementById('winners-page') as HTMLDivElement;
                winners.innerHTML = renderWinners();
                break;
            }
            default:
        }
    };

    onNextBtnClick = async () => {
        switch (store.view) {
            case View.Garage: {
                store.carsPage += 1;
                await this.garage.updateGarage();
                const garage = document.getElementById('garage') as HTMLDivElement;

                garage.innerHTML = renderGarage();
                break;
            }
            case View.Winners: {
                store.winnersPage += 1;
                await this.winners.updateWinners();
                const winners = document.getElementById('winners-page') as HTMLDivElement;

                winners.innerHTML = renderWinners();
                break;
            }
            default:
        }
    };

    onSelectBtnClick = async (target: HTMLElement) => {
        const carUpdName = document.getElementById('update-name') as HTMLInputElement;
        const carUpdColor = document.getElementById(
            'update-color',
        ) as HTMLInputElement;
        const updateBtn = document.getElementById('update-btn') as HTMLButtonElement;

        this.selectedCar = await this.apiService.getCarById(target.id.split('select-car-')[1]);

        carUpdName.value = this.selectedCar.name;
        carUpdColor.value = this.selectedCar.color;
        carUpdName.disabled = false;
        carUpdColor.disabled = false;
        updateBtn.disabled = false;
    };

    omRemoveBtnClick = async (target: HTMLElement) => {
        const id = Number(target.id.split('remove-car-')[1]);
        await this.apiService.getDeleteCarById(id);
        await this.apiService.deleteWinner(id);
        await this.garage.updateGarage();
        const garage = document.getElementById('garage') as HTMLDivElement;
        garage.innerHTML = renderGarage();
    };

    private initListeners() {
        this.initCreateFormListener();
        this.initUpdateFormListener();
        refs.root.addEventListener('click', async event => {
            const target = <HTMLElement>event.target;
            switch (true) {
                case target.classList.contains('generate-btn'): { this.onGenerateBtnClick(event); break; }
                case target.classList.contains('race-btn'): { this.onRaceBtnClick(event); break; }
                case target.classList.contains('reset-btn'): { this.onResetBtnClick(event); break; }
                case target.classList.contains('header-garage-btn'): { this.onGarageBtnClick(); break; }
                case target.classList.contains('header-winners-btn'): { this.onWinnersBtnClick(); break; }
                case target.classList.contains('prev-button'): { this.onPrevBtnClick(); break; }
                case target.classList.contains('next-button'): { this.onNextBtnClick(); break; }
                case target.classList.contains('table-wins'): { this.winners.setSortOrder(SortBy.Wins); break; }
                case target.classList.contains('table-time'): { this.winners.setSortOrder(SortBy.Time); break; }
                case target.classList.contains('select-btn'): { this.onSelectBtnClick(target); break; }
                case target.classList.contains('remove-btn'): { this.omRemoveBtnClick(target); break; }
            }
        });
    }
}
export default App;