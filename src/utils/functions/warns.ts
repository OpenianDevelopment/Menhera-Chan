export function CreateWarnId(userId: string) {
    const uid = (
        num: number,
        b: number,
        numerals = "0123456789abcdefghijklmnopqrstuvwxyz"
    ): any => {
        return (
            (num == 0 &&
                numerals[Math.floor(Math.random() * numerals.length)]) ||
            uid(Math.floor(num / b), b, numerals).replace(/ +/, numerals[0]) +
                numerals[num % b]
        );
    };
    /** 36 is {@link uid}'s numerals length*/
    const mangled = (parseInt(userId) * Date.now() * 36 ** 6) % 36 ** 6;
    return uid(mangled, 36);
}
