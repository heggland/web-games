class RenderHtmlPage {

  private title: string = '';
  private language: string = 'en';
  private description: string = '';

  constructor(title: string, language: string = 'en') {
    this.title = title;
    this.language = language;
  }

  setDescription(description: string) {
    this.description = description;
  }

  renderLayout(): string {
    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${this.title}</title>
                <meta name="description" content="${this.description}">
                <link rel="stylesheet" href="styles.css">
            </head>
            <body>
            hello world
            </body>
            </html>
        `;
  }
}

export default RenderHtmlPage;