import request from "supertest";
import { AppModule } from "./samples/app";
import { Test } from '@nestjs/testing';
import { RouteInterceptor } from "./generated/RouteInterceptor";
import { INestApplication } from "@nestjs/common";

describe("generated interceptor", () => {

    let app: INestApplication;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
          imports: [AppModule],
        })
          .compile();
    
        app = module.createNestApplication();
        app.useGlobalInterceptors(new RouteInterceptor());
        await app.init();
      });

    it("intercepts requests and returnes mapped instances of generated model classes", async () => {
        
        await request(app.getHttpServer())
            .get('/questions')
            .expect('Content-Type', /json/)
            .expect({ text: 'Name your favourite can opener brand' })
            .expect(200);
    })
})
