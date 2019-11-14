const { Builder, By, Key, util } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const driver = new Builder().forBrowser("chrome").build();

const scrape = require("website-scraper");

scrape({
  urls: ["http://exams.kluniversity.in"],
  directory: "/Users/yesaswi/Desktop/selenium/filess",
  sources: [{ selector: "img", attr: "src" }]
});
