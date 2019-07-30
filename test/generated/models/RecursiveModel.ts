import { Data } from './Data';
export class RecursiveModel {

    data!: Data;

    constructor(raw: RecursiveModel) {
        this.data = new Data(raw.data);
    }
}