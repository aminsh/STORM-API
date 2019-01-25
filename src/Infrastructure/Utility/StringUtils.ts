export class StringUtils {
    static isNullOrEmpty(str: string): Boolean {
        if (typeof str === 'undefined')
            return true;

        if (!str) return true;

        if (str.toString().length === 0) return true;

        return !str.toString().trim();


    }

    static isEmail(email: string): Boolean {
        let regex = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
        return !!email.match(regex)
    }

    static format = function (text: string, ...args: any[]): string {
        let s = text,
            i = args.length;

        while (i--) {
            s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), args[i]);
        }
        return s;
    };
}