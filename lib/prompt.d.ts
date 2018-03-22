export interface IPromptOptions {
    prompt?: string;
    type?: 'normal' | 'mask' | 'hide';
    allowEmpty?: boolean;
}
declare const _default: {
    prompt(name: string, options?: IPromptOptions): Promise<any>;
    confirm(message: string): Promise<boolean>;
};
export default _default;
