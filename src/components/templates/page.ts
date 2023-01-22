abstract class Page {
    protected container: HTMLElement;
    static TextObject = {};

    constructor (id: string) {
        this.container = document.createElement('div');
        this.container.id = id;
    }

    protected createHeaderTitle(text: string) {
        const headerTitle = document.createElement('h1');
        headerTitle.innerText = text;
        return headerTitle;
    }

    render() {
        return this.container;
    }
}

export const renderPage = (): void => {
    const markup = `
      <header class="header">
        <h1 class="title" >Async Race</h1>
        <button type="button" class="btn header-garage-btn"><a href="#main-page">TO GARAGE</a></button>
        <button type="button" class="btn header-winners-btn"><a href="#winners-page">TO WINNERS</a></button>
      </header>
  `;
    const app = document.createElement('div');
    app.innerHTML = markup;
    document.body.appendChild(app);
  };

export default Page;