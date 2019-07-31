export class Question {

    public text!: string;

    public constructor(raw: Question) {
        this.text = raw.text;
    }
}