import { ApiModelProperty } from '@nestjs/swagger';
import { QuestionOption } from './QuestionOption';

export class Question {

    @ApiModelProperty({ required: true })
    public text: string;

    @ApiModelProperty()
    public isMulti?: boolean;

    @ApiModelProperty({ isArray: true, required: true, type: QuestionOption })
    public options: QuestionOption[];

    public constructor(raw: Question) {
        this.text = raw.text;
        this.isMulti = raw.isMulti;
        this.options = raw.options;
    }
}