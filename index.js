const {Builder, By, Key, util} = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const options = new chrome.Options();
const tesseract = require("node-tesseract-ocr");
const fs = require('fs');
const sharp = require('sharp');


const config = {
    lang: "eng"
  }

async function example(){
    let driver = await new Builder().forBrowser("chrome").build();
    //await driver.get("https://google.com");
    //await driver.findElement(By.name("q")).sendKeys("Selenium");
    await driver.get("http://exams.kluniversity.in/");
    await driver.findElement(By.id("MainContent_Txtusername")).sendKeys("170031332");
    await driver.findElement(By.id("MainContent_Txtpassword")).sendKeys("21/04/2000");
    driver.findElement(By.id("MainContent_Txtusername"))
    await driver.takeScreenshot().then(function(data){
        fs.writeFileSync('img.png',data,'base64')
    });
    let originalImage = 'img.png';

    // file name for cropped image
    let outputImage = 'croppedImage.jpg';

    sharp(originalImage).extract({ width: 520, height: 120, left: 800, top: 950 }).toFile(outputImage)
    .then(function(new_file_info) {
        console.log("Image cropped and saved");
    })
    .catch(function(err) {
        console.log("An error occured");
    });

    tesseract.recognize("croppedImage.jpg", config)
  .then(text => {
   console.log("Result:", text)
    text = text.toUpperCase();
   // console.log(text)
    let finaltext = "";
    for(let i =0;i<text.length;i++)
    {
        if(text[i]>='A' && text[i]<='Z' || text[i]>='0' && text[i]<='9')
        finaltext+=text[i];
    }
    console.log(finaltext);
    driver.findElement(By.id("MainContent_txtCaptcha")).sendKeys(finaltext);
  })
  .catch(error => {
    console.log(error.message)
  })
  await new Promise(done => setTimeout(done, 5000));
  await driver.findElement(By.id('MainContent_Button1')).click();
}



example();