import puppeteer from "puppeteer";

(async () => {
    const email = "***@mhs.unsoed.ac.id"
    const password = "***"
    const saran = "Tetap semangat untuk memberikan yang terbaik bagi mahasiswa"
    const rating = 4

    const browser = await puppeteer.launch({
        headless: false,
        args: ['--start-maximized'],
        defaultViewport: null
    });
    const page = await browser.newPage();
    // await page.setViewport({ width: 1920, height: 1080 });

    await page.goto('https://kori.unsoed.ac.id/login?service=http%3A%2F%2Fsia.akademik.unsoed.ac.id%2Fauth%2Floginsso');

    await page.type("#username", email, { delay: 80 })
    await page.type("#password", password, { delay: 80 })

    await page.click("#fm1 input[type=submit]")

    await page.goto('https://sia.akademik.unsoed.ac.id/krskhskuis/index')

    const links = await page.evaluate(() => Array.from(document.querySelectorAll('#w5-container tbody tr [data-col-seq="7"] div a'), el => el.href))

    for (const [index, link] of links.entries()) {
        await page.goto(await link)

        const ratingButtons = await page.$$(`.content table:nth-of-type(3) tbody input[value="${rating}"]`)

        for (const ratingButton of ratingButtons) {
            ratingButton.evaluate(e => { e.click() })
            ratingButton.scrollIntoView()
            await new Promise((resolve, reject) => setTimeout(resolve, 300));
        }

        await page.type('#saran', saran, { delay: 80 })

        const submitButton = await page.waitForSelector('#tombolselesai')

        await submitButton.click()
        console.log(`Selesai ${index + 1} kuisioner`)

        await new Promise((resolve, reject) => setTimeout(resolve, 500));
    }

    await browser.close()
})()