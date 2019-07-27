import { Data } from './Data';
export class RecursiveModel {

    constructor(raw: RecursiveModel) {
        this.data = new Data(raw.data);
    }

    data!: Data;
}