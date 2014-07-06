var AnalyzeRow = function(pattern, values) {
    var pattern_temp = pattern.slice(0),
        values_temp = values.slice(0)
        results = { reds: 0, whites: 0 };

    var i = 0;
    while(i < values_temp.length) {
        if(pattern_temp[i] == values_temp[i]) {
            pattern_temp.splice(i, 1);
            values_temp.splice(i, 1);
            results.reds++;
        } else {
            i++;
        }
    }

    while(values_temp.length) {
        var index = pattern_temp.indexOf(values_temp.pop());

        if(index > -1) {
            results.whites++;
            pattern_temp.splice(index, 1);
        }
    }

    return results;
}

var analyze = function(sample_set) {

    var n = sample_set.length
    // red_white[i][j]: represents the red/white response of sample_set[i] against sample_set[j]
    var red_white = new Array(n);
    // matrix[i][j]: if we guess sample_set[j] and the solution is sample_set[i], what is our new sample set?
    var matrix = new Array(n);
    for(var i = 0; i < n; i++) {
        red_white[i] = new Array(n)
        matrix[i] = []
        for(var j = 0; j < n; j++) {
            matrix[i].push(0)
        }
    }
    alert("I made the matrix")

    for(var i = 0; i < n; i++) {
        var solution = sample_set[i]
        for(var j = 0; j < n; j++) {
            if(j >= i) {
                var guess = sample_set[j]
                var results = AnalyzeRow(solution, guess)
                red_white[i][j] = results.reds * 10 + results.whites
            } else {
                red_white[i][j] = red_white[j][i]
            }
        }
    }

    alert("about to enter the n^3")

    // O(n^3)!! Gross! D:  
    for(var i = 0; i < n; i++) {
        for(var j = 0; j < n; j++) {
            for(var k = 0; k < n; k++) {
                var results = red_white[i][j]
                if(results === red_white[k][j]) {
                    matrix[i][j] = matrix[i][j] + 1
                }
            }
        }
    }

    alert("made it!")

    // next_sample_set[i] = the reduced sample set
    var next_sample_set = new Array(n)
    for(var i = 0; i < n; i++) {
        next_sample_set[i] = matrix[i].reduce(function(a,b){ return a + b }, 0);
    }

    var minimum = _.min(next_sample_set)

    best_guesses = []
    for(var i = 0; i < n; i++) {
        if(next_sample_set[i] === minimum) {
            best_guesses.push(sample_set[i])
        }
    }
    return best_guesses



}

var before = _.now()
possible_answers = []
NUM_SPACES = prompt("spaces?")
NUM_COLORS = prompt("colors?")
for(var i = 0; i < Math.pow(NUM_COLORS, NUM_SPACES); i++) {
    var possible_answer = ("0000"+i.toString(NUM_COLORS)).slice(-NUM_SPACES);

    possible_answers.push(possible_answer.split(''));
}


console.log(analyze(possible_answers))
var after = _.now()
console.log("time: " + (after - before).toString())