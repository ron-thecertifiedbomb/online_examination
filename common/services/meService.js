import fs from "fs";



const jsonPath = new URL("../data/me.json", import.meta.url);
const me = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

export const getData = () => { return me };