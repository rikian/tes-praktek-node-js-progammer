const request = require("supertest");
const server = require("./listener")
const server_conf = require("./injector/injector");

jest.mock('./middleware/middleware')

const Middleware = require("./middleware/middleware")
Middleware.prototype.init.mockImplementation((req, next) => next())
Middleware.prototype.apiProductMiddleware.mockImplementation((req, res, next) => {
    if (req["user"] && req.authentication) {
        return next()
    } else {
        return res.status(400).end()
    }
})

server_conf.middleware = new Middleware()

describe('Test Api Product Authentication', () => {
    it('Cannot post api product without session login', async () => {
        
        const response = await request(server(server_conf))
            .post("/api/products")

        expect(response.statusCode).toBe(400)
    });

    it('Cannot update api product without session login', async () => {
        
        const response = await request(server(server_conf))
            .put("/api/products")

        expect(response.statusCode).toBe(400)
    });

    it('Cannot delete api product without session login', async () => {
        
        const response = await request(server(server_conf))
            .delete("/api/products")

        expect(response.statusCode).toBe(400)
    });
});
