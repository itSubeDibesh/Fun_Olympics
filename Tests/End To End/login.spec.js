import 'regenerator-runtime/runtime'
import puppeteer from "puppeteer";

const
    valid_email = "kingraj530@gmail.com",
    valid_password = "password",
    invalid_email = "kingraj531@gmail.com",
    invalid_password = "password1",
    test_case = {
        valid: {
            name: "should login with valid credentials",
            expect: "Welcome kingraj530!",
            email: valid_email,
            password: valid_password
        },
        invalid: {
            name: "should not login with invalid credentials",
            expect: "Error (user-not-found).",
            email: invalid_email,
            password: invalid_password
        },
        invalid_user: {
            name: "should not login with invalid user",
            expect: "Error (user-not-found).",
            email: invalid_email,
            password: valid_password
        },
        invalid_password: {
            name: "should not login with invalid password",
            expect: "Error (wrong-password).",
            email: valid_email,
            password: invalid_password
        },
    };

describe.skip('Login Check 🔓🔑', () => {
    for (const [key, value] of Object.entries(test_case)) {
        it.skip(`${value.name}`, async () => {
            const browser = await puppeteer.launch({
                headless: true,
                // slowMo: 100,
                // args: ['--window-size=1920,1080']
            });
            const page = await browser.newPage();
            // Open Website
            await page.goto('http://localhost:8080/');
            // Navigate to Login Page
            await page.goto('http://localhost:8080/login');
            // Fill Email
            await page.waitForSelector('#email');
            await page.type('#email', value.email);
            // Fill Password
            await page.type('#password', value.password);
            // Click Login Button
            await page.click('button[type=submit]');
            // Wait for Login
            await page.waitForSelector('.alert');
            // Get Login Message
            const alert = await page.$eval('.alert', el => el.innerText);
            // Validate Login
            expect(alert).toContain(value.expect);
            // Close Browser
            await browser.close();
        });
    }
});
