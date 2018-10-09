const { EventRegistry, ReturnInfo, LocationInfoFlags, RequestArticlesRecentActivity, QueryArticles, sleep } = require('eventregistry')
lodash = require('lodash')
const er = new EventRegistry({apiKey: 'e042cdf5-6a54-45c6-88cf-4ab5a974d503'})

const locationInfo = new LocationInfoFlags({
    bodyLen = -1,
    basicInfo = true,
    title = true,
    body = true,
    eventUri = true,
    concepts = false,
    storyUri = false,
    duplicateList = false,
    originalArticle = false,
    categories = false,
    location = true,
    image = false,
    extractedDates = false,
    shares = false,
    details = false,
} = {})
const returnInfo = new ReturnInfo(locationInfo)


async function fetchfilteredUpdates() {
    const query = new QueryArticles({sourceLocationUri: await er.getLocationUri("United States")}, returnInfo);
    query.setRequestedResult(
        new RequestArticlesRecentActivity({
            // download at most 2000 articles. if less of matching articles were added in last 10 minutes, less will be returned
            maxArticleCount: 10,
            
            // consider articles that were published at most 10 minutes ago
            updatesAfterMinsAgo: 10,
        }), { returnInfo: returnInfo }
    ) 
    const articleList = await er.execQuery(query, returnInfo);
    // TODO: do here whatever you need to with the articleList

    for (const article of lodash.get(articleList, "recentActivityArticles.activity", [])) {
        console.info(`Whole Object ${JSON.stringify(article, null, 2)}`);
    }
    // wait exactly a minute until next batch of new content is ready
    await sleep(60 * 1000);
}
    fetchfilteredUpdates();