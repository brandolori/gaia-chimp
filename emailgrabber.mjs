import serp from "serp"
import fetch from "node-fetch"
import Papa from "papaparse"
import * as fs from "fs"

const companies = [
    "iotty",
    "exaequo",
    "amazon"
]

const data = [...companies.map(el => ({ company: el, emails: [] }))]

const promises = companies.map(async companyName => {

    var options = {
        host: "google.it",
        qs: {
            q: companyName,
            filter: 0,
            pws: 0
        },
        num: 1
    };



    /** @type {{url: string, title: string}[]} */
    const links = await serp.search(options);

    const res = await fetch(links[0].url)
    const text = await res.text()

    const mailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g

    text.replace(mailRegex, (el) => {
        // heuristic: mail addresses dont tend to be longer than 40 chars
        if (el.length < 40)
            data.find(el => el.company == companyName).emails.push(el)
        return ""
    })

    // const anchorExp = /<a\s*.*>\s*(.+?)\s*<\/a>/g
    // text.replace(anchorExp, (el) => {
    //     const content = el.replace(/<a\s*.*>/, "").replace(/<\/a>/, "").toLowerCase()
    //     if (content.includes("contatti") || content.includes("chi siamo") || content.includes("contattaci"))
    //         console.log(content)
    //     return ""
    // })

})
await Promise.all(promises)
const outString = Papa.unparse(data, { delimiter: ";" })
fs.writeFileSync("emails.csv", outString)
