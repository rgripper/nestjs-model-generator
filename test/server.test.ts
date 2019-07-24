import request from "supertest";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app";

describe("generated interceptor", () => {
    it("intercepts requests and returnes mapped instances of generated model classes", async () => {
        const app = await NestFactory.create(AppModule)
        request(app.getHttpServer())
            .get('/user')
            .expect('Content-Type', /json/)
            .expect('Content-Length', '15')
            .expect(200)
            .end(function(err, res) {
                if (err) throw err;
            });
    })
})
