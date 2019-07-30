export class Question {

    text!: string;

    constructor(raw: Question) {
        this.text = raw.text;
    }
}