const puppeteer = require('puppeteer'); //node env
const stringify = require("csv-stringify");
const fs = require("file-system");

(async () => {
  const browser = await puppeteer.launch(
      {
          headless: false,
        //   slowMo: 300,
      }
  );

  const page = await browser.newPage();
  await page.setViewport({
      width: 1000,
      height: 1000,
      deviceScaleFactor: 1,
  });
  await page.goto('https://www.imdb.com/chart/top/');
//   await page.select("select#lister-sort-by-options", "us:descending");

//   const elementHandle = await page.$("input");
//   await elementHandle.type("iron man");
//   await elementHandle.press("");

//   await page.screenshot({path: 'images/example.png'});
  const data = await page.evaluate(()=>{

    // let title = Array.from(document.querySelectorAll("tbody.lister-list tr td.titleColumn a")
    // ).map((list)=>list.innerText);

    // let year = Array.from(document.querySelectorAll("tbody.lister-list tr td.titleColumn span")
    // ).map((list)=>list.innerText);

    // let poster = Array.from(document.querySelectorAll("tbody.lister-list tr td.posterColumn a img")
    // ).map((list)=>list.src);

    // let rating = Array.from(document.querySelectorAll("tbody.lister-list tr td.ratingColumn strong")
    // ).map((list)=>list.innerText);

    const movies = Array.from(document.querySelectorAll("tbody.lister-list tr")).map((list) =>
    ({
        // firebase.push
        poster: list.querySelector("td.posterColumn a img").src,
        title: list.querySelector("tbody.lister-list tr td.titleColumn a").innerText,
        year: list.querySelector("td.titleColumn span").innerText,
        rating: list.querySelector("td.ratingColumn strong").innerText,
    }))

    
    return movies;
    
});

    console.log("data", data);
    stringify(data, function(err, output){
            fs.writeFile("data.csv", output, "utf8", function(err) {
            if (err) {
                console.log(
                    "Some error occured - file either not saved or corrupted file saved."
                );
            } else {
                console.log(
                    "It's saved!"
                );
            }
        
        });
    });


    await browser.close();
})();