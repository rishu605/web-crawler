const { crawlPage } = require("./crawl")

const main = () => {
        if(process.argv.length < 3) {
            console.log("No Website provided")
            process.exit(1)
        } else if(process.argv.length > 3){
            console.log("Too many args")
            process.exit(1)
        }
        
        const baseURL = process.argv[2]
        console.log(`Starting to crawl ${baseURL}`)
        const pages = crawlPage(baseURL, baseURL, {})
        for(const page of Object.entries(pages)) {
            console.log(page)
        }
}

main()