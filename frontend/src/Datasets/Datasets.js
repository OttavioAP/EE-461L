import React, { Component } from "react";

export default class Datasets extends Component {
  render() {
    const searchUrl = `https://www.amazon.de/s/?page=${page}&keywords=graphic+card`;
    const response = await fetch(searchUrl);      // fetch page 

    const htmlString = await response.text();     // get response text
    const $ = cheerio.load(htmlString);           // parse HTML string
    
    return (
      <div className="Datasets">
        <h1>Datasets page</h1>
        <p>A simple app showing react button click navigation</p>
      </div>
    );
  }
}
