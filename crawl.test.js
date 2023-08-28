const {normalizeURL, getURLsFromHTML} = require("./crawl")

const {test, expect} = require("@jest/globals")

test("normalizeURL strip protocol", () => {
    const input = "https://blog.boot.dev/path"
    const actualOutput = normalizeURL(input)
    const expectedOutput = "blog.boot.dev/path"
    expect(actualOutput).toEqual(expectedOutput)
})

test("normalizeURL strip trailing slash", () => {
    const input = "https://blog.boot.dev/path/"
    const actualOutput = normalizeURL(input)
    const expectedOutput = "blog.boot.dev/path"
    expect(actualOutput).toEqual(expectedOutput)
})

test("normalizeURL capitals", () => {
    const input = "https://BLOG.boot.dev/path"
    const actualOutput = normalizeURL(input)
    const expectedOutput = "blog.boot.dev/path"
    expect(actualOutput).toEqual(expectedOutput)
})

test("normalizeURL strip http(s)", () => {
    const input = "http://blog.boot.dev/path"
    const actualOutput = normalizeURL(input)
    const expectedOutput = "blog.boot.dev/path"
    expect(actualOutput).toEqual(expectedOutput)
})

test("getURLsFromHTML absoluteURLs", () => {
    const inputHTMLbody = `
    <html>
        <body>
            <a href="https://blog.boot.dev/">
                Boot.dev Blog
            </a>
        </body>
    </html>
    `
    const inputBaseUrl = "https://blog.boot.dev"
    const actualOutput = getURLsFromHTML(inputHTMLbody, inputBaseUrl)
    const expectedOutput = ["https://blog.boot.dev/"]
    expect(actualOutput).toEqual(expectedOutput)
})

test("getURLsFromHTML relativeURLs", () => {
    const inputHTMLbody = `
    <html>
        <body>
            <a href="/path">
                Boot.dev Blog
            </a>
            <a href="https://blog.boot.dev/path">
                Boot.dev Blog
            </a>
        </body>
    </html>
    `
    const inputBaseUrl = "https://blog.boot.dev"
    const actualOutput = getURLsFromHTML(inputHTMLbody, inputBaseUrl)
    const expectedOutput = ["https://blog.boot.dev/path", "https://blog.boot.dev/path"]
    expect(actualOutput).toEqual(expectedOutput)
})

test("getURLsFromHTML relative and absolute urls", () => {
    const inputHTMLbody = `
    <html>
        <body>
            <a href="/path">
                Boot.dev Blog
            </a>
        </body>
    </html>
    `
    const inputBaseUrl = "https://blog.boot.dev"
    const actualOutput = getURLsFromHTML(inputHTMLbody, inputBaseUrl)
    const expectedOutput = ["https://blog.boot.dev/path"]
    expect(actualOutput).toEqual(expectedOutput)
})

test("getURLsFromHTML invalid urls", () => {
    const inputHTMLbody = `
    <html>
        <body>
            <a href="invalid">
                Boot.dev Blog
            </a>
        </body>
    </html>
    `
    const inputBaseUrl = "https://blog.boot.dev"
    const actualOutput = getURLsFromHTML(inputHTMLbody, inputBaseUrl)
    const expectedOutput = []
    expect(actualOutput).toEqual(expectedOutput)
})