const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://bry:weioWEIO8*@cluster0-ovni5.mongodb.net/project3?retryWrites=true', { useNewUrlParser: true })
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


async function fetchfilteredUpdates() {
  const query = new QueryArticles({
    sourceLocationUri: await er.getLocationUri("United States"),
    returnInfo: returnInfo
  });

  query.setRequestedResult(
    new RequestArticlesRecentActivity({
      // download at most 2000 articles. if less of matching articles were added in last 10 minutes, less will be returned
      maxArticleCount: 1000,
      // consider articles that were published at most 10 minutes ago
      updatesAfterMinsAgo: 10000,
      returnInfo: returnInfo,
      mandatorySourceLocation: true
    })
  );

  const articleList = await er.execQuery(query, returnInfo);

  var count = 0;

  //set up database connection


  for (const article of lodash.get(articleList, "recentActivityArticles.activity", [])) {
    if (article.location) {
      console.log('++++++++++NEW ARTICLE+++++++++++++')
      const savedArticle = new Article()

      savedArticle.title = JSON.stringify(article.title)
      savedArticle.body = JSON.stringify(article.body)
      savedArticle.date = JSON.stringify(article.date)
      savedArticle.location = JSON.stringify(article.location.label.eng)
      savedArticle.lat = parseInt(JSON.stringify(article.location.lat))
      savedArticle.lng = parseInt(JSON.stringify(article.location.long))

      // articleObj = {
      //   title: JSON.stringify(article.title),
      //   body: JSON.stringify(article.body),
      //   date: JSON.stringify(article.date),
      //   location: JSON.stringify(article.location),
      //   lat: parseInt(JSON.stringify(article.location.lat)),
      //   lng: parseInt(JSON.stringify(article.location.long))
      // }

      savedArticle.save()
      // console.info('whole article', article)
      count++;
      //     const string = JSON.stringify(article)

      // console.info(`latitude ${JSON.stringify(article.location.lat, null, 2)}
    }
  }
  console.log('count', count)
  // wait exactly a minute until next batch of new content is ready
  await sleep(60 * 1000);
}
fetchfilteredUpdates();