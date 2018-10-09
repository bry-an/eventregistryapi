const { EventRegistry, RequestArticlesRecentActivity, QueryArticles, sleep } = require('eventregistry')
lodash = require('lodash')
const er = new EventRegistry({apiKey: 'e042cdf5-6a54-45c6-88cf-4ab5a974d503'})

// er.getLocationUri('United States').then(res => console.log(res))

// console.log(er.getLocationUri('United States'))

async function fetchfilteredUpdates() {
    const query = new QueryArticles({sourceLocationUri: await er.getLocationUri("United States")});
    query.setRequestedResult(
        new RequestArticlesRecentActivity({
            // download at most 2000 articles. if less of matching articles were added in last 10 minutes, less will be returned
            maxArticleCount: 10,
            // consider articles that were published at most 10 minutes ago
            updatesAfterMinsAgo: 10,
        })
    );
    const articleList = await er.execQuery(query);
    // TODO: do here whatever you need to with the articleList

    for (const article of lodash.get(articleList, "recentActivityArticles.activity", [])) {
        console.info(`Whole Object ${JSON.stringify(article.location)}`);
    }
    // wait exactly a minute until next batch of new content is ready
    await sleep(60 * 1000);
}
    fetchfilteredUpdates();