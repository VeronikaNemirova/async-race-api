import { renderGarage } from '../../components/garage';
import Page from '../../components/templates/page';

class MainPage extends Page {

  static TextObject = {
    MainTitle: 'ASYNC RACE',
  };

  constructor(id: string) {
    super(id);
  }

  render() {
    const block = document.createElement('div');
    block.innerHTML = `            <main id="garage-page">
      <div class="forms-container">
        <form class="form create-form" id="create-form">
          <input class="input" id="create-name" name="name" type="text" required />
          <input
            class="color"
            id="create-color"
            name="color"
            type="color"
            value="#ffffff"
          />
          <button class="btn" type="submit">Create</button>
        </form>
        <form class="form update-form" id="update-form">
          <input
            class="input"
            id="update-name"
            name="name"
            type="text"
            disabled
            required
          />
          <input
            class="color"
            id="update-color"
            name="color"
            type="color"
            value="#ffffff"
            disabled
          />
          <button class="btn" id="update-btn" type="submit" disabled >Update</button>
        </form>
      </div>
      <ul class="controls-list">
        <li class="item" ><button class="btn race-btn" id="race">Race</button></li>
        <li class="item" ><button class="btn reset-btn" id="reset" disabled>Reset</button></li>
        <li class="item" ><button class="btn generate-btn" id="generate">Generate</button></li>
      </ul>
      <div id="garage" class="garage">${renderGarage()}</div>
      <div>
        <p class="win-message hidden" id="win-message"></p>
      </div>
    </main>
    <div class="pagination">
    <button class="btn prev-button" disabled id="prev">←</button>
    <button class="btn next-button" disabled id="next">→</button>
  </div>`
    const title = this.createHeaderTitle(MainPage.TextObject.MainTitle);
    this.container.append(block);
    return this.container;

  }

}




export default MainPage;