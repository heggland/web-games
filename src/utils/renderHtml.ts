class RenderHtmlPage {

  private title: string = '';
  private language: string = 'en';
  private description: string = '';
  private keywords: string[] = [''];
  private author: string = '';
  private robots: string = '';
  private bodyContent: string = '';

  constructor(title: string, language: string = 'en') {
    this.title = title;
    this.language = language;
  }

  setDescription(description: string) {
    this.description = description;
  }

  // Method to set body content
  setBody(content: string) {
    this.bodyContent = content;
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
            </body>
            </html>
        `;
  }
}

export default RenderHtmlPage;
