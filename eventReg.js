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
  // console.log('query', query, 'returninfo', returnInfo, 'articleinfo', articleInfoFlags)
  // TODO: do here whatever you need to with the articleList

  let array = [];
  var count = 0;
  for (const article of lodash.get(
    articleList,
    "recentActivityArticles.activity",
    []
  )) {
    array.push(JSON.stringify(article));
    // console.info('whole article', article)
    // if (article.location) {
    count++;
    //     const string = JSON.stringify(article)

    // console.info(`latitude ${JSON.stringify(article.location.lat, null, 2)}
    // longitude ${JSON.stringify(article.location.long)}`);
    // }
  }
  fs.appendFile("./1009-2323.json", array, err => {
    if (err) throw err;
    console.log(count);
  });
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
