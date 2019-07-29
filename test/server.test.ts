import request from "supertest";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./samples/app";
import { RouteInterceptor } from "./generated/RouteInterceptor";

describe("generated interceptor", () => {
    it("intercepts requests and returnes mapped instances of generated model classes", async () => {
        const app = await NestFactory.create(AppModule);
        app.useGlobalInterceptors(new RouteInterceptor());

        request(app.getHttpServer())
            .get('/addresses')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) throw err;
            });
    })
})
