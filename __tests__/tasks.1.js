const puppeteer = require("puppeteer");
const path = require('path');

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch({ headless: 'new'});
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
}, 30000);

afterAll(async () => {
    try {
        await browser.close();
    } catch(e) {
        console.error(e);
    }
});

describe('Flexbox', () => {
    it("Header is using flexbox", async () => {
        const flex = await page.$$eval('*', el => Array.from(el).map(e => getComputedStyle(e).getPropertyValue('display')));
        expect(flex).toEqual(expect.arrayContaining(['flex']));
    });
});

describe('Grid', () => {
    it("Page has a grid setup", async () => {
        const container = await page.$$eval('*', el => Array.from(el).map(e => getComputedStyle(e).getPropertyValue('display')));
        expect(container).toEqual(expect.arrayContaining(['grid']));
    });

    it("Grid areas are defined", async () => {
        const gridTemplateAreas = await page.$$eval('*', el => Array.from(el).map(e => getComputedStyle(e).getPropertyValue('grid-template-areas')));
        expect(gridTemplateAreas).toEqual(expect.arrayContaining([expect.not.stringMatching(/none/i)]));
    });

    it("Elements are assigned to grid areas", async () => {
        const gridAreas = await page.$$eval('*', el => Array.from(el).map(e => getComputedStyle(e).getPropertyValue('grid-area')));
        expect(gridAreas).toEqual(expect.arrayContaining([expect.not.stringMatching(/auto \/ auto \/ auto \/ auto/i)]));
    });
});

describe('Background', () => {
    it("Each grid area has a different `background-color`", async () => {
        const gridItemsBgc = await page.$$eval('*', el => Array.from(el).map(e => getComputedStyle(e).getPropertyValue('background-color')));
        const uniqueGridItemsBgc = Array.from(new Set(gridItemsBgc));
        expect(uniqueGridItemsBgc.length).toBeGreaterThan(4);
    });
});
