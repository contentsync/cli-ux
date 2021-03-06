"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const config_1 = require("./config");
const deps_1 = require("./deps");
exports.default = {
    prompt(name, options = {}) {
        return config_1.default.action.pauseAsync(() => {
            return _prompt(name, options);
        }, chalk_1.default.cyan('?'));
    },
    confirm(message, defaultValue) {
        return config_1.default.action.pauseAsync(async () => {
            const confirm = async () => {
                var options = {};
                if (defaultValue != undefined) {
                    message += ' [' + (defaultValue ? 'yes' : 'no') + ']';
                    options = { allowEmpty: true };
                }
                let response = (await _prompt(message, options)).toLowerCase();
                if (response == '' && defaultValue != undefined)
                    return defaultValue;
                if (['n', 'no'].includes(response))
                    return false;
                if (['y', 'yes'].includes(response))
                    return true;
                return confirm();
            };
            return confirm();
        }, chalk_1.default.cyan('?'));
    }
};
function _prompt(name, inputOptions = {}) {
    const options = Object.assign({ isTTY: !!(process.env.TERM !== 'dumb' && process.stdin.isTTY), name, prompt: name ? chalk_1.default.dim(`${name}: `) : chalk_1.default.dim('> '), type: 'normal', allowEmpty: false }, inputOptions);
    switch (options.type) {
        case 'normal':
            return normal(options);
        case 'mask':
        case 'hide':
            return deps_1.default.passwordPrompt(options.prompt, { method: options.type });
        default:
            throw new Error(`unexpected type ${options.type}`);
    }
}
function normal(options, retries = 100) {
    if (retries < 0)
        throw new Error('no input');
    return new Promise(resolve => {
        process.stdin.setEncoding('utf8');
        process.stderr.write(options.prompt);
        process.stdin.resume();
        process.stdin.once('data', data => {
            process.stdin.pause();
            data = data.trim();
            if (data === '' && !options.allowEmpty) {
                resolve(normal(options, retries - 1));
            }
            else {
                resolve(data);
            }
        });
    });
}
