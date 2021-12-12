import 'regenerator-runtime/runtime'
import puppeteer from "puppeteer";

const baseUrl = "http://localhost:8080";
const users = [
    {
        name: "developer or admin should be able to access profanity page",
        email: "kingraj530@gmail.com",
        password: "password",
        role: "developer",
        expect: {
            Profanity: true,
        }
    },
    {
        name: "user should not be able to access profanity page",
        email: "dsubedi@ismt.edu.np",
        password: "password",
        role: "user",
        expect: {
            Profanity: false,
        }
    }
];

describe.skip('Role Check ⚙👥', () => {
    for (let index = 0; index < users.length; index++) {
        const user = users[index];
        it.skip(`${user.name}}`, async () => {
            const browser = await puppeteer.launch({
                headless: true,
                // slowMo: 100,
                // args: ['--window-size=1920,1080']
            });
            const page = await browser.newPage();
            await page.goto(baseUrl);
            // Navigate to Login Page
            await page.goto(baseUrl + '/login');
            // Fill Email
            await page.waitForSelector('#email');
            await page.type('#email', user.email);
            // Fill Password
            await page.type('#password', user.password);
            // Click Login Button
            await page.click('button[type=submit]');
            // Wait for Login
            await page.waitForSelector('#navbarNav');
            // Get Nav text
            const nav = await page.$eval('#navbarNav', el => el.innerHTML);
            if (user.role === "developer") {
                expect(nav).toContain('Profanity');
            }
            if (user.role === "user") {
                expect(nav).not.toContain('Profanity');
            }
            await browser.close();
        })
    }
});