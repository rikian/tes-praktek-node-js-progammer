const request = require("supertest");
const server = require("./app")
const server_conf = require("./injector/injector");
const dataLogin = "email_login=rikian@coolguy.com&password_login=12345"
const app = server(server_conf)

let cookieSession
let cookieId


describe('Test Login Authentication', () => {
    it('Visit slash ("/") url with session login will get user page', async () => {
        try {
            // login for get session
            const loginResponse = await request(app)
                .post("/auth/login/")
                .set("Content-Type", "application/x-www-form-urlencoded")
                .send(dataLogin)
            
            expect(loginResponse.body["status"]).toBe("ok")
            cookieSession = loginResponse.header["set-cookie"][0].split(";")[0].split("=")[1]
            cookieId = loginResponse.header["set-cookie"][1].split(";")[0].split("=")[1]
    
            // hit slash url
            const response = await request(app)
                .get("/")
                .set('Cookie', [`id=${cookieId}`, `session=${cookieSession}`])
    
            expect(response.statusCode).toBe(200)
            expect(response.text.match(/<title[^>]*>([^<]+)<\/title>/)[1]).toBe("User Page")
        } catch (error) {
            console.log(error.message)
        }
    });

    it('Visit slash ("/") url without session login will get visitor page', async () => {
        try {
            const response = await request(app)
                .get("/")
    
            expect(response.statusCode).toBe(200)
            expect(response.text.match(/<title[^>]*>([^<]+)<\/title>/)[1]).toBe("Visitor Page")
        } catch (error) {
            console.log(error.message)
        }
    });

    it("user with valid session can not hit api login, so will get 400 http code bad request", async() => {
        try {
            const loginAfterLogin = await request(app)
                .post("/auth/login/")
                .set('Cookie', [`id=${cookieId}`, `session=${cookieSession}`])
                .set("Content-Type", "application/x-www-form-urlencoded")
                .send(dataLogin)
    
            expect(loginAfterLogin.statusCode).toBe(400)
        } catch (error) {
            console.log(error.message)
        }
    })
});
