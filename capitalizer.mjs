import * as fs from "fs"
import Papa from "papaparse"

/** @type {(word: string) => string} */
const capitalize = (word) => {
    return word.charAt(0).toUpperCase()
        + word.slice(1).toLowerCase()
}

const file = fs.readFileSync("input.csv")

/** @type any[] */
const data = Papa.parse(file.toString(), { header: true }).data

// console.log(data)

const workedData = data
    .filter(el => el.hasOwnProperty("First Name") && el.hasOwnProperty("Last Name"))
    .map(el => ({
        ...el,
        ["First Name"]: capitalize(el["First Name"]),
        ["Last Name"]: capitalize(el["Last Name"])
    }))

const outString = Papa.unparse(workedData)
fs.writeFileSync("capitalized.csv", outString)