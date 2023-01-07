const request = require("supertest");
const server = require("./listener")
const server_conf = require("./injector/injector");
const dataLogin = "email_login=rikian@coolguy.com&password_login=54ng4t_R@h451A...."

let cookieSession
let cookieId

describe('Test Login Authentication', () => {
    it('Visit slash ("/") url with session login will get user page', async () => {
        const loginResponse = await request(server(server_conf))
            .post("/auth/login/")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .send(dataLogin)
        
        expect(loginResponse.body["status"]).toBe("ok")
        cookieSession = loginResponse.header["set-cookie"][0].split(";")[0].split("=")[1]
        cookieId = loginResponse.header["set-cookie"][1].split(";")[0].split("=")[1]

        const response = await request(server(server_conf))
            .get("/")
            .set('Cookie', [`id=${cookieId}`, `session=${cookieSession}`])

        expect(response.statusCode).toBe(200)
        expect(response.text.match(/<title[^>]*>([^<]+)<\/title>/)[1]).toBe("User Page")
    });

    it('Visit slash ("/") url without session login will get visitor page', async () => {
        const response = await request(server(server_conf))
            .get("/")

        expect(response.statusCode).toBe(200)
        expect(response.text.match(/<title[^>]*>([^<]+)<\/title>/)[1]).toBe("Visitor Page")
    });


    it("user with valid session can not hit api login, so will get 400 http code bad request", async() => {
        const loginAfterLogin = await request(server(server_conf))
            .post("/auth/login/")
            .set('Cookie', [`id=${cookieId}`, `session=${cookieSession}`])
            .set("Content-Type", "application/x-www-form-urlencoded")
            .send(dataLogin)

        expect(loginAfterLogin.statusCode).toBe(400)
    })
});
