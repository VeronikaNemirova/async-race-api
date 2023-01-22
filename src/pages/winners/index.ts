import Page from '../../components/templates/page';
import { renderWinners } from '../../components/winners';

class WinnersPage extends Page {

    static TextObject = {
        MainTitle: 'Winners',
    };

    constructor(id: string) {
        super(id);
    }

    render() {
        const block = document.createElement('div');
        block.innerHTML = `      <div id="winners-page" class="winners-page">${renderWinners()}</div>
        <div class="pagination">
          <button class="btn prev-button" disabled id="prev">←</button>
          <button class="btn next-button" disabled id="next">→</button>
        </div>`
        const title = this.createHeaderTitle(WinnersPage.TextObject.MainTitle);
        this.container.append(block);
        return this.container;
    }

}


export default WinnersPage;