const {JSDOM} = require("jsdom")

const crawlPage = async (baseURL, currentURL, pages) => {
    console.log(`Actively crawling ${currentURL}`)
    baseURL = new URL(baseURL)
    currentURL = new URL(currentURL)
    if(baseURL.hostname !== currentURL.hostname) {
        return pages
    }
    const normalizedCurrentURL = normalizeURL(currentURL)
    if(pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++
        return pages
    }

    pages[normalizedCurrentURL] = 1
    const resp = await fetch(currentURL)
    
    if(resp.status > 399) {
        console.log(`Error in fetch with status code: ${resp.status} on page ${currentURL}`)
        return
    }
    
    const contentType = resp.headers.get("content-type")
    if(!contentType === "text/html") {
        console.log("Non HTML response")
        return
    }

    const htmlBody = await resp.text()
    const nextURLs = getURLsFromHTML(htmlBody, baseURL)
    for(const nextURL of nextURLs) {
        pages = await crawlPage(baseURL, nextURL, pages)
    }
}

const getURLsFromHTML = (htmlBody, baseURL) => {
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll("a")
    for(const linkEl of linkElements) {
        if(linkEl.href.slice(0,1) === "/") {
            // Relative URL
            try {
                const urlObj = new URL(`${baseURL}${linkEl.href}`)
                urls.push(urlObj.href)
            } catch(err) {
                console.log("Error with relative url: ", err.message)
            }
        } else {
            // Absolute URL
            try {
                const urlObj = new URL(linkEl.href)
                urls.push(urlObj.href)
            } catch(err) {
                console.log("Error with absolute url: ", err.message)
            }
        }
    }
    return urls
}


const normalizeURL = (urlString) => {
    const urlObj = new URL(urlString)
    console.log(urlObj)
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`
    if(hostPath.length > 0 && hostPath.slice(-1) === "/") {
        return hostPath.slice(0, -1)
    }
    return hostPath
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}