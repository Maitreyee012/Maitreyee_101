const { chromium } = require('playwright')
const { expect } = require('@playwright/test');
const cp = require('child_process');
const playwrightClientVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1];

const parallelTests = async (capability) => {
  console.log('Initialising test:: ', capability['LT:Options']['name'])

  const browser = await chromium.connect({
    wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capability))}`
  })

  const page = await browser.newPage()


  try {
     /*
   1. Open LambdaTest’s Selenium Playground from
   https://www.lambdatest.com/selenium-playground
   2. Click “Simple Form Demo”.
   3. Validate that the URL contains “simple-form-demo”.
   4. Create a variable for a string value e.g.: “Welcome to LambdaTest”.
   5. Use this variable to enter values in the “Enter Message” text box.
   6. Click “Get Checked Value”.
   7. Validate whether the same text message is displayed in the right-hand
   panel under the “Your Message:” section.
   */
   await page.goto("https://www.lambdatest.com/selenium-playground");
   await page.getByText("Simple Form Demo").click();
   expect(page.url()).toContain("simple-form-demo");
   const textvalue ="Welcome to LambdaTest";
   await page.getByPlaceholder("Please enter your Message").fill(textvalue);
   await page.getByRole('button', { name: "Get Checked Value"}).click();
   //await page.waitForTimeout(5000);
  //  expect(await page.locator('.mt-20').nth(3)).toHaveText(textvalue);
 
   
 
   await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'passed', remark: 'Title matched' } })}`)
 
  /*
  1. Open the https://www.lambdatest.com/selenium-playground page and
  click “Drag & Drop Sliders”.
  2. Select the slider “Default value 15” and drag the bar to make it 95 by
  validating whether the range value shows 95.
  */
  await page.goto('https://www.lambdatest.com/selenium-playground');
   await page.getByText('Drag & Drop Sliders').click();
   expect(page.url()).toContain("drag-drop-range-sliders-demo");
   const slider = page.locator('#slider3').getByRole('slider');
   await slider.focus();
   let currentValue = await page.locator("#rangeSuccess").textContent();
   while (currentValue !== '95') {
     await page.keyboard.press('ArrowRight');
     currentValue = await page.locator("#rangeSuccess").textContent();
   }
   await expect(page.locator("#rangeSuccess")).toHaveText('95');
     
   await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'passed', remark: 'Title matched' } })}`)

     
   await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'passed', remark: 'Title matched' } })}`)

  /*
  1. Open the https://www.lambdatest.com/selenium-playground page and
  click “Input Form Submit”.
  2. Click “Submit” without filling in any information in the form.
  3. Assert “Please fill in the fields” error message.
  4. Fill in Name, Email, and other fields.
  5. From the Country drop-down, select “United States” using the text
  property.
  6. Fill in all fields and click “Submit”.
  7. Once submitted, validate the success message “Thanks for contacting
  us, we will get back to you shortly.” on the screen.
  */
  await page.goto('https://www.lambdatest.com/selenium-playground');
  await page.getByText("Input Form Submit").click();
  await page.getByRole("button", { name: "Submit"}).click();
  await page.getByRole("textbox", { name: 'Name'}).fill("Test");
  await page.getByRole("textbox", { name: 'Email'}).fill("Test@xyz.com");
  await page.getByRole("textbox", { name: 'Password'}).fill("Password");
  await page.getByRole("textbox", { name: 'Company'}).fill("ABC PVT LTD");
  await page.getByRole("textbox", { name: 'Website'}).fill("ABCPVTLTD.com");
  await page.getByRole('combobox').selectOption("United States")
  await page.getByRole("textbox", { name: 'City', exact: true}).fill("USCity");
  await page.getByRole("textbox", { name: 'Address 1'}).fill("Address 1");
  await page.getByRole("textbox", { name: 'Address 2'}).fill("Address 2");
  await page.getByRole("textbox", { name: 'City* State*'}).fill("Usstate");
  await page.getByRole("textbox", { name: 'Zip Code'}).fill("Zip Code");
  await page.getByRole("button", { name: "Submit"}).click();
  await expect(page.getByText("Thanks for contacting us, we will get back to you shortly.")).toBeVisible();


   await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'passed', remark: 'Title matched' } })}`)

  } catch (e) {
    await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'failed', remark: 'Title matched' } })}`)
    throw e;
  }finally {
    await page.close();
    await browser.close();
  }

}

async function teardown(page, browser) {
  await page.close();
  await browser.close();
}

// Capabilities array for with the respective configuration for the parallel tests
const capabilities = [
  {
    'browserName': 'Chrome', // Browsers allowed: `Chrome`, `MicrosoftEdge`, `pw-chromium`, `pw-firefox` and `pw-webkit`
    'browserVersion': 'latest',
    'LT:Options': {
      'platform': 'Windows 10',
      'build': 'Playwright With Parallel Build',
      'name': 'Playwright Sample Test on Windows 10 - Chrome',
      'user': process.env.LT_USERNAME,
      'accessKey': process.env.LT_ACCESS_KEY,
      'network': true,
      'video': true,
      'console': true,
      'playwrightClientVersion': playwrightClientVersion
    }
  },
  {
    'browserName': 'MicrosoftEdge',
    'browserVersion': 'latest',
    'LT:Options': {
      'platform': 'MacOS Ventura',
      'build': 'Playwright With Parallel Build',
      'name': 'Playwright Sample Test on Windows 8 - MicrosoftEdge',
      'user': process.env.LT_USERNAME,
      'accessKey': process.env.LT_ACCESS_KEY,
      'network': true,
      'video': true,
      'console': true,
      'playwrightClientVersion': playwrightClientVersion
    }
  },
  // {
  //   'browserName': 'Chrome',
  //   'browserVersion': 'latest',
  //   'LT:Options': {
  //     'platform': 'MacOS Big sur',
  //     'build': 'Playwright With Parallel Build',
  //     'name': 'Playwright Sample Test on MacOS Big sur - Chrome',
  //     'user': process.env.LT_USERNAME,
  //     'accessKey': process.env.LT_ACCESS_KEY,
  //     'network': true,
  //     'video': true,
  //     'console': true,
  //     'playwrightClientVersion': playwrightClientVersion
  //   }
  // }
]

capabilities.forEach(async (capability) => {
  await parallelTests(capability)
})