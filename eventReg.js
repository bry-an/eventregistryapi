const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://bry:weioWEIO8*@cluster0-ovni5.mongodb.net/project3')
const Article = require('./models/article')

const {
  EventRegistry,
  ReturnInfo,
  GetRecentArticles,
  ArticleInfoFlags,
  LocationInfoFlags,
  RequestArticlesRecentActivity,
  QueryArticles,
  sleep
} = require("eventregistry");
lodash = require("lodash");
const er = new EventRegistry({
  apiKey: "e042cdf5-6a54-45c6-88cf-4ab5a974d503"
});
const fs = require("file-system");

const articleInfoFlags = new ArticleInfoFlags({
  location: true
});

const locationInfoFlags = new LocationInfoFlags({
  geoLocation: true
});

const returnInfo = new ReturnInfo({
  articleInfo: articleInfoFlags,
  locationInfo: locationInfoFlags
});

const recentQ = new GetRecentArticles(er, { maxCount: 2000 });

async function fetchfilteredUpdates() {
  const query = new QueryArticles({
    sourceLocationUri: await er.getLocationUri("United States"),
    returnInfo: returnInfo
  });

  query.setRequestedResult(
    new RequestArticlesRecentActivity({
      // download at most 2000 articles. if less of matching articles were added in last 10 minutes, less will be returned
      maxArticleCount: 10,
      // consider articles that were published at most 10 minutes ago
      updatesAfterMinsAgo: 10000,
      returnInfo: returnInfo,
      mandatorySourceLocation: true
    })
  );
  
  const articleList = await er.execQuery(query, returnInfo);

  let array = [];
  var count = 0;

  //set up database connection
  const savedArticle = new Article()


  for (const article of lodash.get(articleList, "recentActivityArticles.activity",[])) {
    if (article.location) {
    savedArticle.title = JSON.stringify(article.title)
    savedArticle.body = JSON.stringify(article.body)
    savedArticle.date = JSON.stringify(article.date)
    savedArticle.location = JSON.stringify(article.location)
    savedArticle.lat = parseInt(JSON.stringify(article.location.lat))
    savedArticle.lng = parseInt(JSON.stringify(article.location.long))
    
    savedArticle.save(err => {
      if (err) console.log(err)
    })

    array.push(JSON.stringify(article));
    // console.info('whole article', article)
    count++;
    //     const string = JSON.stringify(article)

    // console.info(`latitude ${JSON.stringify(article.location.lat, null, 2)}
  }
  }
  // fs.appendFile("./1009-2323.json", array, err => {
  //   if (err) throw err;
  //   console.log(count);
  // });
  // wait exactly a minute until next batch of new content is ready
  await sleep(60 * 1000);
}
fetchfilteredUpdates();

async function getRecentUpdates(recentQ) {
  const articleList = await recentQ.getUpdates();
  console.log(articleList);

  await sleep(60 * 1000);
  await getRecentUpdates(recentQ);
}

getRecentUpdates(recentQ);
