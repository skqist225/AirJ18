const seperateNumber = number => {
    let dotNum = 0;
    const countDotNum = number => {
        const resultOfDivisionOperator = number / 1000;
        if (resultOfDivisionOperator >= 1) {
            dotNum++;
            const _number = resultOfDivisionOperator;
            countDotNum(_number);
        } else {
            return;
        }
    };

    countDotNum(number);

    let finalString = [];
    let numString = String(number);
    for (let i = 0; i < dotNum; i++) {
        const subString = '.' + numString.substr(-3);
        numString = numString.substring(0, numString.length - 3);
        finalString.unshift(subString);
    }

    return numString + finalString.join('');
};
