import { ApiModelProperty } from '@nestjs/swagger';

export class QuestionOption {

    @ApiModelProperty({ required: true })
    public text: string;

    @ApiModelProperty({ required: true })
    public value: unknown;

    public constructor(raw: QuestionOption) {
        this.text = raw.text;
        this.value = raw.value;
    }
}