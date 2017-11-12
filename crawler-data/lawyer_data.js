const Crawler = require('crawler');
const fs = require('fs');

const c = new Crawler({
    maxConnections: 10,
    callback: (err, res, done) => {
        if (err) {
            console.log(err);
        } else {
            var $ = res.$;
            console.log($('title').text());
        }
        done();
    }
});

c.queue({
    uri: "http://www.wanguoschool.com/teachers/",
    filename: "./data/datatest.json",
    callback: (err, res, done) => {
        if (err) {
            console.log(err);
        } else {
            var $ = res.$;
            var resultsToJson = [];
            const data = $("dt>img,dd:nth-child(2)>h2,dd:nth-child(3)");

            var arrayData = {
                "teacherName": "",
                "experience": "test",
                "description": "test",
                "avaterURI": "",
            };
            data.map((i, elem) => {
                try {
                    switch (elem.name) {
                        case "img":
                            var imgURI = $(elem).attr('src');
                            arrayData.avaterURI = imgURI;
                            // console.log(imgURI);
                            break;
                        case "h2":
                            var h2TextData = $(elem).text().trim().split(/\s+/);
                            var arr = [];
                            for (var itme in h2TextData) {
                                if (h2TextData.hasOwnProperty(itme)) {
                                    arr.push(h2TextData[itme]);

                                    switch (itme) {
                                        case "0":
                                            arrayData.teacherName = h2TextData[itme];
                                            break;
                                        case "1":
                                            h2TextData[itme] !== undefined ?
                                                arrayData.experience += h2TextData[itme] : false;

                                            break;
                                        case "2":
                                            arrayData.experience += h2TextData[itme];
                                            break
                                        default:
                                            break;
                                    }
                                    // console.log(h2TextData[itme]);
                                };
                            };
                            console.log(arr);
                            console.log("-------------");
                            break;
                        case "dd":
                            var textData = $(elem).text().trim().split(/\s+/);
                            for (var itme in textData) {
                                if (textData.hasOwnProperty(itme)) {
                                    arrayData.description += textData[itme];
                                };
                            };
                            resultsToJson.push(arrayData);
                            arrayData = {};
                            break;
                        default:
                            break;
                    }
                } catch (error) {
                    console.log("get error:" + error);

                } finally {
                    // console.log('Done' + i)
                }
            });
            resultsToJson.join(", ")
            fs.createWriteStream(res.options.filename).write(JSON.stringify(resultsToJson));
            console.log(resultsToJson);
            // console.log(resultsToJson);
            //如用chrome developer
            // data = document.querySelectorAll("dd:nth-child(2) > h2,dd:nth-child(3),dt>img")
            // dataToJson = {
            //     'teachers': [],
            // };
            // for (let n = 0; n < data.length; n++) {
            //     if (data[n].localName === "img") {
            //         let teacher = data[n + 1].textContent.split(/\s+/);
            //         let des = data[n+2].textContent.trim().split(/\s+/);
            //         dataToJson.teachers.push({ "teacherName": teacher[0], "experience": teacher[1], "education": teacher[2], "description": `${des[1]}+${des[2]}` , "avaterURI": data[n].src });
            //     }
            // }
            // console.log(dataToJson);
            // ********************

            // $("div>dl>dd>h2").each((i, elem) => {
            //     var e = $(elem).text().split(' ');
            //     results["teachername"] = e[0];
            //     results["teacherexperience"] = e[1]
            // });
            // console.log(resultsToJson);
        }
        done();
    }
})