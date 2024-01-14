
/* twine-user-script #36: "MathHelper.js" */
/* Box-Muller transform for quick random standard deviation calculations.
https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
Where 0 is the mean and 1 is a standard deviation
 */

/* Provide a mean and unit deviation. You can change (or remove) the min and max value sanity checks */
setup.getHeightCalc = function (meanValue, devValue, minValue = 1, maxValue = null) {
    var u = Math.random();
    var v = Math.random();
    var x = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    var value = meanValue + devValue * x;
    if (maxValue) {
        value = min(maxValue, value);
    }
    if (minValue) {
        value = max(minValue, value0);
    }
    return value;
}