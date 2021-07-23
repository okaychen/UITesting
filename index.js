const puppeteer = require('puppeteer');
const Koa = require('koa');
const fs = require('fs');
const app = new Koa();

// 清空文件&保留文件夹
const delDir = (path) => {
    let files = [];
    if(fs.existsSync(path)){
        files = fs.readdirSync(path);
        if (files.length) {
            files.forEach((file, index) => {
                let curPath = path + "/" + file;
                if(fs.statSync(curPath).isDirectory()){
                    delDir(curPath); //递归删除文件夹
                } else {
                    fs.unlinkSync(curPath); //删除文件
                }
            });
        }
        // fs.rmdirSync(path);
    }
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // 设置机型
    // const iPhone = puppeteer.devices['iPhone 11'];
    // await page.emulate(iPhone);
    page.setUserAgent('Mozilla/5.0 (Linux; U; Android 4.4.4; zh-cn; R8107 Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 OppoBrowser/3.5.1beta Mobile Safari/537.36');
    //设置可视区域大小
    await page.setViewport({width: 400, height: 700});
    const list = [
        'https://www.baidu.com',
        'https://mbd.baidu.com/newspage/data/landingshare?preview=1&pageType=1&isBdboxFrom=1&context=%7B%22nid%22%3A%22news_9793809295047300402%22%2C%22sourceFrom%22%3A%22bjh%22%7D&_refluxos=a7',
        'https://mbd.baidu.com/newspage/data/landingshare?preview=1&pageType=1&isBdboxFrom=1&context=%7B%22nid%22%3A%22news_9793809295047300402%22%2C%22sourceFrom%22%3A%22bjh%22%7D',
    ]
    // 清空文件夹
    delDir('./files');
    // 遍历需要截图的URL
    for (let i = 0; i < list.length; i++) {
        await page.goto(list[i]);
        await page.waitForTimeout(1500);
        await page.screenshot({
            path: `./files/capture${Date.now()}.png`,
            type: 'png',
            fullPage: true
        });
    }
    await page.close();
    await browser.close();

    // node服务
    app.use(async ctx => {
        ctx.body = 'Hello World';
    });
    app.listen(3000);
    console.log('running at http://localhost:3000')
})();