const { EventRegistry, ReturnInfo, ArticleInfoFlags, LocationInfoFlags, RequestArticlesRecentActivity, QueryArticles, sleep } = require('eventregistry')
lodash = require('lodash')
const er = new EventRegistry({ apiKey: 'e042cdf5-6a54-45c6-88cf-4ab5a974d503' })

const articleInfoFlags  = new ArticleInfoFlags({
    location: true,
})

const locationInfoFlags = new LocationInfoFlags({
    geoLocation:  true,
})

const returnInfo = new ReturnInfo({
    articleInfo: articleInfoFlags,
    locationInfo: locationInfoFlags  
})



async function fetchfilteredUpdates() {
    const query = new QueryArticles({ sourceLocationUri:  await er.getLocationUri("United States"), returnInfo:  returnInfo });
    query.setRequestedResult(
        new RequestArticlesRecentActivity({
            // download at most 2000 articles. if less of matching articles were added in last 10 minutes, less will be returned
            maxArticleCount: 1000,
            // consider articles that were published at most 10 minutes ago
            updatesAfterMinsAgo: 1140,
            returnInfo: returnInfo,
            mandatorySourceLocation: true
        })
    )
    const articleList = await er.execQuery(query, returnInfo);
    // console.log('query', query, 'returninfo', returnInfo, 'articleinfo', articleInfoFlags)
    // TODO: do here whatever you need to with the articleList

    for (const article of lodash.get(articleList, "recentActivityArticles.activity", [])) {
        // console.info('whole article', article)
        if (article.location) {
            console.info(`latitude ${JSON.stringify(article.location.lat, null, 2)}
            longitude ${JSON.stringify(article.location.long)}`);
        }
    }
    // wait exactly a minute until next batch of new content is ready
    await sleep(60 * 1000);
}
fetchfilteredUpdates();