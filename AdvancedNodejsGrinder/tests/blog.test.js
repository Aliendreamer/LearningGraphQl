const Page = require('./factories/page');

let page;
beforeEach( async ()=>{
    page = await Page.build();
    await page.goto('http://localhost:3000')
})

afterEach( async() => {
    await page.close();
})

describe('While logged in', async ()=>{

    beforeEach(async()=>{
        await page.login();
        await page.click('a.btn-floating');
    })
 
    test("user can see create blog form",async ()=>{
        const label = await page.getContentsOF('form label');
        expect(label).toEqual("Blog Title");
    })

    describe("and using valid inputs", async () =>{
        
        beforeEach(async () =>{
            await page.type('.title input',"test input for blog creation");
            await page.type('.content input',"test input again");
            await page.click('form button');
        })
        
        test("submitting takes uset to review screen", async () => {
             const text = await page.getContentsOF('h5');
             expect(text).toEqual('Please confirm your entries');
        }) 

        test("submitting lead to index page",async () => {
            await page.click('button.green');
            await page.waitFor('.card');
            
            const title = await page.getContentsOF('.card-title');
            const content = await page.getContentsOF('p');

            expect(title).toEqual("test input for blog creation"); 
            expect(content).toEqual("test input again");
        })
    });

    describe("and using invalid inputs", async ()=>{
         
        beforeEach( async () => {
            await page.click('form button');
        })
        test('form shows error message',async () => {
            const titleError = await page.getContentsOF('.title .red-text');
            const  contentError = await page.getContentsOF('.content .red-text');
            expect(titleError).toEqual("You must provide a value");
            expect(contentError).toEqual("You must provide a value");
         })
    })
})

