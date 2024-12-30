class RenderHtmlPage {

  private title: string = '';
  private language: string = 'en';
  private description: string = '';
  private keywords: string[] = [''];
  private author: string = '';
  private robots: string = '';
  private bodyContent: string = '';
  private cssContent: string = '';
  private scripts: string[] = [];

  addScript(scriptPath: string) {
    this.scripts.push(scriptPath);
  }

  constructor(title: string, language: string = 'en') {
    this.title = title;
    this.language = language;
  }

  setTitle(title: string) {
    this.title = title;
  }

  setDescription(description: string) {
    this.description = description;
  }

  setBody(content: string) {
    this.bodyContent = content;
  }

  addBody(content: string) {
    this.bodyContent += content;
  }

  clearBody() {
    this.bodyContent = '';
  }

  renderLayout(): string {
    return `
            <!DOCTYPE html>
            <html lang="${this.language}">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${this.title}</title>
                <meta name="description" content="${this.description}">
                <link rel="stylesheet" href="styles.css">
                <meta name="keywords" content="${this.keywords.join(',')}">
                <meta name="author" content="${this.author}">
                <meta name="robots" content="${this.robots}">
            </head>
            <body>
            ${this.bodyContent}
            ${this.scripts.map((script) => `<script type="module" src="${script}"></script>`).join('')}
            </body>
            </html>
        `;
  }
}

export default RenderHtmlPage;
